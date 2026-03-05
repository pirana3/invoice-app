import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import BusinessinfoButton from '@/components/BusinessinfoButton';
import useFetch from '@/service/usefetch';
import { getBusinessInfo } from '@/database/businessinfodb';

const ProfileBusiness = () => {
  const router = useRouter();
  const { data, loading, error, refetch } = useFetch(getBusinessInfo);

  const latestInfo = data?.[0] ?? null;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

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
      {latestInfo ? (
        <View className="gap-2">
          <Text>Company Name: {latestInfo.bname}</Text>
          <Text>Company Email: {latestInfo.email}</Text>
          <Text>Phone Number: {latestInfo.phone}</Text>
          <Text>Address: {latestInfo.address}</Text>
          <Text>Industry: {latestInfo.industry}</Text>
        </View>
      ) : (
        <Text>No business information saved yet.</Text>
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
