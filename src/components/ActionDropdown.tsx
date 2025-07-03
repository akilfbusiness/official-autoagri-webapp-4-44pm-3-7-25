import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Edit, Archive, FileText, Download, Trash2, RotateCcw } from 'lucide-react';
import { JobCard } from '../types/JobCard';

interface ActionDropdownProps {
  jobCard: JobCard;
  onView: (jobCard: JobCard) => void;
  onEdit: (jobCard: JobCard) => void;
  onArchive: (jobCard: JobCard) => void;
  onUnarchive: (jobCard: JobCard) => void;
  onInvoice: (jobCard: JobCard) => void;
  onDownload: (jobCard: JobCard) => void;
  onDelete: (jobCard: JobCard) => void;
  onConfirmDownload?: (jobCard: JobCard) => void; // New prop for confirmation
}

export const ActionDropdown: React.FC<ActionDropdownProps> = ({
  jobCard,
  onView,
  onEdit,
  onArchive,
  onUnarchive,
  onInvoice,
  onDownload,
  onDelete,
  onConfirmDownload,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 280; // Approximate height of dropdown
      
      // Check if there's enough space below
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen]);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle PDF download with confirmation
  const handlePdfDownload = () => {
    if (onConfirmDownload) {
      onConfirmDownload(jobCard);
    } else {
      // Fallback to original download function
      onDownload(jobCard);
    }
    setIsOpen(false);
  };

  // Handle invoice generation and webhook sending
  const handleInvoiceGeneration = () => {
    onInvoice(jobCard);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="More actions"
      >
        <MoreVertical className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsOpen(false)} />
          
          {/* Dropdown Menu */}
          <div 
            className={`absolute ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} right-0 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 transform transition-all duration-200 ease-out ${
              isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{
              // Ensure dropdown is always visible within viewport
              maxHeight: '280px',
              overflowY: 'auto'
            }}
          >
            <div className="py-1">
              <button
                onClick={() => handleAction(() => onView(jobCard))}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Eye className="h-4 w-4" />
                View Details
              </button>
              
              {jobCard.is_archived ? (
                <button
                  onClick={() => handleAction(() => onUnarchive(jobCard))}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Unarchive
                </button>
              ) : (
                <button
                  onClick={() => handleAction(() => onArchive(jobCard))}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Archive className="h-4 w-4" />
                  Archive
                </button>
              )}
              
              <button
                onClick={handleInvoiceGeneration}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Generate Invoice
              </button>
              
              <button
                onClick={handlePdfDownload}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={() => handleAction(() => onDelete(jobCard))}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};