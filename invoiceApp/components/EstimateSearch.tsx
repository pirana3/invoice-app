import { Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import React, {useState} from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {icons} from '@/constants/icons';
import { useLocalSearchParams, router } from 'expo-router';
import cn from 'clsx';
import { setParams } from 'expo-router/build/global-state/routing';

type EstimateSearchBarProps = {
    containerClassName?: string;
};

const EstimateSearch = ({ containerClassName}: EstimateSearchBarProps) => {
    const params = useLocalSearchParams<{ query?: string}>();
    const [search, setSearch] = useState(params.query || '');

    const debouncedSearch = useDebouncedCallback((text: string) => {
        router.setParams({ query: text});
    }, 500);

    const handleSearch = (text: string) => {
        setSearch(text);
        debouncedSearch(text);
    }

    const handleClear = () => {
        setSearch('');
        router.setParams({ query: '' });
    };

  return (
    <View className={cn('flex flex-row items-center justify-between bg-gray-100 rounded-full px-4 py-2 mx-4', containerClassName)}>
      <View className= "flex flex-row items-center flex-1">
        <Image
            source={icons.search}
            resizeMode="contain"
            className="size-5 mr-2"
        />
        <TextInput
            placeholder="Search Estiamte"
            placeholderTextColor="#888"
            value={search}
            onChangeText={handleSearch}
            className='flex-1 text-black py-1'
        />
      </View>
        {search && (
            <TouchableOpacity onPress={handleClear} className="mt-2">
                <Text className="text-lg font-bold text-gray-500">X</Text>
            </TouchableOpacity>
        )}
    </View>
  )
}

export default EstimateSearch

