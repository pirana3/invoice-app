import React, {useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { deleteEmployees, getEmployees, updateEmployees } from '@/database/employeesdb';
import useFetch from '@/service/usefetch';


const EmployeeProfileScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams<{ id?: string | string[] }>();
    const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
    const employeesId =Number(rawId);
    const canFetch = Number.isFinite(employeesId);
    const fetchEmployees = useCallback(() => getEmployees(), [employeesId]);
    const [isEditing, setIsEditing] = useState(false);
    const [ename, setEname] = useState('');
    const [eemail, setEeamil] = useState('');
    const [ephone, setEphone] = useState('');
    const [eage, setEage] = useState('');
    const [eposition, setEpsition] = useState('');
    const [erole, setErole] = useState('');
    const [edetails, setEdetails] = useState('');
    const [epay, setEpay] = useState('');
    const [eperformance, setEperformance] = useState('');
    const [elanguage, setElanguage] = useState('');
    const [eyears, setEyears] = useState('');
    const [ephoto, setEphoto] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setISDeleting] = useState(false);

    const { data: employees, loading, error, refetch } = useFetch(
        fetchEmployees,
        canFetch
    );

    useEffect(() => {
        if (!employees) return;
        setEname(employees.ename);
        setEeamil(employees.eemail);
        setEphone(String(employees.ephone));
        setEage(String(employees.eage));
        setEpsition(employees.eposition);
        setErole(employees.erole);
        setEdetails(employees.edetails);
        setEpay(String(employees.epay));
        setEperformance(String(employees.eperformance));
        setElanguage(employees.elanguage);
        setEyears(String(employees.eyears));
        setEphoto(employees.ephoto ?? '');
    }, [employees]);

    const handleSave = async () => {
        const parsedPhone = Number(ephone);

        if (!employees) return;
        if (!ename.trim()) {
            Alert.alert('Missing Employees name' , 'Please enter your Employees name.');
            return;
        }
        if (!Number.isFinite(parsedEphone) || parsedEphone < 0) {
            Alert.alert(' Invalid phone number', 'Please enter a your employees phone number');
            return;
        }
        if (!Number.isFinite(parsedEpay) || pasredEpay < 0){
            Alert.alert(' Invalid pay' , 'Please enter employees actual Paycheck');
            return;
        }

        try{
            setIsSaving(true);
            const updated = await updateEmployees(employeesid, ename.trim(), eemail.trim(), parsedEphone, Number(eage), eposition.trim(), erole.trim(), edetails.trim(), Number(epay), Number(eperformance), elanguage.trim(), Number(eyears), ephoto.trim());
            if (!updated) {
                Alert.alert('Update failed', 'Employee no longer exists.');
                router.back();
                return;
            }
            await refetch();
            setIsEditing(false);
        } catch (saveError) {
            console.error(saveError);
            Alert.alert('Update failed', 'Could not update this Employee.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = () => {
        if (!employees) return;
        Alert.alert('Delete product', `Delete "${employees.ename}"?` , [
            { text:}
        ])
    }

    return (
    <View>
      <Text>[id]</Text>
    </View>
  )
}

export default EmployeeProfileScreen
