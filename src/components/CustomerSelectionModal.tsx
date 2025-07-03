import React, { useState, useEffect, useRef } from 'react';
import { X, Users, Search, UserPlus, ChevronDown } from 'lucide-react';
import { CustomerVehicleSuggestion } from '../types/JobCard';
import { useJobCards } from '../hooks/useJobCards';

interface CustomerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNewCustomer: () => void;
  onSelectExistingCustomer: (customer: CustomerVehicleSuggestion) => void;
}

export const CustomerSelectionModal: React.FC<CustomerSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectNewCustomer,
  onSelectExistingCustomer,
}) => {
  const [step, setStep] = useState<'selection' | 'search'>('selection');
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<CustomerVehicleSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { fetchCustomerVehicleSuggestions } = useJobCards();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('selection');
      setSearchTerm('');
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [isOpen]);

  // Focus search input when switching to search step
  useEffect(() => {
    if (step === 'search' && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [step]);

  // Handle search term changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length >= 2) {
        setIsLoading(true);
        try {
          const results = await fetchCustomerVehicleSuggestions(searchTerm);
          setSuggestions(results);
          setShowDropdown(results.length > 0);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
          setShowDropdown(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, fetchCustomerVehicleSuggestions]);

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNewCustomer = () => {
    onSelectNewCustomer();
    onClose();
  };

  const handleExistingCustomer = () => {
    setStep('search');
  };

  const handleSelectSuggestion = (suggestion: CustomerVehicleSuggestion) => {
    onSelectExistingCustomer(suggestion);
    onClose();
  };

  const handleBackToSelection = () => {
    setStep('selection');
    setSearchTerm('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  if (!isOpen) return null;

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
              <Users className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {step === 'selection' ? 'Customer Selection' : 'Search Existing Customer'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {step === 'selection' ? (
              /* Initial Selection Step */
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-6">
                  Choose whether to create a new job card for a new customer or select an existing customer
                </p>

                <button
                  onClick={handleNewCustomer}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <UserPlus className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900">New Customer</h4>
                      <p className="text-sm text-gray-500">Create a job card with empty customer and vehicle fields</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleExistingCustomer}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Search className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900">Existing Customer</h4>
                      <p className="text-sm text-gray-500">Search and autofill customer and vehicle information</p>
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              /* Search Step */
              <div className="space-y-4" ref={dropdownRef}>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Search by Customer Name, Company, ABN, Mobile, or REGO
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Start typing to search..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {isLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Search Results Dropdown */}
                {showDropdown && suggestions.length > 0 && (
                  <div className="relative">
                    <div className="absolute top-0 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={`${suggestion.id}-${index}`}
                          onClick={() => handleSelectSuggestion(suggestion)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{suggestion.displayText}</p>
                              <div className="flex gap-4 mt-1">
                                {suggestion.mobile && (
                                  <span className="text-xs text-gray-500">📞 {suggestion.mobile}</span>
                                )}
                                {suggestion.abn && (
                                  <span className="text-xs text-gray-500">ABN: {suggestion.abn}</span>
                                )}
                              </div>
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-400 transform -rotate-90" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results Message */}
                {searchTerm.length >= 2 && !isLoading && suggestions.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No matching customers found</p>
                    <p className="text-xs text-gray-400 mt-1">Try different search terms or create a new customer</p>
                  </div>
                )}

                {/* Search Instructions */}
                {searchTerm.length < 2 && (
                  <div className="text-center py-6 text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Start typing to search existing customers</p>
                    <p className="text-xs text-gray-400 mt-1">Search by customer name, company, ABN, mobile, or REGO</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between gap-3 px-6 py-4 bg-gray-50 rounded-b-xl">
            {step === 'search' ? (
              <>
                <button
                  onClick={handleBackToSelection}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNewCustomer}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Create New Instead
                </button>
              </>
            ) : (
              <div className="flex-1"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};