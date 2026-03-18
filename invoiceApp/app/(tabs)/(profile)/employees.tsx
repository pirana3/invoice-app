import { View, ActivityIndicator, ScrollView } from 'react-native';
import EmployeeButton from '@/components/EmployeesButton';
import EmployeesSearchBar from '@/components/EmployeesSearchBar';
import EmployeesProfile from '@/app/employees/employeesProfile';
import NoResults from '@/components/NoResults';
import { getEmployees, searchEmployees, type Employees } from '@/database/employeesdb';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import EmployeeRatingFilter from '@/components/EmployeeRatingFilter';

const employees = () => {
  const params = useLocalSearchParams<{ query?: string; rating?: string }>();
  const [allEmployees, setAllEmployees] = useState<Employees[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employees[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all employees on mount
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        const data = await getEmployees();
        setAllEmployees(data);
        setFilteredEmployees(data);
      } catch (error) {
        console.error('Error loading employees:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  // Filter employees when search query or rating changes
  useEffect(() => {
    const filterEmployees = async () => {
      const parsedRating = Number(params.rating);
      const hasRating = Number.isFinite(parsedRating) && parsedRating > 0;
      const applyRatingFilter = (list: Employees[]) =>
        hasRating ? list.filter((employee) => employee.eperformance >= parsedRating) : list;

      if (!params.query || params.query.trim() === '') {
        setFilteredEmployees(applyRatingFilter(allEmployees));
      } else {
        try {
          const results = await searchEmployees(params.query);
          setFilteredEmployees(applyRatingFilter(results));
        } catch (error) {
          console.error('Error searching employees:', error);
          setFilteredEmployees([]);
        }
      }
    };

    filterEmployees();
  }, [params.query, params.rating, allEmployees]);

  const handleAddEmployee = () => {
    router.push('/employees/[id]');
  };

  const handleEmployeePress = (id: number) => {
    router.push(`/employees/${id}`);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="py-4">
        {/* Search Bar */}
        <EmployeesSearchBar />
        <View className="px-4">
          <EmployeeRatingFilter />
        </View>

        {/* Add Employee Button */}
        <View className="px-4 mt-4 mb-4">
          <EmployeeButton 
            onPress={handleAddEmployee}
            title="Add New Employee"
          />
        </View>

        {/* Employees List */}
        {loading ? (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="large" color="#0066cc" />
          </View>
        ) : filteredEmployees.length === 0 ? (
          <NoResults />
        ) : (
          <View className="px-4">
            {filteredEmployees.map((employee) => (
              <EmployeesProfile
                key={employee.id}
                employees={employee}
                onPress={() => handleEmployeePress(employee.id)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default employees;
