import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PhotoIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function PhotoSelector({ value, onChange, multiple = false, category }) {
  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      // Handle each file
      for (const file of acceptedFiles) {
        // Basic validation
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`);
          continue;
        }

        // Create object URL for preview
        const url = URL.createObjectURL(file);
        onChange(url);
      }
    } catch (error) {
      console.error('Error handling file upload:', error);
      toast.error('Failed to process uploaded file(s)');
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
    >
      <input {...getInputProps()} />
      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive ? (
          "Drop the files here..."
        ) : (
          <>
            Drag & drop images here, or click to select
            {multiple && <span className="block text-xs text-gray-500 mt-1">You can select multiple files</span>}
          </>
        )}
      </p>
    </div>
  );
}
