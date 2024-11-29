import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';

const defaultSettings = {
  features: {
    cart: false,
    userAccounts: true,
    reviews: false,
    wishlist: false
  },
  theme: {
    primaryColor: '#3B82F6',
    backgroundColor: '#F3F4F6'
  },
  info: {
    name: 'Bullocks Smoke Shop',
    address: '400 Vernonview Dr\nMt Vernon, OH 43050',
    phone: '(740) 830-6002',
    email: 'info@bullocksmokeshop.com'
  }
};

export function useStoreSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'settings', 'store'),
      (doc) => {
        if (doc.exists()) {
          setSettings(doc.data());
        } else {
          setSettings(defaultSettings);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching store settings:', error);
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { settings, loading, error };
}