import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import type { InvoiceContent } from '@/database/invoicecontent';

type StatsInvoiceCompletionProps = {
  invoices: InvoiceContent[];
};

const StatsInvoiceCompletion = ({ invoices }: StatsInvoiceCompletionProps) => {
  const { total, completed, completionRate } = useMemo(() => {
    const totalCount = invoices.length;
    const completedCount = invoices.filter((invoice) => invoice.completed === 1).length;
    const rate = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
    return { total: totalCount, completed: completedCount, completionRate: rate };
  }, [invoices]);

  return (
    <View className="rounded-md border border-gray-200 bg-white p-4">
      <Text className="text-base font-semibold text-black">Invoice Completion</Text>
      <Text className="mt-2 text-sm text-gray-600">Total invoices: {total}</Text>
      <Text className="mt-1 text-sm text-gray-600">Completed: {completed}</Text>
      <Text className="mt-3 text-sm font-semibold text-black">Completion rate: {completionRate}%</Text>
    </View>
  );
};

export default StatsInvoiceCompletion;
