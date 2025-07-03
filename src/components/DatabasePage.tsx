import React, { useState } from 'react';
import { Database, Archive, Eye, FileText } from 'lucide-react';
import { DatabaseContent } from './DatabaseContent';
import { useJobCards } from '../hooks/useJobCards';
import { JobCard } from '../types/JobCard';

interface DatabasePageProps {
  onEdit: (jobCard: JobCard) => void;
  onView: (jobCard: JobCard) => void;
  onArchive: (jobCard: JobCard) => void;
  onUnarchive: (jobCard: JobCard) => void;
  onDelete: (jobCard: JobCard) => void;
  onConfirmDownload?: (jobCard: JobCard) => void;
}

export const DatabasePage: React.FC<DatabasePageProps> = ({
  onEdit,
  onView,
  onArchive,
  onUnarchive,
  onDelete,
  onConfirmDownload,
}) => {
  const [showDatabaseContent, setShowDatabaseContent] = useState(false);
  const { fetchArchivedJobCardsDirectly } = useJobCards();

  const handleShowDatabase = () => {
    setShowDatabaseContent(true);
  };

  if (showDatabaseContent) {
    return (
      <DatabaseContent
        fetchArchivedJobCardsDirectly={fetchArchivedJobCardsDirectly}
        onEdit={onEdit}
        onView={onView}
        onArchive={onArchive}
        onUnarchive={onUnarchive}
        onDelete={onDelete}
        onConfirmDownload={onConfirmDownload}
      />
    );
  }

  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        {/* Icon */}
        <div className="flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mx-auto mb-8">
          <Database className="h-12 w-12 text-blue-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Archived Job Cards Database
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Access the complete archive of all historical job cards with advanced search, 
          filtering, and sorting capabilities. This comprehensive database contains all 
          completed and archived job cards from your system.
        </p>

        {/* Features List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="flex items-start gap-3 text-left">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg flex-shrink-0 mt-1">
              <Archive className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Complete Archive</h3>
              <p className="text-sm text-gray-600">Access all archived job cards with full historical data</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-left">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg flex-shrink-0 mt-1">
              <Eye className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Advanced Search</h3>
              <p className="text-sm text-gray-600">Search by customer, vehicle, dates, and status</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-left">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg flex-shrink-0 mt-1">
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Detailed Filtering</h3>
              <p className="text-sm text-gray-600">Filter by payment status, completion status, and dates</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-left">
            <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-lg flex-shrink-0 mt-1">
              <Database className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Export & Download</h3>
              <p className="text-sm text-gray-600">Download PDFs and export data for reporting</p>
            </div>
          </div>
        </div>

        {/* Show Database Button */}
        <button
          onClick={handleShowDatabase}
          className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Database className="h-6 w-6" />
          Show Database
        </button>

        {/* Note */}
        <p className="text-sm text-gray-500 mt-6">
          This will load all archived job cards. Depending on your data size, this may take a moment.
        </p>
      </div>
    </div>
  );
};