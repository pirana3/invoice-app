import { Pressable, Text } from 'react-native';
import React from 'react';
import { useLanguage } from '@/service/language';

type SpanishButtonProps = {
  onSelected?: () => void;
};

const SpanishButton = ({ onSelected }: SpanishButtonProps) => {
  const { setLanguage, t } = useLanguage();

  return (
    <Pressable
      onPress={() => {
        setLanguage('es');
        onSelected?.();
      }}
      className="rounded-md border border-gray-300 px-4 py-2"
    >
      <Text>{t('spanish')}</Text>
    </Pressable>
  );
};

export default SpanishButton;
