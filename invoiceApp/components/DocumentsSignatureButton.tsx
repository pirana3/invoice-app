import { Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import React from 'react';

const DocumentsSignatureButton = () => {
  return (
    <Pressable
        onPress={() => router.push('/bdocuments/signature' as never)}
        className="flex-row items-center gap-2"
      >
        <Text className="text-sm text-gray-700">Add Signature</Text>
      </Pressable>
  )
}

export default DocumentsSignatureButton