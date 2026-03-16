import { Text, View, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import {router, useLocalSearchParams} from "expo-router";
import React, {useState} from 'react';
import { eCategories } from '@/constants/data';

const EmployeeFilter = () => {
  const paras = useLocalSearchParams<{ filter?: string}>();
  const [selectedCategory, setSeletedCategory] = useState(paras.filter || "All");

  const handleCategoryPress = (category: string) => {
    if (selectedCategory === category) {
        setSelectedCategory("");
        router.setParams({ filter: ""});
        return;
    }

    setSelectedCategory(category);
    router.setParams({fileter: category});;
  };
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-3 mb-2"
    >
      {eCategories.map((eCategory) => (
        <Pressable>
          <Text>

          </Text>
        </Pressable>

    </ScrollView>
  )
}

export default EmployeeFilter

