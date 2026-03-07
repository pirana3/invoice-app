import { StyleSheet, Text, View } from 'react-native';
import EmployeeButton from '@/components/EmployeesButton';
import React from 'react'

const employees = () => {
  return (
    <View>
      <Text>employees</Text>
      <EmployeeButton/>
    </View>
  )
}

export default employees

const styles = StyleSheet.create({})