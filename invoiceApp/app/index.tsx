import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';

import useFetch from '@/service/usefetch';
import { isOnboardingComplete } from '@/database/appstate';

const AppEntry = () => {
  const { data, loading } = useFetch(isOnboardingComplete);

  if (loading || data === null) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="small" color="#111827" />
      </View>
    );
  }

  if (data) {
    return <Redirect href="/(tabs)/(profile)" />;
  }

  return <Redirect href="/startScreen/chooseLanguage" />;
};

export default AppEntry;
