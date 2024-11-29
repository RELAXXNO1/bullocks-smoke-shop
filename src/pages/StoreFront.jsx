import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { toast } from 'react-hot-toast';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const PromoPopup = () => {
  const [activePromos, setActivePromos] = useState([]);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const fetchActivePromos = useCallback(async (retryCount = 0) => {
    try {
      const now = new Date();
      const q = query(
        collection(db, 'promos'),
        where('active', '==', true),
        where('startDate', '<=', now.toISOString()),
        where('endDate', '>=', now.toISOString())
      );

      const querySnapshot = await getDocs(q);
      const promosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (promosData.length > 0) {
        setActivePromos(promosData);
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Error fetching active promotions', error);
      
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => {
          fetchActivePromos(retryCount + 1);
        }, RETRY_DELAY * Math.pow(2, retryCount));
      } else {
        toast.error('Failed to load promotions');
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchActivePromos();
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [fetchActivePromos]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleNextPromo = useCallback(() => {
    setCurrentPromoIndex(prevIndex => 
      (prevIndex + 1) % activePromos.length
    );
  }, [activePromos.length]);

  const currentPromo = useMemo(() => 
    activePromos[currentPromoIndex],
    [activePromos, currentPromoIndex]
  );

  if (!isVisible || !currentPromo) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="fixed z-[100] bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
      >
        <div className="relative">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-xl">
              <h2 className="text-xl font-bold">{currentPromo.title}</h2>
            </div>

            <div className="p-4">
              <p className="text-gray-600 mb-4">{currentPromo.description}</p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-blue-600">
                  {currentPromo.discountType === 'percentage' 
                    ? `${currentPromo.discountValue}% OFF` 
                    : `$${currentPromo.discountValue} OFF`
                  }
                </span>
                
                {currentPromo.minimumPurchase && (
                  <span className="text-sm text-gray-500">
                    Min. purchase: ${currentPromo.minimumPurchase}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Valid until: {new Date(currentPromo.endDate).toLocaleDateString()}
                </span>
                
                {activePromos.length > 1 && (
                  <button 
                    onClick={handleNextPromo}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Next Promo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(PromoPopup);