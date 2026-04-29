import { Text, View, ActivityIndicator, Alert, ScrollView, Pressable} from 'react-native';
import EstimateProfileCard from '@/components/EstimateProfileCard';
import { convertEstimateToInvoice, getEstimates, searchEstimates, deleteEstimates, toggleEstimateCompleted, type EstimateContent } from '@/database/estimatecontent';
import { useLocalSearchParams, router } from 'expo-router';
import EstimateSearch from '@/components/EstimateSearch';
import React, { useEffect, useState} from 'react';
import { useLanguage } from '@/service/language';

const estimateContentList = () => {
  const { t } = useLanguage();
  const params = useLocalSearchParams<{ query?: string}>();
  const [allEstimates, setAllEstimates] = useState<EstimateContent[]>([]);
  const [filteredEstimates, setFilteredEstimates] = useState<EstimateContent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEstimates = async () => {
    try{
      setLoading(true);
      const data = await getEstimates();
      setAllEstimates(data);
      setFilteredEstimates(data);
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
    const filterEstimates = async () => {
      if (!params.query || params.query.trim() === ''){
        setFilteredEstimates(allEstimates);
      } else {
        try {
          const results = await searchEstimates(params.query);
          setFilteredEstimates(results);
        } catch (error){
          console.error('Error searching estimates:', error);
          setFilteredEstimates([]);
        }
      }
    };
    filterEstimates();
  }, [params.query, allEstimates]);

  const handleCreate = () => {
    router.push({ pathname: '/(tabs)/(estimate)/estimateCreate', params: { id: 'new', nonce: String(Date.now()) } } as never);
  }

  const handleEdit = (id: number) => {
    router.push({ pathname: '/(tabs)/(estimate)/estimateCreate', params: { id } } as never);
  }

  const handleDelete = (estimate: EstimateContent) => {
    Alert.alert(t('delete_estimate_title'), t('delete_estimate_message').replace('{{number}}', String(estimate.estimatenumber)), [
      { text: t('cancel'), style: 'cancel'},
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteEstimates(estimate.id);
          loadEstimates();
        },
      },
    ]);
  };

  const handleToggleCompleted = async (estimate: EstimateContent) => {
    const next = estimate.estimatecompleted ? 0 : 1;
    if (next === 1) {
      Alert.alert(t('mark_as_won_title'), t('convert_estimate_message').replace('{{number}}', String(estimate.estimatenumber)), [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('convert'),
          onPress: async () => {
            await toggleEstimateCompleted(estimate.id, 1);
            await convertEstimateToInvoice(estimate.id);
            loadEstimates();
          },
        },
      ]);
      return;
    }
    await toggleEstimateCompleted(estimate.id, 0);
    loadEstimates();
  };

  const handleConvert = async (estimate: EstimateContent) => {
    Alert.alert(t('convert_estimate_title'), t('convert_estimate_message').replace('{{number}}', String(estimate.estimatenumber)), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('convert'),
        onPress: async () => {
          await convertEstimateToInvoice(estimate.id);
          await toggleEstimateCompleted(estimate.id, 1);
          loadEstimates();
        },
      },
    ]);
  };

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
              <Text className='text-sm font-semibold text-white'>{t('new_estimate')}</Text>
            </Pressable>
        </View>

        {loading ? (
          <View className='flex-1 items-center justify-center py-10'>
            <ActivityIndicator size="large" color="#111827" />
          </View>
        ) : filteredEstimates.length === 0 ? (
          <View className='px-4 mt-6'>
            <Text className='text-sm text-gray-500'>{t('no_estimates_created')}</Text>
          </View>
        ) : (
          <View className="px-4 mt-4">
            {filteredEstimates.map((estimate) => (
              <EstimateProfileCard
                key={estimate.id}
                estimate={estimate}
                onPress={() => handleEdit(estimate.id)}
                onEdit={() => handleEdit(estimate.id)}
                onDelete={() => handleDelete(estimate)}
                onToggleCompleted={() => handleToggleCompleted(estimate)}
                onConvert={() => handleConvert(estimate)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default estimateContentList;
