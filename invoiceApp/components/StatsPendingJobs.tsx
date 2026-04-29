import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import type { InvoiceContent } from '@/database/invoicecontent';
import { useLanguage } from '@/service/language';

type StatsPendingJobsProps = {
  invoices: InvoiceContent[];
};

const StatsPendingJobs = ({ invoices }: StatsPendingJobsProps) => {
  const { t } = useLanguage();
  const { pendingCount, pendingValue } = useMemo(() => {
    const pending = invoices.filter((invoice) => invoice.completed === 0);
    const value = pending.reduce((sum, invoice) => sum + (Number(invoice.totalamount) || 0), 0);
    return { pendingCount: pending.length, pendingValue: value };
  }, [invoices]);

  return (
    <View className="rounded-md border border-gray-200 bg-white p-4">
      <Text className="text-base font-semibold text-black">{t('stats_pending_jobs')}</Text>
      <Text className="mt-2 text-sm text-gray-600">{t('stats_open_invoices')}: {pendingCount}</Text>
      <Text className="mt-1 text-sm text-gray-600">
        {t('stats_pending_value')}: ${pendingValue.toFixed(2)}
      </Text>
    </View>
  );
};

export default StatsPendingJobs;
