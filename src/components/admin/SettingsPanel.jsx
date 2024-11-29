import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ComponentPanel from './ComponentPanel';
import StylePanel from './StylePanel';

const SettingsPanel = ({ selectedComponent, onClose }) => {
  if (!selectedComponent) return null;

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="w-80 bg-white border-l shadow-lg overflow-hidden"
    >
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="flex items-center justify-between p-4">
          <h3 className="text-lg font-medium text-gray-900">
            Edit {selectedComponent.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh-57px)]">
        {selectedComponent.id === 'theme' ? (
          <StylePanel />
        ) : (
          <ComponentPanel component={selectedComponent} />
        )}
      </div>
    </motion.div>
  );
};

SettingsPanel.propTypes = {
  selectedComponent: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    settings: PropTypes.object
  }),
  onClose: PropTypes.func.isRequired
};

export default SettingsPanel;