import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { LocalPhotoBank } from '../../utils/localPhotoBank';
import toast from 'react-hot-toast';

export default function PhotoSelector({ value = '', onChange, category = 'products' }) {
  const [photos, setPhotos] = useState([]);
  const [showPhotoBank, setShowPhotoBank] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const categoryPhotos = await LocalPhotoBank.getAllPhotos(category);
      setPhotos(categoryPhotos);
      setShowPhotoBank(true);
    } catch (error) {
      console.error('Error loading photos:', error);
      toast.error('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (photo) => {
    onChange(photo.url);
    setShowPhotoBank(false);
  };

  return (
    <div className="space-y-4">
      {/* Preview of selected photo */}
      {value && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-square"
        >
          <img
            src={value}
            alt="Selected"
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg"
          >
            <XMarkIcon className="h-4 w-4 text-gray-500" />
          </button>
        </motion.div>
      )}

      {/* Photo selection button */}
      <button
        onClick={loadPhotos}
        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center"
      >
        <PhotoIcon className="h-5 w-5 mr-2" />
        Select from Photo Bank
      </button>

      {/* Photo Bank Modal */}
      <AnimatePresence>
        {showPhotoBank && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl max-w-2xl w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Select Photo</h3>
                <button
                  onClick={() => setShowPhotoBank(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {photos.map((photo) => (
                    <motion.button
                      key={photo.id}
                      onClick={() => handlePhotoSelect(photo)}
                      whileHover={{ scale: 1.05 }}
                      className="relative aspect-square group"
                    >
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          Select
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500">No photos available</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}