import { Text, View, Pressable } from 'react-native'
import React from 'react'

import type { Employees } from '@/database/employeesdb';

type EmployeesProfileProps = {
    employees: Employees;
    onPress: () => void;
};

const EmployeesProfile = ({ employees, onPress}: EmployeesProfileProps) => {
  return (
    <Pressable onPress={onPress} className ="mb-3 rounded-md border border-gray-200 bg-white p-4">
        <Text className="text-base font-semibold text-black">{employees.ename}</Text>
        <Text className="mt-1 text-sm text-gray-600" numberOfLines={2}>
            {employees.edetails || 'No description'}
        </Text>
        <View className="mt-3">
            <Text className='text-sm font-medium text-black'>${employees.ephone} </Text>
        </View>
    </Pressable>
  )
}

export default EmployeesProfile;
