import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { convertToBase64, validateImageFile, compressImage } from '../utils/imageUtils';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onImageUpload: (imageBase64: string, file: File) => void;
  onImageRemove: () => void;
  uploadedImage: string | null;
  isAnalyzing: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  onImageRemove,
  uploadedImage,
  isAnalyzing
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Compress image if needed
      const compressedFile = await compressImage(file);
      const base64 = await convertToBase64(compressedFile);
      
      onImageUpload(base64, compressedFile);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-purple-400" />
        Image Analysis
      </h2>

      <AnimatePresence mode="wait">
        {uploadedImage ? (
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-500/20">
              <img 
                src={uploadedImage} 
                alt="Uploaded" 
                className="w-full h-64 object-cover"
              />
              
              {(isAnalyzing || isProcessing) && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
                    <p className="text-white text-sm">
                      {isProcessing ? 'Processing...' : 'Analyzing image...'}
                    </p>
                  </div>
                </div>
              )}
              
              <motion.button
                onClick={onImageRemove}
                className="absolute top-3 right-3 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            {...getRootProps()}
            className={`
              relative p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
              ${isDragActive 
                ? 'border-purple-400 bg-purple-500/10' 
                : 'border-purple-500/30 hover:border-purple-400/50 bg-gradient-to-br from-purple-500/5 to-blue-500/5'
              }
              backdrop-blur-sm
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <input {...getInputProps()} />
            
            <div className="text-center">
              <motion.div
                animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              </motion.div>
              
              <h3 className="text-lg font-medium text-white mb-2">
                {isDragActive ? 'Drop your image here' : 'Upload an image to analyze'}
              </h3>
              
              <p className="text-gray-400 text-sm mb-4">
                Drag & drop an image or click to browse
              </p>
              
              <div className="text-xs text-gray-500">
                Supports JPEG, PNG, WebP • Max 10MB
              </div>
            </div>

            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
                  <p className="text-white text-sm">Processing image...</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};