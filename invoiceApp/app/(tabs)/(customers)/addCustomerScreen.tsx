import { Text, View, ActivityIndicator, Alert, Pressable, ScrollView, TextInput } from 'react-native';
import React, { useCallback, useEffect, useState, useMemo} from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { createCustomer, deleteCustomer, getCustomerById, updateCustomer } from '@/database/customersdb';
import useFetch from '@/service/usefetch';


const addCustomerScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }> ();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isNew = rawId === 'new' || rawId === undefined;
  const customerId = Number(rawId);
  const canFetch = !isNew && Number.isFinite(customerId);
  const fetchCustomer = useCallback(() => getCustomerById(customerId), [customerId]);

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

  const { data: customer, loading, error, refetch} = useFetch(
    fetchCustomer,
    canFetch
  );

  useEffect(() => {
    if (!customer) return;
    setCname(customer.cname);
    setCemail(customer.cemail);
    setCphone(String(customer.cphone));
    setCaddress(customer.caddress);
    setCcity(customer.ccity);
    setCzip(String(customer.czip));
    setCstate(customer.cstate);
    setCcompany(customer.ccompany);
    setCdetails(customer.cdetails);
    setCphoto(customer.cphoto ?? '');
  }, [customer]);

  const canEdit = useMemo(() => isNew || isEditing, [isNew, isEditing]);

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted){
      Alert.alert(
        'Permission neeeded',
        'Please allow photo library access to select a customer photo.'
      );
      return 
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
    const parsedPhone = Number(normalizedPhone);

    if (!cname.trim()) {
      Alert.alert('Missing name', 'Please enter the customers name.');
      return;
    }
    if (!ccompany.trim()){
      Alert.alert('Missing Company name', 'Please enter the Customers Company name.');
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
          czip.trim(),
          cstate.trim(),
          ccompany.trim(),
          cdetails.trim(),
          cphoto.trim()
        );
        router.back();
      } else if (customer) {
        const updated = await updateCustomer(
          customer.id,
          cname.trim(),
          cemail.trim(),
          parsedPhone,
          caddress.trim(),
          ccity.trim(),
          czip.trim(),
          cstate.trim(),
          ccompany.trim(),
          cdetails.trim(),
          cphoto.trim()
        );
        if (!updated){
          Alert.alert('Update Failed', 'Cstomer no longer exists.');
          router.back();
          return;
        }
        await refetch();
        setIsEditing(false);
      }
    } catch (saveError){
      console.error(saveError)
        Alert.alert('Save failed', 'Could not save this Customer.');
      } finally{
        setIsSaving(false);
      }
  };

    const handleDelete = () => {
      if(!customer) return;
      Alert.alert('Delete Customer', `Delete "${customer.cname}`, [
        { text: 'Cancel', style: 'cancel'},
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
              Alert.alert('Delete failed', 'Could not delete this Customer.')
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
        <Text className='text-red-500'>Invalid Customer ID.</Text>
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

  if (!isNew && error){
    return (
      <View className='flex-1 items-center justify-center bg-white px-4'>
        <Text className='text-red-500'>Could not load Customer.</Text>
      </View>
    )
  }

  if (!isNew && !customer) {
      return (
        <View className="flex-1 items-center justify-center bg-white px-4">
          <Text className="text-gray-500">Customer not found.</Text>
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
                source={{ uri: cphoto}}
                contentFit="cover"
                style={{ width: 140, height: 140, borderRadius: 12 }}
              />
            ) : (
              <View className='h-36 w-36 items-c enter justify-center rounded-xl border border-gray-300'>
                <Text className='text-xs text-gray-500'> No Photo</Text>
              </View>
            )}
            <View className='mt-3 flex-row gap-2'>
              <Pressable
              onPress={handlePickPhoto}
              className='rounded-md border border-gray-300 px-3 py-2'
              >
                <Text className='text-sm font-medium text-black'>
                  {cphoto ? 'Change photo' : ' Add photo'}
                </Text>
              </Pressable>
            </View>
          </View>
          <TextInput
            value={cname}
            onChangeText={setCname}
            placeholder='Customer name'
            className='rounded-md norder border-gray-300 px-3 py-2 text-black'
          />
          <TextInput
            value={cemail}
            onChangeText={setCemail}
            placeholder='Customer Email'
            keyboardType='email-address'
            autoCapitalize='none'
            className='mt-3 rounded-md border border-gray-300 px-3 py-2 text-black'
          />
          <TextInput
            value={cphone}
            onChangeText={setCphone}
            placeholder='Customer phone number'
            keyboardType='numeric'
            className='mt-3 rounded-md border-gray-300 px-3 py-2 text-black'
          />
          <TextInput
            value={caddress}
            onChangeText={setCaddress}
            placeholder='Custoemr stree address'
            className='mt- 3 rounded-md border-gray-300 px-3 py-2 text-black'
          />

        </>
      )}
    </ScrollView>
  )
}

export default addCustomerScreen