import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import type { InvoiceContent } from '@/database/invoicecontent';

type StatsRevenueSummaryProps = {
  invoices: InvoiceContent[];
};

const StatsRevenueSummary = ({ invoices }: StatsRevenueSummaryProps) => {
  const { gained, lost } = useMemo(() => {
    const completed = invoices.filter((invoice) => invoice.completed === 1);
    const pending = invoices.filter((invoice) => invoice.completed === 0);
    const gainedValue = completed.reduce((sum, invoice) => sum + (Number(invoice.totalamount) || 0), 0);
    const lostValue = pending.reduce((sum, invoice) => sum + (Number(invoice.totalamount) || 0), 0);
    return { gained: gainedValue, lost: lostValue };
  }, [invoices]);

  return (
    <View className="rounded-md border border-gray-200 bg-white p-4">
      <Text className="text-base font-semibold text-black">Revenue Gained / Lost</Text>
      <Text className="mt-2 text-sm text-gray-600">Gained: ${gained.toFixed(2)}</Text>
      <Text className="mt-1 text-sm text-gray-600">Lost/Pending: ${lost.toFixed(2)}</Text>
    </View>
  );
};

export default StatsRevenueSummary;
