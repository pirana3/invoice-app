import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import {Link} from 'expo-router';
import React from 'react'

// this is the main profile where the company can adjust thier business profile and what they sell as well as employees and thier profiles

type ItemData = {
    path: string;
    title: string;
}

const DATA: ItemData[] = [

]

const index = () => {
  return (
    <>
    <View>
      <Text className='text-blue-400'>index</Text>
      <Link href="/profile/projects">here </Link>
    </View>
    </>
  )
}

export default index

