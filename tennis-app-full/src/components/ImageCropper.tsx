import React, { useState, useRef, useCallback } from 'react';
import { X, RotateCw, ZoomIn, ZoomOut, Check, Move } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
  aspectRatio: number;
  cropType: 'avatar' | 'cover';
}

export function ImageCropper({ imageSrc, onCropComplete, onCancel, aspectRatio, cropType }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragType, setDragType] = useState<'crop' | 'image'>('crop');
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize crop area when image loads
  const handleImageLoad = useCallback(() => {
    if (imageRef.current && containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // Calculate initial crop dimensions based on aspect ratio
      let cropWidth, cropHeight;
      if (aspectRatio > 1) {
        // Wide image (cover)
        cropWidth = Math.min(containerWidth * 0.8, containerWidth);
        cropHeight = cropWidth / aspectRatio;
      } else {
        // Tall image (avatar)
        cropHeight = Math.min(containerHeight * 0.8, containerHeight);
        cropWidth = cropHeight * aspectRatio;
      }

      // Center the crop area
      const x = Math.max(0, (containerWidth - cropWidth) / 2);
      const y = Math.max(0, (containerHeight - cropHeight) / 2);

      setCrop({ x, y, width: cropWidth, height: cropHeight });
      
      // Center the image initially
      setImagePosition({ x: 0, y: 0 });
    }
  }, [aspectRatio]);

  // Handle mouse events for dragging crop area
  const handleMouseDown = (e: React.MouseEvent, type: 'crop' | 'image') => {
    e.preventDefault();
    e.stopPropagation();
    
    if (type === 'crop') {
      setIsDragging(true);
      setDragType('crop');
      setDragStart({ x: e.clientX - crop.x, y: e.clientY - crop.y });
    } else {
      setIsDraggingImage(true);
      setDragType('image');
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging && !isDraggingImage) return;
    e.preventDefault();
    
    if (dragType === 'crop' && isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Constrain crop area within container bounds
      if (containerRef.current) {
        const maxX = Math.max(0, containerRef.current.clientWidth - crop.width);
        const maxY = Math.max(0, containerRef.current.clientHeight - crop.height);
        
        setCrop(prev => ({
          ...prev,
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        }));
      }
    } else if (dragType === 'image' && isDraggingImage) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Allow image to move within reasonable bounds
      const maxOffset = 200; // Maximum pixels the image can move
      setImagePosition({
        x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
        y: Math.max(-maxOffset, Math.min(maxOffset, newY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsDraggingImage(false);
  };

  // Handle zoom controls
  const handleZoomIn = () => setScale(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev / 1.2, 0.5));

  // Handle rotation
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  // Reset image position
  const handleResetPosition = () => {
    setImagePosition({ x: 0, y: 0 });
    setScale(1);
    setRotation(0);
  };

  // Apply crop and generate final image
  const handleApplyCrop = () => {
    try {
      if (!imageRef.current || !canvasRef.current || !containerRef.current) {
        console.error('Required refs not available');
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Could not get canvas context');
        return;
      }

      const img = imageRef.current;
      const container = containerRef.current;

      // Set canvas size to target dimensions
      let outputWidth, outputHeight;
      
      if (cropType === 'avatar') {
        outputWidth = 256;
        outputHeight = 256;
      } else {
        outputWidth = 1200;
        outputHeight = Math.round(1200 / aspectRatio);
      }

      canvas.width = outputWidth;
      canvas.height = outputHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate scale factors
      const scaleX = img.naturalWidth / container.clientWidth;
      const scaleY = img.naturalHeight / container.clientHeight;
      
      // Calculate source coordinates, taking into account image position
      const sourceX = (crop.x - imagePosition.x) * scaleX;
      const sourceY = (crop.y - imagePosition.y) * scaleY;
      const sourceWidth = crop.width * scaleX;
      const sourceHeight = crop.height * scaleY;

      // Draw cropped image to canvas
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, outputWidth, outputHeight
      );

      // Convert to base64 and call callback
      const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
      onCropComplete(croppedImage);
    } catch (error) {
      console.error('Error during cropping:', error);
      // Fallback: just pass the original image
      onCropComplete(imageSrc);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">
            Crop {cropType === 'avatar' ? 'Profile Picture' : 'Cover Image'}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Image Container */}
        <div className="p-4">
          <div 
            ref={containerRef}
            className="relative overflow-hidden bg-gray-100 rounded-lg"
            style={{ 
              width: cropType === 'avatar' ? '400px' : '600px',
              height: cropType === 'avatar' ? '400px' : '300px',
              margin: '0 auto'
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop preview"
              className="w-full h-full object-contain cursor-move"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                transformOrigin: 'center',
                transition: isDraggingImage ? 'none' : 'transform 0.1s ease-out'
              }}
              onLoad={handleImageLoad}
              onMouseDown={(e) => handleMouseDown(e, 'image')}
              onError={(e) => {
                console.error('Image failed to load:', e);
                onCancel();
              }}
            />

            {/* Crop Overlay */}
            {crop.width > 0 && crop.height > 0 && (
              <div
                className="absolute border-2 border-white shadow-lg cursor-move"
                style={{
                  left: crop.x,
                  top: crop.y,
                  width: crop.width,
                  height: crop.height,
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                }}
                onMouseDown={(e) => handleMouseDown(e, 'crop')}
              />
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="px-4 py-2 bg-blue-50 border-l-4 border-blue-400">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Drag the image to reposition it, or drag the crop area to move it. 
            Use zoom and rotate to fine-tune your selection.
          </p>
        </div>

        {/* Controls */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="p-2 border rounded hover:bg-gray-100 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 border rounded hover:bg-gray-100 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleRotate}
                className="p-2 border rounded hover:bg-gray-100 transition-colors"
                title="Rotate"
              >
                <RotateCw className="h-4 w-4" />
              </button>

              <button
                onClick={handleResetPosition}
                className="p-2 border rounded hover:bg-gray-100 transition-colors"
                title="Reset Position"
              >
                <Move className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={onCancel}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleApplyCrop}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Apply Crop
              </button>
            </div>
          </div>
        </div>

        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
