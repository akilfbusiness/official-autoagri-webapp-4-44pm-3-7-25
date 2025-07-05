import React from 'react';
import { JobCard, JobCardFormData, CustomerVehicleSuggestion } from '../../types/JobCard';

interface InformationTabProps {
  formData: JobCardFormData;
  onChange: (field: keyof JobCardFormData, value: any) => void;
  editingJobCard?: JobCard | null;
  mode: 'create' | 'edit' | 'view' | 'mechanic' | 'parts';
  restrictedMode?: boolean;
  initialCustomerData?: CustomerVehicleSuggestion | null;
  missingFields: Set<string>;
}

export const InformationTab: React.FC<InformationTabProps> = ({
  formData,
  onChange,
  editingJobCard,
  mode,
  restrictedMode,
  initialCustomerData,
  missingFields,
}) => {
  // This is a placeholder component - the actual implementation would be moved here
  // from the JobCardForm component
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <p className="text-gray-500">Information Tab Component</p>
        <p className="text-sm text-gray-400">This component needs to be implemented with the actual form fields</p>
      </div>
    </div>
  );
};