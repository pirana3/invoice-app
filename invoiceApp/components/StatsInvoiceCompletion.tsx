import React, { useMemo } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import type { InvoiceContent } from '@/database/invoicecontent';
import { useLanguage } from '@/service/language';

type StatsInvoiceCompletionProps = {
  invoices: InvoiceContent[];
};

const StatsInvoiceCompletion = ({ invoices }: StatsInvoiceCompletionProps) => {
  const { t } = useLanguage();
  const { completed, pending, chartData } = useMemo(() => {
    const completedCount = invoices.filter((invoice) => invoice.completed === 1).length;
    const pendingCount = invoices.length - completedCount;
    return {
      completed: completedCount,
      pending: pendingCount,
      chartData: [
        { name: t('stats_completed'), value: completedCount, color: '#10b981', legendFontColor: '#000', legendFontSize: 12 },
        { name: t('stats_pending'), value: pendingCount, color: '#f59e0b', legendFontColor: '#000', legendFontSize: 12 },
      ],
    };
  }, [invoices, t]);

  if (chartData.every((item) => item.value === 0)) {
    return (
      <View className="rounded-md border border-gray-200 bg-white p-4">
        <Text className="text-base font-semibold text-black">{t('stats_invoice_completion_status')}</Text>
        <Text className="mt-4 text-sm text-gray-500">{t('stats_no_invoices_yet')}</Text>
      </View>
    );
  }

  return (
    <View className="rounded-md border border-gray-200 bg-white p-4">
      <Text className="text-base font-semibold text-black">{t('stats_invoice_completion_status')}</Text>
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
