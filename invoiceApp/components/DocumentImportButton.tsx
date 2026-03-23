import { Alert, Text, View, Pressable } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { db } from '@/database/db';

const DocumentImportButton = () => {
    const [docName, setDocName] = useState<string | null>(null);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                multiple: false,
                copyToCacheDirectory: true,
            });

            if (result.canceled || !result.assets?.[0]) return;

            const asset = result.assets[0];
            const title = asset.name ?? 'Untitled document';
            const buri = asset.uri;
            const bdate = new Date().toISOString();

            db.runSync(
                `INSERT INTO bdcouments (title, buri, bdate) VALUES (?, ?, ?)`,
                title,
                buri,
                bdate
            );

            setDocName(title);
        } catch (error) {
            console.error('Document import failed:', error);
            Alert.alert('Import failed', 'Could not save this document. Please try again.');
        }
    };
  return (
    <View>
     <Pressable
        onPress={pickDocument}
        className="mb-2 items-center rounded-md border border-gray-200 bg-white px-3 py-3"
        >
        <Text className="text-sm font-medium text-black">Import Document</Text>
      </Pressable>
      {docName ? <Text className="text-xs text-gray-600">{docName}</Text> : null}
        
    </View>
  )
}

export default DocumentImportButton
