import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, SortAsc, Calendar, ChevronDown, RefreshCw, Database, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { JobCard } from '../types/JobCard';
import { JobCardTable } from './JobCardTable';

interface DatabaseContentProps {
  fetchArchivedJobCardsDirectly: () => Promise<JobCard[]>;
  onEdit: (jobCard: JobCard) => void;
  onView: (jobCard: JobCard) => void;
  onArchive: (jobCard: JobCard) => void;
  onUnarchive: (jobCard: JobCard) => void;
  onDelete: (jobCard: JobCard) => void;
  onConfirmDownload?: (jobCard: JobCard) => void;
}

type SortConfig = {
  key: keyof JobCard | null;
  direction: 'asc' | 'desc';
};

type SearchFilterType = 'all' | 'customer_name' | 'company_name' | 'mobile' | 'rego' | 'invoice_number' | 'job_number';

const SEARCH_FILTER_OPTIONS = [
  { label: 'All Fields', value: 'all' as SearchFilterType },
  { label: 'Customer Name', value: 'customer_name' as SearchFilterType },
  { label: 'Company Name', value: 'company_name' as SearchFilterType },
  { label: 'Mobile', value: 'mobile' as SearchFilterType },
  { label: 'REGO', value: 'rego' as SearchFilterType },
  { label: 'Invoice Number', value: 'invoice_number' as SearchFilterType },
  { label: 'Job Number', value: 'job_number' as SearchFilterType },
];

type FilterConfig = {
  // Job card creation date filters
  month: string;
  year: string;
  filterType: 'all' | 'month-year' | 'year-only';
  // Vehicle manufacture date filters
  vehicleManufactureMonth: string;
  vehicleManufactureYear: string;
  vehicleManufactureFilterType: 'all' | 'month-year' | 'year-only';
  // New filters
  customerName: string;
  companyName: string;
  paymentStatus: 'all' | 'paid' | 'unpaid';
  workerCompletionStatus: 'all' | 'complete' | 'incomplete';
  partsCompletionStatus: 'all' | 'complete' | 'incomplete';
};

export const DatabaseContent: React.FC<DatabaseContentProps> = ({
  fetchArchivedJobCardsDirectly,
  onEdit,
  onView,
  onArchive,
  onUnarchive,
  onDelete,
  onConfirmDownload,
}) => {
  const [jobCardsData, setJobCardsData] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilterType, setSearchFilterType] = useState<SearchFilterType>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'created_at', direction: 'desc' });
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    month: '',
    year: '',
    filterType: 'all',
    vehicleManufactureMonth: '',
    vehicleManufactureYear: '',
    vehicleManufactureFilterType: 'all',
    customerName: '',
    companyName: '',
    paymentStatus: 'all',
    workerCompletionStatus: 'all',
    partsCompletionStatus: 'all',
  });
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

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

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchArchivedJobCardsDirectly();
      setJobCardsData(data);
    } catch (err) {
      console.error('Error loading archived job cards:', err);
      setError('Failed to load archived job cards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleRetry = () => {
    loadData();
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const requestSort = (key: keyof JobCard) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleDateSort = (direction: 'asc' | 'desc') => {
    setSortConfig({ key: 'created_at', direction });
    setShowSortDropdown(false);
    setCurrentPage(1);
  };

  const handleJobCardFilterChange = (type: 'month-year' | 'year-only' | 'all') => {
    setFilterConfig(prev => ({ ...prev, filterType: type }));
    if (type === 'all') {
      setFilterConfig(prev => ({ ...prev, month: '', year: '', filterType: 'all' }));
    }
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
    setCurrentPage(1);
  };

  const applyFilter = () => {
    setShowFilterDropdown(false);
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setFilterConfig({ 
      month: '', 
      year: '', 
      filterType: 'all',
      vehicleManufactureMonth: '',
      vehicleManufactureYear: '',
      vehicleManufactureFilterType: 'all',
      customerName: '',
      companyName: '',
      paymentStatus: 'all',
      workerCompletionStatus: 'all',
      partsCompletionStatus: 'all',
    });
    setShowFilterDropdown(false);
    setCurrentPage(1);
  };

  const getSearchPlaceholder = () => {
    const selectedOption = SEARCH_FILTER_OPTIONS.find(option => option.value === searchFilterType);
    if (searchFilterType === 'all') {
      return 'Search archived job cards...';
    }
    return `Search by ${selectedOption?.label.toLowerCase()}...`;
  };
  const filteredAndSortedJobCards = useMemo(() => {
    let filtered = jobCardsData.filter(card => {
      // Apply search filter
      let matchesSearch = true;
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        
        // Apply search based on selected filter type
        switch (searchFilterType) {
          case 'customer_name':
            matchesSearch = card.customer_name?.toLowerCase().includes(searchLower) || false;
            break;
          case 'company_name':
            matchesSearch = card.company_name?.toLowerCase().includes(searchLower) || false;
            break;
          case 'mobile':
            matchesSearch = card.mobile?.toLowerCase().includes(searchLower) || false;
            break;
          case 'rego':
            matchesSearch = card.rego?.toLowerCase().includes(searchLower) || false;
            break;
          case 'invoice_number':
            matchesSearch = card.invoice_number?.toLowerCase().includes(searchLower) || false;
            break;
          case 'job_number':
            matchesSearch = card.job_number?.toLowerCase().includes(searchLower) || false;
            break;
          case 'all':
          default:
            matchesSearch = (
              card.job_number?.toLowerCase().includes(searchLower) ||
              card.id.toLowerCase().includes(searchLower) ||
              card.customer_name?.toLowerCase().includes(searchLower) ||
              card.company_name?.toLowerCase().includes(searchLower) ||
              card.rego?.toLowerCase().includes(searchLower) ||
              card.mobile?.toLowerCase().includes(searchLower) ||
              card.invoice_number?.toLowerCase().includes(searchLower)
            );
            break;
        }
      }

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

      // Apply customer name filter
      if (filterConfig.customerName) {
        if (!card.customer_name?.toLowerCase().includes(filterConfig.customerName.toLowerCase())) return false;
      }

      // Apply company name filter
      if (filterConfig.companyName) {
        if (!card.company_name?.toLowerCase().includes(filterConfig.companyName.toLowerCase())) return false;
      }

      // Apply payment status filter
      if (filterConfig.paymentStatus !== 'all') {
        if (card.payment_status !== filterConfig.paymentStatus) return false;
      }

      // Apply worker completion status filter
      if (filterConfig.workerCompletionStatus !== 'all') {
        const isComplete = card.is_worker_assigned_complete || false;
        if (filterConfig.workerCompletionStatus === 'complete' && !isComplete) return false;
        if (filterConfig.workerCompletionStatus === 'incomplete' && isComplete) return false;
      }

      // Apply parts completion status filter
      if (filterConfig.partsCompletionStatus !== 'all') {
        const isComplete = card.is_parts_assigned_complete || false;
        if (filterConfig.partsCompletionStatus === 'complete' && !isComplete) return false;
        if (filterConfig.partsCompletionStatus === 'incomplete' && isComplete) return false;
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
  }, [jobCardsData, searchTerm, searchFilterType, sortConfig, filterConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedJobCards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobCards = filteredAndSortedJobCards.slice(startIndex, endIndex);

  // Determine if pagination should be shown
  const shouldShowPagination = filteredAndSortedJobCards.length > 10;

  // Helper functions for pagination
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

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchFilterType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading archived job cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Database className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Archived Job Cards Database</h2>
            <p className="text-sm text-gray-500">Complete archive of all historical job cards</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-3 flex-1 max-w-2xl">
          {/* Search Filter Dropdown */}
          <div className="w-48">
            <select
              value={searchFilterType}
              onChange={(e) => setSearchFilterType(e.target.value as SearchFilterType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {SEARCH_FILTER_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">per page</span>
          </div>

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
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                <div className="p-4 space-y-6">
                  {/* Customer Filters */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">Customer Filters</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                      <input
                        type="text"
                        value={filterConfig.customerName}
                        onChange={(e) => setFilterConfig(prev => ({ ...prev, customerName: e.target.value }))}
                        placeholder="Filter by customer name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={filterConfig.companyName}
                        onChange={(e) => setFilterConfig(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="Filter by company name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Status Filters */}
                  <div className="space-y-4 border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-900">Status Filters</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                      <select
                        value={filterConfig.paymentStatus}
                        onChange={(e) => setFilterConfig(prev => ({ ...prev, paymentStatus: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Payment Status</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Worker Completion</label>
                      <select
                        value={filterConfig.workerCompletionStatus}
                        onChange={(e) => setFilterConfig(prev => ({ ...prev, workerCompletionStatus: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Worker Status</option>
                        <option value="complete">Complete</option>
                        <option value="incomplete">Incomplete</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parts Completion</label>
                      <select
                        value={filterConfig.partsCompletionStatus}
                        onChange={(e) => setFilterConfig(prev => ({ ...prev, partsCompletionStatus: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Parts Status</option>
                        <option value="complete">Complete</option>
                        <option value="incomplete">Incomplete</option>
                      </select>
                    </div>
                  </div>

                  {/* Date Filters */}
                  <div className="space-y-4 border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      Date Filters
                    </h3>
                    
                    {/* Job Card Creation Date Filter */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">Job Card Date</h4>
                      
                      <div className="space-y-2">
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

                    {/* Vehicle Manufacture Date Filter */}
                    <div className="space-y-3 border-t border-gray-200 pt-3">
                      <h4 className="text-sm font-medium text-gray-700">Vehicle Manufacture Date</h4>
                      
                      <div className="space-y-2">
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
      </div>

      {/* Results Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Showing {filteredAndSortedJobCards.length} of {jobCardsData.length} archived job cards
            </span>
          </div>
          {filteredAndSortedJobCards.length !== jobCardsData.length && (
            <span className="text-sm text-blue-700">Filters applied</span>
          )}
        </div>
        {searchFilterType !== 'all' && searchTerm && (
          <div className="mt-2">
            <span className="text-xs text-blue-600">
              Filtering by: {SEARCH_FILTER_OPTIONS.find(opt => opt.value === searchFilterType)?.label}
            </span>
          </div>
        )}
      </div>

      {/* Job Cards Table */}
      <JobCardTable
        jobCards={paginatedJobCards}
        hideControls={true}
        searchTerm={searchTerm}
        searchFilterType={searchFilterType}
        sortConfig={sortConfig}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onSearchTermChange={setSearchTerm}
        onSearchFilterTypeChange={setSearchFilterType}
        onSortConfigChange={setSortConfig}
        onCurrentPageChange={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        onEdit={onEdit}
        onView={onView}
        onArchive={onArchive}
        onUnarchive={onUnarchive}
        onDelete={onDelete}
        onCreateNew={() => {}} // Not used in database view
        isLoading={false}
        isArchivedView={true}
        onConfirmDownload={onConfirmDownload}
      />

      {/* Pagination Controls for Database View */}
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