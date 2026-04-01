import {Text, View, ActivityIndicator, Alert, Pressable, ScrollView, TextInput, Image } from 'react-native';
import {useRouter} from 'expo-router';
import React, {useEffect, useMemo, useState} from 'react';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Directory, File, Paths} from 'expo-file-system';
import { getBusinessInfo} from '@/database/businessdb';


const estimateCreate = () => {
    const router = useRouter();
    const [clientname, setCleintname] = useState('');
    const [estimatenumber, setEstimatenumber] = useState('');
    const [estimatedate, setEstimatedate] = useState('');
    const [estiamteproducts]
  return (
    <View>
      <Text>estimateCreate</Text>
    </View>
  )
}

export default estimateCreate
