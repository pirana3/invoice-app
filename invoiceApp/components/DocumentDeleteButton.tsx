import { Alert, Pressable, Text, View, ActivityIndicator } from 'react-native';
import { File } from 'expo-file-system';
import React, { useState } from 'react';
import { deleteBdocuments } from '@/database/bdocuments';

type DocumentDeleteButtonProps = {
  documentId: number;
  uri: string;
  title?: string;
  onDeleted?: () => void;
};

const DocumentDeleteButton = ({ documentId, uri, title, onDeleted }: DocumentDeleteButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    Alert.alert('Delete document', `Delete "${title ?? 'this document'}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsDeleting(true);
            const file = new File(uri);
            file.delete();
            await deleteBdocuments(documentId);
            onDeleted?.();
          } catch (error) {
            console.error('Delete failed:', error);
            Alert.alert('Delete failed', 'Could not delete this document.');
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  return (
    <Pressable
      onPress={handleDelete}
      disabled={isDeleting}
      className="flex-row items-center gap-2"
    >
      {isDeleting ? (
        <ActivityIndicator size="small" color="#dc2626" />
      ) : (
        <Text className="text-sm text-red-600">Delete</Text>
      )}
    </Pressable>
  );
};

export default DocumentDeleteButton;
