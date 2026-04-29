import { ActivityIndicator, ScrollView, Text, View, Pressable } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import CustomerSearch from '@/components/CustomerSearch';
import CustomerImportContactsScreen from '@/components/CustomerImportContactsScreen';
import CustomersProfile from '@/components/CustomersProfile';
import EmployeeButton from '@/components/EmployeesButton';
import { getCustomers, searchCustomers, type Customers } from '@/database/customersdb';
import { useLanguage } from '@/service/language';

const customersList = () => {
  const { t } = useLanguage();
  const params = useLocalSearchParams<{ query?: string }>();
  const [allCustomers, setAllCustomers] = useState<Customers[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customers[]>([]);
  const [loading, setLoading] = useState(true);
  const [importOpen, setImportOpen] = useState(false);

  const companyCounts = useMemo(() => {
    const counts = new Map<string, number>();
    allCustomers.forEach((customer) => {
      const key = customer.ccompany?.trim().toLowerCase() || customer.cname.trim().toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return counts;
  }, [allCustomers]);

  const companyMainId = useMemo(() => {
    const mainMap = new Map<string, number>();
    allCustomers.forEach((customer) => {
      const key = customer.ccompany?.trim().toLowerCase() || customer.cname.trim().toLowerCase();
      if (companyCounts.get(key) && (companyCounts.get(key) ?? 0) > 1) {
        const cname = customer.cname.trim().toLowerCase();
        const ccompany = customer.ccompany?.trim().toLowerCase();
        if (ccompany && cname === ccompany) {
          mainMap.set(key, customer.id);
        }
      }
      if (!mainMap.has(key)) {
        mainMap.set(key, customer.id);
      }
    });
    return mainMap;
  }, [allCustomers, companyCounts]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setAllCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    const filterCustomers = async () => {
      if (!params.query || params.query.trim() === '') {
        setFilteredCustomers(allCustomers);
      } else {
        try {
          const results = await searchCustomers(params.query);
          setFilteredCustomers(results);
        } catch (error) {
          console.error('Error searching customers:', error);
          setFilteredCustomers([]);
        }
      }
    };
    filterCustomers();
  }, [params.query, allCustomers]);

  const handleAddCustomer = () => {
    router.push('/customers/addCustomer' as never);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="py-4">
        <View className="flex-row items-center gap-2 px-4">
          <View className="flex-1">
            <CustomerSearch containerClassName="mx-0" />
          </View>
          <Pressable
            onPress={() => setImportOpen(true)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2"
          >
            <Text className="text-xs font-semibold text-black">{t('import')}</Text>
          </Pressable>
        </View>
        <View className="mt-3 px-4">
          <EmployeeButton onPress={handleAddCustomer} title={t('customers_add')} style="mb-0" />
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="large" color="#111827" />
          </View>
        ) : filteredCustomers.length === 0 ? (
          <View className="px-4 mt-6">
            <Text className="text-sm text-gray-500">{t('no_customers_yet')}</Text>
          </View>
        ) : (
          <View className="px-4 mt-4">
            {filteredCustomers.map((customer) => {
              const key = customer.ccompany?.trim().toLowerCase() || customer.cname.trim().toLowerCase();
              const associatesCount = Math.max((companyCounts.get(key) ?? 1) - 1, 0);
              const isMain = companyMainId.get(key) === customer.id;
              return (
                <CustomersProfile
                  key={customer.id}
                  customer={customer}
                  isMain={isMain}
                  associatesCount={associatesCount}
                  onPress={() => router.push({ pathname: '/customers/[id]', params: { id: customer.id } } as never)}
                />
              );
            })}
          </View>
        )}
      </View>

      <CustomerImportContactsScreen
        isVisible={importOpen}
        onClose={() => setImportOpen(false)}
        onSelect={(contact) => {
          setImportOpen(false);
          router.push({
            pathname: '/customers/addCustomer',
            params: {
              cname: contact.name,
              cemail: contact.email ?? '',
              cphone: contact.phone ?? '',
              ccompany: contact.company ?? '',
            },
          } as never);
        }}
      />
    </ScrollView>
  );
};

export default customersList;
