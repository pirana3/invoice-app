import { Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { icons } from '@/constants/icons';
import { useLocalSearchParams, router } from 'expo-router';
import cn from 'clsx';

const InvoiceSearch = () => {
  return (
    <View>
      <Text>InvoiceSearch</Text>
    </View>
  )
}

export default InvoiceSearch

const styles = StyleSheet.create({})