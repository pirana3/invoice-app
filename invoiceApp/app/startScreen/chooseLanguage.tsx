import { Text, View } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

import EnglishButton from '@/components/EnglishButton';
import SpanishButton from '@/components/SpanishButton';
import { useLanguage } from '@/service/language';

const ChooseLanguage = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const continueToCompany = () => {
    router.replace('/startScreen/companyDetail');
  };

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white px-6">
      <Text className="text-xl font-semibold text-black">{t('choose_language_title')}</Text>
      <View className="w-full flex-row gap-3">
        <View className="flex-1">
          <EnglishButton onSelected={continueToCompany} />
        </View>
        <View className="flex-1">
          <SpanishButton onSelected={continueToCompany} />
        </View>
      </View>
    </View>
  );
};

export default ChooseLanguage;
