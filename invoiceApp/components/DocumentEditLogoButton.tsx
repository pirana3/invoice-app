import { Pressable, Text } from 'react-native';
import React from 'react';

type DocumentEditLogoButtonProps = {
  onPress: () => void;
  disabled?: boolean;
};

const DocumentEditLogoButton = ({ onPress, disabled }: DocumentEditLogoButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="flex-1 items-center rounded-md border border-gray-300 bg-white py-2"
    >
      <Text className="text-xs font-medium text-black">Add Logo</Text>
    </Pressable>
  );
};

export default DocumentEditLogoButton;
