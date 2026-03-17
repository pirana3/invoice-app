import { Text, View, ScrollView, Pressable, Modal, TouchableWithoutFeedback } from 'react-native';
import React from 'react';

type PositionOption = {
  label: string;
  value: string;
};

type EPositionModalProps = {
  isVisible: boolean;
  options: PositionOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  onClose: () => void;
};

const EPositionModal = ({
  isVisible,
  options,
  selectedValue,
  onSelect,
  onClose,
}: EPositionModalProps) => {
  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/40">
          <TouchableWithoutFeedback>
            <View className="max-h-[60%] rounded-t-2xl bg-white px-4 pb-6 pt-4">
              <Text className="text-base font-semibold text-black">Select rank</Text>
              <ScrollView className="mt-3">
                {options.map((option) => {
                  const isSelected = option.value === selectedValue;
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => onSelect(option.value)}
                      className={`mb-2 rounded-md border px-3 py-3 ${
                        isSelected ? 'border-black bg-black' : 'border-gray-300 bg-white'
                      }`}
                    >
                      <Text className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-black'}`}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EPositionModal;
