import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getCustomers, type Customers } from '@/database/customersdb';
import { useLanguage } from '@/service/language';

const customerAssociates = () => {
  const { t } = useLanguage();
  const params = useLocalSearchParams<{ ccompany?: string }>();
  const [associates, setAssociates] = useState<Customers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const customers = await getCustomers();
        const company = params.ccompany?.trim().toLowerCase();
        const filtered = company
          ? customers.filter((customer) => customer.ccompany?.trim().toLowerCase() === company)
          : customers;
        setAssociates(filtered);
      } catch (error) {
        console.error('Failed to load associates:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.ccompany]);

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="text-lg font-semibold text-black">{t('company_associates')}</Text>
      {params.ccompany ? (
        <Text className="mt-1 text-xs text-gray-500">{params.ccompany}</Text>
      ) : null}

      {loading ? (
        <View className="mt-8 items-center">
          <ActivityIndicator size="small" color="#111827" />
        </View>
      ) : associates.length === 0 ? (
        <Text className="mt-6 text-sm text-gray-500">{t('no_associates_found')}</Text>
      ) : (
        <View className="mt-4">
          {associates.map((customer) => (
            <View key={customer.id} className="mb-3 rounded-md border border-gray-200 bg-white p-4">
              <Text className="text-sm font-semibold text-black">{customer.cname}</Text>
              <Text className="mt-1 text-xs text-gray-500">{customer.cemail}</Text>
              <Text className="mt-1 text-xs text-gray-500">{customer.cphone}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default customerAssociates;
