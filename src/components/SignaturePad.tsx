import React, { useRef, useEffect, useState } from 'react';
import { PenTool, RotateCcw, Trash2 } from 'lucide-react';

interface SignaturePadProps {
  value?: string;
  onChange: (signature: string | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Sign here",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if device is mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Function to set canvas dimensions and redraw content
    const setCanvasDimensionsAndRedraw = () => {
      // Get the container's actual size
      const rect = container.getBoundingClientRect();
      
      // Set internal canvas resolution to match its displayed size
      // This is crucial for making the drawing area match the visible area
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Clear canvas and set background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set drawing styles
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Load existing signature if provided
      if (value) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setHasSignature(true);
        };
        img.src = value;
      } else {
        setHasSignature(false);
      }
    };

    // Initial setup
    setCanvasDimensionsAndRedraw();

    // Add resize observer to handle dynamic resizing
    const resizeObserver = new ResizeObserver(() => {
      setCanvasDimensionsAndRedraw();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [value]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    
    // Prevent default behavior to stop scrolling on touch devices
    if (isMobile && 'touches' in e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return;
    
    // Prevent default behavior to stop scrolling on touch devices
    if (isMobile && 'touches' in e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const { x, y } = getCoordinates(e);

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    // Prevent default behavior if event is provided
    if (e && isMobile && 'touches' in e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setIsDrawing(false);
    setHasSignature(true);
    
    // Save signature as base64
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      onChange(dataURL);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    setHasSignature(false);
    onChange(undefined);
  };

  // Enhanced touch event handling for mobile devices
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      
      setIsDrawing(true);
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      const touch = e.touches[0];
      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDrawing || disabled) return;
      e.preventDefault();
      e.stopPropagation();
      
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      const touch = e.touches[0];
      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      e.stopPropagation();
      
      setIsDrawing(false);
      setHasSignature(true);
      
      const dataURL = canvas.toDataURL('image/png');
      onChange(dataURL);
    };

    // Add event listeners with passive: false to ensure preventDefault works
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [disabled, isDrawing, onChange, isMobile]);

  return (
    <div className="space-y-3">
      <div 
        ref={containerRef}
        className={`relative border-2 border-dashed rounded-lg overflow-hidden ${
          disabled ? 'border-gray-200 bg-gray-50' : 'border-gray-300 hover:border-gray-400'
        }`} 
        style={{ height: '200px', width: '100%' }}
      >
        <canvas
          ref={canvasRef}
          className={`block w-full h-full ${disabled ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
          onMouseDown={!isMobile ? startDrawing : undefined}
          onMouseMove={!isMobile ? draw : undefined}
          onMouseUp={!isMobile ? stopDrawing : undefined}
          onMouseLeave={!isMobile ? stopDrawing : undefined}
          style={{
            // Prevent touch actions on mobile for better signature experience
            touchAction: isMobile ? 'none' : 'auto',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
            // Prevent text selection
            WebkitTapHighlightColor: 'transparent',
          }}
        />
        
        {!hasSignature && !disabled && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 text-gray-400">
              <PenTool className="h-5 w-5" />
              <span className="text-sm">{placeholder}</span>
            </div>
          </div>
        )}
      </div>

      {!disabled && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={clearSignature}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 className="h-3 w-3" />
            Clear
          </button>
          {isMobile && (
            <span className="text-xs text-gray-500 px-2 py-1.5">
              Touch and drag to sign
            </span>
          )}
        </div>
      )}

      {disabled && !hasSignature && (
        <p className="text-sm text-gray-500">No signature provided</p>
      )}
    </div>
  );
};