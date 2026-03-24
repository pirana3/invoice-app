import { Text, Pressable } from 'react-native';
import { router } from 'expo-router';

import React from 'react';

const DocumentEditButton = () => {
  return (
    <Pressable
      onPress={() => router.push('/bdocuments/documentEdit' as never)}
      className="flex-row items-center gap-2"
    >
      <Text className="text-sm text-gray-700">Edit</Text>
    </Pressable>
  )
}

export default DocumentEditButton
