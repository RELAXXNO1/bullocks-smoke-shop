import Compressor from 'compressorjs';

export const imageProcessor = {
  compress: (file, options = {}) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.8,
        maxWidth: 1920,
        maxHeight: 1920,
        ...options,
        success: resolve,
        error: reject,
      });
    });
  },

  autoCrop: (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;
        
        // Set target dimensions
        let targetWidth = img.width;
        let targetHeight = img.height;
        
        // If image is too wide, crop width
        if (aspectRatio > 1) {
          targetWidth = img.height;
        }
        // If image is too tall, crop height
        else if (aspectRatio < 1) {
          targetHeight = img.width;
        }
        
        // Calculate crop position to center the image
        const x = (img.width - targetWidth) / 2;
        const y = (img.height - targetHeight) / 2;
        
        // Set canvas dimensions
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // Draw cropped image
        ctx.drawImage(img, x, y, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
        
        // Convert to blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, file.type, 0.95);
      };
      
      img.src = URL.createObjectURL(file);
    });
  },

  processImage: async (file) => {
    // First compress the image
    const compressedFile = await imageProcessor.compress(file);
    
    // Then auto-crop to square
    const croppedBlob = await imageProcessor.autoCrop(compressedFile);
    
    // Add the original filename to the blob
    croppedBlob.name = file.name;
    
    return croppedBlob;
  }
};