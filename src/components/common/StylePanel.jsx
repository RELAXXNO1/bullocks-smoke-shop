import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import ColorPicker from '../editors/ColorPicker';
import { useLayoutStore } from '../../../../stores/layoutStore';

const StylePanel = () => {
  const { layout, updateComponent } = useLayoutStore();

  const handleThemeChange = (key, value) => {
    updateComponent('theme', {
      ...layout.theme,
      [key]: value
    });
  };

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Theme Settings</h3>
      
      <div className="space-y-4">
        <ColorPicker
          label="Primary Color"
          value={layout.theme?.primaryColor}
          onChange={(color) => handleThemeChange('primaryColor', color)}
        />
        
        <ColorPicker
          label="Background Color"
          value={layout.theme?.backgroundColor}
          onChange={(color) => handleThemeChange('backgroundColor', color)}
        />
      </div>
    </div>
  );
};

export default StylePanel;