import { Text, View, Pressable } from 'react-native'
import React from 'react'

import type { InvoiceContent } from '@/database/invoicecontent';

type InvoiceProfileProps ={
    invocies: InvoiceContent;
    onPress: () => void;
}

const inoviceProfile = ({ invocies, onPress }: InvoiceProfileProps) => {
  return (
    <Pressable onPress={onPress} className="mb-3 rounded-md border border-gray-200 bg-white p-4">
      <Text className='text-base font-semibold text-black'>{invocies.clientname}</Text>
      <Text className='mt-1 text-sm text-gray-600' numberOfLines={2}>
        {invocies.products || 'No description'}
      </Text>
      <View className="mt-3">
        <Text className='text-sm font-medium text-black'>${invocies.totalamount.toFixed(2)} </Text>
      </View>
    </Pressable>
  )
}

export default inoviceProfile

