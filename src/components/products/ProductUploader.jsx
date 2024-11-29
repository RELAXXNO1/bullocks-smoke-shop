import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import Papa from 'papaparse';

function ProductUploader() {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const processFile = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          toast.error('Error parsing CSV file');
          console.error('CSV parsing errors:', results.errors);
          return;
        }

        setPreview({
          headers: Object.keys(results.data[0]),
          sample: results.data.slice(0, 3),
          total: results.data.length,
          data: results.data
        });
      },
      error: (error) => {
        toast.error('Error processing file');
        console.error('CSV parsing error:', error);
      }
    });
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    multiple: false
  });

  const uploadProducts = async () => {
    if (!preview?.data) return;

    setUploading(true);
    const uploadToast = toast.loading('Uploading products...');

    try {
      const batch = writeBatch(db);
      const productsRef = collection(db, 'products');

      preview.data.forEach((product) => {
        // Skip empty rows
        if (!product.name || !product.price) return;

        const docRef = doc(productsRef);
        batch.set(docRef, {
          ...product,
          price: parseFloat(product.price) || 0,
          stock: parseInt(product.stock) || 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });

      await batch.commit();
      toast.success(`Successfully uploaded ${preview.data.length} products`, {
        id: uploadToast,
      });
      setPreview(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading products: ' + error.message, {
        id: uploadToast,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Product Uploader</h2>
          <p className="mt-2 text-gray-600">Upload your product data in CSV format</p>
        </div>

        <div
          {...getRootProps()}
          className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          <input {...getInputProps()} />
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive ? 'Drop the file here' : 'Drag & drop a CSV file here, or click to select'}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Required columns: name, price, category, description
          </p>
        </div>

        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8"
          >
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Preview</h3>
              <p className="text-sm text-gray-600">Total products: {preview.total}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {preview.headers.map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {preview.sample.map((row, idx) => (
                    <tr key={idx}>
                      {preview.headers.map((header) => (
                        <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setPreview(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={uploadProducts}
                disabled={uploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 text-sm font-medium transition-colors"
              >
                {uploading ? 'Uploading...' : 'Upload Products'}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default ProductUploader;