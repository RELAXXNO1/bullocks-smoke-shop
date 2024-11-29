import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Featured = ({ settings = {} }) => {
  const {
    title = 'Featured Products',
    products = [],
    columns = 4,
    backgroundColor = '#FFFFFF',
    showPrices = true,
    showDescription = true
  } = settings;

  return (
    <div 
      className="py-16"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
        
        <div 
          className="grid gap-6"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium text-gray-900">
                  {product.name}
                </h3>
                
                {showDescription && product.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {product.description}
                  </p>
                )}
                
                {showPrices && (
                  <p className="text-lg font-medium text-gray-900">
                    ${product.price?.toFixed(2)}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

Featured.propTypes = {
  settings: PropTypes.shape({
    title: PropTypes.string,
    products: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      price: PropTypes.number,
      image: PropTypes.string
    })),
    columns: PropTypes.number,
    backgroundColor: PropTypes.string,
    showPrices: PropTypes.bool,
    showDescription: PropTypes.bool
  })
};

export default Featured;