import { StyleSheet, Text, View } from 'react-native'
import React from 'react';

const NoReults = () =>{
    return (
        <View className="Flex items-center my-3">
            <Text className='text-gray-600 text-lg font-bold mt-5'>
                NO RESULTS
            </Text>
            <Text className='text-base text-black mt-2'>
                Could not be found what you are looking for. Please Try again!
            </Text>
        </View>
    )
}

export default NoReults;