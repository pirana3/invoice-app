import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import DocumentImportButton from '@/components/DocumentImportButton';
import DocumentProfile from '@/app/bdocuments/documentProfile';
import { getBdocuments, type Bdocuments } from '@/database/bdocuments';
import { useLanguage } from '@/service/language';

const documents = () => {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<Bdocuments[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await getBdocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleImported = (id: number) => {
    loadDocuments();
    router.push({ pathname: '/bdocuments/documentEdit', params: { id } } as never);
  };

  const handleDocumentPress = (id: number) => {
    router.push({ pathname: '/bdocuments/documentEdit', params: { id } } as never);
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="text-lg font-semibold text-black">{t('documents')}</Text>
      <View className="mt-4">
        <DocumentImportButton onImported={handleImported} />
      </View>

      {loading ? (
        <View className="mt-8 items-center">
          <ActivityIndicator size="small" color="#111827" />
        </View>
      ) : documents.length === 0 ? (
        <Text className="mt-6 text-sm text-gray-500">{t('no_documents_yet')}</Text>
      ) : (
        <View className="mt-4">
          {documents.map((doc) => (
            <DocumentProfile
              key={doc.id}
              bdocument={doc}
              onPress={() => handleDocumentPress(doc.id)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default documents;
