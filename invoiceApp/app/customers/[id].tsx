import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  updateCustomer,
} from '@/database/customersdb';
import useFetch from '@/service/usefetch';

const CustomerProfileScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string | string[];
    cname?: string;
    cemail?: string;
    cphone?: string;
    ccompany?: string;
  }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isNew = rawId === 'new' || rawId === undefined;
  const customerId = Number(rawId);
  const canFetch = !isNew && Number.isFinite(customerId);
  const fetchCustomer = useCallback(() => getCustomerById(customerId), [customerId]);

  const [isEditing, setIsEditing] = useState(isNew);
  const [cname, setCname] = useState(params.cname ?? '');
  const [cemail, setCemail] = useState(params.cemail ?? '');
  const [cphone, setCphone] = useState(params.cphone ?? '');
  const [caddress, setCaddress] = useState('');
  const [ccity, setCcity] = useState('');
  const [czip, setCzip] = useState('');
  const [cstate, setCstate] = useState('');
  const [ccompany, setCcompany] = useState(params.ccompany ?? '');
  const [cdetails, setCdetails] = useState('');
  const [cphoto, setCphoto] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: customer, loading, error, refetch } = useFetch(fetchCustomer, canFetch);

  useEffect(() => {
    if (!customer) return;
    setCname(customer.cname);
    setCemail(customer.cemail);
    setCphone(String(customer.cphone));
    setCaddress(customer.caddress);
    setCcity(customer.ccity);
    setCzip(String(customer.czip ?? ''));
    setCstate(customer.cstate);
    setCcompany(customer.ccompany);
    setCdetails(customer.cdetails);
    setCphoto(customer.cphoto ?? '');
  }, [customer]);

  const canEdit = useMemo(() => isNew || isEditing, [isNew, isEditing]);

  const handleSave = async () => {
    const normalizedPhone = cphone.replace(/\D/g, '');
    const parsedPhone = Number(normalizedPhone);
    const normalizedZip = czip.replace(/\D/g, '');
    const parsedZip = Number(normalizedZip || '0');

    if (!cname.trim()) {
      Alert.alert('Missing name', 'Please enter the customer name.');
      return;
    }
    if (!cemail.trim()) {
      Alert.alert('Missing email', 'Please enter the customer email.');
      return;
    }
    if (!Number.isFinite(parsedPhone) || parsedPhone < 0 || !normalizedPhone) {
      Alert.alert('Invalid phone number', 'Please enter a valid phone number.');
      return;
    }
    if (!caddress.trim()) {
      Alert.alert('Missing address', 'Please enter the customer address.');
      return;
    }
    if (!ccity.trim()) {
      Alert.alert('Missing city', 'Please enter the city.');
      return;
    }
    if (!cstate.trim()) {
      Alert.alert('Missing state', 'Please enter the state.');
      return;
    }
    const companyValue = ccompany.trim() || cname.trim();

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
          companyValue,
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
          parsedZip,
          cstate.trim(),
          companyValue,
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
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-red-500">Invalid customer ID.</Text>
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
        <Text className="text-red-500">Could not load this customer.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      {canEdit ? (
        <>
          <TextInput
            value={cname}
            onChangeText={setCname}
            placeholder="Customer name"
            className="rounded-md border border-gray-300 px-3 py-2 text-black"
          />
          <TextInput
            value={cemail}
            onChangeText={setCemail}
            placeholder="Customer email"
            keyboardType="email-address"
            autoCapitalize="none"
            className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
          <TextInput
            value={cphone}
            onChangeText={setCphone}
            placeholder="Phone number"
            keyboardType="numeric"
            className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
          <TextInput
            value={caddress}
            onChangeText={setCaddress}
            placeholder="Address"
            className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
          <TextInput
            value={ccity}
            onChangeText={setCcity}
            placeholder="City"
            className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
          <TextInput
            value={cstate}
            onChangeText={setCstate}
            placeholder="State"
            className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
          <TextInput
            value={czip}
            onChangeText={setCzip}
            placeholder="Zip code"
            keyboardType="numeric"
            className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
          <TextInput
            value={ccompany}
            onChangeText={setCcompany}
            placeholder="Company"
            className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
          <TextInput
            value={cdetails}
            onChangeText={setCdetails}
            placeholder="Details"
            multiline
            className="mt-3 min-h-20 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
        </>
      ) : (
        <>
          <Text className="text-2xl font-semibold text-black">{cname}</Text>
          <Text className="mt-2 text-base text-gray-700">{cemail}</Text>
          <Text className="mt-2 text-base text-gray-700">{cphone}</Text>
          <Text className="mt-2 text-base text-gray-700">{caddress}</Text>
          <Text className="mt-2 text-base text-gray-700">
            {ccity}, {cstate}
          </Text>
          <Text className="mt-2 text-base text-gray-700">Company: {ccompany}</Text>
          <Text className="mt-4 text-base text-gray-700">
            {cdetails || 'No details'}
          </Text>

          <View className="mt-6 flex-row gap-3">
            <Pressable
              onPress={() =>
                router.push({ pathname: '/customers/customerJobs', params: { cname } } as never)
              }
              className="flex-1 items-center rounded-md border border-gray-300 py-3"
            >
              <Text className="font-semibold text-black">Jobs</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                router.push({ pathname: '/customers/customerAssociates', params: { ccompany } } as never)
              }
              className="flex-1 items-center rounded-md border border-gray-300 py-3"
            >
              <Text className="font-semibold text-black">Associates</Text>
            </Pressable>
          </View>
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
                  {isNew ? 'Save Customer' : 'Save Changes'}
                </Text>
              )}
            </Pressable>
            {!isNew ? (
              <Pressable
                onPress={() => {
                  if (customer) {
                    setCname(customer.cname);
                    setCemail(customer.cemail);
                    setCphone(String(customer.cphone));
                    setCaddress(customer.caddress);
                    setCcity(customer.ccity);
                    setCstate(customer.cstate);
                    setCcompany(customer.ccompany);
                    setCdetails(customer.cdetails);
                    setCphoto(customer.cphoto ?? '');
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

export default CustomerProfileScreen;
