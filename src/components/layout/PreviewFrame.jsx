import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const PreviewFrame = ({ width, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 mx-auto"
      style={{ width }}
    >
      <div className="relative">
        {children}
      </div>
    </motion.div>
  );
};

PreviewFrame.propTypes = {
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  children: PropTypes.node.isRequired
};

export default PreviewFrame;