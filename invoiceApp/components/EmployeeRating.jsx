import { Text, View, Pressable } from 'react-native';
import React, { useMemo } from 'react';
import { Image } from 'expo-image';
import { icons } from '../constants/icons';

const { star, emptystar, halfstar } = icons;

const clampRating = (value) => Math.max(0, Math.min(5, Math.round(value * 2) / 2));

const EmployeeRating = ({ value = 0, onChange, size = 24, disabled = false, showValue = false }) => {
  const rating = useMemo(() => clampRating(value), [value]);

  const getStarIcon = (index) => {
    if (rating >= index) return star;
    if (rating >= index - 0.5) return halfstar;
    return emptystar;
  };

  const handleSelect = (nextValue) => {
    if (disabled || !onChange) return;
    onChange(clampRating(nextValue));
  };

  return (
    <View className="flex-row items-center">
      {[1, 2, 3, 4, 5].map((index) => (
        <View key={index} style={{ width: size, height: size, marginRight: 6 }}>
          <Image source={getStarIcon(index)} style={{ width: size, height: size }} />
          {!disabled ? (
            <>
              <Pressable
                onPress={() => handleSelect(index - 0.5)}
                style={{ position: 'absolute', left: 0, top: 0, width: size / 2, height: size }}
              />
              <Pressable
                onPress={() => handleSelect(index)}
                style={{ position: 'absolute', right: 0, top: 0, width: size / 2, height: size }}
              />
            </>
          ) : null}
        </View>
      ))}
      {showValue ? (
        <Text className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</Text>
      ) : null}
    </View>
  );
};

export default EmployeeRating;
