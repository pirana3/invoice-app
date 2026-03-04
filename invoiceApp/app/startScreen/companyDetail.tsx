import { Text, View, TextInput, Alert } from 'react-native';
import {useRouter} from 'expo-router';
import React, { useState} from 'react';
import { createBusinessInfo } from '@/database/businessinfodb';
import Businessinfobutton from '@/components/Businessinfobutton';

const companyDetail = () => {
  const router = useRouter();
  const [bname, setName] = useState("");
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
      value={"Company Name"}
      />
    </View>
  )
}

export default companyDetail

