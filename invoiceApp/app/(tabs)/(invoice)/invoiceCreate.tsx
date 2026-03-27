import { Text, View, Alert, Image, TextInput } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState} from 'react';
import * as ImagePicker from 'expo-image-picker';
import useFetch from '@/service/usefetch';



const invoiceCreate = () => {
    const router = useRouter()

  return (
    <View>
      <Text>New Invoice</Text>

      <TextInput
        
      />
    </View>
  )
}

export default invoiceCreate
