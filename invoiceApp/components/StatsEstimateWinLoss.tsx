import React, { useMemo } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import type { EstimateContent } from '@/database/estimatecontent';

type StatsEstimateWinLossProps = {
  estimates: EstimateContent[];
};

const StatsEstimateWinLoss = ({ estimates }: StatsEstimateWinLossProps) => {
  const { won, pending, chartData } = useMemo(() => {
    const wonCount = estimates.filter((estimate) => estimate.estimatecompleted === 1).length;
    const pendingCount = estimates.length - wonCount;
    return {
      won: wonCount,
      pending: pendingCount,
      chartData: [
        { name: 'Won', value: wonCount, color: '#10b981', legendFontColor: '#000', legendFontSize: 12 },
        { name: 'Pending', value: pendingCount, color: '#f59e0b', legendFontColor: '#000', legendFontSize: 12 },
      ],
    };
  }, [estimates]);

  if (chartData.every((item) => item.value === 0)) {
    return (
      <View className="rounded-md border border-gray-200 bg-white p-4">
        <Text className="text-base font-semibold text-black">Estimates: Won vs Pending</Text>
        <Text className="mt-4 text-sm text-gray-500">No estimates yet.</Text>
      </View>
    );
  }

  return (
    <View className="rounded-md border border-gray-200 bg-white p-4">
      <Text className="text-base font-semibold text-black">Estimates: Won vs Pending</Text>
      <PieChart
        data={chartData}
        width={Dimensions.get('window').width - 48}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: () => '#000',
          labelColor: () => '#000',
        }}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </View>
  );
};

export default StatsEstimateWinLoss;
