import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { getBusinessInfo } from '@/database/businessinfodb';

const invoiceCreate = () => {
  const router = useRouter();

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

  useEffect(() => {
    const loadLogo = async () => {
      const businesses = await getBusinessInfo();
      const latest = businesses?.[0];
      setLogoUri(latest?.logo ?? null);
    };
    loadLogo();
  }, []);

  const subtotal = useMemo(() => Number(totalamount) || 0, [totalamount]);
  const taxAmount = useMemo(() => (subtotal * (Number(tax) || 0)) / 100, [subtotal, tax]);
  const discountAmount = useMemo(
    () => (subtotal * (Number(percentage) || 0)) / 100,
    [subtotal, percentage]
  );
  const finalTotal = useMemo(() => subtotal + taxAmount - discountAmount, [subtotal, taxAmount, discountAmount]);

  const buildHtml = () => {
    const safe = (value: string) => value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const logoHtml = logoUri
      ? `<img src="${logoUri}" style="max-width:140px; max-height:140px; object-fit:contain;" />`
      : '';
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
            <div style="margin-top:6px;">${safe(products)}</div>
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

  const handleSavePdf = async () => {
    if (!pdfUri) {
      Alert.alert('No PDF yet', 'Generate the PDF first.');
      return;
    }
    try {
      setIsSaving(true);
      const dir = `${FileSystem.documentDirectory}invoices`;
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      const filename = invoicenumber ? `invoice-${invoicenumber}.pdf` : `invoice-${Date.now()}.pdf`;
      const dest = `${dir}/${filename}`;
      await FileSystem.copyAsync({ from: pdfUri, to: dest });
      Alert.alert('Saved', `Saved to ${dest}`);
    } catch (error) {
      console.error('Save failed:', error);
      Alert.alert('Save failed', 'Could not save the PDF.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSharePdf = async () => {
    if (!pdfUri) {
      Alert.alert('No PDF yet', 'Generate the PDF first.');
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
      Alert.alert('Share failed', 'Could not share the PDF.');
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
      Alert.alert('Print failed', 'Could not print the PDF.');
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-black">New Invoice</Text>
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
        onChangeText={setProducts}
        placeholder="Products / Services"
        multiline
        className="mt-3 min-h-20 rounded-md border border-gray-300 px-3 py-2 text-black"
      />
      <TextInput
        value={totalamount}
        onChangeText={setTotalamount}
        placeholder="Subtotal"
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
          onPress={handleSavePdf}
          className="flex-1 items-center rounded-md border border-gray-300 py-3"
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#111827" />
          ) : (
            <Text className="font-semibold text-black">Save</Text>
          )}
        </Pressable>
      </View>

      <View className="mt-3 flex-row gap-3">
        <Pressable
          onPress={handleSharePdf}
          className="flex-1 items-center rounded-md border border-gray-300 py-3"
          disabled={isSharing}
        >
          {isSharing ? (
            <ActivityIndicator size="small" color="#111827" />
          ) : (
            <Text className="font-semibold text-black">Share</Text>
          )}
        </Pressable>
        <Pressable
          onPress={handlePrintPdf}
          className="flex-1 items-center rounded-md border border-gray-300 py-3"
          disabled={isPrinting}
        >
          {isPrinting ? (
            <ActivityIndicator size="small" color="#111827" />
          ) : (
            <Text className="font-semibold text-black">Print</Text>
          )}
        </Pressable>
      </View>
      {pdfUri ? (
        <Text className="mt-3 text-xs text-gray-500">PDF ready to export.</Text>
      ) : null}
    </ScrollView>
  );
};

export default invoiceCreate;
