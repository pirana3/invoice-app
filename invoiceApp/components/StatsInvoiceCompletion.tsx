import React, { useMemo } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import type { InvoiceContent } from '@/database/invoicecontent';

type StatsInvoiceCompletionProps = {
  invoices: InvoiceContent[];
};

const StatsInvoiceCompletion = ({ invoices }: StatsInvoiceCompletionProps) => {
  const { completed, pending, chartData } = useMemo(() => {
    const completedCount = invoices.filter((invoice) => invoice.completed === 1).length;
    const pendingCount = invoices.length - completedCount;
    return {
      completed: completedCount,
      pending: pendingCount,
      chartData: [
        { name: 'Completed', value: completedCount, color: '#10b981', legendFontColor: '#000', legendFontSize: 12 },
        { name: 'Pending', value: pendingCount, color: '#f59e0b', legendFontColor: '#000', legendFontSize: 12 },
      ],
    };
  }, [invoices]);

  if (chartData.every((item) => item.value === 0)) {
    return (
      <View className="rounded-md border border-gray-200 bg-white p-4">
        <Text className="text-base font-semibold text-black">Invoice Completion Status</Text>
        <Text className="mt-4 text-sm text-gray-500">No invoices yet.</Text>
      </View>
    );
  }

  return (
    <View className="rounded-md border border-gray-200 bg-white p-4">
      <Text className="text-base font-semibold text-black">Invoice Completion Status</Text>
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

export default StatsInvoiceCompletion;
