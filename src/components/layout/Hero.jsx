import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Hero = ({ settings = {} }) => {
  const {
    backgroundImage,
    backgroundColor = '#1F2937',
    heading = 'Welcome',
    subheading = 'Discover our products',
    overlay = true,
    overlayOpacity = 0.5,
    textAlignment = 'center',
    height = '70vh'
  } = settings;

  return (
    <div 
      className="relative bg-cover bg-center flex items-center"
      style={{ 
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundColor,
        height
      }}
    >
      {overlay && backgroundImage && (
        <div 
          className="absolute inset-0 bg-black transition-opacity"
          style={{ opacity: overlayOpacity }}
        />
      )}

      <div className={`relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-${textAlignment}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white"
        >
          <h1 
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-4"
            dangerouslySetInnerHTML={{ __html: heading }}
          />
          <p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: subheading }}
          />
        </motion.div>
      </div>
    </div>
  );
};

Hero.propTypes = {
  settings: PropTypes.shape({
    backgroundImage: PropTypes.string,
    backgroundColor: PropTypes.string,
    heading: PropTypes.string,
    subheading: PropTypes.string,
    overlay: PropTypes.bool,
    overlayOpacity: PropTypes.number,
    textAlignment: PropTypes.oneOf(['left', 'center', 'right']),
    height: PropTypes.string
  })
};

export default Hero;