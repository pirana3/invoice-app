import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, TextInput, View, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Directory, File, Paths } from 'expo-file-system';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getBusinessInfo } from '@/database/businessinfodb';
import { createEstimate, getEstimateById, updateEstimate } from '@/database/estimatecontent';
import { getProducts, type Product } from '@/database/productdb';
import { createEstimateItem, deleteEstimateItemsByEstimateId, getEstimateItemsByEstimateId } from '@/database/estimateitemsdb';
import { useLanguage } from '@/service/language';

const estimateCreate = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const [clientname, setClientname] = useState('');
  const [estimatenumber, setEstimatenumber] = useState('');
  const [estimatedate, setEstimatedate] = useState('');
  const [estimateproducts, setEstimateproducts] = useState('');
  const [estimatetotalamount, setEstimatetotalamount] = useState('');
  const [estimatepercentage, setEstimatepercentage] = useState('');
  const [estimatetax, setEstimatetax] = useState('');
  const [estimatenotes, setEstimatenotes] = useState('');
  const [estimatetermsandconditions, setEstimatetermsandconditions] = useState('');
  const [estimatedetails, setEstimatedetails] = useState('');

  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [centerLogo, setCenterLogo] = useState(false);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSavingEstimate, setIsSavingEstimate] = useState(false);
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
  const estimateId = params.id ? Number(params.id) : NaN;
  const isEditing = Number.isFinite(estimateId);

  useEffect(() => {
    const loadLogo = async () => {
      const businesses = await getBusinessInfo();
      const latest = businesses?.[0];
      setLogoUri(latest?.logo ?? null);
    };
    loadLogo();
  }, []);

  useEffect(() => {
    const loadEstimate = async () => {
      if (!isEditing) return;
      // Ensure we're in edit mode, not preview
      setIsPreview(false);
      const estimate = await getEstimateById(estimateId);
      if (!estimate) return;
      setClientname(estimate.clientname);
      setEstimatenumber(String(estimate.estimatenumber));
      setEstimatedate(String(estimate.estimatedate));
      setEstimateproducts(estimate.estimateproducts);
      setEstimatetotalamount(String(estimate.estimatetotalamount));
      setEstimatepercentage(String(estimate.estimatepercentage));
      setEstimatetax(String(estimate.estimatetax));
      setEstimatenotes(estimate.estimatenotes);
      setEstimatetermsandconditions(estimate.estimatetermsandconditions);
      setEstimatedetails(estimate.estimatedetails);

      const items = await getEstimateItemsByEstimateId(estimateId);
      if (items.length > 0) {
        const mapped: Record<
          number,
          { id: number; name: string; price: number; qty: string; unitPrice: string; manualAmount: string; useManual: boolean }
        > = {};
        items.forEach((item) => {
          const key = item.productId ?? item.id;
          mapped[key] = {
            id: key,
            name: item.estimatename,
            price: Number(item.estimateunitPrice ?? 0),
            qty: String(item.estimatequantity ?? 1),
            unitPrice: String(item.estimateunitPrice ?? 0),
            manualAmount: String(item.estimatemanualAmount ?? 0),
            useManual: item.estimateuseManual === 1,
          };
        });
        setSelectedProducts(mapped);
      }
    };
    loadEstimate();
  }, [estimateId, isEditing]);

  useEffect(() => {
    if (isEditing) {
      setIsPreview(false);
      setIsSubtotalManuallySet(false);
    } else {
      // Reset form for new estimate
      setClientname('');
      setEstimatenumber('');
      setEstimatedate('');
      setEstimateproducts('');
      setEstimatetotalamount('');
      setEstimatepercentage('');
      setEstimatetax('');
      setEstimatenotes('');
      setEstimatetermsandconditions('');
      setEstimatedetails('');
      setSelectedProducts({});
      setIsPreview(false);
      setIsSubtotalManuallySet(false);
      setPdfUri(null);
    }
  }, [isEditing, estimateId]);

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
    return selectedTotal || Number(estimatetotalamount) || 0;
  }, [selectedProducts, estimatetotalamount]);

  const taxAmount = useMemo(() => (subtotal * (Number(estimatetax) || 0)) / 100, [subtotal, estimatetax]);
  const discountAmount = useMemo(
    () => (subtotal * (Number(estimatepercentage) || 0)) / 100,
    [subtotal, estimatepercentage]
  );
  const finalTotal = useMemo(() => subtotal + taxAmount - discountAmount, [subtotal, taxAmount, discountAmount]);

  useEffect(() => {
    if (Object.keys(selectedProducts).length === 0) {
      // Only clear if user hasn't manually set the subtotal
      if (!isSubtotalManuallySet) {
        setEstimatetotalamount('');
        setEstimateproducts('');
      }
      return;
    }
    // Only auto-calculate if user hasn't manually set the subtotal
    if (!isSubtotalManuallySet) {
      setEstimatetotalamount(subtotal.toFixed(2));
    }
    const payload = Object.values(selectedProducts).map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      amount: item.useManual
        ? Number(item.manualAmount) || 0
        : (Number(item.qty) || 0) * (Number(item.unitPrice) || 0),
    }));
    setEstimateproducts(JSON.stringify(payload));
  }, [selectedProducts, subtotal, isSubtotalManuallySet]);

  const buildHtml = () => {
    const safe = (value: string) => value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const logoHtml = logoUri
      ? `<img src="${logoUri}" style="max-width:140px; max-height:140px; object-fit:contain;" />`
      : '';
    let productLines = '';
    try {
      const parsed = JSON.parse(estimateproducts);
      if (Array.isArray(parsed) && parsed.length > 0) {
        productLines = parsed
          .map((item: { name: string; amount: number }) => `<div>${safe(item.name)} — $${Number(item.amount || 0).toFixed(2)}</div>`)
          .join('');
      }
    } catch {
      productLines = safe(estimateproducts);
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
            <div class="title">Estimate</div>
          </div>

          <div class="box">
            <div class="row"><div class="label">Client</div><div>${safe(clientname)}</div></div>
            <div class="row"><div class="label">Estimate #</div><div>${safe(estimatenumber)}</div></div>
            <div class="row"><div class="label">Date</div><div>${safe(estimatedate)}</div></div>
          </div>

          <div class="box">
            <div class="label">Products / Services</div>
            <div style="margin-top:6px;">${productLines}</div>
          </div>

          <div class="box">
            <div class="row"><div class="label">Subtotal</div><div>$${subtotal.toFixed(2)}</div></div>
            <div class="row"><div class="label">Tax (%)</div><div>${Number(estimatetax || 0).toFixed(2)}%</div></div>
            <div class="row"><div class="label">Discount (%)</div><div>${Number(estimatepercentage || 0).toFixed(2)}%</div></div>
            <div class="row total"><div>Total</div><div>$${finalTotal.toFixed(2)}</div></div>
          </div>

          ${estimatedetails ? `<div class="box"><div class="label">Details</div><div>${safe(estimatedetails)}</div></div>` : ''}
          ${estimatenotes ? `<div class="box"><div class="label">Notes</div><div>${safe(estimatenotes)}</div></div>` : ''}
          ${
            estimatetermsandconditions
              ? `<div class="box"><div class="label">Terms</div><div>${safe(estimatetermsandconditions)}</div></div>`
              : ''
          }
        </body>
      </html>
    `;
  };

  const validateEstimateForm = () => {
    const parsedEstimateNumber = Number(estimatenumber);
    const parsedEstimateDate = Number(estimatedate);
    const parsedTotal = Number(estimatetotalamount);
    const parsedPercentage = Number(estimatepercentage);
    const parsedTax = Number(estimatetax);

    if (!clientname.trim()) {
      Alert.alert(t('estimate_missing_client_title'), t('estimate_missing_client_message'));
      return null;
    }
    if (!Number.isFinite(parsedEstimateNumber)) {
      Alert.alert(t('estimate_invalid_number_title'), t('estimate_invalid_number_message'));
      return null;
    }
    if (!Number.isFinite(parsedEstimateDate)) {
      Alert.alert(t('estimate_invalid_date_title'), t('estimate_invalid_date_message'));
      return null;
    }
    if (!Number.isFinite(parsedTotal)) {
      Alert.alert(t('estimate_invalid_total_title'), t('estimate_invalid_total_message'));
      return null;
    }
    if (!Number.isFinite(parsedPercentage)) {
      Alert.alert(t('estimate_invalid_discount_title'), t('estimate_invalid_discount_message'));
      return null;
    }
    if (!Number.isFinite(parsedTax)) {
      Alert.alert(t('estimate_invalid_tax_title'), t('estimate_invalid_tax_message'));
      return null;
    }
    if (parsedTotal <= 0) {
      Alert.alert(t('estimate_invalid_total_title'), t('estimate_total_gt_zero'));
      return null;
    }

    return { parsedEstimateNumber, parsedEstimateDate, parsedTotal, parsedPercentage, parsedTax };
  };

  const handleGeneratePdf = async () => {
    const validated = validateEstimateForm();
    if (!validated) return;
    try {
      setIsGenerating(true);
      const html = buildHtml();
      const file = await Print.printToFileAsync({ html });
      setPdfUri(file.uri);
      setIsPreview(true); // Show preview immediately
    } catch (error) {
      console.error('PDF generation failed:', error);
      Alert.alert(t('estimate_pdf_failed_title'), t('estimate_pdf_failed_message'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveEstimate = async () => {
    const validated = validateEstimateForm();
    if (!validated) return;
    const { parsedEstimateNumber, parsedEstimateDate, parsedTotal, parsedPercentage, parsedTax } = validated;

    try {
      setIsSavingEstimate(true);

      if (isEditing) {
        await updateEstimate(
          estimateId,
          parsedEstimateNumber,
          parsedEstimateDate,
          clientname.trim(),
          estimateproducts.trim(),
          parsedTotal,
          parsedPercentage,
          parsedTax,
          estimatenotes.trim(),
          estimatetermsandconditions.trim(),
          estimatedetails.trim(),
          0
        );
        await deleteEstimateItemsByEstimateId(estimateId);
        await Promise.all(
          Object.values(selectedProducts).map((item) =>
            createEstimateItem(
              estimateId,
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
        const newId = await createEstimate(
          parsedEstimateNumber,
          parsedEstimateDate,
          clientname.trim(),
          estimateproducts.trim(),
          parsedTotal,
          parsedPercentage,
          parsedTax,
          estimatenotes.trim(),
          estimatetermsandconditions.trim(),
          estimatedetails.trim(),
          0
        );
        await Promise.all(
          Object.values(selectedProducts).map((item) =>
            createEstimateItem(
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
      Alert.alert(t('invoice_saved_title'), t('estimate_saved_message'));
      router.back();
    } catch (error) {
      console.error('Estimate save failed:', error);
      Alert.alert(t('invoice_save_failed_title'), t('estimate_save_failed_message'));
    } finally {
      setIsSavingEstimate(false);
    }
  };

  const handleSavePdf = async () => {
    if (!pdfUri) {
      Alert.alert(t('invoice_no_pdf_yet_title'), t('invoice_generate_pdf_first'));
      return;
    }
    try {
      setIsSaving(true);
      const estimatesDir = new Directory(Paths.document, 'estimates');
      if (!estimatesDir.exists) {
        estimatesDir.create({ intermediates: true });
      }
      const filename = estimatenumber ? `estimate-${estimatenumber}.pdf` : `estimate-${Date.now()}.pdf`;
      const sourceFile = new File(pdfUri);
      const destFile = new File(estimatesDir, filename);
      sourceFile.copy(destFile);
      Alert.alert(t('invoice_saved_title'), t('estimate_saved_folder_message'));
    } catch (error) {
      console.error('Save failed:', error);
      Alert.alert(t('invoice_save_failed_title'), t('invoice_pdf_save_failed_message'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSharePdf = async () => {
    if (!pdfUri) {
      Alert.alert(t('invoice_no_pdf_yet_title'), t('invoice_generate_pdf_first'));
      return;
    }
    try {
      setIsSharing(true);
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert(t('invoice_sharing_not_available_title'), t('invoice_sharing_not_available_message'));
        return;
      }
      await Sharing.shareAsync(pdfUri);
    } catch (error) {
      console.error('Share failed:', error);
      Alert.alert(t('invoice_shared_failed'));
    } finally {
      setIsSharing(false);
    }
  };

  const handlePrintPdf = async () => {
    if (!pdfUri) {
      Alert.alert(t('invoice_no_pdf_yet_title'), t('invoice_generate_pdf_first'));
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
      <ScrollView
        className="flex-1 bg-white px-4 py-6"
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-black">{t('invoice_preview_title')}</Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-sm font-medium text-gray-600">{t('close')}</Text>
          </Pressable>
        </View>

        <View className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Estimate #{estimatenumber}</Text>
          <Text className="text-xs text-gray-600 mb-3">{t('client_label')}: {clientname}</Text>
          <Text className="text-xs text-gray-600 mb-3">{t('date_label')}: {estimatedate}</Text>
          {(() => {
            const displaySubtotal = isSubtotalManuallySet ? Number(estimatetotalamount) : subtotal;
            const displayTaxAmount = (displaySubtotal * (Number(estimatetax) || 0)) / 100;
            const displayDiscountAmount = (displaySubtotal * (Number(estimatepercentage) || 0)) / 100;
            const displayFinalTotal = displaySubtotal + displayTaxAmount - displayDiscountAmount;
            return (
              <>
                <Text className="text-xs text-gray-600 mt-2">{t('subtotal_label')}: ${displaySubtotal.toFixed(2)}</Text>
                <Text className="text-xs text-gray-600">{t('tax_label')}: ${displayTaxAmount.toFixed(2)}</Text>
                <Text className="text-xs text-gray-600">{t('discount_label')}: ${displayDiscountAmount.toFixed(2)}</Text>
                <Text className="text-sm font-semibold text-black mt-3">{t('total_label')}: ${displayFinalTotal.toFixed(2)}</Text>
              </>
            );
          })()}
        </View>

        <Text className="mt-6 text-sm text-gray-500 text-center">{t('invoice_pdf_ready_share_print')}</Text>

        <View className="mt-6 flex-row gap-3">
          <Pressable
            onPress={handleSavePdf}
            className="flex-1 items-center rounded-md bg-blue-600 py-3"
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="font-semibold text-white">{t('save_pdf')}</Text>
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
              <Text className="font-semibold text-white">{t('share')}</Text>
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
              <Text className="font-semibold text-white">{t('print')}</Text>
            )}
          </Pressable>
          <Pressable
            onPress={() => setIsPreview(false)}
            className="flex-1 items-center rounded-md border border-gray-300 py-3"
          >
            <Text className="font-semibold text-black">{t('back_to_edit')}</Text>
          </Pressable>
        </View>

        <View className="mt-3 flex-row gap-3">
          <Pressable
            onPress={() => router.back()}
            className="flex-1 items-center rounded-md bg-gray-600 py-3"
          >
            <Text className="font-semibold text-white">{t('done')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    ) : (
      <ScrollView
        className="flex-1 bg-white px-4 py-6"
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-black">{isEditing ? t('estimate_edit_title') : t('estimate_new_title')}</Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-sm font-medium text-gray-600">{t('close')}</Text>
          </Pressable>
        </View>

        <View className="mt-4 rounded-md border border-gray-200 bg-white p-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-gray-500">{t('logo_position')}</Text>
            <Pressable
              onPress={() => setCenterLogo((prev) => !prev)}
              className="rounded-full border border-gray-300 px-3 py-1"
            >
              <Text className="text-xs text-black">{centerLogo ? t('top_center') : t('top_left')}</Text>
            </Pressable>
          </View>
          {logoUri ? (
            <View className={`mt-3 ${centerLogo ? 'items-center' : 'items-start'}`}>
              <Image source={{ uri: logoUri }} style={{ width: 80, height: 80, resizeMode: 'contain' }} />
            </View>
          ) : (
            <Text className="mt-3 text-xs text-gray-400">{t('no_logo_saved')}</Text>
          )}
        </View>

        <View className="mt-4">
          <Text className="text-sm font-bold text-black mb-2">{t('client_name_placeholder')}</Text>
          <TextInput
            value={clientname}
            onChangeText={setClientname}
            placeholder={t('client_name_placeholder')}
            className="rounded-md border border-gray-300 px-3 py-2 text-black"
          />
        </View>
        <View className="mt-3">
          <Text className="text-sm font-bold text-black mb-2">{t('estimate_number_placeholder')}</Text>
          <TextInput
            value={estimatenumber}
            onChangeText={setEstimatenumber}
            placeholder={t('estimate_number_placeholder')}
            keyboardType="numeric"
            className="rounded-md border border-gray-300 px-3 py-2 text-black"
          />
        </View>
        <View className="mt-3">
          <Text className="text-sm font-bold text-black mb-2">{t('estimate_date_placeholder')}</Text>
          <TextInput
            value={estimatedate}
            onChangeText={setEstimatedate}
            placeholder={t('estimate_date_placeholder')}
            className="rounded-md border border-gray-300 px-3 py-2 text-black"
          />
        </View>

        <Pressable
          onPress={() => setIsProductsModalOpen(true)}
          className="mt-2 rounded-md border border-gray-300 px-3 py-3"
        >
          <Text className="text-sm text-black">{t('select_products')}</Text>
        </Pressable>
        {Object.keys(selectedProducts).length > 0 ? (
          <View className="mt-3 rounded-md border border-gray-200 bg-white p-3">
            <View className="flex-row justify-between">
              <Text className="text-xs font-semibold text-gray-500">{t('item_label')}</Text>
              <Text className="text-xs font-semibold text-gray-500">{t('total_label')}</Text>
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
                        ? `${t('manual_label')}: $${Number(item.manualAmount || 0).toFixed(2)}`
                        : `${t('qty_label')} ${item.qty} × $${Number(item.unitPrice || 0).toFixed(2)}`}
                    </Text>
                  </View>
                  <Text className="text-sm font-semibold text-black">${lineTotal.toFixed(2)}</Text>
                </View>
              );
            })}
          </View>
        ) : null}
        <View className="mt-3">
          <Text className="text-sm font-bold text-black mb-2">{t('subtotal_calculated_placeholder')}</Text>
          <TextInput
            value={estimatetotalamount}
            onChangeText={(text) => {
              setEstimatetotalamount(text);
              setIsSubtotalManuallySet(true);
            }}
            placeholder={t('subtotal_calculated_placeholder')}
            keyboardType="decimal-pad"
            className="rounded-md border border-gray-300 px-3 py-2 text-black"
          />
        </View>
        <View className="mt-3">
          <Text className="text-sm font-bold text-black mb-2">{t('tax_percent_placeholder')}</Text>
          <TextInput
            value={estimatetax}
            onChangeText={setEstimatetax}
            placeholder={t('tax_percent_placeholder')}
            keyboardType="numeric"
            className="rounded-md border border-gray-300 px-3 py-2 text-black"
          />
        </View>
        <View className="mt-3">
          <Text className="text-sm font-bold text-black mb-2">{t('discount_percent_placeholder')}</Text>
          <TextInput
            value={estimatepercentage}
            onChangeText={setEstimatepercentage}
            placeholder={t('discount_percent_placeholder')}
            keyboardType="numeric"
            className="rounded-md border border-gray-300 px-3 py-2 text-black"
          />
        </View>
        <View className="mt-3">
          <Text className="text-sm font-bold text-black mb-2">{t('details_placeholder')}</Text>
          <TextInput
            value={estimatedetails}
            onChangeText={setEstimatedetails}
            placeholder={t('details_placeholder')}
            multiline
            className="min-h-16 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
        </View>
        <View className="mt-3">
          <Text className="text-sm font-bold text-black mb-2">{t('notes_placeholder')}</Text>
          <TextInput
            value={estimatenotes}
            onChangeText={setEstimatenotes}
            placeholder={t('notes_placeholder')}
            multiline
            className="min-h-16 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
        </View>
        <View className="mt-3">
          <Text className="text-sm font-bold text-black mb-2">{t('terms_and_conditions_placeholder')}</Text>
          <TextInput
            value={estimatetermsandconditions}
            onChangeText={setEstimatetermsandconditions}
            placeholder={t('terms_and_conditions_placeholder')}
            multiline
            className="min-h-16 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
        </View>

        <View className="mt-5 flex-row gap-3">
          <Pressable
            onPress={handleGeneratePdf}
            className="flex-1 items-center rounded-md bg-black py-3"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="font-semibold text-white">{t('generate_pdf')}</Text>
            )}
          </Pressable>
          <Pressable
            onPress={handleSaveEstimate}
            className="flex-1 items-center rounded-md border border-gray-300 py-3"
            disabled={isSavingEstimate}
          >
            {isSavingEstimate ? (
              <ActivityIndicator size="small" color="#111827" />
            ) : (
              <Text className="font-semibold text-black">{t('save_estimate')}</Text>
            )}
          </Pressable>
        </View>

        <Modal visible={isProductsModalOpen} animationType="slide">
          <View className="flex-1 bg-white px-4" style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom }}>
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-lg font-semibold text-black">{t('select_products')}</Text>
              <Pressable onPress={() => setIsProductsModalOpen(false)}>
                <Text className="text-sm font-medium text-gray-600">{t('done')}</Text>
              </Pressable>
            </View>

            {allProducts.length === 0 ? (
              <Text className="mt-6 text-sm text-gray-500">{t('no_products_saved_yet')}</Text>
            ) : (
              <ScrollView className="mt-4">
                {allProducts.map((product) => {
                  const selected = selectedProducts[product.id];
                  return (
                    <View key={product.id} className="mb-3 rounded-md border border-gray-200 bg-white p-3">
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
                            {selected ? t('selected') : t('select')}
                          </Text>
                        </Pressable>
                      </View>
                      {selected ? (
                        <View className="mt-3">
                          <View className="flex-row items-center justify-between">
                            <Text className="text-xs text-gray-500">{t('use_manual_amount')}</Text>
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
                                {selected.useManual ? t('manual_label') : t('auto')}
                              </Text>
                            </Pressable>
                          </View>
                          {selected.useManual ? (
                            <View className="mt-3">
                              <Text className="text-xs text-gray-500">{t('manual_amount')}</Text>
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
                                <Text className="text-xs text-gray-500">{t('qty_label')}</Text>
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
                                <Text className="text-xs text-gray-500">{t('unit_price')}</Text>
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
          <Text className="mt-3 text-xs text-gray-500">{t('pdf_ready_to_export')}</Text>
        ) : null}
      </ScrollView>
    )
  );
};

export default estimateCreate;
