import React, { useMemo } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import type { InvoiceContent } from '@/database/invoicecontent';

type StatsTopCustomersProps = {
  invoices: InvoiceContent[];
};

const StatsTopCustomers = ({ invoices }: StatsTopCustomersProps) => {
  const { topCustomers, chartData } = useMemo(() => {
    const totals = new Map<string, number>();
    invoices.forEach((invoice) => {
      const name = invoice.clientname || 'Unknown';
      const current = totals.get(name) ?? 0;
      totals.set(name, current + (Number(invoice.totalamount) || 0));
    });
    const sorted = Array.from(totals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
    
    return {
      topCustomers: sorted,
      chartData: {
        labels: sorted.map(([name]) => name.substring(0, 8)),
        datasets: [
          {
            data: sorted.map(([, amount]) => amount),
          },
        ],
      },
    };
  }, [invoices]);

  if (topCustomers.length === 0) {
    return (
      <View className="rounded-md border border-gray-200 bg-white p-4">
        <Text className="text-base font-semibold text-black">Top Customers</Text>
        <Text className="mt-4 text-sm text-gray-500">No invoices yet.</Text>
      </View>
    );
  }

  return (
    <View className="rounded-md border border-gray-200 bg-white p-4">
      <Text className="text-base font-semibold text-black">Top Customers by Revenue</Text>
      <BarChart
        data={chartData}
        width={Dimensions.get('window').width - 48}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: () => '#3b82f6',
          labelColor: () => '#000',
          barPercentage: 0.65,
        }}
        verticalLabelRotation={45}
      />
      <View className="mt-4">
        {topCustomers.map(([name, total]) => (
          <View key={name} className="mb-2 flex-row items-center justify-between border-b border-gray-100 pb-2">
            <Text className="text-xs text-black" numberOfLines={1}>
              {name}
            </Text>
            <Text className="text-xs font-semibold text-black">${total.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default StatsTopCustomers;
