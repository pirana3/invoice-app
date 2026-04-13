import { Text, View } from 'react-native';
import React from 'react';

type NoResultsProps = {
  title?: string;
  subtitle?: string;
};

const NoResults = ({
  title = 'No results',
  subtitle = 'Could not find what you are looking for. Please try again.',
}: NoResultsProps) => {
  return (
    <View className="flex items-center my-3 px-6">
      <Text className="text-gray-600 text-lg font-bold mt-5 text-center">{title}</Text>
      <Text className="text-base text-black mt-2 text-center">{subtitle}</Text>
    </View>
  );
};

export default NoResults;
