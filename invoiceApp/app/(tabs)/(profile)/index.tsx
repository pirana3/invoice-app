import React, { useCallback } from 'react';
import { Image, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useLanguage } from '@/service/language';
import BusinessinfoButton from '@/components/BusinessinfoButton';
import useFetch from '@/service/usefetch';
import { getBusinessInfo } from '@/database/businessinfodb';

const ProfileBusiness = () => {
  const router = useRouter();
  const { data, loading, error, refetch } = useFetch(getBusinessInfo);
  const { t } = useLanguage();
  const latestInfo = data?.[0] ?? null;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>{t('business_index')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-red-500">{t('business_cant_load')}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 gap-2 bg-white px-4 py-4">
      <Text className="mb-2 text-lg font-semibold">{t('business_info')}</Text>
      {latestInfo ? (
        <View className="gap-2">
          {latestInfo.logo ? (
            <Image
              source={{ uri: latestInfo.logo }}
              className="mb-2 h-24 w-24 rounded-md border border-gray-300"
            />
          ) : null}
          <Text>Company Name: {latestInfo.bname}</Text>
          <Text>Company Email: {latestInfo.email}</Text>
          <Text>Phone Number: {latestInfo.phone}</Text>
          <Text>Address: {latestInfo.address}</Text>
          <Text>Industry: {latestInfo.industry}</Text>
        </View>
      ) : (
        <Text>{t('business_info_not_saved')}</Text>
      )}

      <BusinessinfoButton
        title={latestInfo ? 'Edit Business' : 'Add Business Info'}
        onPress={() => router.push('/startScreen/companyDetail')}
        style="mt-3"
      />
    </View>
  );
};

export default ProfileBusiness;
