import { Text, View, Pressable } from 'react-native'
import React from 'react'
import { Bdocuments } from '@/database/bdocuments'

type DocumentProfileProps = {
    bdocument: Bdocuments;
    onPress: () => void;
};

const documentProfile = ({ bdocument, onPress }: DocumentProfileProps) => {
  return (
    <Pressable onPress={onPress} className = "mb-3 rounded-md border border-gray-200 bg-white p-4">
        <Text className = "text-base font-semibold text-black">{bdocument.title}</Text>
        <Text className = "mt-1 text-sm text-gray-600" numberOfLines={2}>
            {bdocument.title}
        </Text>
     
    </Pressable>
  )
}

export default documentProfile
