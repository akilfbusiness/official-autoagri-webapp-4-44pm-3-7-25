import React, { useState, useEffect } from 'react';
import { X, FileText, Wrench, Package, CreditCard, RefreshCw } from 'lucide-react';
import { JobCard, JobCardFormData, CustomerVehicleSuggestion } from '../types/JobCard';
import { useJobCards } from '../hooks/useJobCards';

// Import all the tab components
import { ServiceATaskList } from './ServiceATaskList';
import { ServiceBTaskList } from './ServiceBTaskList';
import { ServiceCTaskList } from './ServiceCTaskList';
import { ServiceDTaskList } from './ServiceDTaskList';
import { TrailerTaskList } from './TrailerTaskList';
import { OtherTaskList } from './OtherTaskList';
import { PartsAndConsumablesTable } from './PartsAndConsumablesTable';
import { LubricantsUsedTable } from './LubricantsUsedTable';
import { ImageUpload } from './ImageUpload';
import { SignaturePad } from './SignaturePad';

interface JobCardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: JobCardFormData) => Promise<void>;
  editingJobCard?: JobCard | null;
  mode: 'create' | 'edit' | 'view' | 'mechanic' | 'parts';
  activeTab: 'information' | 'mechanic' | 'parts' | 'payments';
  onTabChange: (tab: 'information' | 'mechanic' | 'parts' | 'payments') => void;
  restrictedMode?: boolean;
  isWorkerPortalMode?: boolean;
  currentInvalidFieldsMap?: any;
  onRefresh?: () => void;
  initialCustomerData?: CustomerVehicleSuggestion | null;
}

export const JobCardForm: React.FC<JobCardFormProps> = ({
  isOpen,
  onClose,
  onSave,
  editingJobCard,
  mode,
  activeTab,
  onTabChange,
  restrictedMode = false,
  isWorkerPortalMode = false,
  currentInvalidFieldsMap = {},
  onRefresh,
  initialCustomerData,
}) => {
  const { getNextJobNumber, checkJobNumberExists } = useJobCards();
  const [formData, setFormData] = useState<JobCardFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalB, setTotalB] = useState(0);
  const [totalC, setTotalC] = useState(0);

  const isViewMode = mode === 'view';
  const isCreateMode = mode === 'create';
  const isEditMode = mode === 'edit';
  const isMechanicMode = mode === 'mechanic';
  const isPartsMode = mode === 'parts';

  // Initialize form data
  useEffect(() => {
    if (editingJobCard) {
      // Populate form with existing job card data
      setFormData({
        job_number: editingJobCard.job_number,
        job_start_date: editingJobCard.job_start_date?.toISOString().split('T')[0],
        expected_completion_date: editingJobCard.expected_completion_date?.toISOString().split('T')[0],
        completed_date: editingJobCard.completed_date?.toISOString().split('T')[0],
        approximate_cost: editingJobCard.approximate_cost?.toString(),
        customer_name: editingJobCard.customer_name,
        company_name: editingJobCard.company_name,
        abn: editingJobCard.abn,
        mobile: editingJobCard.mobile,
        email: editingJobCard.email,
        vehicle_make: editingJobCard.vehicle_make,
        vehicle_model: editingJobCard.vehicle_model,
        vehicle_month: editingJobCard.vehicle_month,
        vehicle_year: editingJobCard.vehicle_year?.toString(),
        vehicle_kms: editingJobCard.vehicle_kms?.toString(),
        fuel_type: editingJobCard.fuel_type,
        vin: editingJobCard.vin,
        rego: editingJobCard.rego,
        tyre_size: editingJobCard.tyre_size,
        next_service_kms: editingJobCard.next_service_kms?.toString(),
        vehicle_type: editingJobCard.vehicle_type,
        vehicle_state: editingJobCard.vehicle_state,
        service_selection: editingJobCard.service_selection,
        assigned_worker: editingJobCard.assigned_worker,
        assigned_parts: editingJobCard.assigned_parts,
        customer_declaration_authorized: editingJobCard.customer_declaration_authorized,
        service_progress: editingJobCard.service_progress,
        trailer_progress: editingJobCard.trailer_progress,
        other_progress: editingJobCard.other_progress,
        handover_valuables_to_customer: editingJobCard.handover_valuables_to_customer,
        check_all_tyres: editingJobCard.check_all_tyres,
        total_a: editingJobCard.total_a?.toString(),
        future_work_notes: editingJobCard.future_work_notes,
        image_front: editingJobCard.image_front,
        image_back: editingJobCard.image_back,
        image_right_side: editingJobCard.image_right_side,
        image_left_side: editingJobCard.image_left_side,
        invoice_number: editingJobCard.invoice_number,
        part_location: editingJobCard.part_location,
        invoice_date: editingJobCard.invoice_date?.toISOString().split('T')[0],
        invoice_value: editingJobCard.invoice_value?.toString(),
        issue_counter_sale: editingJobCard.issue_counter_sale,
        parts_and_consumables: editingJobCard.parts_and_consumables,
        lubricants_used: editingJobCard.lubricants_used,
        payment_status: editingJobCard.payment_status,
        total_c: editingJobCard.total_c?.toString(),
        customer_signature: editingJobCard.customer_signature,
        supervisor_signature: editingJobCard.supervisor_signature,
      });
    } else if (initialCustomerData) {
      // Populate form with customer data from selection
      setFormData({
        customer_name: initialCustomerData.customer_name,
        company_name: initialCustomerData.company_name,
        abn: initialCustomerData.abn,
        mobile: initialCustomerData.mobile,
        email: initialCustomerData.email,
        vehicle_make: initialCustomerData.vehicle_make,
        vehicle_model: initialCustomerData.vehicle_model,
        vehicle_month: initialCustomerData.vehicle_month,
        vehicle_year: initialCustomerData.vehicle_year?.toString(),
        rego: initialCustomerData.rego,
        vin: initialCustomerData.vin,
        fuel_type: initialCustomerData.fuel_type,
      });
    } else {
      // Reset form for new job card
      setFormData({});
    }
  }, [editingJobCard, initialCustomerData]);

  // Auto-generate job number for new job cards
  useEffect(() => {
    if (isCreateMode && !formData.job_number) {
      const generateJobNumber = async () => {
        const now = new Date();
        const year = now.getFullYear().toString();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        
        try {
          const nextNum = await getNextJobNumber(year, month);
          const jobNumber = `JC-${year.slice(-2)}-${month}-${nextNum}`;
          setFormData(prev => ({ ...prev, job_number: jobNumber }));
        } catch (error) {
          console.error('Error generating job number:', error);
        }
      };
      
      generateJobNumber();
    }
  }, [isCreateMode, formData.job_number, getNextJobNumber]);

  const handleInputChange = (field: keyof JobCardFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isViewMode) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving job card:', error);
      // Don't close the form if there's an error
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTabTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create New Job Card';
      case 'edit':
        return 'Edit Job Card';
      case 'view':
        return 'View Job Card';
      case 'mechanic':
        return 'Mechanic Portal - Edit Job Card';
      case 'parts':
        return 'Parts Portal - Edit Job Card';
      default:
        return 'Job Card';
    }
  };

  const getSubmitButtonText = () => {
    if (isViewMode) return 'Close';
    if (isSubmitting) return 'Saving...';
    if (isCreateMode) return 'Create Job Card';
    if (isMechanicMode) return 'Update Job Card';
    if (isPartsMode) return 'Update Job Card';
    return 'Update Job Card';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 transition-opacity bg-gray-500/75 backdrop-blur-sm" />
        
        {/* Modal */}
        <div className="relative w-full max-w-6xl mx-auto bg-white rounded-xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{getTabTitle()}</h3>
                {formData.job_number && (
                  <p className="text-sm text-gray-500">Job Number: {formData.job_number}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Refresh job card data"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          {!restrictedMode && (
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => onTabChange('information')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'information'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FileText className="h-4 w-4 inline mr-2" />
                  Information
                </button>
                <button
                  onClick={() => onTabChange('mechanic')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'mechanic'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Wrench className="h-4 w-4 inline mr-2" />
                  Mechanic
                </button>
                <button
                  onClick={() => onTabChange('parts')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'parts'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Package className="h-4 w-4 inline mr-2" />
                  Parts
                </button>
                <button
                  onClick={() => onTabChange('payments')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'payments'
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="h-4 w-4 inline mr-2" />
                  Payments
                </button>
              </nav>
            </div>
          )}

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex flex-col h-[80vh]">
            <div className="flex-1 overflow-y-auto p-6">
              {/* Information Tab */}
              {(activeTab === 'information' || restrictedMode) && (
                <div className="space-y-6">
                  {/* Job Information Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Job Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Number</label>
                        <input
                          type="text"
                          value={formData.job_number || ''}
                          onChange={(e) => handleInputChange('job_number', e.target.value)}
                          disabled={isViewMode || !isCreateMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={formData.job_start_date || ''}
                          onChange={(e) => handleInputChange('job_start_date', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expected Completion</label>
                        <input
                          type="date"
                          value={formData.expected_completion_date || ''}
                          onChange={(e) => handleInputChange('expected_completion_date', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Customer Information Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                        <input
                          type="text"
                          value={formData.customer_name || ''}
                          onChange={(e) => handleInputChange('customer_name', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                          type="text"
                          value={formData.company_name || ''}
                          onChange={(e) => handleInputChange('company_name', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                        <input
                          type="tel"
                          value={formData.mobile || ''}
                          onChange={(e) => handleInputChange('mobile', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Vehicle Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                        <input
                          type="text"
                          value={formData.vehicle_make || ''}
                          onChange={(e) => handleInputChange('vehicle_make', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                        <input
                          type="text"
                          value={formData.vehicle_model || ''}
                          onChange={(e) => handleInputChange('vehicle_model', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Registration</label>
                        <input
                          type="text"
                          value={formData.rego || ''}
                          onChange={(e) => handleInputChange('rego', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mechanic Tab */}
              {activeTab === 'mechanic' && (
                <div className="space-y-6">
                  {/* Service Task Lists */}
                  <ServiceATaskList
                    serviceSelection={formData.service_selection}
                    mode={mode}
                    currentProgress={formData.service_progress}
                    onProgressChange={(progress) => handleInputChange('service_progress', progress)}
                    isMandatoryCheckActive={isWorkerPortalMode}
                    initialInvalidFields={currentInvalidFieldsMap.service_progress || {}}
                  />
                  
                  <ServiceBTaskList
                    serviceSelection={formData.service_selection}
                    mode={mode}
                    currentProgress={formData.service_progress}
                    onProgressChange={(progress) => handleInputChange('service_progress', progress)}
                    isMandatoryCheckActive={isWorkerPortalMode}
                    initialInvalidFields={currentInvalidFieldsMap.service_progress || {}}
                  />
                  
                  <ServiceCTaskList
                    serviceSelection={formData.service_selection}
                    mode={mode}
                    currentProgress={formData.service_progress}
                    onProgressChange={(progress) => handleInputChange('service_progress', progress)}
                    isMandatoryCheckActive={isWorkerPortalMode}
                    initialInvalidFields={currentInvalidFieldsMap.service_progress || {}}
                  />
                  
                  <ServiceDTaskList
                    serviceSelection={formData.service_selection}
                    mode={mode}
                    currentProgress={formData.service_progress}
                    onProgressChange={(progress) => handleInputChange('service_progress', progress)}
                    isMandatoryCheckActive={isWorkerPortalMode}
                    initialInvalidFields={currentInvalidFieldsMap.service_progress || {}}
                  />

                  <TrailerTaskList
                    vehicleType={formData.vehicle_type}
                    mode={mode}
                    currentProgress={formData.trailer_progress}
                    onProgressChange={(progress) => handleInputChange('trailer_progress', progress)}
                    isMandatoryCheckActive={isWorkerPortalMode}
                    initialInvalidFields={currentInvalidFieldsMap.trailer_progress || {}}
                  />

                  <OtherTaskList
                    vehicleType={formData.vehicle_type}
                    mode={mode}
                    currentProgress={formData.other_progress}
                    onProgressChange={(progress) => handleInputChange('other_progress', progress)}
                    isMandatoryCheckActive={isWorkerPortalMode}
                    initialInvalidFields={currentInvalidFieldsMap.other_progress || {}}
                  />

                  {/* Vehicle Images */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Vehicle Images</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ImageUpload
                        label="Front View"
                        value={formData.image_front}
                        onChange={(value) => handleInputChange('image_front', value)}
                        disabled={isViewMode}
                      />
                      <ImageUpload
                        label="Back View"
                        value={formData.image_back}
                        onChange={(value) => handleInputChange('image_back', value)}
                        disabled={isViewMode}
                      />
                      <ImageUpload
                        label="Left Side"
                        value={formData.image_left_side}
                        onChange={(value) => handleInputChange('image_left_side', value)}
                        disabled={isViewMode}
                      />
                      <ImageUpload
                        label="Right Side"
                        value={formData.image_right_side}
                        onChange={(value) => handleInputChange('image_right_side', value)}
                        disabled={isViewMode}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Parts Tab */}
              {activeTab === 'parts' && (
                <div className="space-y-6">
                  <PartsAndConsumablesTable
                    parts={formData.parts_and_consumables || []}
                    onChange={(parts) => handleInputChange('parts_and_consumables', parts)}
                    onTotalBChange={setTotalB}
                    mode={mode}
                  />

                  <LubricantsUsedTable
                    lubricants={formData.lubricants_used || []}
                    onChange={(lubricants) => handleInputChange('lubricants_used', lubricants)}
                    onTotalCChange={setTotalC}
                    mode={mode}
                  />
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  {/* Payment Status */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                        <select
                          value={formData.payment_status || 'unpaid'}
                          onChange={(e) => handleInputChange('payment_status', e.target.value)}
                          disabled={isViewMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="paid">Paid</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Signatures</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <SignaturePad
                          value={formData.customer_signature}
                          onChange={(signature) => handleInputChange('customer_signature', signature)}
                          disabled={isViewMode}
                          placeholder="Customer signature"
                        />
                      </div>
                      <div>
                        <SignaturePad
                          value={formData.supervisor_signature}
                          onChange={(signature) => handleInputChange('supervisor_signature', signature)}
                          disabled={isViewMode}
                          placeholder="Supervisor signature"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {getSubmitButtonText()}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};