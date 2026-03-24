import { Text, View, Pressable } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import DocumentImportButton from '@/components/DocumentImportButton';
import DocumentDeleteButton from '@/components/DocumentDeleteButton';

const documents = () => {
  return (
    <View>
       <Text>documents</Text>
      <DocumentImportButton/>
    </View>
  )
}

export default documents
