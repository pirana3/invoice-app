import { Text, View, ActivityIndicator, ScrollView } from 'react-native';
import InoviceProfile from '@/app/invoice/inoviceProfile';
import InvoiceCreateButton from '@/components/InvoiceCreateButton';
import { getInvoices, type InvoiceContent } from '@/database/invoicesdb';
import { useLocalSearchParams, router } from 'expo-router';
import invoiceExport from '@/app/invoice/invoiceExport';
import InvoiceSearch from '@/components/InvoiceSearch';
import React, { useState, useEffect } from 'react';


const invoiceContentList = () => {

const inovicesList = () => {
  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default inovicesList
