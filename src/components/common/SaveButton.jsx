import React from 'react';
import { motion } from 'framer-motion';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useLayoutStore } from '../../../stores.jsx/layoutStore';
import toast from 'react-hot-toast';

const SaveButton = () => {
  const { saveLayout, hasChanges } = useLayoutStore();

  const handleSave = async () => {
    const toastId = toast.loading('Saving changes...');
    try {
      await saveLayout();
      toast.success('Layout updated successfully', { id: toastId });
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save changes', { id: toastId });
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSave}
      disabled={!hasChanges}
      className={`fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 transition-colors ${
        hasChanges 
          ? 'bg-blue-600 text-white hover:bg-blue-700' 
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
      }`}
    >
      <CloudArrowUpIcon className="h-5 w-5" />
      <span>Update Store</span>
    </motion.button>
  );
};

export default SaveButton;
