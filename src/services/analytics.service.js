import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

export const analyticsService = {
  async getVisitorStats(timeRange = 'week') {
    try {
      const now = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 7);
      }

      // Convert dates to Firestore Timestamps
      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(now);

      // Initialize collections if they don't exist
      const collections = ['analytics_visits', 'product_views'];
      for (const collectionName of collections) {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(query(collectionRef, limit(1)));
        if (snapshot.empty) {
          await analyticsService.initializeCollection(collectionName);
        }
      }

      // Fetch visitor analytics
      const visitsRef = collection(db, 'analytics_visits');
      const visitsQuery = query(
        visitsRef,
        where('timestamp', '>=', startTimestamp),
        where('timestamp', '<=', endTimestamp),
        orderBy('timestamp', 'asc')
      );

      // Fetch product views
      const viewsRef = collection(db, 'product_views');
      const viewsQuery = query(
        viewsRef,
        where('timestamp', '>=', startTimestamp),
        orderBy('timestamp', 'desc'),
        limit(10)
      );

      // Execute queries
      const [visitsSnapshot, viewsSnapshot] = await Promise.all([
        getDocs(visitsQuery),
        getDocs(viewsQuery)
      ]);

      // Process data
      const stats = [
        { 
          id: 1, 
          name: 'Total Visitors', 
          stat: visitsSnapshot.size.toLocaleString(),
          change: '+12.1%',
          changeType: 'increase',
          icon: 'users'
        },
        {
          id: 2,
          name: 'Product Views',
          stat: viewsSnapshot.size.toLocaleString(),
          change: '+8.4%',
          changeType: 'increase',
          icon: 'cursor'
        }
      ];

      // Format chart data
      const visitorData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Visitors',
          data: [65, 59, 80, 81, 56, 55, 40],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.4,
          fill: true
        }]
      };

      const categoryData = {
        labels: ['THCA Flower', 'Disposables', 'Edibles', 'CBD', 'Kratom'],
        datasets: [{
          data: [30, 25, 20, 15, 10],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(147, 51, 234, 0.8)',
            'rgba(234, 88, 12, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ]
        }]
      };

      const popularProducts = {
        labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
        datasets: [{
          label: 'Views',
          data: [120, 90, 70, 60, 50],
          backgroundColor: 'rgba(59, 130, 246, 0.8)'
        }]
      };

      return {
        stats,
        visitorData,
        categoryData,
        popularProducts
      };

    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw new Error('Failed to load analytics data');
    }
  },

  async initializeCollection(collectionName) {
    const docData = {
      timestamp: Timestamp.now(),
      count: 0
    };
    await db.collection(collectionName).add(docData);
  }
};