import React, { useState, useMemo } from 'react';
import { Search, Eye, X, Check, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
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
  onGenerateInvoiceAndSendWebhook?: (jobCard: JobCard) => void;
  isLoading: boolean;
  isArchivedView?: boolean;
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
  const [searchFilterType, setSearchFilterType] = useState<SearchFilterType>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const requestSort = (key: keyof JobCard) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
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

  const getSearchPlaceholder = () => {
    const selectedOption = SEARCH_FILTER_OPTIONS.find(option => option.value === searchFilterType);
    if (searchFilterType === 'all') {
      return 'Search job cards...';
    }
    return `Search by ${selectedOption?.label.toLowerCase()}...`;
  };

  const filteredAndSortedJobCards = useMemo(() => {
    let filtered = jobCards.filter(card => {
      if (!searchTerm.trim()) return true;
      
      const searchLower = searchTerm.toLowerCase();
      
      // Apply search based on selected filter type
      switch (searchFilterType) {
        case 'customer_name':
          return card.customer_name?.toLowerCase().includes(searchLower) || false;
        case 'company_name':
          return card.company_name?.toLowerCase().includes(searchLower) || false;
        case 'mobile':
          return card.mobile?.toLowerCase().includes(searchLower) || false;
        case 'rego':
          return card.rego?.toLowerCase().includes(searchLower) || false;
        case 'invoice_number':
          return card.invoice_number?.toLowerCase().includes(searchLower) || false;
        case 'job_number':
          return card.job_number?.toLowerCase().includes(searchLower) || false;
        case 'all':
        default:
          return (
            card.customer_name?.toLowerCase().includes(searchLower) ||
            card.company_name?.toLowerCase().includes(searchLower) ||
            card.mobile?.toLowerCase().includes(searchLower) ||
            card.rego?.toLowerCase().includes(searchLower) ||
            card.invoice_number?.toLowerCase().includes(searchLower) ||
            card.job_number?.toLowerCase().includes(searchLower) ||
            card.id.toLowerCase().includes(searchLower)
          );
      }
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
  }, [jobCards, searchTerm, searchFilterType, sortConfig]);

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
    setCurrentPage(1);
  };

  // Reset to first page when search term or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchFilterType]);

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
  const shouldShowPagination = filteredAndSortedJobCards.length > 5;

  return (
    <div className="space-y-6">
      {/* Search controls for all views */}
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

        {/* Pagination Controls - Only show for Dashboard views */}
        {!isArchivedView && shouldShowPagination && (
          <div className="flex items-center gap-3">
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
          </div>
        )}
      </div>

      {/* Archived view pagination controls */}
      {isArchivedView && shouldShowPagination && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div></div> {/* Spacer */}
          <div className="flex items-center gap-3">
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
          </div>
        </div>
      )}

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
                        {jobCards.length === 0 ? 'Create your first job card to get started!' : 'Try adjusting your search terms or filter'}
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
                      {/* Add Invoice Number display */}
                      {jobCard.invoice_number && (
                        <div className="text-xs text-blue-600 font-medium">
                          Invoice: {jobCard.invoice_number}
                        </div>
                      )}
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

      {/* Pagination Controls - Only show for Dashboard view */}
      {!isArchivedView && shouldShowPagination && totalPages > 1 && (
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
          {!isArchivedView && shouldShowPagination ? 
            `Page ${currentPage} of ${totalPages} (${filteredAndSortedJobCards.length} total job cards)` :
            `Showing ${filteredAndSortedJobCards.length} of ${jobCards.length} job cards`
          }
        </span>
        {!isArchivedView && searchFilterType !== 'all' && (
          <span className="text-xs text-blue-600">
            Filtering by: {SEARCH_FILTER_OPTIONS.find(opt => opt.value === searchFilterType)?.label}
          </span>
        )}
      </div>
    </div>
  );
};