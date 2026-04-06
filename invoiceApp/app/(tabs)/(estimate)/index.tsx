import { Text, View, ActivityIndicator, Alert, ScrollView, Pressable} from 'react-native';
import EstimateProfile from '@/app/(tabs)/(estimate)/estimateProfile';
import { getEstimates, searchEstimates, deleteEstimates, toggleEstimateCompleted, type EstimateContent } from '@/database/estimatecontent';
import { useLocalSearchParams, router } from 'expo-router';
import EstimateSearch from '@/components/EstimateSearch';
import React, { useEffect, useState} from 'react';

const estimateContentList = () => {
  const params = useLocalSearchParams<{ query?: string}>();
  const [allEstimates, setAllEstiamtes] = useState<EstimateContent[]>([]);
  const [fillteredEstimates, setFillteredEstimates] = useState<EstimateContent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEstimates = async () => {
    try{
      setLoading(true);
      const data = await getEstimates();
      setAllEstiamtes(data);
      setFillteredEstimates(data);
    } catch (error){
      console.error('Error loading estiamtes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEstimates();
  }, []);

  useEffect(() => {
    const fillterEstimates = async () => {
      if (!params.query || params.query.trim() === ''){
        setFillteredEstimates(allEstimates);
      } else {
        try {
          const results = await searchEstimates(params.query);
          setFillteredEstimates(results);
        } catch (error){
          console.error('Error searching estimates:', error);
          setFillteredEstimates([]);
        }
      }
    };
    fillterEstimates();
  }, [params.query, allEstimates]);

  const handleCreate = () => {
    router.push('/(tabs)/(estimate)/estimateCreate' as never);
  }

  const handleEdit = (id: number) => {
    router.push({ pathname: '/(tabs)/(estimate)/estimateCreate', params: { id } } as never);
  }

  const handleDelete = (estimate: EstimateContent) => {
    Alert.alert('Delete estimate', `Delete estimate #${estimate.estimatenumber}?`, [
      { text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteEstimates(estimate.id);
          loadEstimates();
        },
      },
    ]);
  };

  const handleToggleCompleted = async (estimate: EstimateContent) => {
    const next = estimate.completed ? 0 : 1;
    await toggleEstimateCompleted(estimate.id, next);
    loadEstimates();
  }

  return (
    <ScrollView className='flex-1 bg-gray-50'>
      <View className="py-4">
        <View className = "flex-row items-center gap-2 px-4">
          <View className="flex-1">
            <EstimateSearch />
          </View>
          <Pressable 
            onPress ={handleCreate}
            className='rounded-md bg-black px-3 py-2'
            >
              <Text className='text-sm font-semibold text-white'> New Estimate</Text>
            </Pressable>
        </View>

        {laoding ? (
          <View className='flex-1 items-center justify-center py-10'>
            <ActivityIndicator size="large" color="#111827" />
          </View>
        ) : filteredEstimates.length === 0 ? (
          <View className='px-4 mt-6'>
            <Text className='text-sm text-gray-500'> No Estimates have been created</Text>
          </View>
        ) : (
          <View className="px-4 mt-4">
            {fillteredEstimates.map((estimate) => (
              <EstimateProfile
                key={estimate.id}
                estimate={estimate}
                onPress={() => handleEdit(estimate.id)}
                onEdit={() => handleEdit(estimate.id)}
                onDelete={() => handleDelete(estimate)}
                onToggleCompleted={() => handleToggleCompleted(estimate)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default estimateContentList;

