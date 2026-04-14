import { Text, View, Pressable } from 'react-native';
import React from 'react';
import type { InvoiceContent } from '@/database/invoicecontent';

type InvoiceProfileProps = {
  invocies: InvoiceContent;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleCompleted: () => void;
};

const InvoiceProfileCard = ({ invocies, onPress, onEdit, onDelete, onToggleCompleted }: InvoiceProfileProps) => {
  if (!invocies) return null;

  const getProductNames = (productsJson: string): string => {
    try {
      const parsed = JSON.parse(productsJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item: { name: string }) => item.name).join(', ');
      }
    } catch {}
    return 'No products';
  };

  return (
    <Pressable onPress={onPress} className="mb-3 rounded-md border border-gray-200 bg-white p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-base font-semibold text-black">{invocies.clientname}</Text>
          <Text className="mt-1 text-sm text-gray-600" numberOfLines={2}>
            {getProductNames(invocies.products)}
          </Text>
        </View>
        <Pressable
          onPress={onToggleCompleted}
          className={`rounded-full px-3 py-1 ${invocies.completed ? 'bg-emerald-100' : 'bg-gray-100'}`}
        >
          <Text className={`text-xs font-medium ${invocies.completed ? 'text-emerald-700' : 'text-gray-600'}`}>
            {invocies.completed ? 'Completed' : 'Not completed'}
          </Text>
        </Pressable>
      </View>
      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-black">${invocies.totalamount.toFixed(2)} </Text>
        <View className="flex-row items-center gap-4">
          <Pressable onPress={onEdit}>
            <Text className="text-xs font-semibold text-blue-600">Edit</Text>
          </Pressable>
          <Pressable onPress={onDelete}>
            <Text className="text-xs font-semibold text-red-600">Delete</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

export default InvoiceProfileCard;
