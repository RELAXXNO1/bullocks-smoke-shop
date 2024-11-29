import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { 
  DevicePhoneMobileIcon, 
  DeviceTabletIcon, 
  ComputerDesktopIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const PreviewToolbar = ({ mode, onModeChange, onReset }) => {
  const devices = [
    { id: 'desktop', icon: ComputerDesktopIcon, label: 'Desktop' },
    { id: 'tablet', icon: DeviceTabletIcon, label: 'Tablet' },
    { id: 'mobile', icon: DevicePhoneMobileIcon, label: 'Mobile' }
  ];

  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex space-x-2">
        {devices.map(({ id, icon: Icon, label }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onModeChange(id)}
            className={`px-3 py-2 rounded-md text-sm flex items-center space-x-2 ${
              mode === id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
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
        onClick={onReset}
        className="px-3 py-2 bg-white text-gray-600 hover:bg-gray-50 rounded-md text-sm flex items-center space-x-2"
      >
        <ArrowPathIcon className="h-5 w-5" />
        <span>Reset Layout</span>
      </motion.button>
    </div>
  );
};

PreviewToolbar.propTypes = {
  mode: PropTypes.oneOf(['desktop', 'tablet', 'mobile']).isRequired,
  onModeChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
};

export default PreviewToolbar;