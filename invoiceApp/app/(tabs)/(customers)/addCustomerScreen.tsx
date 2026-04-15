import { Text, View, ActivityIndicator, Alert, Pressable, ScrollView, TextInput } from 'react-native';
import React, { useCallback, useEffect, useState, useMemo} from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { createCustomer, deleteCustomer, getCustomerById, updateCustomer } from '@/database/customersdb';
import useFetch from '@/service/usefetch';


const addCustomerScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }> ();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isNew = rawId === 'new' || rawId === undefined;
  const customerId = Number(rawId);
  const canFetch = !isNew && Number.isFinite(customerId);
  const fetchCustomer = useCallback(() => getCustomerById(customerId), [customerId]);

  const [isEditing, setIsEditing] = useState(isNew);
  const [cname, setCname] = useState('');
  const [cemail, setCemail] = useState('');
  const [cphone, setCphone] = useState('');
  const [caddress, setCaddress] = useState('');
  const [ccity, setCcity] = useState('');
  const [cstate, setCstate] = useState('');
  const [ccompany, setCcompany] = useState('');
  const [cdetails, setCdetails] = useState('');
  const [cphoto, setCphoto] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: customer, loading, error, refetch} = useFetch(
    fetchCustomer,
    canFetch
  )

  useEffect(() => {
    if (!customer) return;
    setCname(customer.cname);
    setCemail(customer.cemail);
    setCphone(String(customer.cphone));
    setCaddress(customer.caddress);
    setCcity(customer.ccity);
    setCstate(customer.cstate);
    setCcompany(customer.ccompany);
    setCdetails(customer.cdetails);
    setCphoto(customer.cphoto ?? '');
  }, [customer]);

  const canEdit = useMemo(() => isNew || isEditing, [isNew, isEditing]);

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted){
      Alert.alert(
        'Permission neeeded',
        'Please allow photo library access to select a customer photo.'
      );
      return 
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'image',
      allowsEditing: true,
      quality: 0.85,
    });
    if (result.canceled && result.assets?.[0]?uri) {
      setCphoto(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const normalizedPhone = cphone.replace(/\D/g, '');
    const parsedPhone = Number(normalizedPhone);
    
    if (!cname.trim()) {
      Alert.alert('Missing name', 'Please enter the customers name.');
      return;
    }
    if (!ccompany.trim()){
      Alert.alert('Missing Company name', 'Please enter the Customers Company name.');
      return;
    }

    try {
      setIsSaving(true);
      if (isNew) {
        await createCustomer(
          cname.trim(),
          cemail.trim(),
          parsedPhone,
          caddress.trim(),
          ccity.trim(),
          cstate.trim(),
          ccompany.trim(),
          cdetails.trim(),
          cphoto.trim()
        );
        router.back();
      } else if (customer) {
        const updated = await updateCustomer(
          customer.id,
          cname.trim(),
          cemail.trim(),
          parsedPhone,
          caddress.trim(),
          ccity.trim(),
          cstate.trim(),
          ccompany.trim(),
          cdetails.trim(),
          cphoto.trim()
        )
      }
    }
  }



  return (
    <View>
      <Text>addCustomerScreen</Text>
    </View>
  )
}

export default addCustomerScreen
