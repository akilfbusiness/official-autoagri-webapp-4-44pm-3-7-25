import React, { useState, useRef } from 'react';
import { Upload, X, ZoomIn, ZoomOut, RotateCw, Trash2, Eye } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  disabled = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = async (file: File): Promise<string> => {
    try {
      setIsCompressing(true);
      
      // Dynamic import to avoid build issues
      const imageCompression = (await import('browser-image-compression')).default;
      
      const options = {
        maxSizeMB: 0.5, // Maximum file size in MB
        maxWidthOrHeight: 1920, // Maximum width or height
        useWebWorker: true,
        quality: 0.8, // Image quality (0.1 to 1)
      };

      const compressedFile = await imageCompression(file, options);
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(compressedFile);
      });
    } catch (error) {
      console.error('Error compressing image:', error);
      // Fallback: use original file without compression
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    try {
      const compressedBase64 = await compressImage(file);
      onChange(compressedBase64);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = () => {
    onChange(undefined);
  };

  const openModal = () => {
    setIsModalOpen(true);
    setZoom(1);
    setRotation(0);
    setTranslateX(0);
    setTranslateY(0);
    setIsDragging(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setZoom(1);
    setRotation(0);
    setTranslateX(0);
    setTranslateY(0);
    setIsDragging(false);
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newZoom = Math.max(zoom - 0.25, 0.5);
    setZoom(newZoom);
    
    // Reset translation when zooming back to 1x or less
    if (newZoom <= 1) {
      setTranslateX(0);
      setTranslateY(0);
    }
  };

  const handleRotate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRotation(prev => (prev + 90) % 360);
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return; // Only allow dragging when zoomed in
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - translateX,
      y: e.clientY - translateY,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const newTranslateX = e.clientX - dragStart.x;
    const newTranslateY = e.clientY - dragStart.y;
    
    setTranslateX(newTranslateX);
    setTranslateY(newTranslateY);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Touch drag handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom <= 1) return; // Only allow dragging when zoomed in
    
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - translateX,
      y: touch.clientY - translateY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || zoom <= 1) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    const newTranslateX = touch.clientX - dragStart.x;
    const newTranslateY = touch.clientY - dragStart.y;
    
    setTranslateX(newTranslateX);
    setTranslateY(newTranslateY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
        {value ? (
          <div className="space-y-3">
            {/* Image Preview */}
            <div className="relative">
              <img
                src={value}
                alt={label}
                className="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                onClick={openModal}
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  type="button"
                  onClick={openModal}
                  className="p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  title="View full size"
                >
                  <Eye className="h-3 w-3" />
                </button>
                {!disabled && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="p-1 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Delete image"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {!disabled && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isCompressing}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="h-4 w-4" />
                  {isCompressing ? 'Processing...' : 'Replace'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            {!disabled ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
                className="flex flex-col items-center justify-center w-full py-6 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">
                  {isCompressing ? 'Processing image...' : `Upload ${label}`}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Click to select image (max 10MB)
                </span>
              </button>
            ) : (
              <div className="flex flex-col items-center justify-center w-full py-6 text-gray-400">
                <Upload className="h-8 w-8 mb-2" />
                <span className="text-sm">No image uploaded</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isCompressing}
      />

      {/* Image Modal */}
      {isModalOpen && value && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-4xl max-h-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
              <h3 className="text-white font-medium">{label}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  title="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-white text-sm px-2">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  title="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  title="Rotate"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCloseModal}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Image Container */}
            <div className="flex items-center justify-center min-h-[400px] max-h-[80vh] overflow-hidden">
              <img
                src={value}
                alt={label}
                className={`max-w-full max-h-full object-contain transition-transform duration-200 ${
                  zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                } ${isDragging ? 'cursor-grabbing' : ''}`}
                style={{
                  transform: `translate(${translateX}px, ${translateY}px) scale(${zoom}) rotate(${rotation}deg)`,
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                draggable={false}
              />
            </div>

            {/* Instructions */}
            {zoom > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                Click and drag to move the image
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};