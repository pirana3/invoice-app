import { Text, View, TextInput } from 'react-native'
import React from 'react'

const productScreen = () => {
    const[text, onChangeText] = React.useState('')
    const [number, onChangeNumber] = React.useState('')
  return (
    <View>
      <TextInput
      onChangeText = {onChangeText}
      value = {text}
      placeholder='Enter the product name here.'
      />

      <TextInput
      onChangeText ={onChangeText}
      value = {text}
      placeholder='Enter product description.'
      />

      <TextInput
      onChangeText = {onChangeNumber}
      value = {number}
      placeholder= "Enter the product price here. $"
      keyboardType="numeric"
      />
    </View>
  )
}

export default productScreen
