import { Text, View, Pressable, Modal, TouchableWithoutFeedback, ScrollView, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState, useEffect } from 'react';
import { eAges, ePositions, eYears, ePay } from '@/constants/data';
import EmployeeRating from '@/components/EmployeeRating';
import { icons } from '@/constants/icons';
import EmployeeYearsFillterButton from '@/components/EmployeeYearsFillterButton';
import EmployeeAgesFillterButton from './EmployeeAgesFillterButton';
import EmployeePayFillterButton from './EmployeePayFillterButton';
import { useLanguage } from '@/service/language';

const EmployeeFilter = () => {
  const { t } = useLanguage();
  const ALL = 'All';
  const params = useLocalSearchParams<{ position?: string; rating?: string; years?: string; age?: string; pay?: string }>();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(ALL);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedYearsLabel, setSelectedYearsLabel] = useState(ALL);
  const [selectedAge, setSelectedAge] = useState(ALL);
  const [selectedPay, setSelectedPay] = useState(ALL);
  const [isYearsOpen, setIsYearsOpen] = useState(false);
  const [isRankOpen, setIsRankOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);
  const [isAgeOpen, setIsAgeOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);

  const positionOptions = useMemo(
    () => [{ label: ALL, value: ALL }, ...ePositions],
    []
  );

  useEffect(() => {
    if (!isVisible) return;
    const positionParam = params.position ? String(params.position) : ALL;
    const ratingParam = Number(params.rating);
    const yearsParam = params.years ? String(params.years) : ALL;
    const ageParam = params.age ? String(params.age) : ALL;
    const payParam = params.pay ? String(params.pay) : ALL;
    setSelectedPosition(positionParam || ALL);
    setSelectedRating(Number.isFinite(ratingParam) ? ratingParam : 0);
    setSelectedYearsLabel(yearsParam || ALL);
    setSelectedAge(ageParam || ALL);
    setSelectedPay(payParam || ALL);
  }, [isVisible, params.position, params.rating, params.years, params.age, params.pay]);

  const handleApply = () => {
    router.setParams({
      position: selectedPosition === ALL ? '' : selectedPosition,
      rating: selectedRating ? String(selectedRating) : '',
      years: selectedYearsLabel === ALL ? '' : selectedYearsLabel,
      age: selectedAge === ALL ? '' : selectedAge,
      pay: selectedPay === ALL ? '' : selectedPay,
    });
    setIsVisible(false);
  };

  const handleClear = () => {
    setSelectedPosition(ALL);
    setSelectedRating(0);
    setSelectedYearsLabel(ALL);
    setSelectedAge(ALL);
    setSelectedPay(ALL);
    router.setParams({ position: '', rating: '', years: '', age: '', pay: '' });
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
                  <Text className="text-base font-semibold text-black">{t('filter_employees')}</Text>
                  <Pressable onPress={() => setIsVisible(false)}>
                    <Text className="text-sm font-medium text-gray-600">{t('close')}</Text>
                  </Pressable>
                </View>

                <View className="mt-4">
                  <Pressable
                    onPress={() => setIsRankOpen((prev) => !prev)}
                    className="flex-row items-center justify-between rounded-md border border-gray-200 px-3 py-3"
                  >
                    <View>
                      <Text className="text-xs text-gray-500">{t('rank')}</Text>
                      <Text className="mt-1 text-sm text-black">
                        {selectedPosition === ALL ? t('any') : selectedPosition}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-600">{isRankOpen ? t('hide') : t('show')}</Text>
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
                              {option.label === ALL ? t('all') : option.label}
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
                      <Text className="text-xs text-gray-500">{t('years_of_experience')}</Text>
                      <Text className="mt-1 text-sm text-black">
                        {selectedYearsLabel === ALL ? t('any') : selectedYearsLabel}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-600">{isYearsOpen ? t('hide') : t('show')}</Text>
                  </Pressable>
                  {isYearsOpen ? (
                    <ScrollView className="mt-2" style={{ maxHeight: 220 }}>
                      <EmployeeYearsFillterButton
                        options={[{ label: ALL, min: 0, max: Infinity }, ...eYears]}
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
                      <Text className="text-xs text-gray-500">{t('minimum_rating')}</Text>
                      <Text className="mt-1 text-sm text-black">
                        {selectedRating ? `${selectedRating.toFixed(1)}+` : t('any')}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-600">{isRatingOpen ? t('hide') : t('show')}</Text>
                  </Pressable>
                  {isRatingOpen ? (
                    <View className="mt-2 rounded-md border border-gray-200 px-3 py-3">
                      <EmployeeRating value={selectedRating} onChange={setSelectedRating} size={22} showValue />
                    </View>
                  ) : null}
                </View>

                <View className="mt-4">
                  <Pressable
                    onPress={() => setIsAgeOpen((prev) => !prev)}
                    className="flex-row items-center justify-between rounded-md border border-gray-200 px-3 py-3"
                  >
                    <View>
                        <Text className="text-xs text-gray-500">{t('employee_age')}</Text>
                        <Text className="mt-1 text-sm text-black">
                        {selectedAge !== ALL ? `${selectedAge}` : t('any')}
                        </Text>
                      </View>
                    <Text className= "text-sm text-gray-600">{isAgeOpen ? t('hide') : t('show')}</Text>
                  </Pressable>
                  {isAgeOpen ? (
                    <ScrollView className='mt-2' style={{ maxHeight: 220 }}>
                      <EmployeeAgesFillterButton 
                        options={[{label: ALL, min: 0, max: Infinity }, ...eAges]}
                        selectedLabel={selectedAge}
                        onSelect={setSelectedAge}
                      />
                    </ScrollView>
                  ) : null}
                </View>

                <View className="mt-4">
                  <Pressable
                    onPress={() => setIsPayOpen((prev) => !prev)}
                    className="flex-row items-center justify-between rounded-md border border-gray-200 px-3 py-3"
                    >
                      <View>
                        <Text className="text-xs text-gray-500">{t('weekly_salary')}</Text>
                        <Text className="mt-1 text-sm text-black">
                          {selectedPay !== ALL ? `${selectedPay}`: t('any')}
                        </Text>
                      </View>
                      <Text className='text-sm text-gray-600'>{isPayOpen ? t('hide') : t('show')}</Text>
                  </Pressable>
                  {isPayOpen ? (
                    <ScrollView className='mt-2' style={{ maxHeight: 200 }}>
                      <EmployeePayFillterButton
                        options={[{label: ALL, min: 0, max: Infinity}, ...ePay]}
                        selectedLabel={selectedPay}
                        onSelect={setSelectedPay}
                        />
                    </ScrollView>
                        ) : null}
                </View>

                <View className="mt-5 flex-row gap-3">
                  <Pressable
                    onPress={handleClear}
                    className="flex-1 items-center rounded-md border border-gray-300 py-3"
                  >
                    <Text className="font-semibold text-black">{t('clear')}</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleApply}
                    className="flex-1 items-center rounded-md bg-black py-3"
                  >
                    <Text className="font-semibold text-white">{t('apply')}</Text>
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
