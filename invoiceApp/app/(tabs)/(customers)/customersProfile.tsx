import { Text, View, Pressable } from 'react-native';
import React from 'react';
import type { Customers } from '@/database/customersdb';

type CustomersProfileProps = {
  customer: Customers;
  isMain: boolean;
  associatesCount: number;
  onPress: () => void;
};

const customersProfile = ({ customer, isMain, associatesCount, onPress }: CustomersProfileProps) => {
  return (
    <Pressable onPress={onPress} className="mb-3 rounded-md border border-gray-200 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-base font-semibold text-black">{customer.cname}</Text>
          <Text className="mt-1 text-sm text-gray-600">
            {customer.ccompany || 'Independent'}
          </Text>
        </View>
        <View className={`rounded-full px-3 py-1 ${isMain ? 'bg-emerald-100' : 'bg-gray-100'}`}>
          <Text className={`text-xs font-medium ${isMain ? 'text-emerald-700' : 'text-gray-600'}`}>
            {isMain ? 'Main' : 'Associate'}
          </Text>
        </View>
      </View>
      <View className="mt-3">
        <Text className="text-xs text-gray-500">
          {associatesCount > 0 ? `${associatesCount} associates` : 'No associates'}
        </Text>
      </View>
    </Pressable>
  );
};

export default customersProfile;
