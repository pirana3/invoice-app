import { Text, View, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useDebouncedCallBack} from "use-debounce";
import { icons }from '@/constants/icons';
import { useLocalSearchParams, router, usePathname} from 'expo-router';

const EmployeesSearchBar = () => {
    const path = usePathname();
    const params = useLocalSearchParams<{ query?: string}>();
    const [search, setSearch] = useState(params.query);

    const debouncedSearch = useDebouncedCallback((text: string) => {
        router.setParams({ query: text});
    }, 500);

    const handleSearch = (text: string) => {
        setSearch(text);
        debouncedSearch(text);
    }

  return (
    <View className="flex flex-row items-center justify">
        <View>
            <Image/>
            <TextInput 
            />
        </View>
        lu
        <TouchableOpacity>
            <Image/>
        </TouchableOpacity>
    </View>
  )
}

export default EmployeesSearchBar
