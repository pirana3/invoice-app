import { Text, View, Alert, Image, TextInput } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState} from 'react';
import * as ImagePicker from 'expo-image-picker';
import useFetch from '@/service/usefetch';



const invoiceCreate = () => {
    const router = useRouter();
    
    const [clientname, setClientname] = useState('');
    const [invoicenumber, setInvvoicenumber] = useState('');
    const [invoicedate, setInvoicedate] = useState('');
    const [duedate, setDudate] = useState('');
    const [products, setProducts] = useState('');
    const [totalamount, setTotalamount] = useState('');
    const [percentage, setPercentage] = useState('');
    const [tax, setTax] = useState('');
    const [notes, setNotes] = useState('');
    const [termsandconditions, setTermsandconditions] = useState('');
    const [details, setDetails] = useState('');



  return (
    <View>
      <Text>New Invoie</Text>

      <TextInput
        
      />
    </View>
  )
}

export default invoiceCreate
