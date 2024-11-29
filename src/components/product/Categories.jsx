import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Categories = ({ settings = {} }) => {
  const {
    categories = [],
    columns = 3,
    gap = 6,
    aspectRatio = 'square',
    showLabels = true,
    backgroundColor = '#F3F4F6'
  } = settings;

  return (
    <div 
      className="py-16"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="grid gap-6"
          style={{ 
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap: `${gap * 0.25}rem`
          }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={category.path || '#'} 
                className="block group"
              >
                <div className={`relative ${
                  aspectRatio === 'square' 
                    ? 'aspect-w-1 aspect-h-1' 
                    : 'aspect-w-16 aspect-h-9'
                }`}>
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xl">No Image</span>
                    </div>
                  )}
                  
                  {showLabels && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg">
                      <h3 className="text-xl font-bold text-white">
                        {category.name}
                      </h3>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

Categories.propTypes = {
  settings: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string.isRequired,
      path: PropTypes.string,
      image: PropTypes.string
    })),
    columns: PropTypes.number,
    gap: PropTypes.number,
    aspectRatio: PropTypes.oneOf(['square', 'video']),
    showLabels: PropTypes.bool,
    backgroundColor: PropTypes.string
  })
};

export default Categories;