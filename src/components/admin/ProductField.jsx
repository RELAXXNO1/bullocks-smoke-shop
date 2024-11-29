import { useEffect, useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import ImageUploader from '../common/ImageUploader';
import RichTextEditor from '../common/RichTextEditor';
import ColorPicker from '../common/ColorPicker';

export default function ProductField({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  required = false,
  options = [],
  placeholder = '',
  className = '',
  error = ''
}) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(name, newValue);
  };

  const handleImageChange = (imageUrl) => {
    setLocalValue(imageUrl);
    onChange(name, imageUrl);
  };

  const handleRichTextChange = (content) => {
    setLocalValue(content);
    onChange(name, content);
  };

  const handleColorChange = (color) => {
    setLocalValue(color);
    onChange(name, color);
  };

  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            name={name}
            value={localValue || ''}
            onChange={handleChange}
            required={required}
            placeholder={placeholder}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${className}`}
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            name={name}
            value={localValue || ''}
            onChange={handleChange}
            required={required}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${className}`}
          >
            <option value="">{placeholder || 'Select an option'}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'image':
        return (
          <div className="mt-1">
            <ImageUploader
              value={localValue}
              onChange={handleImageChange}
              placeholder={
                <div className="flex items-center justify-center">
                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">Upload Image</span>
                </div>
              }
            />
          </div>
        );

      case 'richtext':
        return (
          <div className="mt-1">
            <RichTextEditor
              value={localValue || ''}
              onChange={handleRichTextChange}
              placeholder={placeholder}
            />
          </div>
        );

      case 'color':
        return (
          <div className="mt-1">
            <ColorPicker
              color={localValue || '#000000'}
              onChange={handleColorChange}
            />
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            name={name}
            value={localValue || ''}
            onChange={handleChange}
            required={required}
            placeholder={placeholder}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${className}`}
          />
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={localValue || ''}
            onChange={handleChange}
            required={required}
            placeholder={placeholder}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${className}`}
          />
        );
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
