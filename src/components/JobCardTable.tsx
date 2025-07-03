import React, { useState, useMemo } from 'react';
import { Search, Eye, X, Check, ChevronUp, ChevronDown, Filter, SortAsc, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { JobCard } from '../types/JobCard';
import { ActionDropdown } from './ActionDropdown';

interface JobCardTableProps {
  jobCards: JobCard[];
  onEdit: (jobCard: JobCard) => void;
  onView: (jobCard: JobCard) => void;
  onArchive: (jobCard: JobCard) => void;
  onUnarchive: (jobCard: JobCard) => void;
  onDelete: (jobCard: JobCard) => void;
  onCreateNew: () => void;
  onToggleWorkerCompletion?: (jobCard: JobCard, isComplete: boolean) => void;
  onTogglePartsCompletion?: (jobCard: JobCard, isComplete: boolean) => void;
  onGenerateInvoiceAndSendWebhook?: (jobCard: JobCard) => void; // New prop for webhook functionality
  isLoading: boolean;
  isArchivedView?: boolean; // New prop to determine if this is the archived view
  onConfirmDownload?: (jobCard: JobCard) => void; // New prop for download confirmation
}

type SortConfig = {
  key: keyof JobCard | null;
  direction: 'asc' | 'desc';
};

type FilterConfig = {
  // Job card creation date filters
  month: string;
  year: string;
  filterType: 'all' | 'month-year' | 'year-only';
  // Vehicle manufacture date filters
  vehicleManufactureMonth: string;
  vehicleManufactureYear: string;
  vehicleManufactureFilterType: 'all' | 'month-year' | 'year-only';
};

export const JobCardTable: React.FC<JobCardTableProps> = ({
  jobCards,
  onEdit,
  onView,
  onArchive,
  onUnarchive,
  onDelete,
  onCreateNew,
  onToggleWorkerCompletion,
  onTogglePartsCompletion,
  onGenerateInvoiceAndSendWebhook,
  isLoading,
  isArchivedView = false,
  onConfirmDownload,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    month: '',
    year: '',
    filterType: 'all',
    vehicleManufactureMonth: '',
    vehicleManufactureYear: '',
    vehicleManufactureFilterType: 'all'
  });
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Pagination state - now applies to both active and archived views
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default to 10 items per page

  // Generate year options for job card creation date (current year and past 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // Generate year options for vehicle manufacture date (1900 to 2100)
  const vehicleYearOptions = Array.from({ length: 2100 - 1900 + 1 }, (_, i) => 2100 - i);

  // Month options
  const monthOptions = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const requestSort = (key: keyof JobCard) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    // Reset to first page when sorting
    setCurrentPage(1);
  };

  const handleDateSort = (direction: 'asc' | 'desc') => {
    setSortConfig({ key: 'created_at', direction });
    setShowSortDropdown(false);
    // Reset to first page when sorting
    setCurrentPage(1);
  };

  const handleJobCardFilterChange = (type: 'month-year' | 'year-only' | 'all') => {
    setFilterConfig(prev => ({ ...prev, filterType: type }));
    if (type === 'all') {
      setFilterConfig(prev => ({ ...prev, month: '', year: '', filterType: 'all' }));
    }
    // Reset to first page when filtering
    setCurrentPage(1);
  };

  const handleVehicleManufactureFilterChange = (type: 'month-year' | 'year-only' | 'all') => {
    setFilterConfig(prev => ({ ...prev, vehicleManufactureFilterType: type }));
    if (type === 'all') {
      setFilterConfig(prev => ({ 
        ...prev, 
        vehicleManufactureMonth: '', 
        vehicleManufactureYear: '', 
        vehicleManufactureFilterType: 'all' 
      }));
    }
    // Reset to first page when filtering
    setCurrentPage(1);
  };

  const applyFilter = () => {
    setShowFilterDropdown(false);
    // Reset to first page when applying filters
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setFilterConfig({ 
      month: '', 
      year: '', 
      filterType: 'all',
      vehicleManufactureMonth: '',
      vehicleManufactureYear: '',
      vehicleManufactureFilterType: 'all'
    });
    setShowFilterDropdown(false);
    // Reset to first page when clearing filters
    setCurrentPage(1);
  };

  const getSortIcon = (columnKey: keyof JobCard) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUp className="h-3 w-3 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-3 w-3 text-blue-600" /> : 
      <ChevronDown className="h-3 w-3 text-blue-600" />;
  };

  const filteredAndSortedJobCards = useMemo(() => {
    let filtered = jobCards.filter(card => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        card.job_number?.toLowerCase().includes(searchLower) ||
        card.id.toLowerCase().includes(searchLower) ||
        card.customer_name?.toLowerCase().includes(searchLower) ||
        card.company_name?.toLowerCase().includes(searchLower) ||
        card.rego?.toLowerCase().includes(searchLower) ||
        card.mobile?.toLowerCase().includes(searchLower)
      );

      if (!matchesSearch) return false;

      // Apply job card creation date filter
      if (filterConfig.filterType !== 'all') {
        const cardDate = new Date(card.created_at);
        const cardYear = cardDate.getFullYear().toString();
        const cardMonth = (cardDate.getMonth() + 1).toString().padStart(2, '0');

        if (filterConfig.filterType === 'year-only' && filterConfig.year) {
          if (cardYear !== filterConfig.year) return false;
        }

        if (filterConfig.filterType === 'month-year' && filterConfig.year && filterConfig.month) {
          if (cardYear !== filterConfig.year || cardMonth !== filterConfig.month) return false;
        }
      }

      // Apply vehicle manufacture date filter
      if (filterConfig.vehicleManufactureFilterType !== 'all') {
        const vehicleYear = card.vehicle_year?.toString();
        const vehicleMonth = card.vehicle_month?.padStart(2, '0');

        if (filterConfig.vehicleManufactureFilterType === 'year-only' && filterConfig.vehicleManufactureYear) {
          if (vehicleYear !== filterConfig.vehicleManufactureYear) return false;
        }

        if (filterConfig.vehicleManufactureFilterType === 'month-year' && 
            filterConfig.vehicleManufactureYear && filterConfig.vehicleManufactureMonth) {
          if (vehicleYear !== filterConfig.vehicleManufactureYear || 
              vehicleMonth !== filterConfig.vehicleManufactureMonth) return false;
        }
      }

      return true;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        // Handle different data types
        if (sortConfig.key === 'created_at') {
          const aDate = new Date(aValue as Date).getTime();
          const bDate = new Date(bValue as Date).getTime();
          return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
        }

        if (sortConfig.key === 'vehicle_type') {
          const aStr = Array.isArray(aValue) ? aValue.join(', ') : '';
          const bStr = Array.isArray(bValue) ? bValue.join(', ') : '';
          const comparison = aStr.localeCompare(bStr);
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        }

        // Handle string comparisons
        const aStr = (aValue || '').toString().toLowerCase();
        const bStr = (bValue || '').toString().toLowerCase();
        const comparison = aStr.localeCompare(bStr);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [jobCards, searchTerm, sortConfig, filterConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedJobCards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobCards = filteredAndSortedJobCards.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Reset to first page when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleInvoice = (jobCard: JobCard) => {
    if (onGenerateInvoiceAndSendWebhook) {
      onGenerateInvoiceAndSendWebhook(jobCard);
    } else {
      alert(`Generating invoice for Job ${jobCard.job_number}`);
    }
  };

  const handleDownload = (jobCard: JobCard) => {
    alert(`Downloading PDF for Job ${jobCard.job_number}`);
  };

  // Helper function to get month name from month number
  const getMonthName = (monthNumber?: string) => {
    if (!monthNumber) return '';
    const month = monthOptions.find(m => m.value === monthNumber.padStart(2, '0'));
    return month ? month.label : monthNumber;
  };

  // Status Badge Component
  const StatusBadge: React.FC<{
    label: string;
    isComplete: boolean;
    onClick: () => void;
    disabled?: boolean;
  }> = ({ label, isComplete, onClick, disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-all ${
        isComplete
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-red-100 text-red-800 hover:bg-red-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      title={`Click to toggle ${label} completion status`}
    >
      {isComplete ? (
        <Check className="h-3 w-3" />
      ) : (
        <X className="h-3 w-3" />
      )}
      {label}
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Determine if pagination should be shown (when there are more than the minimum items per page option)
  const shouldShowPagination = filteredAndSortedJobCards.length > 5; // Show if more than 5 items total

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search job cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Pagination Controls and Filters */}
        <div className="flex items-center gap-3">
          {/* Items per page selector */}
          {shouldShowPagination && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>
          )}

          {/* Sort and Filter buttons for archived view */}
          {isArchivedView && (
            <div className="flex gap-2">
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SortAsc className="h-4 w-4" />
                  Sort
                  <ChevronDown className="h-4 w-4" />
                </button>

                {showSortDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => handleDateSort('desc')}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Newest First
                      </button>
                      <button
                        onClick={() => handleDateSort('asc')}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Oldest First
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                  <ChevronDown className="h-4 w-4" />
                </button>

                {showFilterDropdown && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="p-4 space-y-6">
                      {/* Job Card Creation Date Filter */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          Filter by Job Card Date
                        </h3>
                        
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="jobCardFilterType"
                              checked={filterConfig.filterType === 'all'}
                              onChange={() => handleJobCardFilterChange('all')}
                              className="mr-2"
                            />
                            <span className="text-sm">Show All</span>
                          </label>

                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="jobCardFilterType"
                              checked={filterConfig.filterType === 'year-only'}
                              onChange={() => handleJobCardFilterChange('year-only')}
                              className="mr-2"
                            />
                            <span className="text-sm">Year Only</span>
                          </label>

                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="jobCardFilterType"
                              checked={filterConfig.filterType === 'month-year'}
                              onChange={() => handleJobCardFilterChange('month-year')}
                              className="mr-2"
                            />
                            <span className="text-sm">Specific Month and Year</span>
                          </label>
                        </div>

                        {(filterConfig.filterType === 'year-only' || filterConfig.filterType === 'month-year') && (
                          <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                              <select
                                value={filterConfig.year}
                                onChange={(e) => setFilterConfig(prev => ({ ...prev, year: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="">Select Year</option>
                                {yearOptions.map(year => (
                                  <option key={year} value={year.toString()}>{year}</option>
                                ))}
                              </select>
                            </div>

                            {filterConfig.filterType === 'month-year' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                                <select
                                  value={filterConfig.month}
                                  onChange={(e) => setFilterConfig(prev => ({ ...prev, month: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  <option value="">Select Month</option>
                                  {monthOptions.map(month => (
                                    <option key={month.value} value={month.value}>{month.label}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-200"></div>

                      {/* Vehicle Manufacture Date Filter */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          Filter by Vehicle Manufacture Date
                        </h3>
                        
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="vehicleManufactureFilterType"
                              checked={filterConfig.vehicleManufactureFilterType === 'all'}
                              onChange={() => handleVehicleManufactureFilterChange('all')}
                              className="mr-2"
                            />
                            <span className="text-sm">Show All</span>
                          </label>

                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="vehicleManufactureFilterType"
                              checked={filterConfig.vehicleManufactureFilterType === 'year-only'}
                              onChange={() => handleVehicleManufactureFilterChange('year-only')}
                              className="mr-2"
                            />
                            <span className="text-sm">Year Only</span>
                          </label>

                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="vehicleManufactureFilterType"
                              checked={filterConfig.vehicleManufactureFilterType === 'month-year'}
                              onChange={() => handleVehicleManufactureFilterChange('month-year')}
                              className="mr-2"
                            />
                            <span className="text-sm">Specific Month and Year</span>
                          </label>
                        </div>

                        {(filterConfig.vehicleManufactureFilterType === 'year-only' || filterConfig.vehicleManufactureFilterType === 'month-year') && (
                          <div className="space-y-3 pl-4 border-l-2 border-green-200">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Year</label>
                              <select
                                value={filterConfig.vehicleManufactureYear}
                                onChange={(e) => setFilterConfig(prev => ({ ...prev, vehicleManufactureYear: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              >
                                <option value="">Select Year</option>
                                {vehicleYearOptions.map(year => (
                                  <option key={year} value={year.toString()}>{year}</option>
                                ))}
                              </select>
                            </div>

                            {filterConfig.vehicleManufactureFilterType === 'month-year' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Month</label>
                                <select
                                  value={filterConfig.vehicleManufactureMonth}
                                  onChange={(e) => setFilterConfig(prev => ({ ...prev, vehicleManufactureMonth: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                  <option value="">Select Month</option>
                                  {monthOptions.map(month => (
                                    <option key={month.value} value={month.value}>{month.label}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={applyFilter}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Apply
                        </button>
                        <button
                          onClick={clearFilter}
                          className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
        <div className="w-full">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => requestSort('job_number')}
                    className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                  >
                    Job Number
                    {getSortIcon('job_number')}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => requestSort('customer_name')}
                    className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                  >
                    Customer
                    {getSortIcon('customer_name')}
                  </button>
                </th>
                {isArchivedView && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => requestSort('mobile')}
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                    >
                      Mobile
                      {getSortIcon('mobile')}
                    </button>
                  </th>
                )}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => requestSort('vehicle_make')}
                    className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                  >
                    Vehicle
                    {getSortIcon('vehicle_make')}
                  </button>
                </th>
                {isArchivedView && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => requestSort('vehicle_type')}
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                    >
                      Vehicle Type
                      {getSortIcon('vehicle_type')}
                    </button>
                  </th>
                )}
                {!isArchivedView && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignments
                  </th>
                )}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedJobCards.length === 0 ? (
                <tr>
                  <td colSpan={isArchivedView ? 7 : 6} className="px-6 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="text-gray-400">
                        <Search className="h-12 w-12 mx-auto mb-4" />
                      </div>
                      <p className="text-lg font-medium">
                        {jobCards.length === 0 ? 'No job cards found' : 'No job cards match your search'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {jobCards.length === 0 ? 'Create your first job card to get started!' : 'Try adjusting your search terms'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedJobCards.map((jobCard, index) => (
                  <tr key={jobCard.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {jobCard.job_number || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-400">
                        Created: {jobCard.created_at.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {jobCard.customer_name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {jobCard.company_name || 'No company'}
                      </div>
                    </td>
                    {isArchivedView && (
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {jobCard.mobile || 'N/A'}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {jobCard.vehicle_make} {jobCard.vehicle_model}
                      </div>
                      <div className="text-xs text-gray-500">
                        REGO: {jobCard.rego || 'N/A'}
                        {isArchivedView && (jobCard.vehicle_month || jobCard.vehicle_year) && (
                          <div className="mt-1">
                            Manufactured: {getMonthName(jobCard.vehicle_month)} {jobCard.vehicle_year || 'N/A'}
                          </div>
                        )}
                      </div>
                    </td>
                    {isArchivedView && (
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {jobCard.vehicle_type?.join(', ') || 'N/A'}
                        </div>
                      </td>
                    )}
                    {!isArchivedView && (
                      <td className="px-6 py-6">
                        <div className="space-y-2">
                          {/* Worker Assignment */}
                          {jobCard.assigned_worker && (
                            <StatusBadge
                              label={jobCard.assigned_worker}
                              isComplete={jobCard.is_worker_assigned_complete || false}
                              onClick={() => onToggleWorkerCompletion?.(
                                jobCard, 
                                !jobCard.is_worker_assigned_complete
                              )}
                              disabled={!onToggleWorkerCompletion}
                            />
                          )}
                          
                          {/* Parts Assignment */}
                          {jobCard.assigned_parts && (
                            <StatusBadge
                              label={jobCard.assigned_parts}
                              isComplete={jobCard.is_parts_assigned_complete || false}
                              onClick={() => onTogglePartsCompletion?.(
                                jobCard, 
                                !jobCard.is_parts_assigned_complete
                              )}
                              disabled={!onTogglePartsCompletion}
                            />
                          )}
                          
                          {/* No Assignments */}
                          {!jobCard.assigned_worker && !jobCard.assigned_parts && (
                            <span className="text-xs text-gray-400">No assignments</span>
                          )}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-6 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        jobCard.is_archived 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {jobCard.is_archived ? 'Archived' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onEdit(jobCard)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Eye className="h-3 w-3" />
                          Edit
                        </button>
                        <ActionDropdown
                          jobCard={jobCard}
                          onView={onView}
                          onEdit={onEdit}
                          onArchive={onArchive}
                          onUnarchive={onUnarchive}
                          onInvoice={handleInvoice}
                          onDownload={handleDownload}
                          onDelete={onDelete}
                          onConfirmDownload={onConfirmDownload}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Add padding at bottom to ensure dropdown visibility */}
        <div className="h-32"></div>
      </div>

      {/* Pagination Controls */}
      {shouldShowPagination && totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-6 py-3 border border-gray-200 rounded-lg">
          <div className="flex items-center text-sm text-gray-700">
            <span>
              Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedJobCards.length)} of {filteredAndSortedJobCards.length} results
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Show first page, last page, current page, and pages around current
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-gray-500 flex justify-between items-center">
        <span>
          {shouldShowPagination ? 
            `Page ${currentPage} of ${totalPages} (${filteredAndSortedJobCards.length} total job cards)` :
            `Showing ${filteredAndSortedJobCards.length} of ${jobCards.length} job cards`
          }
        </span>
        {isArchivedView && (filterConfig.filterType !== 'all' || filterConfig.vehicleManufactureFilterType !== 'all') && (
          <div className="flex gap-4 text-xs">
            {filterConfig.filterType !== 'all' && (
              <span className="text-blue-600">
                Job Card: {filterConfig.filterType === 'year-only' ? 'year' : 'month and year'}
              </span>
            )}
            {filterConfig.vehicleManufactureFilterType !== 'all' && (
              <span className="text-green-600">
                Vehicle: {filterConfig.vehicleManufactureFilterType === 'year-only' ? 'year' : 'month and year'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Click outside handlers */}
      {(showSortDropdown || showFilterDropdown) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowSortDropdown(false);
            setShowFilterDropdown(false);
          }}
        />
      )}
    </div>
  );
};