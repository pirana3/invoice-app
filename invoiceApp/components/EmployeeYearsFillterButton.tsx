import { Text, View, Pressable } from 'react-native';
import React from 'react';

type YearsOption = {
  label: string;
  min: number;
  max: number;
};

type EmployeeYearsFillterButtonProps = {
  options: YearsOption[];
  selectedLabel?: string;
  onSelect: (label: string) => void;
};

const EmployeeYearsFillterButton = ({
  options,
  selectedLabel,
  onSelect,
}: EmployeeYearsFillterButtonProps) => {
  return (
    <View>
      {options.map((option) => {
        const isSelected = option.label === selectedLabel;
        return (
          <Pressable
            key={option.label}
            onPress={() => onSelect(option.label)}
            className={`mb-2 rounded-md border px-3 py-3 ${
              isSelected ? 'border-black bg-black' : 'border-gray-200 bg-white'
            }`}
          >
            <Text className={`text-sm ${isSelected ? 'text-white' : 'text-black'}`}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default EmployeeYearsFillterButton;
