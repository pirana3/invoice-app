import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import type { EstimateContent } from '@/database/estimatecontent';

type StatsEstimateWinLossProps = {
  estimates: EstimateContent[];
};

const StatsEstimateWinLoss = ({ estimates }: StatsEstimateWinLossProps) => {
  const { total, won, lost, winRate } = useMemo(() => {
    const totalCount = estimates.length;
    const wonCount = estimates.filter((estimate) => estimate.estimatecompleted === 1).length;
    const lostCount = totalCount - wonCount;
    const rate = totalCount ? Math.round((wonCount / totalCount) * 100) : 0;
    return { total: totalCount, won: wonCount, lost: lostCount, winRate: rate };
  }, [estimates]);

  return (
    <View className="rounded-md border border-gray-200 bg-white p-4">
      <Text className="text-base font-semibold text-black">Estimate Win/Loss</Text>
      <Text className="mt-2 text-sm text-gray-600">Total estimates: {total}</Text>
      <Text className="mt-1 text-sm text-gray-600">Won: {won}</Text>
      <Text className="mt-1 text-sm text-gray-600">Lost/Pending: {lost}</Text>
      <Text className="mt-3 text-sm font-semibold text-black">Win rate: {winRate}%</Text>
    </View>
  );
};

export default StatsEstimateWinLoss;
