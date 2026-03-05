import { Pressable, Text } from 'react-native';
import React from 'react';
import { useLanguage } from '@/service/language';

const EnglishButton = () => {
  const { setLanguage, t } = useLanguage();

  return (
    <Pressable onPress={() => setLanguage('en')} className="rounded-md border border-gray-300 px-4 py-2">
      <Text>{t('english')}</Text>
    </Pressable>
  );
};

export default EnglishButton;
