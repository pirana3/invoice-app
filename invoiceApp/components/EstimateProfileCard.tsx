import { Text, View, Pressable } from 'react-native';
import React from 'react';
import type { EstimateContent } from '@/database/estimatecontent';

type EstimateProfileProps = {
  estimate: EstimateContent;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleCompleted: () => void;
  onConvert: () => void;
};

const estimateProfile = ({ estimate, onPress, onEdit, onDelete, onToggleCompleted, onConvert }: EstimateProfileProps) => {
  if (!estimate) return null;

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
          <Text className="text-base font-semibold text-black">{estimate.clientname}</Text>
          <Text className="mt-1 text-sm text-gray-600" numberOfLines={2}>
            {getProductNames(estimate.estimateproducts)}
          </Text>
        </View>
        <Pressable
          onPress={onToggleCompleted}
          className={`rounded-full px-3 py-1 ${estimate.estimatecompleted ? 'bg-emerald-100' : 'bg-gray-100'}`}
        >
          <Text className={`text-xs font-medium ${estimate.estimatecompleted ? 'text-emerald-700' : 'text-gray-600'}`}>
            {estimate.estimatecompleted ? 'Won' : 'Pending'}
          </Text>
        </Pressable>
      </View>
      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-black">${estimate.estimatetotalamount.toFixed(2)}</Text>
        <View className="flex-row items-center gap-4">
          <Pressable onPress={onConvert}>
            <Text className="text-xs font-semibold text-emerald-600">Convert</Text>
          </Pressable>
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

export default estimateProfile;
