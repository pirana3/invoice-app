import {Text, View, TextInput, Alert } from 'react-native';
import React, {useState} from 'react';
import { useRouter} from 'expo-router';
import EmployeeButton from '@/components/EmployeesButton';
import { createEmployees } from '@/database/employeesdb';

const employeesScreen = () => {
    const router = useRouter();
    const [ename, setEname] = useState('');
  return (
    <View>
      <Text>employeesScreen</Text>
    </View>
  )
}

export default employeesScreen