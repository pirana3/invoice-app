import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createProduct, deleteProduct, getProductById, updateProduct } from '@/database/productdb';
import useFetch from '@/service/usefetch';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProductProfileScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isNew = rawId === 'new' || rawId === undefined;
  const productId = Number(rawId);
  const canFetch = !isNew && Number.isFinite(productId);
  const fetchProduct = useCallback(() => getProductById(productId), [productId]);
  const [isEditing, setIsEditing] = useState(isNew);
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [price, setPrice] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: product, loading, error, refetch } = useFetch(
    fetchProduct,
    canFetch
  );

  useEffect(() => {
    if (!product) return;
    setName(product.name);
    setDetails(product.details);
    setPrice(String(product.price));
  }, [product]);

  const canEdit = useMemo(() => isNew || isEditing, [isNew, isEditing]);

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
      if (isNew) {
        await createProduct(name.trim(), details.trim(), parsedPrice);
        router.back();
      } else if (product) {
        const updated = await updateProduct(product.id, name.trim(), details.trim(), parsedPrice);
        if (!updated) {
          Alert.alert('Update failed', 'Product no longer exists.');
          router.back();
          return;
        }
        await refetch();
        setIsEditing(false);
      }
    } catch (saveError) {
      console.error(saveError);
      Alert.alert('Save failed', 'Could not save this product.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!product) return;
    Alert.alert('Delete product', `Delete "${product.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsDeleting(true);
            await deleteProduct(product.id);
            router.back();
          } catch (deleteError) {
            console.error(deleteError);
            Alert.alert('Delete failed', 'Could not delete this product.');
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  if (!canFetch && !isNew) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-red-500">Invalid product ID.</Text>
      </View>
    );
  }

  if (!isNew && loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="small" color="#111827" />
      </View>
    );
  }

  if (!isNew && error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-red-500">Could not load this product.</Text>
      </View>
    );
  }

  if (!isNew && !product) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-gray-500">Product not found.</Text>
      </View>
    );
  }

  const insets = useSafeAreaInsets();

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6"
    style={{ paddingTop: Math.max(insets.top, 16), paddingBottom: Math.max(insets.bottom, 16) }}
    >
      {canEdit ? (
        <>
          <View>
            <Text className="text-sm font-bold text-black mb-2">Product Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Product name"
              className="rounded-md border border-gray-300 px-3 py-2 text-black"
            />
          </View>
          <View className="mt-3">
            <Text className="text-sm font-bold text-black mb-2">Description</Text>
            <TextInput
              value={details}
              onChangeText={setDetails}
              placeholder="Product description"
              multiline
              className="min-h-20 rounded-md border border-gray-300 px-3 py-2 text-black"
            />
          </View>
          <View className="mt-3">
            <Text className="text-sm font-bold text-black mb-2">Price</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="Product price"
              keyboardType="numeric"
              className="rounded-md border border-gray-300 px-3 py-2 text-black"
            />
          </View>
        </>
      ) : (
        <>
          {product ? (
            <>
              <Text className="text-2xl font-semibold text-black">{product.name}</Text>
              <Text className="mt-2 text-base text-gray-700">
                {product.details || 'No description'}
              </Text>
              <Text className="mt-6 text-lg font-semibold text-black">
                ${product.price.toFixed(2)}
              </Text>
            </>
          ) : null}
        </>
      )}

      <View className="mt-8 flex-row gap-3">
        {canEdit ? (
          <>
            <Pressable
              onPress={handleSave}
              disabled={isSaving || isDeleting}
              className="flex-1 items-center rounded-md bg-black py-3"
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="font-semibold text-white">
                  {isNew ? 'Save Product' : 'Save Changes'}
                </Text>
              )}
            </Pressable>
            {!isNew ? (
              <Pressable
                onPress={() => {
                  if (product) {
                    setName(product.name);
                    setDetails(product.details);
                    setPrice(String(product.price));
                  }
                  setIsEditing(false);
                }}
                disabled={isSaving || isDeleting}
                className="flex-1 items-center rounded-md border border-gray-300 py-3"
              >
                <Text className="font-semibold text-black">Cancel</Text>
              </Pressable>
            ) : null}
          </>
        ) : (
          <>
            <Pressable
              onPress={() => setIsEditing(true)}
              disabled={isDeleting}
              className="flex-1 items-center rounded-md bg-black py-3"
            >
              <Text className="font-semibold text-white">Edit</Text>
            </Pressable>
            <Pressable
              onPress={handleDelete}
              disabled={isDeleting}
              className="flex-1 items-center rounded-md border border-red-300 bg-red-50 py-3"
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#dc2626" />
              ) : (
                <Text className="font-semibold text-red-600">Delete</Text>
              )}
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default ProductProfileScreen;
