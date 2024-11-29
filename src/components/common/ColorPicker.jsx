import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { HexColorPicker } from 'react-colorful';

const ColorPicker = ({ label, value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-full h-10 rounded-md border flex items-center px-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div
            className="w-6 h-6 rounded-md mr-2"
            style={{ backgroundColor: value }}
          />
          <span className="text-sm text-gray-600">{value}</span>
        </button>

        {showPicker && (
          <div className="absolute z-10 mt-2">
            <HexColorPicker color={value} onChange={onChange} />
          </div>
        )}
      </div>
    </div>
  );
};

ColorPicker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default ColorPicker;