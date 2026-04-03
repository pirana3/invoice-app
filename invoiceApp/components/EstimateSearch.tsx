import { Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import React, {useState} from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {icons} from '@/constants/icons';
import { useLocalSearchParams, router } from 'expo-router';
import cn from 'clsx';

type EstimateSearchBarProps = {
    containerClassName?: string;
};

const EstimateSearch = () => {
  return (
    <View>
      <Text>EstimateSearch</Text>
    </View>
  )
}

export default EstimateSearch

