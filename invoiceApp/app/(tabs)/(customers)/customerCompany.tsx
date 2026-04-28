import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import CustomerSearch from '@/components/CustomerSearch';
import { getCustomers, type Customers } from '@/database/customersdb';
import { useLanguage } from '@/service/language';

type CompanyGroup = {
  companyName: string;
  customers: Customers[];
};

const CustomerCompanyScreen = () => {
  const { t } = useLanguage();
  const params = useLocalSearchParams<{ query?: string }>();
  const [customers, setCustomers] = useState<Customers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const data = await getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error('Error loading customers for company view:', error);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const groupedCompanies = useMemo(() => {
    const groups = new Map<string, CompanyGroup>();

    customers.forEach((customer) => {
      const trimmedCompany = customer.ccompany?.trim() ?? '';
      const companyName = trimmedCompany.length > 0 ? trimmedCompany : 'Independent';
      const groupKey = companyName.toLowerCase();
      const existing = groups.get(groupKey);

      if (existing) {
        existing.customers.push(customer);
      } else {
        groups.set(groupKey, { companyName, customers: [customer] });
      }
    });

    const query = params.query?.trim().toLowerCase() ?? '';
    const results = Array.from(groups.values())
      .map((group) => ({
        ...group,
        customers: [...group.customers].sort((a, b) => a.cname.localeCompare(b.cname)),
      }))
      .sort((a, b) => a.companyName.localeCompare(b.companyName));

    if (!query) return results;

    return results.filter((group) => {
      if (group.companyName.toLowerCase().includes(query)) return true;
      return group.customers.some((customer) => {
        return (
          customer.cname.toLowerCase().includes(query) ||
          customer.cemail.toLowerCase().includes(query)
        );
      });
    });
  }, [customers, params.query]);

  if (loading) {
    return (
      <View className='flex-1 items-center justify-center bg-gray-50'>
        <ActivityIndicator size='large' color='#111827' />
      </View>
    );
  }

  return (
    <ScrollView className='flex-1 bg-gray-50'>
      <View className='py-4'>
        <View className='px-4'>
          <CustomerSearch containerClassName='mx-0' />
        </View>

        {groupedCompanies.length === 0 ? (
          <View className='mt-6 px-4'>
            <Text className='text-sm text-gray-500'>{t('no_companies_found')}</Text>
          </View>
        ) : (
          <View className='mt-4 gap-3 px-4'>
            {groupedCompanies.map((group) => (
              <Pressable
                key={group.companyName.toLowerCase()}
                onPress={() =>
                  router.push({
                    pathname: '/(tabs)/(customers)/customerAssociates',
                    params: { ccompany: group.companyName },
                  } as never)
                }
                className='rounded-md border border-gray-200 bg-white p-4'
              >
                <View className='flex-row items-center justify-between'>
                  <Text className='text-base font-semibold text-black'>{group.companyName}</Text>
                  <View className='rounded-full bg-gray-100 px-3 py-1'>
                    <Text className='text-xs font-medium text-gray-700'>
                      {group.customers.length} {group.customers.length === 1 ? t('customer_singular') : t('customer_plural')}
                    </Text>
                  </View>
                </View>
                <Text className='mt-2 text-sm text-gray-600'>
                  {group.customers.slice(0, 3).map((customer) => customer.cname).join(', ')}
                  {group.customers.length > 3 ? ', ...' : ''}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default CustomerCompanyScreen;
