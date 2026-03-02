import React, { useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import ProductButton from '@/components/ProductButton';
import { createProduct } from '@/database/productdb';

const ProductScreen = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [price, setPrice] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const parsedPrice = Number(price);

    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter a product name.');
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      Alert.alert('Invalid price', 'Please enter a valid product price.');
      return;
    }

    try {
      setIsSaving(true);
      await createProduct(name.trim(), details.trim(), parsedPrice);
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('Save failed', 'Could not save this product.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 gap-3 bg-white px-4 py-6">
      <TextInput
        onChangeText={setName}
        value={name}
        placeholder="Enter product name"
        className="rounded-md border border-gray-300 px-3 py-2"
      />

      <TextInput
        onChangeText={setDetails}
        value={details}
        placeholder="Enter product description"
        className="min-h-20 rounded-md border border-gray-300 px-3 py-2"
        multiline
      />

      <TextInput
        onChangeText={setPrice}
        value={price}
        placeholder="Enter product price"
        keyboardType="numeric"
        className="rounded-md border border-gray-300 px-3 py-2"
      />

      <ProductButton
        title="Save Product"
        onPress={handleSave}
        isLoading={isSaving}
      />
    </View>
  );
};

export default ProductScreen;
