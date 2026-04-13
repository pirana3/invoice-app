import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, TextInput, View, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Directory, File, Paths } from 'expo-file-system';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getBusinessInfo } from '@/database/businessinfodb';
import { createInvoice, getInvoiceById, updateInvoice } from '@/database/invoicecontent';
import { getProducts, type Product } from '@/database/productdb';
import { useLanguage } from '@/service/language';
import {
  createInvoiceItem,
  deleteInvoiceItemsByInvoiceId,
  getInvoiceItemsByInvoiceId,
} from '@/database/invoiceitemsdb';

const invoiceCreate = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const [clientname, setClientname] = useState('');
  const [invoicenumber, setInvvoicenumber] = useState('');
  const [invoicedate, setInvoicedate] = useState('');
  const [products, setProducts] = useState('');
  const [totalamount, setTotalamount] = useState('');
  const [percentage, setPercentage] = useState('');
  const [tax, setTax] = useState('');
  const [notes, setNotes] = useState('');
  const [termsandconditions, setTermsandconditions] = useState('');
  const [details, setDetails] = useState('');

  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [centerLogo, setCenterLogo] = useState(true);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSavingInvoice, setIsSavingInvoice] = useState(false);
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isSubtotalManuallySet, setIsSubtotalManuallySet] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    Record<
      number,
      {
        id: number;
        name: string;
        price: number;
        qty: string;
        unitPrice: string;
        manualAmount: string;
        useManual: boolean;
      }
    >
  >({});

  const params = useLocalSearchParams<{ id?: string }>();
  const invoiceId = params.id ? Number(params.id) : NaN;
  const isEditing = Number.isFinite(invoiceId);

  useEffect(() => {
    const loadLogo = async () => {
      const businesses = await getBusinessInfo();
      const latest = businesses?.[0];
      setLogoUri(latest?.logo ?? null);
    };
    loadLogo();
  }, []);

  useEffect(() => {
    const loadInvoice = async () => {
      if (!isEditing) return;
      const invoice = await getInvoiceById(invoiceId);
      if (!invoice) return;
      setClientname(invoice.clientname);
      setInvvoicenumber(String(invoice.invoicenumber));
      setInvoicedate(String(invoice.invoicedate));
      setProducts(invoice.products);
      setTotalamount(String(invoice.totalamount));
      setPercentage(String(invoice.percentage));
      setTax(String(invoice.tax));
      setNotes(invoice.notes);
      setTermsandconditions(invoice.termsandconditions);
      setDetails(invoice.details);
      const items = await getInvoiceItemsByInvoiceId(invoiceId);
      if (items.length > 0) {
        const mapped: Record<
          number,
          { id: number; name: string; price: number; qty: string; unitPrice: string; manualAmount: string; useManual: boolean }
        > = {};
        items.forEach((item) => {
          const key = item.productId ?? item.id;
          mapped[key] = {
            id: key,
            name: item.name,
            price: Number(item.unitPrice ?? 0),
            qty: String(item.quantity ?? 1),
            unitPrice: String(item.unitPrice ?? 0),
            manualAmount: String(item.manualAmount ?? 0),
            useManual: item.useManual === 1,
          };
        });
        setSelectedProducts(mapped);
      } else {
        try {
          const parsed = JSON.parse(invoice.products);
          if (Array.isArray(parsed)) {
            const mapped: Record<
              number,
              { id: number; name: string; price: number; qty: string; unitPrice: string; manualAmount: string; useManual: boolean }
            > = {};
            parsed.forEach((item) => {
              if (item?.id != null) {
                mapped[item.id] = {
                  id: item.id,
                  name: item.name ?? 'Item',
                  price: Number(item.price ?? 0),
                  qty: '1',
                  unitPrice: String(item.amount ?? 0),
                  manualAmount: String(item.amount ?? 0),
                  useManual: true,
                };
              }
            });
            setSelectedProducts(mapped);
          }
        } catch {}
      }
    };
    loadInvoice();
  }, [invoiceId, isEditing]);

  useEffect(() => {
    if (isEditing) {
      setIsPreview(false);
      setIsSubtotalManuallySet(false);
    }
  }, [isEditing]);

  useEffect(() => {
    const loadProducts = async () => {
      const items = await getProducts();
      setAllProducts(items);
    };
    if (isProductsModalOpen) {
      loadProducts();
    }
  }, [isProductsModalOpen]);

  const subtotal = useMemo(() => {
    const selectedTotal = Object.values(selectedProducts).reduce((sum, item) => {
      if (item.useManual) {
        const manual = Number(item.manualAmount);
        return Number.isFinite(manual) ? sum + manual : sum;
      }
      const qty = Number(item.qty);
      const unit = Number(item.unitPrice);
      if (!Number.isFinite(qty) || !Number.isFinite(unit)) return sum;
      return sum + qty * unit;
    }, 0);
    return selectedTotal || Number(totalamount) || 0;
  }, [selectedProducts, totalamount]);
  const taxAmount = useMemo(() => (subtotal * (Number(tax) || 0)) / 100, [subtotal, tax]);
  const discountAmount = useMemo(
    () => (subtotal * (Number(percentage) || 0)) / 100,
    [subtotal, percentage]
  );
  const finalTotal = useMemo(() => subtotal + taxAmount - discountAmount, [subtotal, taxAmount, discountAmount]);

  useEffect(() => {
    if (Object.keys(selectedProducts).length === 0) {
      setTotalamount('');
      setProducts('');
      return;
    }
    // Only auto-calculate if user hasn't manually set the subtotal
    if (!isSubtotalManuallySet) {
      setTotalamount(subtotal.toFixed(2));
    }
    const payload = Object.values(selectedProducts).map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      amount: item.useManual
        ? Number(item.manualAmount) || 0
        : (Number(item.qty) || 0) * (Number(item.unitPrice) || 0),
    }));
    setProducts(JSON.stringify(payload));
  }, [selectedProducts, subtotal, isSubtotalManuallySet]);

  const buildHtml = () => {
    const safe = (value: string) => value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const logoHtml = logoUri
      ? `<img src="${logoUri}" style="max-width:140px; max-height:140px; object-fit:contain;" />`
      : '';
    let productLines = '';
    try {
      const parsed = JSON.parse(products);
      if (Array.isArray(parsed) && parsed.length > 0) {
        productLines = parsed
          .map((item: { name: string; amount: number }) => `<div>${safe(item.name)} — $${Number(item.amount || 0).toFixed(2)}</div>`)
          .join('');
      }
    } catch {
      productLines = safe(products);
    }
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body { font-family: -apple-system, Helvetica, Arial, sans-serif; padding: 24px; color: #111827; }
            .header { display: flex; flex-direction: column; align-items: ${centerLogo ? 'center' : 'flex-start'}; }
            .title { margin-top: 12px; font-size: 24px; font-weight: 700; }
            .row { display: flex; justify-content: space-between; margin-top: 6px; }
            .label { color: #6b7280; font-size: 12px; }
            .box { border: 1px solid #e5e7eb; padding: 12px; border-radius: 8px; margin-top: 16px; }
            .total { font-size: 18px; font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="header">
            ${logoHtml}
            <div class="title">Invoice</div>
          </div>

          <div class="box">
            <div class="row"><div class="label">Client</div><div>${safe(clientname)}</div></div>
            <div class="row"><div class="label">Invoice #</div><div>${safe(invoicenumber)}</div></div>
            <div class="row"><div class="label">Date</div><div>${safe(invoicedate)}</div></div>
          </div>

          <div class="box">
            <div class="label">Products / Services</div>
            <div style="margin-top:6px;">${productLines}</div>
          </div>

          <div class="box">
            <div class="row"><div class="label">Subtotal</div><div>$${subtotal.toFixed(2)}</div></div>
            <div class="row"><div class="label">Tax (%)</div><div>${Number(tax || 0).toFixed(2)}%</div></div>
            <div class="row"><div class="label">Discount (%)</div><div>${Number(percentage || 0).toFixed(2)}%</div></div>
            <div class="row total"><div>Total</div><div>$${finalTotal.toFixed(2)}</div></div>
          </div>

          ${details ? `<div class="box"><div class="label">Details</div><div>${safe(details)}</div></div>` : ''}
          ${notes ? `<div class="box"><div class="label">Notes</div><div>${safe(notes)}</div></div>` : ''}
          ${
            termsandconditions
              ? `<div class="box"><div class="label">Terms</div><div>${safe(termsandconditions)}</div></div>`
              : ''
          }
        </body>
      </html>
    `;
  };

  const handleGeneratePdf = async () => {
    try {
      setIsGenerating(true);
      const html = buildHtml();
      const file = await Print.printToFileAsync({ html });
      setPdfUri(file.uri);
      Alert.alert('PDF ready', 'Your invoice PDF was generated.');
    } catch (error) {
      console.error('PDF generation failed:', error);
      Alert.alert('PDF failed', 'Could not generate the invoice PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveInvoice = async () => {
    const parsedInvoiceNumber = Number(invoicenumber);
    const parsedInvoiceDate = Number(invoicedate);
    const parsedTotal = Number(totalamount);
    const parsedPercentage = Number(percentage);
    const parsedTax = Number(tax);

    if (!clientname.trim()) {
      Alert.alert(t('invoice_client_missing'));
      return;
    }
    if (!Number.isFinite(parsedInvoiceNumber)) {
      Alert.alert(t('invoice_number_invalid'));
      return;
    }
    if (!Number.isFinite(parsedInvoiceDate)) {
      Alert.alert(t('invoice_date_invalid'));
      return;
    }
    if (!Number.isFinite(parsedTotal)) {
      Alert.alert(t('invoice_total_invalid'));
      return;
    }

    try {
      setIsSavingInvoice(true);
      if (parsedTotal <= 0) {
        Alert.alert(t('invoice_total_invalid'));
        return;
      }

      if (isEditing) {
        await updateInvoice(
          invoiceId,
          parsedInvoiceNumber,
          parsedInvoiceDate,
          clientname.trim(),
          products.trim(),
          parsedTotal,
          parsedPercentage,
          parsedTax,
          notes.trim(),
          termsandconditions.trim(),
          details.trim(),
          0
        );
        await deleteInvoiceItemsByInvoiceId(invoiceId);
        await Promise.all(
          Object.values(selectedProducts).map((item) =>
            createInvoiceItem(
              invoiceId,
              Number.isFinite(item.id) ? item.id : null,
              item.name,
              Number(item.qty) || 0,
              Number(item.unitPrice) || 0,
              item.useManual ? Number(item.manualAmount) || 0 : null,
              item.useManual ? 1 : 0
            )
          )
        );
      } else {
        const newId = await createInvoice(
          parsedInvoiceNumber,
          parsedInvoiceDate,
          clientname.trim(),
          products.trim(),
          parsedTotal,
          parsedPercentage,
          parsedTax,
          notes.trim(),
          termsandconditions.trim(),
          details.trim(),
          0
        );
        await Promise.all(
          Object.values(selectedProducts).map((item) =>
            createInvoiceItem(
              newId,
              Number.isFinite(item.id) ? item.id : null,
              item.name,
              Number(item.qty) || 0,
              Number(item.unitPrice) || 0,
              item.useManual ? Number(item.manualAmount) || 0 : null,
              item.useManual ? 1 : 0
            )
          )
        );
      }
      Alert.alert(t('invoice_saved'));
      
      // Switch to preview mode and auto-generate PDF
      setIsPreview(true);
      if (!pdfUri) {
        const html = buildHtml();
        const file = await Print.printToFileAsync({ html });
        setPdfUri(file.uri);
      }
    } catch (error) {
      console.error('Invoice save failed:', error);
      Alert.alert(t('invoice_fail_save'));
    } finally {
      setIsSavingInvoice(false);
    }
  };

  const handleSavePdf = async () => {
    if (!pdfUri) {
      Alert.alert(t('invoice_no_pdf'));
      return;
    }
    try {
      setIsSaving(true);
      const invoicesDir = new Directory(Paths.document, 'invoices');
      if (!invoicesDir.exists) {
        invoicesDir.create({ intermediates: true });
      }
      const filename = invoicenumber ? `invoice-${invoicenumber}.pdf` : `invoice-${Date.now()}.pdf`;
      const sourceFile = new File(pdfUri);
      const destFile = new File(invoicesDir, filename);
      sourceFile.copy(destFile);
      Alert.alert('Saved', `Saved to ${destFile.uri}`);
    } catch (error) {
      console.error('Save failed:', error);
      Alert.alert(t('invoice_no_save_pdf'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSharePdf = async () => {
    if (!pdfUri) {
      Alert.alert(t('invoice_no_pdf'));
      return;
    }
    try {
      setIsSharing(true);
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert('Sharing not available', 'Sharing is not available on this device.');
        return;
      }
      await Sharing.shareAsync(pdfUri);
    } catch (error) {
      console.error('Share failed:', error);
      Alert.alert('');
    } finally {
      setIsSharing(false);
    }
  };

  const handlePrintPdf = async () => {
    if (!pdfUri) {
      Alert.alert('No PDF yet', 'Generate the PDF first.');
      return;
    }
    try {
      setIsPrinting(true);
      await Print.printAsync({ uri: pdfUri });
    } catch (error) {
      console.error('Print failed:', error);
      Alert.alert(t('invoice_print_failed'));
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    isPreview ? (
      // Preview Mode
      <ScrollView
        className="flex-1 bg-white px-4 py-6"
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-black">Invoice Preview</Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-sm font-medium text-gray-600">Close</Text>
          </Pressable>
        </View>

        {/* Preview Content */}
        <View className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Invoice #{invoicenumber}</Text>
          <Text className="text-xs text-gray-600 mb-3">Client: {clientname}</Text>
          <Text className="text-xs text-gray-600 mb-3">Date: {invoicedate}</Text>
          {(() => {
            const displaySubtotal = isSubtotalManuallySet ? Number(totalamount) : subtotal;
            const displayTaxAmount = (displaySubtotal * (Number(tax) || 0)) / 100;
            const displayDiscountAmount = (displaySubtotal * (Number(percentage) || 0)) / 100;
            const displayFinalTotal = displaySubtotal + displayTaxAmount - displayDiscountAmount;
            return (
              <>
                <Text className="text-xs text-gray-600 mt-2">Subtotal: ${displaySubtotal.toFixed(2)}</Text>
                <Text className="text-xs text-gray-600">Tax: ${displayTaxAmount.toFixed(2)}</Text>
                <Text className="text-xs text-gray-600">Discount: ${displayDiscountAmount.toFixed(2)}</Text>
                <Text className="text-sm font-semibold text-black mt-3">Total: ${displayFinalTotal.toFixed(2)}</Text>
              </>
            );
          })()}
        </View>

        <Text className="mt-6 text-sm text-gray-500 text-center">PDF generated and ready to share or print</Text>

        {/* Action Buttons */}
        <View className="mt-6 flex-row gap-3">
          <Pressable
            onPress={handleSavePdf}
            className="flex-1 items-center rounded-md bg-blue-600 py-3"
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="font-semibold text-white">Save PDF</Text>
            )}
          </Pressable>
          <Pressable
            onPress={handleSharePdf}
            className="flex-1 items-center rounded-md bg-green-600 py-3"
            disabled={isSharing}
          >
            {isSharing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="font-semibold text-white">Share</Text>
            )}
          </Pressable>
        </View>

        <View className="mt-3 flex-row gap-3">
          <Pressable
            onPress={handlePrintPdf}
            className="flex-1 items-center rounded-md bg-purple-600 py-3"
            disabled={isPrinting}
          >
            {isPrinting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="font-semibold text-white">Print</Text>
            )}
          </Pressable>
          <Pressable
            onPress={() => setIsPreview(false)}
            className="flex-1 items-center rounded-md border border-gray-300 py-3"
          >
            <Text className="font-semibold text-black">Back to Edit</Text>
          </Pressable>
        </View>

        <View className="mt-3 flex-row gap-3">
          <Pressable
            onPress={() => router.back()}
            className="flex-1 items-center rounded-md bg-gray-600 py-3"
          >
            <Text className="font-semibold text-white">Done</Text>
          </Pressable>
        </View>
      </ScrollView>
    ) : (
      // Edit Mode
      <ScrollView
        className="flex-1 bg-white px-4 py-6"
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-black">{isEditing ? 'Edit Invoice' : 'New Invoice'}</Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-sm font-medium text-gray-600">Close</Text>
          </Pressable>
        </View>

        <View className="mt-4 rounded-md border border-gray-200 bg-white p-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-gray-500">Logo position</Text>
            <Pressable
              onPress={() => setCenterLogo((prev) => !prev)}
              className="rounded-full border border-gray-300 px-3 py-1"
            >
              <Text className="text-xs text-black">{centerLogo ? 'Top center' : 'Top left'}</Text>
            </Pressable>
          </View>
          {logoUri ? (
            <View className={`mt-3 ${centerLogo ? 'items-center' : 'items-start'}`}>
              <Image source={{ uri: logoUri }} style={{ width: 80, height: 80, resizeMode: 'contain' }} />
            </View>
          ) : (
            <Text className="mt-3 text-xs text-gray-400">No logo saved</Text>
          )}
        </View>

        <TextInput
          value={clientname}
          onChangeText={setClientname}
          placeholder="Client name"
          className="mt-4 rounded-md border border-gray-300 px-3 py-2 text-black"
        />
        <TextInput
          value={invoicenumber}
          onChangeText={setInvvoicenumber}
          placeholder="Invoice number"
          keyboardType="numeric"
          className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-black"
        />
        <TextInput
          value={invoicedate}
          onChangeText={setInvoicedate}
          placeholder="Invoice date (MM/DD/YYYY)"
          className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-black"
        />
        <TextInput
          value={products}
          placeholder="Products / Services"
          multiline
          className="mt-3 min-h-20 rounded-md border border-gray-300 px-3 py-2 text-black"
          editable={false}
        />
        <Pressable
          onPress={() => setIsProductsModalOpen(true)}
          className="mt-2 rounded-md border border-gray-300 px-3 py-3"
        >
          <Text className="text-sm text-black">Select products</Text>
        </Pressable>
        {Object.keys(selectedProducts).length > 0 ? (
          <View className="mt-3 rounded-md border border-gray-200 bg-white p-3">
            <View className="flex-row justify-between">
              <Text className="text-xs font-semibold text-gray-500">Item</Text>
              <Text className="text-xs font-semibold text-gray-500">Total</Text>
            </View>
            {Object.values(selectedProducts).map((item) => {
              const lineTotal = item.useManual
                ? Number(item.manualAmount) || 0
                : (Number(item.qty) || 0) * (Number(item.unitPrice) || 0);
              return (
                <View key={item.id} className="mt-2 flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-sm font-medium text-black">{item.name}</Text>
                    <Text className="text-xs text-gray-500">
                      {item.useManual
                        ? `Manual: $${Number(item.manualAmount || 0).toFixed(2)}`
                        : `Qty ${item.qty} × $${Number(item.unitPrice || 0).toFixed(2)}`}
                    </Text>
                  </View>
                  <Text className="text-sm font-semibold text-black">${lineTotal.toFixed(2)}</Text>
                </View>
              );
            })}
          </View>
        ) : null}
        <TextInput
          value={totalamount}
          onChangeText={(text) => {
            setTotalamount(text);
            setIsSubtotalManuallySet(text.trim() !== '');
          }}
          placeholder="Subtotal (calculated)"
          keyboardType="numeric"
          className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-black"
        />
        <View className="mt-3 flex-row gap-3">
          <TextInput
            value={tax}
            onChangeText={setTax}
            placeholder="Tax (%)"
            keyboardType="numeric"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
          <TextInput
            value={percentage}
            onChangeText={setPercentage}
            placeholder="Discount (%)"
            keyboardType="numeric"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
        </View>
        <TextInput
          value={details}
          onChangeText={setDetails}
          placeholder="Details"
          multiline
          className="mt-3 min-h-16 rounded-md border border-gray-300 px-3 py-2 text-black"
        />
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes"
          multiline
          className="mt-3 min-h-16 rounded-md border border-gray-300 px-3 py-2 text-black"
        />
        <TextInput
          value={termsandconditions}
          onChangeText={setTermsandconditions}
          placeholder="Terms and conditions"
          multiline
          className="mt-3 min-h-16 rounded-md border border-gray-300 px-3 py-2 text-black"
        />

        <View className="mt-5 flex-row gap-3">
          <Pressable
            onPress={handleGeneratePdf}
            className="flex-1 items-center rounded-md bg-black py-3"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="font-semibold text-white">Generate PDF</Text>
            )}
          </Pressable>
          <Pressable
            onPress={handleSaveInvoice}
            className="flex-1 items-center rounded-md border border-gray-300 py-3"
            disabled={isSavingInvoice}
          >
            {isSavingInvoice ? (
              <ActivityIndicator size="small" color="#111827" />
            ) : (
              <Text className="font-semibold text-black">Save Invoice</Text>
            )}
          </Pressable>
        </View>

        <Modal visible={isProductsModalOpen} animationType="slide">
          <View className="flex-1 bg-white px-4" style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom }}>
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-lg font-semibold text-black">Select products</Text>
              <Pressable onPress={() => setIsProductsModalOpen(false)}>
                <Text className="text-sm font-medium text-gray-600">Done</Text>
              </Pressable>
            </View>

            {allProducts.length === 0 ? (
              <Text className="mt-6 text-sm text-gray-500">No products saved yet.</Text>
            ) : (
              <ScrollView className="mt-4">
                {allProducts.map((product) => {
                  const selected = selectedProducts[product.id];
                  return (
                    <View
                      key={product.id}
                      className="mb-3 rounded-md border border-gray-200 bg-white p-3"
                    >
                      <View className="flex-row items-center justify-between">
                        <View>
                          <Text className="text-sm font-semibold text-black">{product.name}</Text>
                          <Text className="text-xs text-gray-500">${product.price.toFixed(2)}</Text>
                        </View>
                        <Pressable
                          onPress={() => {
                            setSelectedProducts((prev) => {
                              const next = { ...prev };
                              if (next[product.id]) {
                                delete next[product.id];
                              } else {
                                next[product.id] = {
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  qty: '1',
                                  unitPrice: product.price.toFixed(2),
                                  manualAmount: product.price.toFixed(2),
                                  useManual: false,
                                };
                              }
                              return next;
                            });
                          }}
                          className={`rounded-full px-3 py-1 ${selected ? 'bg-black' : 'bg-gray-100'}`}
                        >
                          <Text className={`text-xs ${selected ? 'text-white' : 'text-gray-700'}`}>
                            {selected ? 'Selected' : 'Select'}
                          </Text>
                        </Pressable>
                      </View>
                      {selected ? (
                        <View className="mt-3">
                          <View className="flex-row items-center justify-between">
                            <Text className="text-xs text-gray-500">Use manual amount</Text>
                            <Pressable
                              onPress={() =>
                                setSelectedProducts((prev) => ({
                                  ...prev,
                                  [product.id]: { ...prev[product.id], useManual: !prev[product.id].useManual },
                                }))
                              }
                              className={`rounded-full px-3 py-1 ${selected.useManual ? 'bg-black' : 'bg-gray-100'}`}
                            >
                              <Text className={`text-xs ${selected.useManual ? 'text-white' : 'text-gray-700'}`}>
                                {selected.useManual ? 'Manual' : 'Auto'}
                              </Text>
                            </Pressable>
                          </View>
                          {selected.useManual ? (
                            <View className="mt-3">
                              <Text className="text-xs text-gray-500">Manual amount</Text>
                              <TextInput
                                value={selected.manualAmount}
                                onChangeText={(text) =>
                                  setSelectedProducts((prev) => ({
                                    ...prev,
                                    [product.id]: { ...prev[product.id], manualAmount: text },
                                  }))
                                }
                                keyboardType="numeric"
                                className="mt-2 rounded-md border border-gray-300 px-3 py-2 text-black"
                              />
                            </View>
                          ) : (
                            <View className="mt-3 flex-row gap-3">
                              <View className="flex-1">
                                <Text className="text-xs text-gray-500">Qty</Text>
                                <TextInput
                                  value={selected.qty}
                                  onChangeText={(text) =>
                                    setSelectedProducts((prev) => ({
                                      ...prev,
                                      [product.id]: { ...prev[product.id], qty: text },
                                    }))
                                  }
                                  keyboardType="numeric"
                                  className="mt-2 rounded-md border border-gray-300 px-3 py-2 text-black"
                                />
                              </View>
                              <View className="flex-1">
                                <Text className="text-xs text-gray-500">Unit price</Text>
                                <TextInput
                                  value={selected.unitPrice}
                                  onChangeText={(text) =>
                                    setSelectedProducts((prev) => ({
                                      ...prev,
                                      [product.id]: { ...prev[product.id], unitPrice: text },
                                    }))
                                  }
                                  keyboardType="numeric"
                                  className="mt-2 rounded-md border border-gray-300 px-3 py-2 text-black"
                                />
                              </View>
                            </View>
                          )}
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </Modal>
        {pdfUri ? (
          <Text className="mt-3 text-xs text-gray-500">PDF ready to export.</Text>
        ) : null}
      </ScrollView>
    )
  );
};

export default invoiceCreate;
