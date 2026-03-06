import { Alert, Image, Text, TextInput, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import useFetch from '@/service/usefetch';
import { setOnboardingComplete } from '@/database/appstate';
import BusinessinfoButton from '@/components/BusinessinfoButton';
import {
  createBusinessInfo,
  getBusinessInfo,
  updateBusinessInfo,
} from '@/database/businessinfodb';

const CompanyDetail = () => {
  const router = useRouter();
  const { data, loading, refetch } = useFetch(getBusinessInfo);

  const [bname, setBname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [industry, setIndustry] = useState('');
  const [logo, setLogo] = useState('');
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
    setLogo(latestInfo.logo ?? '');
  }, [latestInfo]);

  const handlePickLogo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access to choose a logo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setLogo(result.assets[0].uri);
    }
  };

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
      const cleanLogo = logo.trim() || undefined;

      if (latestInfo) {
        await updateBusinessInfo(
          latestInfo.id,
          bname.trim(),
          email.trim(),
          parsedPhone,
          address.trim(),
          industry.trim(),
          cleanLogo
        );
        router.back();
      } else {
        await createBusinessInfo(
          bname.trim(),
          email.trim(),
          parsedPhone,
          address.trim(),
          industry.trim(),
          cleanLogo
        );
        await setOnboardingComplete(true);
        router.replace('/(tabs)/(profile)');
      }
    } catch (error) {
      console.error(error);
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

  return (
    <View className="flex-1 gap-2 bg-white px-4 py-6">
      <Text>
        {latestInfo ? 'Edit your company details' : 'Please enter your company details'}
      </Text>

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
        title={logo.trim() ? 'Change Business Photo' : 'Upload Business Photo (Optional)'}
        onPress={handlePickLogo}
        style="mt-1"
      />

      {logo.trim() ? (
        <BusinessinfoButton
          title="Remove Photo"
          onPress={() => setLogo('')}
          style="mt-1 bg-red-500"
        />
      ) : null}

      {logo.trim() ? (
        <Image
          source={{ uri: logo.trim() }}
          className="h-24 w-24 self-start rounded-md border border-gray-300"
        />
      ) : null}

      <BusinessinfoButton
        title={latestInfo ? 'Save Changes' : 'Save Info'}
        onPress={handleSave}
        isLoading={isSaving}
        style="mt-3"
      />
    </View>
  );
};

export default CompanyDetail;
