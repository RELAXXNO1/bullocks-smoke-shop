import React from 'react';
import { motion } from 'framer-motion';
import { useLayoutStore } from '../../../stores.jsx/layoutStore';
import { 
  DevicePhoneMobileIcon, 
  DeviceTabletIcon, 
  ComputerDesktopIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const EditorToolbar = () => {
  const { previewMode, setPreviewMode, resetLayout, hasChanges } = useLayoutStore();

  const devices = [
    { id: 'desktop', icon: ComputerDesktopIcon, label: 'Desktop' },
    { id: 'tablet', icon: DeviceTabletIcon, label: 'Tablet' },
    { id: 'mobile', icon: DevicePhoneMobileIcon, label: 'Mobile' }
  ];

  return (
    <div className="sticky top-0 z-10 bg-white border-b px-4 py-2 flex items-center justify-between">
      <div className="flex space-x-2">
        {devices.map(({ id, icon: Icon, label }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPreviewMode(id)}
            className={`px-3 py-2 rounded-md text-sm flex items-center space-x-2 ${
              previewMode === id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </motion.button>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={resetLayout}
        disabled={!hasChanges}
        className={`px-3 py-2 rounded-md text-sm flex items-center space-x-2 ${
          hasChanges
            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
        }`}
      >
        <ArrowPathIcon className="h-5 w-5" />
        <span>Reset Layout</span>
      </motion.button>
    </div>
  );
};

export default EditorToolbar;