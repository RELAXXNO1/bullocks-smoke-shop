import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Topicals',
    products: [
      'Roll on lotion',
      'Roll on lotion w menthol'
    ]
  },
  {
    name: 'Edibles',
    products: [
      'Gummies',
      'Sleep gummies',
      'Capsules'
    ]
  },
  {
    name: 'Flower',
    products: [
      'CBD hemp flower'
    ]
  },
  {
    name: 'Tinctures',
    products: [
      'Tinctures and droppers'
    ]
  },
  {
    name: 'Brands',
    products: [
      'Just CBD',
      'Space gods',
      'Moon buzz',
      '3chi',
      'Woodstock live resin',
      'Jolly',
      'Urb'
    ]
  }
];

function CBD() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">CBD Products</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
              <ul className="space-y-2">
                {category.products.map((product, idx) => (
                  <li key={idx} className="text-gray-600">{product}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default CBD;