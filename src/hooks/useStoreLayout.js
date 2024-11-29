import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const defaultLayout = {
  components: [
    { id: 'hero', name: 'Hero Banner', visible: true, order: 0 },
    { id: 'categories', name: 'Categories Grid', visible: true, order: 1 },
    { id: 'featured', name: 'Featured Products', visible: true, order: 2 }
  ],
  theme: {
    primaryColor: '#3B82F6',
    backgroundColor: '#F3F4F6'
  }
};

export const useStoreLayout = () => {
  const [layout, setLayout] = useState(defaultLayout);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'settings', 'layout'),
      (doc) => {
        if (doc.exists()) {
          setLayout(doc.data());
        } else {
          setLayout(defaultLayout);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching layout:', error);
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { layout, loading, error };
};