import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import * as Contacts from 'expo-contacts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ContactPick = {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
};

type CustomerImportContactsScreenProps = {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (contact: ContactPick) => void;
};

const CustomerImportContactsScreen = ({
  isVisible,
  onClose,
  onSelect,
}: CustomerImportContactsScreenProps) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<Contacts.ExistingContact[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoading(true);
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== Contacts.PermissionStatus.GRANTED) {
          setContacts([]);
          return;
        }
        const result = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers, Contacts.Fields.Company],
          sort: Contacts.SortTypes.FirstName,
        });
        setContacts(result.data || []);
      } finally {
        setLoading(false);
      }
    };
    if (isVisible) {
      loadContacts();
      setQuery('');
    }
  }, [isVisible]);

  const filtered = useMemo(() => {
    if (!query.trim()) return contacts;
    const term = query.toLowerCase();
    return contacts.filter((contact) => {
      const name = contact.name?.toLowerCase() ?? '';
      const company = contact.company?.toLowerCase() ?? '';
      return name.includes(term) || company.includes(term);
    });
  }, [contacts, query]);

  return (
    <Modal visible={isVisible} animationType="slide">
      <View
        className="flex-1 bg-white px-4"
        style={{ paddingTop: Math.max(insets.top, 16), paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-black">Import Contact</Text>
          <Pressable onPress={onClose}>
            <Text className="text-sm font-medium text-gray-600">Close</Text>
          </Pressable>
        </View>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search contacts"
          className="mt-4 rounded-md border border-gray-300 px-3 py-2 text-black"
        />

        {loading ? (
          <View className="mt-8 items-center">
            <ActivityIndicator size="small" color="#111827" />
          </View>
        ) : (
          <ScrollView className="mt-4">
            {filtered.map((contact) => {
              const email = contact.emails?.[0]?.email;
              const phone = contact.phoneNumbers?.[0]?.number;
              return (
                <Pressable
                  key={contact.id ?? `${contact.name}-${contact.company ?? ''}`}
                  onPress={() =>
                    onSelect({
                      name: contact.name ?? 'Unknown',
                      email,
                      phone,
                      company: contact.company ?? '',
                    })
                  }
                  className="mb-2 rounded-md border border-gray-200 bg-white p-3"
                >
                  <Text className="text-sm font-semibold text-black">{contact.name ?? 'Unknown'}</Text>
                  {contact.company ? (
                    <Text className="mt-1 text-xs text-gray-500">{contact.company}</Text>
                  ) : null}
                  {email ? <Text className="mt-1 text-xs text-gray-500">{email}</Text> : null}
                  {phone ? <Text className="mt-1 text-xs text-gray-500">{phone}</Text> : null}
                </Pressable>
              );
            })}
            {filtered.length === 0 ? (
              <Text className="mt-6 text-sm text-gray-500">No contacts found.</Text>
            ) : null}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

export default CustomerImportContactsScreen;
