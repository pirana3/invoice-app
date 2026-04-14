import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { createEmployees, deleteEmployees, getEmployeesById, updateEmployees } from '@/database/employeesdb';
import useFetch from '@/service/usefetch';
import EPositionModal from '@/app/employees/ePositionModal';
import { ePositions } from '@/constants/data';
import EmployeeRating from '@/components/EmployeeRating';

const EmployeeProfileScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isNew = rawId === 'new' || rawId === undefined;
  const employeeId = Number(rawId);
  const canFetch = !isNew && Number.isFinite(employeeId);
  const fetchEmployee = useCallback(() => getEmployeesById(employeeId), [employeeId]);

  const [isEditing, setIsEditing] = useState(isNew);
  const [ename, setEname] = useState('');
  const [eemail, setEemail] = useState('');
  const [ephone, setEphone] = useState('');
  const [eage, setEage] = useState('');
  const [eposition, setEposition] = useState('');
  const [erole, setErole] = useState('');
  const [edetails, setEdetails] = useState('');
  const [epay, setEpay] = useState('');
  const [eperformance, setEperformance] = useState(0);
  const [elanguage, setElanguage] = useState('');
  const [eyears, setEyears] = useState('');
  const [ephoto, setEphoto] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);

  const { data: employee, loading, error, refetch } = useFetch(
    fetchEmployee,
    canFetch
  );

  useEffect(() => {
    if (!employee) return;
    setEname(employee.ename);
    setEemail(employee.eemail);
    setEphone(String(employee.ephone));
    setEage(String(employee.eage));
    setEposition(employee.eposition);
    setErole(employee.erole);
    setEdetails(employee.edetails);
    setEpay(String(employee.epay));
    setEperformance(employee.eperformance);
    setElanguage(employee.elanguage);
    setEyears(String(employee.eyears));
    setEphoto(employee.ephoto ?? '');
  }, [employee]);

  const canEdit = useMemo(() => isNew || isEditing, [isNew, isEditing]);

  const handlePickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow photo library access to select an employee photo.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.85,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setEphoto(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow camera access to take an employee photo.'
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        quality: 0.85,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setEphoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(
        'Camera not available',
        'Camera is not available on simulator. Please use "Add photo" to select from your library instead.'
      );
    }
  };

  const handleSave = async () => {
    const normalizedPhone = ephone.replace(/\D/g, '');
    const parsedPhone = Number(normalizedPhone);
    const parsedAge = Number(eage);
    const parsedPay = Number(epay);
    const parsedPerformance = Number(eperformance);
    const parsedYears = Number(eyears);

    if (!ename.trim()) {
      Alert.alert('Missing name', 'Please enter the employee name.');
      return;
    }
    if (!eemail.trim()) {
      Alert.alert('Missing email', 'Please enter the employee email.');
      return;
    }
    if (!Number.isFinite(parsedPhone) || parsedPhone < 0 || !normalizedPhone) {
      Alert.alert('Invalid phone number', 'Please enter a valid phone number.');
      return;
    }
    if (!Number.isFinite(parsedAge) || parsedAge < 0) {
      Alert.alert('Invalid age', 'Please enter a valid age.');
      return;
    }
    if (!Number.isFinite(parsedPay) || parsedPay < 0) {
      Alert.alert('Invalid pay', 'Please enter a valid pay amount.');
      return;
    }
    if (!Number.isFinite(parsedPerformance) || parsedPerformance < 0 || parsedPerformance > 5) {
      Alert.alert('Invalid performance', 'Please enter a valid rating between 0 and 5.');
      return;
    }
    if (!Number.isFinite(parsedYears) || parsedYears < 0) {
      Alert.alert('Invalid years', 'Please enter a valid years value.');
      return;
    }

    try {
      setIsSaving(true);
      if (isNew) {
        await createEmployees(
          ename.trim(),
          eemail.trim(),
          parsedPhone,
          parsedAge,
          eposition.trim(),
          erole.trim(),
          edetails.trim(),
          parsedPay,
          parsedPerformance,
          elanguage.trim(),
          parsedYears,
          ephoto.trim()
        );
        router.back();
      } else if (employee) {
        const updated = await updateEmployees(
          employee.id,
          ename.trim(),
          eemail.trim(),
          parsedPhone,
          parsedAge,
          eposition.trim(),
          erole.trim(),
          edetails.trim(),
          parsedPay,
          parsedPerformance,
          elanguage.trim(),
          parsedYears,
          ephoto.trim()
        );
        if (!updated) {
          Alert.alert('Update failed', 'Employee no longer exists.');
          router.back();
          return;
        }
        await refetch();
        setIsEditing(false);
      }
    } catch (saveError) {
      console.error(saveError);
      Alert.alert('Save failed', 'Could not save this employee.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!employee) return;
    Alert.alert('Delete employee', `Delete "${employee.ename}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsDeleting(true);
            await deleteEmployees(employee.id);
            router.back();
          } catch (deleteError) {
            console.error(deleteError);
            Alert.alert('Delete failed', 'Could not delete this employee.');
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  if (!canFetch && !isNew) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-red-500">Invalid employee ID.</Text>
      </View>
    );
  }

  if (!isNew && loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="small" color="#111827" />
      </View>
    );
  }

  if (!isNew && error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-red-500">Could not load this employee.</Text>
      </View>
    );
  }

  if (!isNew && !employee) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-gray-500">Employee not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      {canEdit ? (
        <>
          <View className="items-start">
            {ephoto ? (
              <Image
                source={{ uri: ephoto }}
                contentFit="cover"
                style={{ width: 140, height: 140, borderRadius: 12 }}
              />
            ) : (
              <View className="h-36 w-36 items-center justify-center rounded-xl border border-gray-300">
                <Text className="text-xs text-gray-500">No photo</Text>
              </View>
            )}
            <View className="mt-3 flex-row gap-2">
              <Pressable
                onPress={handlePickPhoto}
                className="rounded-md border border-gray-300 px-3 py-2"
              >
                <Text className="text-sm font-medium text-black">
                  {ephoto ? 'Change photo' : 'Add photo'}
                </Text>
              </Pressable>
              <Pressable
                onPress={handleTakePhoto}
                className="rounded-md border border-gray-300 px-3 py-2"
              >
                <Text className="text-sm font-medium text-black">Take photo</Text>
              </Pressable>
            </View>
          </View>
          <TextInput
            value={ename}
            onChangeText={setEname}
            placeholder="Employee name"
            className="rounded-md border border-gray-300 px-3 py-2 text-black"
          />
          <TextInput
            value={eemail}
            onChangeText={setEemail}
            placeholder="Employee email"
            keyboardType="email-address"
            autoCapitalize="none"
            className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
          <TextInput
            value={ephone}
            onChangeText={setEphone}
            placeholder="Phone number"
            keyboardType="numeric"
            className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
          <TextInput
            value={eage}
            onChangeText={setEage}
            placeholder="Age"
            keyboardType="numeric"
            className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
          <Pressable
            onPress={() => setIsPositionModalOpen(true)}
            className="mt-3 rounded-md border border-gray-300 px-3 py-3"
          >
            <Text className={`text-sm ${eposition ? 'text-black' : 'text-gray-500'}`}>
              {eposition || 'Select rank'}
            </Text>
          </Pressable>
          <TextInput
            value={erole}
            onChangeText={setErole}
            placeholder="Role"
            className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
          <TextInput
            value={edetails}
            onChangeText={setEdetails}
            placeholder="Details"
            multiline
            className="mt-3 min-h-20 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
          <TextInput
            value={epay}
            onChangeText={setEpay}
            placeholder="Pay"
            keyboardType="numeric"
            className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
          <View className="mt-3 rounded-md border border-gray-300 px-3 py-3">
            <Text className="text-xs text-gray-500">Performance rating</Text>
            <View className="mt-2">
              <EmployeeRating
                value={eperformance}
                onChange={setEperformance}
                size={24}
                showValue
              />
            </View>
          </View>
          <TextInput
            value={elanguage}
            onChangeText={setElanguage}
            placeholder="Language"
            className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
          <TextInput
            value={eyears}
            onChangeText={setEyears}
            placeholder="Years"
            keyboardType="numeric"
            className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-black"
          />
          <EPositionModal
            isVisible={isPositionModalOpen}
            options={ePositions}
            selectedValue={eposition}
            onSelect={(value) => {
              setEposition(value);
              setIsPositionModalOpen(false);
            }}
            onClose={() => setIsPositionModalOpen(false)}
          />
        </>
      ) : (
        <>
          {employee ? (
            <>
              <Text className="text-2xl font-semibold text-black">{employee.ename}</Text>
              <Text className="mt-2 text-base text-gray-700">{employee.eemail}</Text>
              <Text className="mt-2 text-base text-gray-700">{employee.ephone}</Text>
              <Text className="mt-2 text-base text-gray-700">Age: {employee.eage}</Text>
              <Text className="mt-2 text-base text-gray-700">Position: {employee.eposition}</Text>
              <Text className="mt-2 text-base text-gray-700">Role: {employee.erole}</Text>
              <Text className="mt-4 text-base text-gray-700">
                {employee.edetails || 'No details'}
              </Text>
              <Text className="mt-6 text-lg font-semibold text-black">
                Pay: ${employee.epay.toFixed(2)}
              </Text>
              <Text className="mt-2 text-base text-gray-700">
                Performance: {employee.eperformance.toFixed(1)} / 5
              </Text>
              <Text className="mt-2 text-base text-gray-700">
                Language: {employee.elanguage}
              </Text>
              <Text className="mt-2 text-base text-gray-700">
                Years: {employee.eyears}
              </Text>
              {employee.ephoto ? (
                <Image
                  source={{ uri: employee.ephoto }}
                  contentFit="cover"
                  style={{ width: 180, height: 180, borderRadius: 12, marginTop: 12 }}
                />
              ) : null}
            </>
          ) : null}
        </>
      )}

      <View className="mt-8 flex-row gap-3">
        {canEdit ? (
          <>
            <Pressable
              onPress={handleSave}
              disabled={isSaving || isDeleting}
              className="flex-1 items-center rounded-md bg-black py-3"
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="font-semibold text-white">
                  {isNew ? 'Save Employee' : 'Save Changes'}
                </Text>
              )}
            </Pressable>
            {!isNew ? (
              <Pressable
                onPress={() => {
                  if (employee) {
                    setEname(employee.ename);
                    setEemail(employee.eemail);
                    setEphone(String(employee.ephone));
                    setEage(String(employee.eage));
                    setEposition(employee.eposition);
                    setErole(employee.erole);
                    setEdetails(employee.edetails);
                    setEpay(String(employee.epay));
                    setEperformance(employee.eperformance);
                    setElanguage(employee.elanguage);
                    setEyears(String(employee.eyears));
                    setEphoto(employee.ephoto ?? '');
                  }
                  setIsEditing(false);
                }}
                disabled={isSaving || isDeleting}
                className="flex-1 items-center rounded-md border border-gray-300 py-3"
              >
                <Text className="font-semibold text-black">Cancel</Text>
              </Pressable>
            ) : null}
          </>
        ) : (
          <>
            <Pressable
              onPress={() => setIsEditing(true)}
              disabled={isDeleting}
              className="flex-1 items-center rounded-md bg-black py-3"
            >
              <Text className="font-semibold text-white">Edit</Text>
            </Pressable>
            <Pressable
              onPress={handleDelete}
              disabled={isDeleting}
              className="flex-1 items-center rounded-md border border-red-300 bg-red-50 py-3"
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#dc2626" />
              ) : (
                <Text className="font-semibold text-red-600">Delete</Text>
              )}
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default EmployeeProfileScreen;
