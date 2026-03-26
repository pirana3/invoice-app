import { Pressable, Text } from 'react-native';
import React from 'react';

type DocumentWriteButtonProps = {
  onPress: () => void;
  disabled?: boolean;
};

const DocumentWriteButton = ({ onPress, disabled }: DocumentWriteButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="flex-1 items-center rounded-md border border-gray-300 bg-white py-2"
    >
      <Text className="text-xs font-medium text-black">Write Text</Text>
    </Pressable>
  );
};

export default DocumentWriteButton;
