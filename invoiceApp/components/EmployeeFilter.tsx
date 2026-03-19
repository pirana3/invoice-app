import { Text, View, Pressable, Modal, TouchableWithoutFeedback, ScrollView, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState, useEffect } from 'react';
import { ePositions, eYears } from '@/constants/data';
import EmployeeRating from '@/components/EmployeeRating';
import { icons } from '@/constants/icons';
import EmployeeYearsFillterButton from '@/components/EmployeeYearsFillterButton';

const EmployeeFilter = () => {
  const params = useLocalSearchParams<{ position?: string; rating?: string; years?: string }>();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedYearsLabel, setSelectedYearsLabel] = useState('All');
  const [isYearsOpen, setIsYearsOpen] = useState(false);
  const [isRankOpen, setIsRankOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);

  const positionOptions = useMemo(
    () => [{ label: 'All', value: 'All' }, ...ePositions],
    []
  );

  useEffect(() => {
    if (!isVisible) return;
    const positionParam = params.position ? String(params.position) : 'All';
    const ratingParam = Number(params.rating);
    const yearsParam = params.years ? String(params.years) : 'All';
    setSelectedPosition(positionParam || 'All');
    setSelectedRating(Number.isFinite(ratingParam) ? ratingParam : 0);
    setSelectedYearsLabel(yearsParam || 'All');
  }, [isVisible, params.position, params.rating, params.years]);

  const handleApply = () => {
    router.setParams({
      position: selectedPosition === 'All' ? '' : selectedPosition,
      rating: selectedRating ? String(selectedRating) : '',
      years: selectedYearsLabel === 'All' ? '' : selectedYearsLabel,
    });
    setIsVisible(false);
  };

  const handleClear = () => {
    setSelectedPosition('All');
    setSelectedRating(0);
    setSelectedYearsLabel('All');
    router.setParams({ position: '', rating: '', years: '' });
    setIsVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setIsVisible(true)}
        className="h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white"
      >
        <Image source={icons.filter} resizeMode="contain" className="h-5 w-5" />
      </Pressable>

      <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={() => setIsVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
          <View className="flex-1 justify-end bg-black/40">
            <TouchableWithoutFeedback>
              <View className="max-h-[70%] rounded-t-2xl bg-white px-4 pb-6 pt-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-semibold text-black">Filter employees</Text>
                  <Pressable onPress={() => setIsVisible(false)}>
                    <Text className="text-sm font-medium text-gray-600">Close</Text>
                  </Pressable>
                </View>

                <View className="mt-4">
                  <Pressable
                    onPress={() => setIsRankOpen((prev) => !prev)}
                    className="flex-row items-center justify-between rounded-md border border-gray-200 px-3 py-3"
                  >
                    <View>
                      <Text className="text-xs text-gray-500">Rank</Text>
                      <Text className="mt-1 text-sm text-black">
                        {selectedPosition === 'All' ? 'Any' : selectedPosition}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-600">{isRankOpen ? 'Hide' : 'Show'}</Text>
                  </Pressable>
                  {isRankOpen ? (
                    <ScrollView className="mt-2" style={{ maxHeight: 220 }}>
                      {positionOptions.map((option) => {
                        const isSelected = option.value === selectedPosition;
                        return (
                          <Pressable
                            key={option.value}
                            onPress={() => setSelectedPosition(option.value)}
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
                    </ScrollView>
                  ) : null}
                </View>

                <View className="mt-4">
                  <Pressable
                    onPress={() => setIsYearsOpen((prev) => !prev)}
                    className="flex-row items-center justify-between rounded-md border border-gray-200 px-3 py-3"
                  >
                    <View>
                      <Text className="text-xs text-gray-500">Years of experience</Text>
                      <Text className="mt-1 text-sm text-black">
                        {selectedYearsLabel === 'All' ? 'Any' : selectedYearsLabel}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-600">{isYearsOpen ? 'Hide' : 'Show'}</Text>
                  </Pressable>
                  {isYearsOpen ? (
                    <ScrollView className="mt-2" style={{ maxHeight: 220 }}>
                      <EmployeeYearsFillterButton
                        options={[{ label: 'All', min: 0, max: Infinity }, ...eYears]}
                        selectedLabel={selectedYearsLabel}
                        onSelect={setSelectedYearsLabel}
                      />
                    </ScrollView>
                  ) : null}
                </View>

                <View className="mt-4">
                  <Pressable
                    onPress={() => setIsRatingOpen((prev) => !prev)}
                    className="flex-row items-center justify-between rounded-md border border-gray-200 px-3 py-3"
                  >
                    <View>
                      <Text className="text-xs text-gray-500">Minimum rating</Text>
                      <Text className="mt-1 text-sm text-black">
                        {selectedRating ? `${selectedRating.toFixed(1)}+` : 'Any'}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-600">{isRatingOpen ? 'Hide' : 'Show'}</Text>
                  </Pressable>
                  {isRatingOpen ? (
                    <View className="mt-2 rounded-md border border-gray-200 px-3 py-3">
                      <EmployeeRating value={selectedRating} onChange={setSelectedRating} size={22} showValue />
                    </View>
                  ) : null}
                </View>

                <View className="mt-5 flex-row gap-3">
                  <Pressable
                    onPress={handleClear}
                    className="flex-1 items-center rounded-md border border-gray-300 py-3"
                  >
                    <Text className="font-semibold text-black">Clear</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleApply}
                    className="flex-1 items-center rounded-md bg-black py-3"
                  >
                    <Text className="font-semibold text-white">Apply</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default EmployeeFilter;
