import { Alert, Pressable, Text, TextInput, View, ActivityIndicator } from 'react-native';
import React, { useRef, useState } from 'react';
import Signature, { type SignatureViewRef } from 'react-native-signature-canvas';
import { useRouter } from 'expo-router';
import { deleteSignature, saveSignature } from '@/database/signaturesdb';

const SignatureScreen = () => {
  const router = useRouter();
  const signatureRef = useRef<SignatureViewRef>(null);
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [typedSignature, setTypedSignature] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveDrawn = () => {
    signatureRef.current?.readSignature();
  };

  const handleOK = async (signature: string) => {
    try {
      setIsSaving(true);
      await saveSignature('drawn', signature);
      router.back();
    } catch (error) {
      console.error('Signature save failed:', error);
      Alert.alert('Save failed', 'Could not save your signature.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTyped = async () => {
    if (!typedSignature.trim()) {
      Alert.alert('Missing signature', 'Please type your signature.');
      return;
    }
    try {
      setIsSaving(true);
      await saveSignature('typed', typedSignature.trim());
      router.back();
    } catch (error) {
      console.error('Signature save failed:', error);
      Alert.alert('Save failed', 'Could not save your signature.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSignature();
      signatureRef.current?.clearSignature();
      setTypedSignature('');
      Alert.alert('Deleted', 'Signature removed.');
    } catch (error) {
      console.error('Signature delete failed:', error);
      Alert.alert('Delete failed', 'Could not delete the signature.');
    }
  };

  return (
    <View className="flex-1 bg-white px-4 py-6">
      <Text className="text-lg font-semibold text-black">Signature</Text>

      <View className="mt-4 flex-row gap-2">
        <Pressable
          onPress={() => setMode('draw')}
          className={`flex-1 items-center rounded-md border py-2 ${
            mode === 'draw' ? 'border-black bg-black' : 'border-gray-300'
          }`}
        >
          <Text className={`${mode === 'draw' ? 'text-white' : 'text-black'}`}>Draw</Text>
        </Pressable>
        <Pressable
          onPress={() => setMode('type')}
          className={`flex-1 items-center rounded-md border py-2 ${
            mode === 'type' ? 'border-black bg-black' : 'border-gray-300'
          }`}
        >
          <Text className={`${mode === 'type' ? 'text-white' : 'text-black'}`}>Type</Text>
        </Pressable>
      </View>

      {mode === 'draw' ? (
        <View className="mt-4 flex-1 rounded-md border border-gray-200">
          <Signature
            ref={signatureRef}
            onOK={handleOK}
            descriptionText="Sign here"
            autoClear={false}
          />
        </View>
      ) : (
        <View className="mt-4">
          <TextInput
            value={typedSignature}
            onChangeText={setTypedSignature}
            placeholder="Type your signature"
            className="rounded-md border border-gray-300 px-3 py-3 text-black"
          />
        </View>
      )}

      <View className="mt-5 flex-row gap-3">
        <Pressable
          onPress={mode === 'draw' ? handleSaveDrawn : handleSaveTyped}
          disabled={isSaving}
          className="flex-1 items-center rounded-md bg-black py-3"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="font-semibold text-white">Save</Text>
          )}
        </Pressable>
        <Pressable
          onPress={handleDelete}
          className="flex-1 items-center rounded-md border border-red-300 bg-red-50 py-3"
        >
          <Text className="font-semibold text-red-600">Delete</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SignatureScreen;
