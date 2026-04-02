import {Text, View, ActivityIndicator, Alert, Pressable, ScrollView, TextInput, Image } from 'react-native';
import {useLocalSearchParams, useRouter} from 'expo-router';
import React, {useEffect, useMemo, useState} from 'react';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Directory, File, Paths} from 'expo-file-system';
import { getBusinessInfo} from '@/database/businessinfodb';
import { createEstimate, getEstimateById, updateEstiamte } from '@/database/estimatecontent';
import { getProducts } from '@/database/productdb';
import {
    createInvoiceItem,
    deleteInvoiceItemsByInvoiceId,
    getInvoiceItemsByInvoiceId,
} from '@/database/invoiceitemsdb';


const estimateCreate = () => {
    const router = useRouter();
    const [clientname, setCleintname] = useState('');
    const [estimatenumber, setEstimatenumber] = useState('');
    const [estimatedate, setEstimatedate] = useState('');
    const [estiamteproducts, setEstimateproducts] = useState('');
    const [estiamtetotalamount, setEstimatetotalamount] = useState('');
    const [estiamntepercentage, setEstimatepercentage] = useState('');
    const [estiamtetax, setEstimatetax] = useState('');
    const [estiamtenotes, setEstiamtenotes] = useState('');
    const [estiamtetermsandconditions, setEstiamtetermsandconditions] = useState('');
    const [estiamtedetails, setEstiamtedetails] = useState('');

    const[logoUri, setLogoUri] = useState<string | null>(null);
    
  return (
    <View>
      <Text>estimateCreate</Text>
    </View>
  )
}

export default estimateCreate
