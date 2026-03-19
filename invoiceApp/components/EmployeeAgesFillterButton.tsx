import { Pressable, Text, View } from 'react-native'
import React from 'react'

type AgesOption = {
    label: string;
    min: number;
    max: number;
};

type EmployeeAgesFillterButtonProps = {
    options: AgesOption[];
    selectedLabel?: string;
    onSelect: (label: string) => void;
};

const EmployeeAgesFillterButton = ({ options, selectedLabel, onSelect }: EmployeeAgesFillterButtonProps) => {
    return (
        <View>
            {options.map((option) => {
                const isSelected = option.label === selectedLabel;
                return (
                    <Pressable
                        key={option.label}
                        onPress={() => onSelect(option.label)}
                        className={`mb-2 rounded-md border px-3 py-3 ${
                            isSelected ? 'border-black bg-black': 'border-gray-200 bg-white}'}`}
                        >
                            <Text className= {`text-sm ${isSelected ? 'text-white' : 'text-black'}`}>
                                {option.label}
                            </Text>
                        </Pressable>
                );
            })}
        </View>
    );
};

export default EmployeeAgesFillterButton