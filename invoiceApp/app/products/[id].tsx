import React, { useCallback } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { getProductById } from '@/database/productdb';
import useFetch from '@/service/usefetch';

const ProductProfileScreen = () => {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const productId = Number(rawId);
  const canFetch = Number.isFinite(productId);
  const fetchProduct = useCallback(() => getProductById(productId), [productId]);

  const { data: product, loading, error } = useFetch(
    fetchProduct,
    canFetch
  );

  if (!canFetch) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-red-500">Invalid product ID.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="small" color="#111827" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-red-500">Could not load this product.</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-gray-500">Product not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="text-2xl font-semibold text-black">{product.name}</Text>
      <Text className="mt-2 text-base text-gray-700">{product.details || 'No description'}</Text>
      <Text className="mt-6 text-lg font-semibold text-black">${product.price.toFixed(2)}</Text>
    </ScrollView>
  );
};

export default ProductProfileScreen;
