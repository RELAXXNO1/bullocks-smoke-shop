import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { motion } from 'framer-motion';
import { useStoreSettings } from '../../hooks/useStoreSettings';
import toast from 'react-hot-toast';
import InfoTooltip from './InfoTooltip';
import ConfirmDialog from './ConfirmDialog';

export default function StoreSettings() {
  const { settings, loading } = useStoreSettings();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleToggleFeature = (feature) => {
    setLocalSettings(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }));
  };

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'settings', 'store'), localSettings);
      toast.success('Store settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  const handleReset = async () => {
    try {
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
        }
      };
      
      await setDoc(doc(db, 'settings', 'store'), defaultSettings);
      setLocalSettings(defaultSettings);
      toast.success('Settings reset to default');
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast.error('Failed to reset settings');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Store Settings</h3>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Feature Toggles */}
      <section className="bg-white rounded-lg shadow p-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Features</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Shopping Cart</span>
              <InfoTooltip content="Enable/disable the shopping cart functionality" />
            </div>
            <button
              onClick={() => handleToggleFeature('cart')}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                localSettings.features?.cart ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  localSettings.features?.cart ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Add more feature toggles as needed */}
        </div>
      </section>

      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
        title="Reset Settings"
        message="Are you sure you want to reset all store settings to their default values? This action cannot be undone."
        type="warning"
      />
    </div>
  );
}