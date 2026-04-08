import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import type { InvoiceContent } from '@/database/invoicecontent';

type StatsTopCustomersProps = {
  invoices: InvoiceContent[];
};

const StatsTopCustomers = ({ invoices }: StatsTopCustomersProps) => {
  const topCustomers = useMemo(() => {
    const totals = new Map<string, number>();
    invoices.forEach((invoice) => {
      const name = invoice.clientname || 'Unknown';
      const current = totals.get(name) ?? 0;
      totals.set(name, current + (Number(invoice.totalamount) || 0));
    });
    return Array.from(totals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [invoices]);

  return (
    <View className="rounded-md border border-gray-200 bg-white p-4">
      <Text className="text-base font-semibold text-black">Top Customers</Text>
      {topCustomers.length === 0 ? (
        <Text className="mt-2 text-sm text-gray-500">No invoices yet.</Text>
      ) : (
        <View className="mt-3">
          {topCustomers.map(([name, total]) => (
            <View key={name} className="mb-2 flex-row items-center justify-between">
              <Text className="text-sm text-black">{name}</Text>
              <Text className="text-sm font-semibold text-black">${total.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default StatsTopCustomers;
