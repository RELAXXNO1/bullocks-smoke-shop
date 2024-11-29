import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../hooks/useAnalytics';
import VisitorChart from './Analytics/VisitorChart';
import StatCard from './Analytics/StatCard';
import CategoryDistribution from './Analytics/CategoryDistribution';
import PopularProducts from './Analytics/PopularProducts';
import { 
  UsersIcon, 
  ShoppingCartIcon, 
  CursorArrowRaysIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('week');
  const { stats, visitorData, categoryData, popularProducts, loading, error } = useAnalytics(timeRange);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats?.map((stat, index) => (
          <StatCard key={stat.id} stat={stat} index={index} />
        ))}
      </div>

      {/* Traffic Overview */}
      {visitorData && <VisitorChart data={visitorData} />}

      {/* Category Distribution and Popular Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categoryData && <CategoryDistribution data={categoryData} />}
        {popularProducts && <PopularProducts data={popularProducts} />}
      </div>
    </div>
  );
}