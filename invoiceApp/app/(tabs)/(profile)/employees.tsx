import { View, ActivityIndicator, ScrollView } from 'react-native';
import EmployeeButton from '@/components/EmployeesButton';
import EmployeesSearchBar from '@/components/EmployeesSearchBar';
import EmployeesProfile from '@/app/employees/employeesProfile';
import NoResults from '@/components/NoResults';
import { getEmployees, searchEmployees, type Employees } from '@/database/employeesdb';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import EmployeeFilter from '@/components/EmployeeFilter';
import { eAges, ePay, eYears } from '@/constants/data';

const employees = () => {
  const params = useLocalSearchParams<{
    query?: string;
    rating?: string;
    position?: string;
    years?: string;
    age?: string;
    pay?: string;
  }>();
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

  // Filter employees when search query or filters change
  useEffect(() => {
    const filterEmployees = async () => {
      const parsedRating = Number(params.rating);
      const hasRating = Number.isFinite(parsedRating) && parsedRating > 0;
      const positionFilter = params.position ? String(params.position) : '';
      const yearsFilter = params.years ? String(params.years) : '';
      const ageFilter = params.age ? String(params.age) : '';
      const payFilter = params.pay ? String(params.pay) : '';
      const yearsRange = yearsFilter
        ? eYears.find((range) => range.label === yearsFilter)
        : undefined;
      const ageRange = ageFilter ? eAges.find((range) => range.label === ageFilter) : undefined;
      const payRange = payFilter ? ePay.find((range) => range.label === payFilter) : undefined;

      const applyFilters = (list: Employees[]) => {
        let next = list;
        if (positionFilter) {
          next = next.filter((employee) => employee.eposition === positionFilter);
        }
        if (yearsRange) {
          next = next.filter(
            (employee) => employee.eyears >= yearsRange.min && employee.eyears <= yearsRange.max
          );
        }
        if (ageRange) {
          next = next.filter(
            (employee) => employee.eage >= ageRange.min && employee.eage <= ageRange.max
          );
        }
        if (payRange) {
          next = next.filter(
            (employee) => employee.epay >= payRange.min && employee.epay <= payRange.max
          );
        }
        if (hasRating) {
          next = next.filter((employee) => employee.eperformance >= parsedRating);
        }
        return next;
      };

      if (!params.query || params.query.trim() === '') {
        setFilteredEmployees(applyFilters(allEmployees));
      } else {
        try {
          const results = await searchEmployees(params.query);
          setFilteredEmployees(applyFilters(results));
        } catch (error) {
          console.error('Error searching employees:', error);
          setFilteredEmployees([]);
        }
      }
    };

    filterEmployees();
  }, [params.query, params.rating, params.position, params.years, params.age, params.pay, allEmployees]);

  const handleAddEmployee = () => {
    router.push('/employees/new');
  };

  const handleEmployeePress = (id: number) => {
    router.push(`/employees/${id}`);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="py-4">
        {/* Search + Filters + Add */}
        <View className="flex-row items-center gap-2 px-4">
          <View className="flex-1">
            <EmployeesSearchBar containerClassName="mx-0" />
          </View>
          <EmployeeFilter />
          <EmployeeButton
            onPress={handleAddEmployee}
            title="Add"
            style="px-3 py-2 bg-black"
            textStyle="text-sm"
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
