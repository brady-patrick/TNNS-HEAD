import React from 'react';
import {
  MetricsSimple,
  MetricsIcon01,
  MetricsIcon02,
  MetricsIcon03,
  MetricsIcon04,
  MetricsChart01,
  MetricsChart02,
  MetricsChart03,
  MetricsChart04,
  MetricsWithTrend,
  TrendIndicatorExamples
} from './Metrics';

export const MetricsDemo: React.FC = () => {
  // Sample trend data for demonstration
  const sampleTrendData = [45, 52, 48, 61, 55, 67, 72, 68, 75, 82, 79, 88, 85, 91];
  const negativeTrendData = [91, 88, 85, 79, 82, 75, 68, 72, 67, 55, 61, 48, 52, 45];
  const weeklyTrendData = [67, 72, 68, 75, 82, 79, 88];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Metrics Components Demo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Simple Metrics with Trend Indicators */}
          <MetricsSimple
            title="2,450"
            subtitle="Total Revenue"
            type="simple"
            trend="positive"
            change="+12.5%"
            trendData={sampleTrendData}
            trendDays={14}
          />
          
          <MetricsSimple
            title="1,234"
            subtitle="Active Users"
            type="trend"
            trend="negative"
            change="-2.1%"
            trendData={negativeTrendData}
            trendDays={14}
          />
          
          <MetricsSimple
            title="89.2%"
            subtitle="Conversion Rate"
            type="modern"
            trend="positive"
            change="+5.3%"
            trendData={sampleTrendData}
            trendDays={7}
          />
          
          {/* Icon Metrics */}
          <MetricsIcon01
            title="3,456"
            subtitle="Monthly Sales"
          />
          
          <MetricsIcon02
            title="12.5K"
            subtitle="Page Views"
          />
          
          <MetricsIcon03
            title="2,789"
            subtitle="New Customers"
            change="+18.2%"
            changeTrend="positive"
            trendData={sampleTrendData}
            trendDays={14}
          />
          
          <MetricsIcon04
            title="95.8%"
            subtitle="Uptime"
            change="+0.2%"
            changeTrend="positive"
          />
          
          {/* Chart Metrics with Trend Indicators */}
          <MetricsChart01
            title="Revenue Growth"
            subtitle="Last 30 days"
            change="+23.4%"
            trend="positive"
            trendData={sampleTrendData}
            trendDays={14}
          />
          
          <MetricsChart02
            title="User Engagement"
            subtitle="Weekly metrics"
            change="+8.7%"
            changeTrend="positive"
          />
          
          <MetricsChart03
            title="Conversion Rate"
            subtitle="Monthly performance"
            change="+12.1%"
            changeTrend="positive"
            changeDescription="vs last quarter"
          />
          
          <MetricsChart04
            title="Customer Satisfaction"
            subtitle="NPS Score"
            change="+15.3%"
            changeTrend="positive"
            changeDescription="vs last year"
          />

          {/* New Trend-Focused Metrics */}
          <MetricsWithTrend
            title="Daily Active Users"
            subtitle="Last 14 days"
            change="+15.2%"
            changeTrend="positive"
            trendData={sampleTrendData}
            trendDays={14}
            size="lg"
          />

          <MetricsWithTrend
            title="Weekly Retention"
            subtitle="User retention rate"
            change="-3.1%"
            changeTrend="negative"
            trendData={negativeTrendData}
            trendDays={7}
            size="md"
          />

          <MetricsWithTrend
            title="Monthly Churn"
            subtitle="Customer churn rate"
            change="-8.7%"
            changeTrend="positive"
            trendData={weeklyTrendData}
            trendDays={7}
            size="sm"
          />
        </div>

        {/* Trend Indicator Examples Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Trend Indicator Examples</h2>
          <TrendIndicatorExamples />
        </div>
      </div>
    </div>
  );
};
