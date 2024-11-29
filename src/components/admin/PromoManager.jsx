import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { toast } from 'react-hot-toast';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon 
} from '@heroicons/react/24/outline';

const PromoManager = () => {
  const [promos, setPromos] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    minimumPurchase: '',
    active: true
  });

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      const q = query(collection(db, 'promos'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const promosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPromos(promosData);
    } catch (error) {
      toast.error('Error fetching promotions');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(selectedPromo ? 'Updating promotion...' : 'Creating promotion...');

    try {
      const promoData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minimumPurchase: parseFloat(formData.minimumPurchase) || null,
        updatedAt: new Date(),
        createdAt: selectedPromo ? formData.createdAt : new Date()
      };

      if (selectedPromo) {
        await updateDoc(doc(db, 'promos', selectedPromo.id), promoData);
        toast.success('Promotion updated successfully', { id: toastId });
      } else {
        await addDoc(collection(db, 'promos'), promoData);
        toast.success('Promotion created successfully', { id: toastId });
      }

      fetchPromos();
      resetForm();
    } catch (error) {
      toast.error('Error saving promotion', { id: toastId });
    }
  };

  const handleDelete = async (promoId) => {
    const toastId = toast.loading('Deleting promotion...');
    try {
      await deleteDoc(doc(db, 'promos', promoId));
      toast.success('Promotion deleted successfully', { id: toastId });
      fetchPromos();
    } catch (error) {
      toast.error('Error deleting promotion', { id: toastId });
    }
  };

  const resetForm = () => {
    setSelectedPromo(null);
    setFormData({
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      startDate: '',
      endDate: '',
      minimumPurchase: '',
      active: true
    });
  };

  const handleEdit = (promo) => {
    setSelectedPromo(promo);
    setFormData({
      ...promo,
      discountValue: promo.discountValue.toString(),
      minimumPurchase: promo.minimumPurchase?.toString() || ''
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Promotion Management
        </h1>

        {/* Promo Creation/Edit Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">
            {selectedPromo ? 'Edit Promotion' : 'Create New Promotion'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Promotion Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Type
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Value
                </label>
                <input
                  type="number"
                  required
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  step={formData.discountType === 'percentage' ? '0.1' : '0.01'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Purchase (Optional)
                </label>
                <input
                  type="number"
                  value={formData.minimumPurchase}
                  onChange={(e) => setFormData({ ...formData, minimumPurchase: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">
                  Active Promotion
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              {selectedPromo && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {selectedPromo ? 'Update' : 'Create'} Promotion
              </button>
            </div>
          </form>
        </motion.div>

        {/* Promo List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Active Promotions
            </h2>
          </div>
          {promos.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No promotions created yet
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {promos.map((promo) => (
                <li 
                  key={promo.id} 
                  className="p-6 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {promo.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {promo.description}
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          promo.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {promo.active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {promo.discountType === 'percentage' 
                            ? `${promo.discountValue}% Off` 
                            : `$${promo.discountValue} Off`
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(promo)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit Promotion"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(promo.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Promotion"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PromoManager;
