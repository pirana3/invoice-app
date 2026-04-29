import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getInvoices, type InvoiceContent } from '@/database/invoicecontent';
import { useLanguage } from '@/service/language';

const customerJobs = () => {
  const { t } = useLanguage();
  const params = useLocalSearchParams<{ cname?: string }>();
  const [jobs, setJobs] = useState<InvoiceContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const invoices = await getInvoices();
        const filtered = params.cname
          ? invoices.filter((invoice) => invoice.clientname === params.cname)
          : invoices;
        setJobs(filtered);
      } catch (error) {
        console.error('Failed to load jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.cname]);

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="text-lg font-semibold text-black">{t('customer_jobs')}</Text>
      {params.cname ? (
        <Text className="mt-1 text-xs text-gray-500">{params.cname}</Text>
      ) : null}

      {loading ? (
        <View className="mt-8 items-center">
          <ActivityIndicator size="small" color="#111827" />
        </View>
      ) : jobs.length === 0 ? (
        <Text className="mt-6 text-sm text-gray-500">{t('no_jobs_yet')}</Text>
      ) : (
        <View className="mt-4">
          {jobs.map((invoice) => (
            <View key={invoice.id} className="mb-3 rounded-md border border-gray-200 bg-white p-4">
              <Text className="text-sm font-semibold text-black">{t('invoice_label')} #{invoice.invoicenumber}</Text>
              <Text className="mt-1 text-xs text-gray-500">${invoice.totalamount.toFixed(2)}</Text>
              <Text className="mt-2 text-xs text-gray-500">
                {invoice.completed ? t('completed') : t('pending')}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default customerJobs;
