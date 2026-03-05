import { Text, View, TextInput, Alert } from 'react-native';
import {useRouter} from 'expo-router';
import React, { useState} from 'react';
import { createBusinessInfo } from '@/database/businessinfodb';
import BusinessinfoButton from '@/components/BusinessinfoButton';

const companyDetail = () => {
  const router = useRouter();
  const [bname, setBname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [industry, setIndustry] = useState("");

  const handleSave = async () => {
    const parsedPhone = Number(phone);

    if (!bname.trim()) {
      Alert.alert('Missing name', 'Please enter your company name.');
      return;
    }
  }

  return (
    <View>
      <Text>Please enter the following detail of your company</Text>
      <TextInput
      onChangeText={setBname}
      value={bname}
      placeholder="Company Name"
      className='rounded-md border border-gray-300 px-3 py-2'
      />

      <Text>Please enter your companies email</Text>
      <TextInput
      onChangeText={setEmail}
      value={email}
      placeholder=""
      className='rounded-md border border-gray-300 px-3 py-2'
      />

      <Text>Please enter your company's phone number</Text>
      <TextInput
      onChangeText={setPhone}
      value={phone}
      placeholder=''
      className='rounded-md border border-gray-300 px-3 py-2'
      />

      <Text>Please enter your company's address</Text>
      <TextInput
      onChangeText={setAddress}
      value={address}
      placeholder=''
      className='rounded-md border border-gray-300 px-3 py-2'
      />

      <Text>Please enter your company's industry</Text>
      <TextInput
      onChangeText={setIndustry}
      value={industry}
      placeholder=''
      className='rounded-md border border-gray-300 px-3 py-2'
      />

      <BusinessinfoButton
      title="Save Info"
      onPress={handleSave}
      isLoading={isSaving}
      />
    </View>
  )
}

export default companyDetail
