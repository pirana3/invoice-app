import { ActivityIndicator, Alert, ScrollView, Text, View, Pressable } from 'react-native';
import InvoiceProfileCard from '@/components/InvoiceProfileCard';
import { getInvoices, searchInvoice, deleteInvoice, toggleInvoiceCompleted, type InvoiceContent } from '@/database/invoicecontent';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import InvoiceSearch from '@/components/InvoiceSearch';
import React, { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '@/service/language';

const invoiceContentList = () => {
  const { t } = useLanguage();
  const params = useLocalSearchParams<{ query?: string }>();
  const [allInvoices, setAllInvoices] = useState<InvoiceContent[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceContent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await getInvoices();
      setAllInvoices(data);
      setFilteredInvoices(data);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadInvoices();
    }, [])
  );

  useEffect(() => {
    const filterInvoices = async () => {
      if (!params.query || params.query.trim() === '') {
        setFilteredInvoices(allInvoices);
      } else {
        try {
          const results = await searchInvoice(params.query);
          setFilteredInvoices(results);
        } catch (error) {
          console.error('Error searching invoices:', error);
          setFilteredInvoices([]);
        }
      }
    };
    filterInvoices();
  }, [params.query, allInvoices]);

  const handleCreate = () => {
    router.push('/(tabs)/(invoice)/invoiceCreate' as never);
  };

  const handleEdit = (id: number) => {
    router.push({ pathname: '/(tabs)/(invoice)/invoiceCreate', params: { id } } as never);
  };

  const handleDelete = (invoice: InvoiceContent) => {
    Alert.alert(t('delete_invoice_title'), t('delete_invoice_message').replace('{{number}}', String(invoice.invoicenumber)), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteInvoice(invoice.id);
          loadInvoices();
        },
      },
    ]);
  };

  const handleToggleCompleted = async (invoice: InvoiceContent) => {
    const next = invoice.completed ? 0 : 1;
    await toggleInvoiceCompleted(invoice.id, next);
    loadInvoices();
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="py-4">
        <View className="flex-row items-center gap-2 px-4">
          <View className="flex-1">
            <InvoiceSearch containerClassName="mx-0" />
          </View>
          <Pressable
            onPress={handleCreate}
            className="rounded-md bg-black px-3 py-2"
          >
            <Text className="text-sm font-semibold text-white">{t('new')}</Text>
          </Pressable>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="large" color="#111827" />
          </View>
        ) : filteredInvoices.length === 0 ? (
          <View className="px-4 mt-6">
            <Text className="text-sm text-gray-500">{t('no_invoices_yet')}</Text>
          </View>
        ) : (
          <View className="px-4 mt-4">
            {filteredInvoices.map((invoice) => (
              <InvoiceProfileCard
                key={invoice.id}
                invocies={invoice}
                onPress={() => handleEdit(invoice.id)}
                onEdit={() => handleEdit(invoice.id)}
                onDelete={() => handleDelete(invoice)}
                onToggleCompleted={() => handleToggleCompleted(invoice)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default invoiceContentList;
