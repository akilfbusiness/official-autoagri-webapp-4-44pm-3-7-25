import React from 'react';
import { X, AlertTriangle, Archive, Trash2, RotateCcw, CheckCircle, Download } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText: string;
  type?: 'archive' | 'unarchive' | 'delete' | 'complete' | 'download';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText,
  type = 'archive',
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'archive':
        return <Archive className="h-6 w-6 text-amber-600" />;
      case 'unarchive':
        return <RotateCcw className="h-6 w-6 text-blue-600" />;
      case 'delete':
        return <Trash2 className="h-6 w-6 text-red-600" />;
      case 'complete':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'download':
        return <Download className="h-6 w-6 text-blue-600" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-amber-600" />;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'archive':
        return 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500';
      case 'unarchive':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
      case 'delete':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'complete':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      case 'download':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
      default:
        return 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 transition-opacity bg-gray-500/75 backdrop-blur-sm" />
        
        {/* Modal */}
        <div className="relative w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {getIcon()}
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-xl">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${getConfirmButtonStyle()}`}
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};