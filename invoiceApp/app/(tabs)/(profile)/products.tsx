import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import ProductButton from '@/components/ProductButton';
import ProductProfile from '@/app/products/productProfile';
import { getProducts } from '@/database/productdb';
import useFetch from '@/service/usefetch';

const Products = () => {
  const router = useRouter();

  const { data, loading, error, refetch } = useFetch(getProducts);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return (
    <View className="flex-1 bg-white px-4 py-4">
      <ProductButton
        title="Add Product"
        onPress={() => router.push('/products/new')}
        style="mb-4"
      />

      {loading ? (
        <ActivityIndicator size="small" color="#111827" />
      ) : error ? (
        <Text className="text-red-500">Could not load products.</Text>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ProductProfile
              product={item}
              onPress={() => router.push(`/products/${item.id}`)}
            />
          )}
          ListEmptyComponent={<Text className="text-gray-500">No products yet.</Text>}
        />
      )}
    </View>
  );
};

export default Products;
