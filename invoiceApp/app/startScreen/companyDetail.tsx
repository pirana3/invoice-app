import { Alert, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

import { createBusinessInfo } from '@/database/businessinfodb';
import { setOnboardingComplete } from '@/database/appstate';
import BusinessinfoButton from '@/components/BusinessinfoButton';

const CompanyDetail = () => {
  const router = useRouter();
  const [bname, setBname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [industry, setIndustry] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
      await createBusinessInfo(
        bname.trim(),
        email.trim(),
        parsedPhone,
        address.trim(),
        industry.trim()
      );
      await setOnboardingComplete(true);
      router.replace('/(tabs)/(profile)');
    } catch (error) {
      console.error(error);
      Alert.alert('Save failed', 'Could not save business info.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 gap-2 bg-white px-4 py-6">
      <Text>Please enter your company details</Text>

      <TextInput
        onChangeText={setBname}
        value={bname}
        placeholder="Company Name"
        className="rounded-md border border-gray-300 px-3 py-2"
      />

      <TextInput
        onChangeText={setEmail}
        value={email}
        placeholder="Company Email"
        className="rounded-md border border-gray-300 px-3 py-2"
      />

      <TextInput
        onChangeText={setPhone}
        value={phone}
        placeholder="Phone Number"
        keyboardType="numeric"
        className="rounded-md border border-gray-300 px-3 py-2"
      />

      <TextInput
        onChangeText={setAddress}
        value={address}
        placeholder="Address"
        className="rounded-md border border-gray-300 px-3 py-2"
      />

      <TextInput
        onChangeText={setIndustry}
        value={industry}
        placeholder="Industry"
        className="rounded-md border border-gray-300 px-3 py-2"
      />

      <BusinessinfoButton
        title="Save Info"
        onPress={handleSave}
        isLoading={isSaving}
        style="mt-3"
      />
    </View>
  );
};

export default CompanyDetail;
