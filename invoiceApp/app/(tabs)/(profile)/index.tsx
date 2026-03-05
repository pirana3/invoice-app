import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import BusinessinfoButton from '@/components/BusinessinfoButton';
import useFetch from '@/service/usefetch';
import {
  createBusinessInfo,
  getBusinessInfo,
  updateBusinessInfo,
} from '@/database/businessinfodb';

const ProfileBusiness = () => {
  const { data, loading, error, refetch } = useFetch(getBusinessInfo);

  const [bname, setBname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [industry, setIndustry] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const latestInfo = data?.[0] ?? null;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    if (!latestInfo) return;

    setBname(latestInfo.bname);
    setEmail(latestInfo.email);
    setPhone(String(latestInfo.phone));
    setAddress(latestInfo.address);
    setIndustry(latestInfo.industry);
  }, [latestInfo]);

  const handleSave = async () => {
    const parsedPhone = Number(phone);

    if (!bname.trim()) {
      Alert.alert('Missing name', 'Please enter your company name.');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Missing email', 'Please enter your company email.');
      return;
    }

    if (!Number.isFinite(parsedPhone)) {
      Alert.alert('Invalid phone', 'Please enter a valid phone number.');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Missing address', 'Please enter your company address.');
      return;
    }

    if (!industry.trim()) {
      Alert.alert('Missing industry', 'Please enter your company industry.');
      return;
    }

    try {
      setIsSaving(true);

      if (latestInfo) {
        await updateBusinessInfo(
          latestInfo.id,
          bname.trim(),
          email.trim(),
          parsedPhone,
          address.trim(),
          industry.trim(),
          latestInfo.logo
        );
      } else {
        await createBusinessInfo(
          bname.trim(),
          email.trim(),
          parsedPhone,
          address.trim(),
          industry.trim()
        );
      }

      await refetch();
      Alert.alert('Saved', 'Business info updated.');
    } catch (saveError) {
      console.error(saveError);
      Alert.alert('Save failed', 'Could not save business info.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-red-500">Could not load business info.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 gap-2 bg-white px-4 py-4">
      <Text className="mb-2 text-lg font-semibold">Business Information</Text>

      <TextInput
        value={bname}
        onChangeText={setBname}
        placeholder="Company Name"
        className="rounded-md border border-gray-300 px-3 py-2"
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Company Email"
        className="rounded-md border border-gray-300 px-3 py-2"
      />

      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone Number"
        keyboardType="numeric"
        className="rounded-md border border-gray-300 px-3 py-2"
      />

      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
        className="rounded-md border border-gray-300 px-3 py-2"
      />

      <TextInput
        value={industry}
        onChangeText={setIndustry}
        placeholder="Industry"
        className="rounded-md border border-gray-300 px-3 py-2"
      />

      <BusinessinfoButton
        title={latestInfo ? 'Save Changes' : 'Save Info'}
        onPress={handleSave}
        isLoading={isSaving}
        style="mt-3"
      />
    </View>
  );
};

export default ProfileBusiness;
