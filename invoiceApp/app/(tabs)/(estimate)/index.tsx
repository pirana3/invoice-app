import { Text, View, ActivityIndicator, Alert, ScrollView, Pressable} from 'react-native';
import EstemateProfile from '@/app/(tabs)/(estimate)/estimateProfile';
import { getEstimates, searchEstimates, deleteEstimates, toggleEstimateCompleted, type EstimateContent } from '@/database/estimatecontent';
import { useLocalSearchParams, router } from 'expo-router';
import Estiamte
import React from 'react'

const index = () => {
  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default index

