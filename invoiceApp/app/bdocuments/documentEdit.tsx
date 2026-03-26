import { ActivityIndicator, Alert, Image, Modal, Pressable, Text, TextInput, View, PanResponder } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getBdocumentsById } from '@/database/bdocuments';
import { getBusinessInfo } from '@/database/businessinfodb';
import { getSignature } from '@/database/signaturesdb';
import {
  createAnnotation,
  getAnnotationsByDocumentId,
  updateAnnotationPosition,
} from '@/database/documentAnnotationsdb';
import DocumentEditLogoButton from '@/components/DocumentEditLogoButton';
import DocumentEditSignatureButton from '@/components/DocumentEditSignatureButton';
import DocumentWriteButton from '@/components/DocumentWriteButton';

type OverlayItem = {
  id: number;
  type: 'logo' | 'signature' | 'text';
  x: number;
  y: number;
  data?: string;
  kind?: 'drawn' | 'typed';
};

const DocumentEditScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const documentId = params.id ? Number(params.id) : NaN;
  const [docTitle, setDocTitle] = useState('');
  const [docUri, setDocUri] = useState('');
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signatureKind, setSignatureKind] = useState<'drawn' | 'typed' | null>(null);
  const [overlays, setOverlays] = useState<OverlayItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [textInput, setTextInput] = useState('');
  const isImage = useMemo(() => {
    const lower = docUri.toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.webp'].some((ext) => lower.endsWith(ext));
  }, [docUri]);

  const dragStart = useRef<Record<number, { x: number; y: number }>>({});

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        if (!Number.isFinite(documentId)) return;
        const doc = await getBdocumentsById(documentId);
        if (doc) {
          setDocTitle(doc.title);
          setDocUri(doc.buri);
        }
        const businesses = await getBusinessInfo();
        const latestBusiness = businesses?.[0];
        setLogoUri(latestBusiness?.logo ?? null);
        const sig = await getSignature();
        if (sig) {
          setSignatureData(sig.data);
          setSignatureKind(sig.kind);
        }
        const annotations = await getAnnotationsByDocumentId(documentId);
        setOverlays(
          annotations.map((item) => ({
            id: item.id,
            type: item.type,
            x: item.x,
            y: item.y,
            data: item.data ?? undefined,
            kind: item.kind ?? undefined,
          }))
        );
      } catch (error) {
        console.error('Failed to load document editor data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [documentId]);

  const addOverlay = async (item: Omit<OverlayItem, 'id' | 'x' | 'y'>) => {
    if (!Number.isFinite(documentId)) return;
    const x = 16;
    const y = 16 + overlays.length * 8;
    const id = await createAnnotation(documentId, item.type, x, y, item.data, item.kind);
    setOverlays((prev) => [
      ...prev,
      {
        id,
        type: item.type,
        data: item.data,
        kind: item.kind,
        x,
        y,
      },
    ]);
  };

  const handleAddLogo = async () => {
    if (!logoUri) {
      Alert.alert('No logo found', 'Please add a business logo first.');
      return;
    }
    await addOverlay({ type: 'logo', data: logoUri });
  };

  const handleAddSignature = async () => {
    if (!signatureData || !signatureKind) {
      Alert.alert('No signature found', 'Please save a signature first.');
      return;
    }
    await addOverlay({ type: 'signature', data: signatureData, kind: signatureKind });
  };

  const handleAddText = async () => {
    if (!textInput.trim()) {
      Alert.alert('Missing text', 'Please enter the text to place on the document.');
      return;
    }
    await addOverlay({ type: 'text', data: textInput.trim() });
    setTextInput('');
    setIsTextModalOpen(false);
  };

  const createPanResponder = (item: OverlayItem) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragStart.current[item.id] = { x: item.x, y: item.y };
      },
      onPanResponderMove: (_, gesture) => {
        const start = dragStart.current[item.id];
        if (!start) return;
        const nextX = start.x + gesture.dx;
        const nextY = start.y + gesture.dy;
        setOverlays((prev) =>
          prev.map((overlay) =>
            overlay.id === item.id
              ? { ...overlay, x: nextX, y: nextY }
              : overlay
          )
        );
      },
      onPanResponderRelease: async (_, gesture) => {
        const start = dragStart.current[item.id];
        if (!start) return;
        const nextX = start.x + gesture.dx;
        const nextY = start.y + gesture.dy;
        await updateAnnotationPosition(item.id, nextX, nextY);
      },
    });

  const overlayNodes = useMemo(
    () =>
      overlays.map((item) => {
        const panHandlers = createPanResponder(item).panHandlers;
        if (item.type === 'logo' && item.data) {
          return (
            <View
              key={item.id}
              style={{ position: 'absolute', left: item.x, top: item.y }}
              {...panHandlers}
            >
              <Image source={{ uri: item.data }} style={{ width: 80, height: 80, borderRadius: 8 }} />
            </View>
          );
        }
        if (item.type === 'signature' && item.data) {
          return (
            <View
              key={item.id}
              style={{ position: 'absolute', left: item.x, top: item.y }}
              {...panHandlers}
            >
              {item.kind === 'typed' ? (
                <Text className="text-base font-medium text-black">{item.data}</Text>
              ) : (
                <Image source={{ uri: item.data }} style={{ width: 140, height: 60 }} />
              )}
            </View>
          );
        }
        if (item.type === 'text' && item.data) {
          return (
            <View
              key={item.id}
              style={{ position: 'absolute', left: item.x, top: item.y }}
              {...panHandlers}
            >
              <Text className="text-base text-black">{item.data}</Text>
            </View>
          );
        }
        return null;
      }),
    [overlays]
  );

  if (!Number.isFinite(documentId)) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500">Invalid document.</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="small" color="#111827" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-4 py-6">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-semibold text-black">Edit Document</Text>
          <Text className="text-xs text-gray-500">{docTitle || 'Untitled document'}</Text>
        </View>
        <Pressable onPress={() => router.back()}>
          <Text className="text-sm font-medium text-gray-600">Close</Text>
        </Pressable>
      </View>

      <View className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-2">
        <View className="relative h-[420px] overflow-hidden rounded-md bg-white">
          {isImage ? (
            <Image
              source={{ uri: docUri }}
              style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}
              resizeMode="contain"
            />
          ) : (
            <View className="absolute inset-0 items-center justify-center">
              <Text className="text-xs text-gray-400">Preview not available</Text>
            </View>
          )}
          {overlayNodes}
          {docUri ? (
            <Text className="absolute bottom-2 right-2 text-[10px] text-gray-400">
              {docUri.split('/').pop()}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="mt-4 flex-row gap-2">
        <DocumentEditLogoButton onPress={handleAddLogo} />
        <DocumentEditSignatureButton onPress={handleAddSignature} />
        <DocumentWriteButton onPress={() => setIsTextModalOpen(true)} />
      </View>

      <Modal transparent visible={isTextModalOpen} animationType="fade">
        <Pressable
          onPress={() => setIsTextModalOpen(false)}
          className="flex-1 items-center justify-center bg-black/40 px-6"
        >
          <Pressable className="w-full rounded-lg bg-white p-4" onPress={() => {}}>
            <Text className="text-sm font-semibold text-black">Add text</Text>
            <TextInput
              value={textInput}
              onChangeText={setTextInput}
              placeholder="Type text to place on document"
              className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-black"
            />
            <View className="mt-4 flex-row gap-3">
              <Pressable
                onPress={() => setIsTextModalOpen(false)}
                className="flex-1 items-center rounded-md border border-gray-300 py-2"
              >
                <Text className="text-sm font-medium text-black">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleAddText}
                className="flex-1 items-center rounded-md bg-black py-2"
              >
                <Text className="text-sm font-medium text-white">Add</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default DocumentEditScreen;
