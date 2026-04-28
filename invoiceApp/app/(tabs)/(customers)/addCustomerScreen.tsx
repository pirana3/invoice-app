import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  updateCustomer,
} from '@/database/customersdb';
import useFetch from '@/service/usefetch';

const AddCustomerScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();

  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isNew = rawId === 'new' || rawId === undefined;
  const customerId = Number(rawId);
  const canFetch = !isNew && Number.isFinite(customerId);

  const fetchCustomer = useCallback(() => getCustomerById(customerId), [customerId]);
  const { data: customer, loading, error, refetch } = useFetch(fetchCustomer, canFetch);

  const [isEditing, setIsEditing] = useState(isNew);
  const [cname, setCname] = useState('');
  const [cemail, setCemail] = useState('');
  const [cphone, setCphone] = useState('');
  const [caddress, setCaddress] = useState('');
  const [ccity, setCcity] = useState('');
  const [czip, setCzip] = useState('');
  const [cstate, setCstate] = useState('');
  const [ccompany, setCcompany] = useState('');
  const [cdetails, setCdetails] = useState('');
  const [cphoto, setCphoto] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!customer) return;

    setCname(customer.cname ?? '');
    setCemail(customer.cemail ?? '');
    setCphone(customer.cphone ? String(customer.cphone) : '');
    setCaddress(customer.caddress ?? '');
    setCcity(customer.ccity ?? '');
    setCzip(customer.czip ? String(customer.czip) : '');
    setCstate(customer.cstate ?? '');
    setCcompany(customer.ccompany ?? '');
    setCdetails(customer.cdetails ?? '');
    setCphoto(customer.cphoto ?? '');
  }, [customer]);

  const canEdit = isNew || isEditing;

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow photo library access to select a customer photo.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.85,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setCphoto(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const normalizedPhone = cphone.replace(/\D/g, '');
    const parsedPhone = Number(normalizedPhone || '0');
    const normalizedZip = czip.replace(/\D/g, '');
    const parsedZip = Number(normalizedZip || '0');

    if (!cname.trim()) {
      Alert.alert('Missing name', 'Please enter the customer\'s name.');
      return;
    }

    if (!ccompany.trim()) {
      Alert.alert('Missing company name', 'Please enter the customer\'s company name.');
      return;
    }

    try {
      setIsSaving(true);

      if (isNew) {
        await createCustomer(
          cname.trim(),
          cemail.trim(),
          parsedPhone,
          caddress.trim(),
          ccity.trim(),
          parsedZip,
          cstate.trim(),
          ccompany.trim(),
          cdetails.trim(),
          cphoto.trim()
        );
        router.back();
        return;
      }

      if (customer) {
        const updated = await updateCustomer(
          customer.id,
          cname.trim(),
          cemail.trim(),
          parsedPhone,
          caddress.trim(),
          ccity.trim(),
          parsedZip,
          cstate.trim(),
          ccompany.trim(),
          cdetails.trim(),
          cphoto.trim()
        );

        if (!updated) {
          Alert.alert('Update failed', 'Customer no longer exists.');
          router.back();
          return;
        }

        await refetch();
        setIsEditing(false);
      }
    } catch (saveError) {
      console.error(saveError);
      Alert.alert('Save failed', 'Could not save this customer.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!customer) return;

    Alert.alert('Delete customer', `Delete "${customer.cname}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsDeleting(true);
            await deleteCustomer(customer.id);
            router.back();
          } catch (deleteError) {
            console.error(deleteError);
            Alert.alert('Delete failed', 'Could not delete this customer.');
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  if (!canFetch && !isNew) {
    return (
      <View className='flex-1 items-center justify-center bg-white px-4'>
        <Text className='text-red-500'>Invalid customer ID.</Text>
      </View>
    );
  }

  if (!isNew && loading) {
    return (
      <View className='flex-1 items-center justify-center bg-white'>
        <ActivityIndicator size='small' color='#111827' />
      </View>
    );
  }

  if (!isNew && error) {
    return (
      <View className='flex-1 items-center justify-center bg-white px-4'>
        <Text className='text-red-500'>Could not load customer.</Text>
      </View>
    );
  }

  if (!isNew && !customer) {
    return (
      <View className='flex-1 items-center justify-center bg-white px-4'>
        <Text className='text-gray-500'>Customer not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className='flex-1 bg-white px-4 py-6'>
      {canEdit ? (
        <>
          <View className='items-start'>
            {cphoto ? (
              <Image
                source={{ uri: cphoto }}
                contentFit='cover'
                style={{ width: 140, height: 140, borderRadius: 12 }}
              />
            ) : (
              <View className='h-36 w-36 items-center justify-center rounded-xl border border-gray-300'>
                <Text className='text-xs text-gray-500'>No Photo</Text>
              </View>
            )}

            <View className='mt-3 flex-row gap-2'>
              <Pressable
                onPress={handlePickPhoto}
                className='rounded-md border border-gray-300 px-3 py-2'
              >
                <Text className='text-sm font-medium text-black'>
                  {cphoto ? 'Change photo' : 'Add photo'}
                </Text>
              </Pressable>
            </View>
          </View>

          <TextInput
            value={cname}
            onChangeText={setCname}
            placeholder='Customer name'
            className='mt-3 rounded-md border border-gray-300 px-3 py-2 text-black'
          />
          <TextInput
            value={cemail}
            onChangeText={setCemail}
            placeholder='Customer email'
            keyboardType='email-address'
            autoCapitalize='none'
            className='mt-3 rounded-md border border-gray-300 px-3 py-2 text-black'
          />
          <TextInput
            value={cphone}
            onChangeText={setCphone}
            placeholder='Customer phone number'
            keyboardType='phone-pad'
            className='mt-3 rounded-md border border-gray-300 px-3 py-2 text-black'
          />
          <TextInput
            value={ccompany}
            onChangeText={setCcompany}
            placeholder='Customer company'
            className='mt-3 rounded-md border border-gray-300 px-3 py-2 text-black'
          />
          <TextInput
            value={caddress}
            onChangeText={setCaddress}
            placeholder='Customer street address'
            className='mt-3 rounded-md border border-gray-300 px-3 py-2 text-black'
          />
          <TextInput
            value={ccity}
            onChangeText={setCcity}
            placeholder='Customer city'
            className='mt-3 rounded-md border border-gray-300 px-3 py-2 text-black'
          />
          <TextInput
            value={cstate}
            onChangeText={setCstate}
            placeholder='Customer state'
            className='mt-3 rounded-md border border-gray-300 px-3 py-2 text-black'
          />
          <TextInput
            value={czip}
            onChangeText={setCzip}
            placeholder='Customer zip code'
            className='mt-3 rounded-md border border-gray-300 px-3 py-2 text-black'
          />
          <TextInput
            value={cdetails}
            onChangeText={setCdetails}
            placeholder='Customer details'
            multiline
            className='mt-3 rounded-md border border-gray-300 px-3 py-2 text-black'
          />
        </>
      ) : (
        <>
          {customer ? (
            <>
              <Text className='text-2xl font-semibold text-black'>{customer.cname}</Text>
              <Text className='mt-2 text-base text-gray-700'>{customer.cemail}</Text>
              <Text className='mt-2 text-base text-gray-700'>{customer.cphone}</Text>
              <Text className='mt-2 text-base text-gray-700'>{customer.ccompany}</Text>
              <Text className='mt-4 text-base text-gray-700'>
                {customer.cdetails || 'No details'}
              </Text>
              {customer.cphoto ? (
                <Image
                  source={{ uri: customer.cphoto }}
                  contentFit='cover'
                  style={{ width: 180, height: 180, borderRadius: 12, marginTop: 12 }}
                />
              ) : null}
            </>
          ) : null}
        </>
      )}

      <View className='mt-8 flex-row gap-3'>
        {canEdit ? (
          <>
            <Pressable
              onPress={handleSave}
              disabled={isSaving || isDeleting}
              className='flex-1 items-center rounded-md bg-black py-3'
            >
              {isSaving ? (
                <ActivityIndicator size='small' color='#fff' />
              ) : (
                <Text className='text-sm font-medium text-white'>
                  {isNew ? 'Save Customer' : 'Save Changes'}
                </Text>
              )}
            </Pressable>

            {!isNew ? (
              <Pressable
                onPress={() => {
                  if (customer) {
                    setCname(customer.cname ?? '');
                    setCemail(customer.cemail ?? '');
                    setCphone(customer.cphone ? String(customer.cphone) : '');
                    setCaddress(customer.caddress ?? '');
                    setCcity(customer.ccity ?? '');
                    setCzip(customer.czip ? String(customer.czip) : '');
                    setCstate(customer.cstate ?? '');
                    setCcompany(customer.ccompany ?? '');
                    setCdetails(customer.cdetails ?? '');
                    setCphoto(customer.cphoto ?? '');
                  }
                  setIsEditing(false);
                }}
                disabled={isSaving || isDeleting}
                className='flex-1 items-center rounded-md border border-gray-300 py-3'
              >
                <Text className='font-semibold text-black'>Cancel</Text>
              </Pressable>
            ) : null}
          </>
        ) : (
          <>
            <Pressable
              onPress={() => setIsEditing(true)}
              className='flex-1 items-center rounded-md border border-gray-300 py-3'
            >
              <Text className='font-semibold text-black'>Edit Customer</Text>
            </Pressable>
            <Pressable
              onPress={handleDelete}
              disabled={isDeleting}
              className='flex-1 items-center rounded-md border border-red-300 py-3'
            >
              {isDeleting ? (
                <ActivityIndicator size='small' color='#dc2626' />
              ) : (
                <Text className='font-semibold text-red-600'>Delete</Text>
              )}
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default AddCustomerScreen;
