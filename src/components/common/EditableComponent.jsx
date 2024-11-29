import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { PencilIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

const EditableComponent = memo(({ id, children, isSelected, onClick }) => {
  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClick(id);
  };

  return (
    <motion.div
      className={`relative group cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={handleClick}
      whileHover={{ scale: 1.01 }}
    >
      <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity ${
        isSelected ? 'bg-opacity-5' : ''
      }`}>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-1 bg-white rounded-full shadow-lg hover:bg-gray-50"
            onClick={handleClick}
          >
            <PencilIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="pointer-events-none">
        {children}
      </div>
    </motion.div>
  );
});

EditableComponent.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

EditableComponent.displayName = 'EditableComponent';
export default EditableComponent;
