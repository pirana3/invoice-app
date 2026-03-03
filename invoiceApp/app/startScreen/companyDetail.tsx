import { Text, View, TextInput, Alert } from 'react-native';
import {useRouter} from 'expo-router';

import React, { useState} from 'react';

const companyDetail = () => {
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

