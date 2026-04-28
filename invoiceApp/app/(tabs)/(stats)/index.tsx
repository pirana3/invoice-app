import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import StatsEstimateWinLoss from '@/components/StatsEstimateWinLoss';
import StatsPendingJobs from '@/components/StatsPendingJobs';
import StatsRevenueSummary from '@/components/StatsRevenueSummary';
import StatsTopCustomers from '@/components/StatsTopCustomers';
import StatsInvoiceCompletion from '@/components/StatsInvoiceCompletion';
import { getEstimates, type EstimateContent } from '@/database/estimatecontent';
import { getInvoices, type InvoiceContent } from '@/database/invoicecontent';
import { useLanguage } from '@/service/language';

const index = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'estimates' | 'pending' | 'revenue' | 'customers' | 'completion'>('estimates');
  const [loading, setLoading] = useState(true);
  const [estimates, setEstimates] = useState<EstimateContent[]>([]);
  const [invoices, setInvoices] = useState<InvoiceContent[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const [estimateData, invoiceData] = await Promise.all([getEstimates(), getInvoices()]);
        setEstimates(estimateData);
        setInvoices(invoiceData);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-4 py-6">
        <Text className="text-lg font-semibold text-black">{t('business_analytics')}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
          {[
            { key: 'estimates', label: t('tab_estimates') },
            { key: 'pending', label: t('tab_pending') },
            { key: 'revenue', label: t('tab_revenue') },
            { key: 'customers', label: t('tab_customers') },
            { key: 'completion', label: t('tab_invoices') },
          ].map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key as typeof activeTab)}
              className={`mr-2 rounded-full px-4 py-2 ${
                activeTab === tab.key ? 'bg-black' : 'bg-white border border-gray-200'
              }`}
            >
              <Text className={`text-xs font-semibold ${activeTab === tab.key ? 'text-white' : 'text-black'}`}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {loading ? (
          <View className="mt-8 items-center">
            <ActivityIndicator size="small" color="#111827" />
          </View>
        ) : (
          <View className="mt-4">
            {activeTab === 'estimates' ? <StatsEstimateWinLoss estimates={estimates} /> : null}
            {activeTab === 'pending' ? <StatsPendingJobs invoices={invoices} /> : null}
            {activeTab === 'revenue' ? <StatsRevenueSummary invoices={invoices} /> : null}
            {activeTab === 'customers' ? <StatsTopCustomers invoices={invoices} /> : null}
            {activeTab === 'completion' ? <StatsInvoiceCompletion invoices={invoices} /> : null}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default index;
