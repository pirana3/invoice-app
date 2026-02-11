import { StyleSheet, Text, View } from 'react-native'
import {SafeAreaProvider } from 'react-native-safe-area-context'
import React from 'react'

const Business = () => {
  return (
    <SafeAreaProvider>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text> hello </Text>
            </View>
        </SafeAreaProvider>
  )
}

export default Business

