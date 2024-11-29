import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion, useState } from 'framer-motion';

export default function ProductDetailsModal({ product, isOpen, onClose, showAddToCart }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % (product.photos?.length || 1)
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? (product.photos?.length || 1) - 1 : prevIndex - 1
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="absolute right-4 top-4">
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Multi-Image Gallery */}
                {product.photos?.length > 0 && (
                  <div className="relative mb-6">
                    <div className="aspect-w-16 aspect-h-9 relative">
                      <img
                        src={product.photos[currentImageIndex]}
                        alt={`${product.name} - Image ${currentImageIndex + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      {product.photos.length > 1 && (
                        <>
                          <button 
                            onClick={handlePrevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-2 hover:bg-white/75 transition"
                          >
                            <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
                          </button>
                          <button 
                            onClick={handleNextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-2 hover:bg-white/75 transition"
                          >
                            <ChevronRightIcon className="h-6 w-6 text-gray-800" />
                          </button>
                        </>
                      )}
                    </div>
                    {/* Image Thumbnails */}
                    {product.photos.length > 1 && (
                      <div className="flex justify-center mt-4 space-x-2">
                        {product.photos.map((photo, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-12 h-12 rounded-md overflow-hidden border-2 ${
                              index === currentImageIndex 
                                ? 'border-blue-500' 
                                : 'border-transparent opacity-50 hover:opacity-75'
                            }`}
                          >
                            <img 
                              src={photo} 
                              alt={`Thumbnail ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </Dialog.Title>

                <div className="space-y-4">
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.stockStatus === 'out_of_stock' 
                        ? 'bg-red-100 text-red-800'
                        : product.stockStatus === 'almost_out'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {product.stockStatus === 'out_of_stock' 
                        ? 'Out of stock'
                        : product.stockStatus === 'almost_out'
                        ? 'Almost out of stock'
                        : 'In stock'
                      }
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600">{product.description}</p>

                  {/* Product Details */}
                  {product.strain && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Product Details</h4>
                      <dl className="grid grid-cols-1 gap-2">
                        {product.strain && (
                          <div className="flex items-center">
                            <dt className="text-sm text-gray-500 w-24">Strain:</dt>
                            <dd className="text-sm text-gray-900">{product.strain}</dd>
                          </div>
                        )}
                        {product.thcaPercentage && (
                          <div className="flex items-center">
                            <dt className="text-sm text-gray-500 w-24">THCA:</dt>
                            <dd className="text-sm text-gray-900">{product.thcaPercentage}%</dd>
                          </div>
                        )}
                        {product.effects && product.effects.length > 0 && (
                          <div className="flex items-center">
                            <dt className="text-sm text-gray-500 w-24">Effects:</dt>
                            <dd className="flex flex-wrap gap-1">
                              {product.effects.map(effect => (
                                <span key={effect} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {effect}
                                </span>
                              ))}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  )}

                  {/* Call to Action */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                    {showAddToCart && (
                      <button
                        onClick={() => {
                          // Add to cart logic here
                          // toast.success('Added to cart');
                          onClose();
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        disabled={product.stockStatus === 'out_of_stock'}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}