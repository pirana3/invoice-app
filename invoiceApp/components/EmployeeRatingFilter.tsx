import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import EmployeeRating from '@/components/EmployeeRating';

const EmployeeRatingFilter = () => {
  const params = useLocalSearchParams<{ rating?: string }>();
  const ratingValue = useMemo(() => {
    const parsed = Number(params.rating);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [params.rating]);

  const handleChange = (nextValue: number) => {
    if (!nextValue) {
      router.setParams({ rating: '' });
      return;
    }
    router.setParams({ rating: String(nextValue) });
  };

  return (
    <View className="mt-3 rounded-md border border-gray-200 bg-white px-3 py-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs text-gray-500">Filter by rating</Text>
        {ratingValue ? (
          <Pressable onPress={() => handleChange(0)}>
            <Text className="text-xs font-medium text-black">Clear</Text>
          </Pressable>
        ) : null}
      </View>
      <View className="mt-2">
        <EmployeeRating value={ratingValue} onChange={handleChange} size={22} showValue />
      </View>
    </View>
  );
};

export default EmployeeRatingFilter;
