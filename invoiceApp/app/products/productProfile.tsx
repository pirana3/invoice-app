import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { Product } from '@/database/productdb';

type ProductProfileProps = {
  product: Product;
  onPress: () => void;
};

const ProductProfile = ({ product, onPress }: ProductProfileProps) => {
  return (
    <Pressable onPress={onPress} className="mb-3 rounded-md border border-gray-200 bg-white p-4">
      <Text className="text-base font-semibold text-black">{product.name}</Text>
      <Text className="mt-1 text-sm text-gray-600" numberOfLines={2}>
        {product.details || 'No description'}
      </Text>
      <View className="mt-3">
        <Text className="text-sm font-medium text-black">${product.price.toFixed(2)}</Text>
      </View>
    </Pressable>
  );
};

export default ProductProfile;
