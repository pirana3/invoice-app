import { Text, View, Pressable } from 'react-native';
import DocumentsButton from '@/components/DocumentsButton';
import React from 'react';
import * as DocumentPicker from 'expo-document-picker';
import DocumentImportButton from '@/components/DocumentImportButton';
import DocumentDeleteButton from '@/components/DocumentDeleteButton';

const documents = () => {
  return (
    <View>
      <Text>documents</Text>
      <DocumentsButton/>
    </View>
  )
}

export default documents
