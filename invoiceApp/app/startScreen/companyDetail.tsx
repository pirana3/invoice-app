import { Alert, Image, Text, TextInput, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import useFetch from '@/service/usefetch';
import { setOnboardingComplete } from '@/database/appstate';
import BusinessinfoButton from '@/components/BusinessinfoButton';
import { useLanguage } from '@/service/language';
import {
  createBusinessInfo,
  getBusinessInfo,
  updateBusinessInfo,
} from '@/database/businessinfodb';

const CompanyDetail = () => {
  const router = useRouter();
  const { t } = useLanguage();
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
      Alert.alert(t('business_permission_needed'), t('business_permission_message'));
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
    const normalizedPhone = phone.replace(/\D/g, '');
    const parsedPhone = Number(normalizedPhone);

    if (!bname.trim()) {
      Alert.alert(t('business_missing_name'), t('business_missing_name'));
      return;
    }

    if (!email.trim()) {
      Alert.alert(t('business_missing_email'), t('business_missing_email'));
      return;
    }

    if (!Number.isFinite(parsedPhone) || !normalizedPhone) {
      Alert.alert(t('business_invalid_phone'), t('business_invalid_phone'));
      return;
    }

    if (!address.trim()) {
      Alert.alert(t('business_missing_address'), t('business_missing_address'));
      return;
    }

    if (!industry.trim()) {
      Alert.alert(t('business_missing_industry'), t('business_missing_industry'));
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
      Alert.alert(t('business_save_failed'), t('business_save_failed'));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>{t('business_loading')}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 gap-2 bg-white px-4 py-6">
      <Text>
        {latestInfo ? t('business_title_edit') : t('business_title_new')}
      </Text>

      <TextInput
        onChangeText={setBname}
        value={bname}
        placeholder={t('business_name')}
        className="rounded-md border border-gray-300 px-3 py-2"
      />

      <TextInput
        onChangeText={setEmail}
        value={email}
        placeholder={t('business_email')}
        className="rounded-md border border-gray-300 px-3 py-2"
      />

      <TextInput
        onChangeText={setPhone}
        value={phone}
        placeholder={t('business_phone')}
        keyboardType="numeric"
        className="rounded-md border border-gray-300 px-3 py-2"
      />

      <TextInput
        onChangeText={setAddress}
        value={address}
        placeholder={t('business_address')}
        className="rounded-md border border-gray-300 px-3 py-2"
      />

      <TextInput
        onChangeText={setIndustry}
        value={industry}
        placeholder={t('business_industry')}
        className="rounded-md border border-gray-300 px-3 py-2"
      />

      <BusinessinfoButton
        title={logo.trim() ? t('business_photo_change') : t('business_photo_upload')}
        onPress={handlePickLogo}
        style="mt-1"
      />

      {logo.trim() ? (
        <BusinessinfoButton
          title={t('business_photo_remove')}
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
        title={latestInfo ? t('business_save_changes') : t('business_save_info')}
        onPress={handleSave}
        isLoading={isSaving}
        style="mt-3"
      />
    </View>
  );
};

export default CompanyDetail;
