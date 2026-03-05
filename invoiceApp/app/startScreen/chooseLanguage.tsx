import { Text, View } from 'react-native';
import React from 'react';
import EnglishButton from '@/components/EnglishButton';
import SpanishButton from '@/components/SpanishButton';
import { useLanguage } from '@/service/language';

const ChooseLanguage = () => {
  const { t } = useLanguage();

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white px-6">
      <Text className="text-xl font-semibold text-black">{t('choose_language_title')}</Text>
      <View className="w-full flex-row gap-3">
        <View className="flex-1">
          <EnglishButton />
        </View>
        <View className="flex-1">
          <SpanishButton />
        </View>
      </View>
    </View>
  );
};

export default ChooseLanguage;
