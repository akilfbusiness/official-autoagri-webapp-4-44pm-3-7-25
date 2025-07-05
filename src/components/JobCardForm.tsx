import React, { useState, useEffect } from 'react';
import { X, Save, FileText, Wrench, Package, CreditCard, AlertTriangle, RefreshCw } from 'lucide-react';
import { JobCard, JobCardFormData, CustomerVehicleSuggestion } from '../types/JobCard';
import { useJobCards } from '../hooks/useJobCards';
import { ImageUpload } from './ImageUpload';
import { SignaturePad } from './SignaturePad';
import { ServiceATaskList } from './ServiceATaskList';
import { ServiceBTaskList } from './ServiceBTaskList';
import { ServiceCTaskList } from './ServiceCTaskList';
import { ServiceDTaskList } from './ServiceDTaskList';
import { TrailerTaskList } from './TrailerTaskList';
import { OtherTaskList } from './OtherTaskList';
import { PartsAndConsumablesTable } from './PartsAndConsumablesTable';
import { LubricantsUsedTable } from './LubricantsUsedTable';

interface JobCardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: JobCardFormData) => Promise<void>;
  editingJobCard?: JobCard | null;
  mode: 'create' | 'edit' | 'view' | 'mechanic' | 'parts';
  activeTab: 'information' | 'mechanic' | 'parts' | 'payments';
  onTabChange: (tab: 'information' | 'mechanic' | 'parts' | 'payments') => void;
  restrictedMode?: boolean;
  onRefresh?: () => void;
  initialCustomerData?: CustomerVehicleSuggestion | null;
}

type FormTabType = 'information' | 'mechanic' | 'parts' | 'payments';

export const JobCardForm: React.FC<JobCardFormProps> = ({
  isOpen,
  onClose,
  onSave,
  editingJobCard,
  mode,
  activeTab,
  onTabChange,
  restrictedMode = false,
  onRefresh,
  initialCustomerData,
}) => {
  const { getNextJobNumber, checkJobNumberExists } = useJobCards();
  const [formData, setFormData] = useState<JobCardFormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [totalB, setTotalB] = useState(0);
  const [totalC, setTotalC] = useState(0);

  // Initialize form data
  useEffect(() => {
    if (isOpen) {
      if (mode === 'create') {
        // Initialize with customer data if provided
        const initialData: JobCardFormData = {
          job_number_year: new Date().getFullYear().toString().slice(-2),
          job_number_month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
          job_number_num: '',
          job_start_date: new Date().toISOString().split('T')[0],
          customer_declaration_authorized: false,
          vehicle_type: [],
          payment_status: 'unpaid',
          service_progress: [],
          trailer_progress: [],
          other_progress: [],
          parts_and_consumables: [],
          lubricants_used: [],
        };

        // Pre-fill with customer data if available
        if (initialCustomerData) {
          initialData.customer_name = initialCustomerData.customer_name || '';
          initialData.company_name = initialCustomerData.company_name || '';
          initialData.abn = initialCustomerData.abn || '';
          initialData.mobile = initialCustomerData.mobile || '';
          initialData.email = initialCustomerData.email || '';
          initialData.vehicle_make = initialCustomerData.vehicle_make || '';
          initialData.vehicle_model = initialCustomerData.vehicle_model || '';
          initialData.vehicle_month = initialCustomerData.vehicle_month || '';
          initialData.vehicle_year = initialCustomerData.vehicle_year?.toString() || '';
          initialData.rego = initialCustomerData.rego || '';
          initialData.vin = initialCustomerData.vin || '';
          initialData.fuel_type = initialCustomerData.fuel_type || '';
        }

        setFormData(initialData);
        generateJobNumber(initialData.job_number_year!, initialData.job_number_month!);
      } else if (editingJobCard) {
        // Convert JobCard to JobCardFormData for editing
        const editData: JobCardFormData = {
          job_number: editingJobCard.job_number || '',
          job_start_date: editingJobCard.job_start_date?.toISOString().split('T')[0] || '',
          expected_completion_date: editingJobCard.expected_completion_date?.toISOString().split('T')[0] || '',
          completed_date: editingJobCard.completed_date?.toISOString().split('T')[0] || '',
          approximate_cost: editingJobCard.approximate_cost?.toString() || '',
          customer_name: editingJobCard.customer_name || '',
          company_name: editingJobCard.company_name || '',
          abn: editingJobCard.abn || '',
          mobile: editingJobCard.mobile || '',
          email: editingJobCard.email || '',
          vehicle_make: editingJobCard.vehicle_make || '',
          vehicle_model: editingJobCard.vehicle_model || '',
          vehicle_month: editingJobCard.vehicle_month || '',
          vehicle_year: editingJobCard.vehicle_year?.toString() || '',
          vehicle_kms: editingJobCard.vehicle_kms?.toString() || '',
          fuel_type: editingJobCard.fuel_type || '',
          vin: editingJobCard.vin || '',
          rego: editingJobCard.rego || '',
          tyre_size: editingJobCard.tyre_size || '',
          next_service_kms: editingJobCard.next_service_kms?.toString() || '',
          vehicle_type: editingJobCard.vehicle_type || [],
          vehicle_state: editingJobCard.vehicle_state || '',
          service_selection: editingJobCard.service_selection || '',
          assigned_worker: editingJobCard.assigned_worker || '',
          assigned_parts: editingJobCard.assigned_parts || '',
          is_worker_assigned_complete: editingJobCard.is_worker_assigned_complete || false,
          is_parts_assigned_complete: editingJobCard.is_parts_assigned_complete || false,
          customer_declaration_authorized: editingJobCard.customer_declaration_authorized || false,
          service_progress: editingJobCard.service_progress || [],
          trailer_progress: editingJobCard.trailer_progress || [],
          other_progress: editingJobCard.other_progress || [],
          handover_valuables_to_customer: editingJobCard.handover_valuables_to_customer || '',
          check_all_tyres: editingJobCard.check_all_tyres || '',
          total_a: editingJobCard.total_a?.toString() || '',
          future_work_notes: editingJobCard.future_work_notes || '',
          image_front: editingJobCard.image_front || '',
          image_back: editingJobCard.image_back || '',
          image_right_side: editingJobCard.image_right_side || '',
          image_left_side: editingJobCard.image_left_side || '',
          invoice_number: editingJobCard.invoice_number || '',
          part_location: editingJobCard.part_location || '',
          invoice_date: editingJobCard.invoice_date?.toISOString().split('T')[0] || '',
          invoice_value: editingJobCard.invoice_value?.toString() || '',
          issue_counter_sale: editingJobCard.issue_counter_sale || '',
          parts_and_consumables: editingJobCard.parts_and_consumables || [],
          lubricants_used: editingJobCard.lubricants_used || [],
          payment_status: editingJobCard.payment_status || 'unpaid',
          total_c: editingJobCard.total_c?.toString() || '',
          customer_signature: editingJobCard.customer_signature || '',
          supervisor_signature: editingJobCard.supervisor_signature || '',
        };
        setFormData(editData);
      }
    }
  }, [isOpen, mode, editingJobCard, initialCustomerData]);

  // Generate job number for new job cards
  const generateJobNumber = async (year: string, month: string) => {
    try {
      const nextNum = await getNextJobNumber(year, month);
      const jobNumber = `JC-${year}-${month}-${nextNum}`;
      setFormData(prev => ({
        ...prev,
        job_number_num: nextNum,
        job_number: jobNumber
      }));
    } catch (error) {
      console.error('Error generating job number:', error);
    }
  };

  // Handle year/month changes for job number
  const handleJobNumberChange = async (field: 'year' | 'month', value: string) => {
    const updatedData = {
      ...formData,
      [`job_number_${field}`]: value
    };
    setFormData(updatedData);

    if (updatedData.job_number_year && updatedData.job_number_month) {
      await generateJobNumber(updatedData.job_number_year, updatedData.job_number_month);
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    // Only validate assignment fields for create mode
    if (mode === 'create') {
      if (!formData.assigned_worker || formData.assigned_worker === 'Select worker') {
        errors.assigned_worker = 'Assigned Worker is required when creating a job card';
      }

      if (!formData.assigned_parts || formData.assigned_parts === 'Select parts team') {
        errors.assigned_parts = 'Assigned Parts is required when creating a job card';
      }
    }

    // Validate trailer task completion for mechanic mode
    if (mode === 'mechanic' && formData.vehicle_type?.includes('Trailer')) {
      const trailerProgress = formData.trailer_progress?.[0];
      if (trailerProgress) {
        let hasIncompleteTrailerTasks = false;
        const trailerErrors: any = {};

        // Check electrical tasks
        if (trailerProgress.electrical_tasks) {
          trailerProgress.electrical_tasks.forEach((task, index) => {
            const taskErrors: any = {};
            if (!task.status) {
              taskErrors.status = true;
              hasIncompleteTrailerTasks = true;
            }
            if (!task.description || task.description.trim() === '') {
              taskErrors.description = true;
              hasIncompleteTrailerTasks = true;
            }
            if (!task.done_by || task.done_by.trim() === '') {
              taskErrors.done_by = true;
              hasIncompleteTrailerTasks = true;
            }
            if (Object.keys(taskErrors).length > 0) {
              if (!trailerErrors.electrical_tasks) trailerErrors.electrical_tasks = {};
              trailerErrors.electrical_tasks[index] = taskErrors;
            }
          });
        }

        // Check other task types similarly...
        ['tires_wheels_tasks', 'brake_system_tasks', 'suspension_tasks', 'body_chassis_tasks'].forEach(taskType => {
          const tasks = (trailerProgress as any)[taskType];
          if (tasks) {
            tasks.forEach((task: any, index: number) => {
              const taskErrors: any = {};
              if (!task.status) {
                taskErrors.status = true;
                hasIncompleteTrailerTasks = true;
              }
              if (!task.description || task.description.trim() === '') {
                taskErrors.description = true;
                hasIncompleteTrailerTasks = true;
              }
              if (!task.done_by || task.done_by.trim() === '') {
                taskErrors.done_by = true;
                hasIncompleteTrailerTasks = true;
              }
              if (Object.keys(taskErrors).length > 0) {
                if (!(trailerErrors as any)[taskType]) (trailerErrors as any)[taskType] = {};
                (trailerErrors as any)[taskType][index] = taskErrors;
              }
            });
          }
        });

        if (hasIncompleteTrailerTasks) {
          errors.trailer_tasks = 'All trailer task fields (Status, Description, Done By) must be completed before finishing the job';
          errors.trailer_validation = JSON.stringify(trailerErrors);
        }
      }
    }

    // Validate other task completion for mechanic mode
    if (mode === 'mechanic' && formData.vehicle_type?.includes('Other')) {
      const otherProgress = formData.other_progress || [];
      let hasIncompleteOtherTasks = false;

      otherProgress.forEach((task, index) => {
        // Only validate tasks that have some data entered
        const hasData = task.task_name || task.description || task.done_by || task.hours;
        if (hasData) {
          if (!task.status) {
            hasIncompleteOtherTasks = true;
          }
          if (!task.description || task.description.trim() === '') {
            hasIncompleteOtherTasks = true;
          }
          if (!task.done_by || task.done_by.trim() === '') {
            hasIncompleteOtherTasks = true;
          }
        }
      });

      if (hasIncompleteOtherTasks) {
        errors.other_tasks = 'All other task fields (Status, Description, Done By) must be completed for tasks with data';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // If there are trailer validation errors, switch to mechanic tab
      if (validationErrors.trailer_tasks) {
        onTabChange('mechanic');
      }
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving job card:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle save changes (without completion validation)
  const handleSaveChanges = async () => {
    // Create a copy of formData without completion validation
    const saveData = { ...formData };
    
    setIsLoading(true);
    try {
      await onSave(saveData);
      // Don't close the form, just show success feedback
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle field changes
  const handleFieldChange = (field: keyof JobCardFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle vehicle type changes
  const handleVehicleTypeChange = (type: string, checked: boolean) => {
    const currentTypes = formData.vehicle_type || [];
    let newTypes;
    
    if (checked) {
      newTypes = [...currentTypes, type];
    } else {
      newTypes = currentTypes.filter(t => t !== type);
    }
    
    handleFieldChange('vehicle_type', newTypes);
  };

  // Calculate grand total
  const calculateGrandTotal = () => {
    const totalA = parseFloat(formData.total_a || '0');
    return totalA + totalB + totalC;
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const isCreateMode = mode === 'create';
  const isMechanicMode = mode === 'mechanic';
  const isPartsMode = mode === 'parts';

  // Determine which tabs to show based on mode
  const availableTabs: FormTabType[] = (() => {
    if (isMechanicMode) return ['mechanic'];
    if (isPartsMode) return ['parts'];
    return ['information', 'mechanic', 'parts', 'payments'];
  })();

  // Get tab icon
  const getTabIcon = (tab: FormTabType) => {
    switch (tab) {
      case 'information': return <FileText className="h-4 w-4" />;
      case 'mechanic': return <Wrench className="h-4 w-4" />;
      case 'parts': return <Package className="h-4 w-4" />;
      case 'payments': return <CreditCard className="h-4 w-4" />;
    }
  };

  // Get tab color
  const getTabColor = (tab: FormTabType) => {
    switch (tab) {
      case 'information': return 'text-blue-600 border-blue-500';
      case 'mechanic': return 'text-green-600 border-green-500';
      case 'parts': return 'text-purple-600 border-purple-500';
      case 'payments': return 'text-orange-600 border-orange-500';
    }
  };

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
                <h3 className="text-lg font-semibold text-gray-900">
                  {isCreateMode ? 'Create New Job Card' : 
                   isMechanicMode ? 'Mechanic Portal - Edit Job Card' :
                   isPartsMode ? 'Parts Portal - Edit Job Card' :
                   isViewMode ? 'View Job Card' : 'Edit Job Card'}
                </h3>
                <p className="text-sm text-gray-500">
                  Job Number: {formData.job_number || 'Generating...'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Validation Errors */}
          {Object.keys(validationErrors).length > 0 && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-900">Please fix the following errors:</h4>
                  <ul className="mt-2 text-sm text-red-700 space-y-1">
                    {Object.entries(validationErrors).map(([field, error]) => {
                      if (field === 'trailer_validation') return null; // Skip internal validation data
                      return (
                        <li key={field}>• {error}</li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex px-6">
              {availableTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? getTabColor(tab)
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {getTabIcon(tab)}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto">
            <div className="p-6">
              {/* Information Tab */}
              {activeTab === 'information' && (
                <div className="space-y-8">
                  {/* Job Information Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Job Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Job Number Generation */}
                      {isCreateMode && (
                        <div className="lg:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Number
                          </label>
                          <div className="flex gap-2 items-center">
                            <span className="text-sm text-gray-500">JC-</span>
                            <select
                              value={formData.job_number_year || ''}
                              onChange={(e) => handleJobNumberChange('year', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {Array.from({ length: 5 }, (_, i) => {
                                const year = new Date().getFullYear() - 2 + i;
                                return (
                                  <option key={year} value={year.toString().slice(-2)}>
                                    {year.toString().slice(-2)}
                                  </option>
                                );
                              })}
                            </select>
                            <span className="text-sm text-gray-500">-</span>
                            <select
                              value={formData.job_number_month || ''}
                              onChange={(e) => handleJobNumberChange('month', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {Array.from({ length: 12 }, (_, i) => {
                                const month = (i + 1).toString().padStart(2, '0');
                                return (
                                  <option key={month} value={month}>
                                    {month}
                                  </option>
                                );
                              })}
                            </select>
                            <span className="text-sm text-gray-500">-</span>
                            <input
                              type="text"
                              value={formData.job_number_num || ''}
                              readOnly
                              className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 w-16"
                            />
                            <span className="text-sm font-medium text-blue-600">
                              = {formData.job_number || 'Generating...'}
                            </span>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Start Date
                        </label>
                        <input
                          type="date"
                          value={formData.job_start_date || ''}
                          onChange={(e) => handleFieldChange('job_start_date', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expected Completion Date
                        </label>
                        <input
                          type="date"
                          value={formData.expected_completion_date || ''}
                          onChange={(e) => handleFieldChange('expected_completion_date', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Completed Date
                        </label>
                        <input
                          type="date"
                          value={formData.completed_date || ''}
                          onChange={(e) => handleFieldChange('completed_date', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Approximate Cost
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.approximate_cost || ''}
                          onChange={(e) => handleFieldChange('approximate_cost', e.target.value)}
                          disabled={isViewMode}
                          placeholder="0.00"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Customer Information Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Customer Name
                        </label>
                        <input
                          type="text"
                          value={formData.customer_name || ''}
                          onChange={(e) => handleFieldChange('customer_name', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={formData.company_name || ''}
                          onChange={(e) => handleFieldChange('company_name', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ABN
                        </label>
                        <input
                          type="text"
                          value={formData.abn || ''}
                          onChange={(e) => handleFieldChange('abn', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile
                        </label>
                        <input
                          type="tel"
                          value={formData.mobile || ''}
                          onChange={(e) => handleFieldChange('mobile', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => handleFieldChange('email', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Vehicle Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle Make
                        </label>
                        <input
                          type="text"
                          value={formData.vehicle_make || ''}
                          onChange={(e) => handleFieldChange('vehicle_make', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle Model
                        </label>
                        <input
                          type="text"
                          value={formData.vehicle_model || ''}
                          onChange={(e) => handleFieldChange('vehicle_model', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle Month
                        </label>
                        <select
                          value={formData.vehicle_month || ''}
                          onChange={(e) => handleFieldChange('vehicle_month', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        >
                          <option value="">Select Month</option>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = (i + 1).toString().padStart(2, '0');
                            const monthName = new Date(2000, i, 1).toLocaleString('default', { month: 'long' });
                            return (
                              <option key={month} value={month}>
                                {monthName}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle Year
                        </label>
                        <input
                          type="number"
                          min="1900"
                          max="2100"
                          value={formData.vehicle_year || ''}
                          onChange={(e) => handleFieldChange('vehicle_year', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle KMs
                        </label>
                        <input
                          type="number"
                          value={formData.vehicle_kms || ''}
                          onChange={(e) => handleFieldChange('vehicle_kms', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fuel Type
                        </label>
                        <select
                          value={formData.fuel_type || ''}
                          onChange={(e) => handleFieldChange('fuel_type', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        >
                          <option value="">Select Fuel Type</option>
                          <option value="Petrol">Petrol</option>
                          <option value="Diesel">Diesel</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          VIN
                        </label>
                        <input
                          type="text"
                          value={formData.vin || ''}
                          onChange={(e) => handleFieldChange('vin', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          REGO
                        </label>
                        <input
                          type="text"
                          value={formData.rego || ''}
                          onChange={(e) => handleFieldChange('rego', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle State
                        </label>
                        <select
                          value={formData.vehicle_state || ''}
                          onChange={(e) => handleFieldChange('vehicle_state', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        >
                          <option value="">Select State</option>
                          <option value="NSW">NSW</option>
                          <option value="VIC">VIC</option>
                          <option value="QLD">QLD</option>
                          <option value="WA">WA</option>
                          <option value="SA">SA</option>
                          <option value="TAS">TAS</option>
                          <option value="ACT">ACT</option>
                          <option value="NT">NT</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tyre Size
                        </label>
                        <input
                          type="text"
                          value={formData.tyre_size || ''}
                          onChange={(e) => handleFieldChange('tyre_size', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Next Service KMs
                        </label>
                        <input
                          type="number"
                          value={formData.next_service_kms || ''}
                          onChange={(e) => handleFieldChange('next_service_kms', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      {/* Vehicle Type */}
                      <div className="lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle Type
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {['HR Truck', 'Prime Mover', 'Trailer', 'Other'].map((type) => (
                            <label key={type} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.vehicle_type?.includes(type) || false}
                                onChange={(e) => handleVehicleTypeChange(type, e.target.checked)}
                                disabled={isViewMode}
                                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Service Selection - Only show for HR Truck or Prime Mover */}
                      {(formData.vehicle_type?.includes('HR Truck') || formData.vehicle_type?.includes('Prime Mover')) && (
                        <div className="lg:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Service Selection
                          </label>
                          <select
                            value={formData.service_selection || ''}
                            onChange={(e) => handleFieldChange('service_selection', e.target.value)}
                            disabled={isViewMode}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              isViewMode ? 'bg-gray-50' : ''
                            }`}
                          >
                            <option value="">Select Service</option>
                            <option value="Service A">Service A</option>
                            <option value="Service B">Service B</option>
                            <option value="Service C">Service C</option>
                            <option value="Service D">Service D</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Assignments Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Assignments</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assigned Worker
                          {isCreateMode && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <select
                          value={formData.assigned_worker || ''}
                          onChange={(e) => handleFieldChange('assigned_worker', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50 border-gray-300' : 
                            validationErrors.assigned_worker ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select worker</option>
                          <option value="Worker 1">Worker 1</option>
                          <option value="Worker 2">Worker 2</option>
                          <option value="Worker 3">Worker 3</option>
                          <option value="Worker 4">Worker 4</option>
                        </select>
                        {validationErrors.assigned_worker && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.assigned_worker}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assigned Parts
                          {isCreateMode && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <select
                          value={formData.assigned_parts || ''}
                          onChange={(e) => handleFieldChange('assigned_parts', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50 border-gray-300' : 
                            validationErrors.assigned_parts ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select parts team</option>
                          <option value="Parts 1">Parts 1</option>
                          <option value="Parts 2">Parts 2</option>
                          <option value="Parts 3">Parts 3</option>
                          <option value="Parts 4">Parts 4</option>
                        </select>
                        {validationErrors.assigned_parts && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.assigned_parts}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customer Declaration */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Customer Declaration</h4>
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={formData.customer_declaration_authorized || false}
                        onChange={(e) => handleFieldChange('customer_declaration_authorized', e.target.checked)}
                        disabled={isViewMode}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">
                          I authorize AutoAgri Australia to perform the requested service
                        </span>
                        <p className="text-gray-600 mt-1">
                          By checking this box, the customer confirms authorization for the service work to be performed.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Mechanic Tab */}
              {activeTab === 'mechanic' && (
                <div className="space-y-8">
                  {/* Service Task Lists */}
                  <ServiceATaskList
                    serviceSelection={formData.service_selection}
                    mode={mode}
                    currentProgress={formData.service_progress}
                    onProgressChange={(progress) => handleFieldChange('service_progress', progress)}
                  />

                  <ServiceBTaskList
                    serviceSelection={formData.service_selection}
                    mode={mode}
                    currentProgress={formData.service_progress}
                    onProgressChange={(progress) => handleFieldChange('service_progress', progress)}
                  />

                  <ServiceCTaskList
                    serviceSelection={formData.service_selection}
                    mode={mode}
                    currentProgress={formData.service_progress}
                    onProgressChange={(progress) => handleFieldChange('service_progress', progress)}
                  />

                  <ServiceDTaskList
                    serviceSelection={formData.service_selection}
                    mode={mode}
                    currentProgress={formData.service_progress}
                    onProgressChange={(progress) => handleFieldChange('service_progress', progress)}
                  />

                  {/* Trailer Task List */}
                  <TrailerTaskList
                    vehicleType={formData.vehicle_type}
                    mode={mode}
                    currentProgress={formData.trailer_progress}
                    onProgressChange={(progress) => handleFieldChange('trailer_progress', progress)}
                    isMandatoryCheckActive={isMechanicMode && !!validationErrors.trailer_tasks}
                    initialInvalidFields={validationErrors.trailer_validation ? JSON.parse(validationErrors.trailer_validation) : {}}
                  />

                  {/* Other Task List */}
                  <OtherTaskList
                    vehicleType={formData.vehicle_type}
                    mode={mode}
                    currentProgress={formData.other_progress}
                    onProgressChange={(progress) => handleFieldChange('other_progress', progress)}
                  />

                  {/* Mechanic Sections */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Mechanic Sections</h4>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Handover Valuables to Customer
                        </label>
                        <textarea
                          value={formData.handover_valuables_to_customer || ''}
                          onChange={(e) => handleFieldChange('handover_valuables_to_customer', e.target.value)}
                          disabled={isViewMode}
                          rows={3}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                          placeholder="Notes about valuables handover..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Check All Tyres
                        </label>
                        <textarea
                          value={formData.check_all_tyres || ''}
                          onChange={(e) => handleFieldChange('check_all_tyres', e.target.value)}
                          disabled={isViewMode}
                          rows={3}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                          placeholder="Tyre inspection notes..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total A (Manual Entry)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.total_a || ''}
                          onChange={(e) => handleFieldChange('total_a', e.target.value)}
                          disabled={isViewMode}
                          placeholder="0.00"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Future Work Notes
                        </label>
                        <textarea
                          value={formData.future_work_notes || ''}
                          onChange={(e) => handleFieldChange('future_work_notes', e.target.value)}
                          disabled={isViewMode}
                          rows={4}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                          placeholder="Recommendations for future work..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Images */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Vehicle Images</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ImageUpload
                        label="Front View"
                        value={formData.image_front}
                        onChange={(value) => handleFieldChange('image_front', value)}
                        disabled={isViewMode}
                      />
                      <ImageUpload
                        label="Back View"
                        value={formData.image_back}
                        onChange={(value) => handleFieldChange('image_back', value)}
                        disabled={isViewMode}
                      />
                      <ImageUpload
                        label="Right Side"
                        value={formData.image_right_side}
                        onChange={(value) => handleFieldChange('image_right_side', value)}
                        disabled={isViewMode}
                      />
                      <ImageUpload
                        label="Left Side"
                        value={formData.image_left_side}
                        onChange={(value) => handleFieldChange('image_left_side', value)}
                        disabled={isViewMode}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Parts Tab */}
              {activeTab === 'parts' && (
                <div className="space-y-8">
                  {/* Parts Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Parts Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Invoice Number
                        </label>
                        <input
                          type="text"
                          value={formData.invoice_number || ''}
                          onChange={(e) => handleFieldChange('invoice_number', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Part Location
                        </label>
                        <input
                          type="text"
                          value={formData.part_location || ''}
                          onChange={(e) => handleFieldChange('part_location', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Invoice Date
                        </label>
                        <input
                          type="date"
                          value={formData.invoice_date || ''}
                          onChange={(e) => handleFieldChange('invoice_date', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Invoice Value
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.invoice_value || ''}
                          onChange={(e) => handleFieldChange('invoice_value', e.target.value)}
                          disabled={isViewMode}
                          placeholder="0.00"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Issue Counter Sale
                        </label>
                        <input
                          type="text"
                          value={formData.issue_counter_sale || ''}
                          onChange={(e) => handleFieldChange('issue_counter_sale', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Parts and Consumables Table */}
                  <PartsAndConsumablesTable
                    parts={formData.parts_and_consumables || []}
                    onChange={(parts) => handleFieldChange('parts_and_consumables', parts)}
                    onTotalBChange={setTotalB}
                    mode={mode}
                  />

                  {/* Lubricants Used Table */}
                  <LubricantsUsedTable
                    lubricants={formData.lubricants_used || []}
                    onChange={(lubricants) => handleFieldChange('lubricants_used', lubricants)}
                    onTotalCChange={setTotalC}
                    mode={mode}
                  />
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === 'payments' && (
                <div className="space-y-8">
                  {/* Payment Status */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Status</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Status
                        </label>
                        <select
                          value={formData.payment_status || 'unpaid'}
                          onChange={(e) => handleFieldChange('payment_status', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="paid">Paid</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Cost Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Cost Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-blue-900">Total A (Labor)</div>
                        <div className="text-2xl font-bold text-blue-900">
                          ${parseFloat(formData.total_a || '0').toFixed(2)}
                        </div>
                      </div>

                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-purple-900">Total B (Parts)</div>
                        <div className="text-2xl font-bold text-purple-900">
                          ${totalB.toFixed(2)}
                        </div>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-green-900">Total C (Lubricants)</div>
                        <div className="text-2xl font-bold text-green-900">
                          ${totalC.toFixed(2)}
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-yellow-900">Grand Total</div>
                        <div className="text-2xl font-bold text-yellow-900">
                          ${calculateGrandTotal().toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Signatures</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Customer Signature
                        </label>
                        <SignaturePad
                          value={formData.customer_signature}
                          onChange={(signature) => handleFieldChange('customer_signature', signature)}
                          disabled={isViewMode}
                          placeholder="Customer signature"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Supervisor Signature
                        </label>
                        <SignaturePad
                          value={formData.supervisor_signature}
                          onChange={(signature) => handleFieldChange('supervisor_signature', signature)}
                          disabled={isViewMode}
                          placeholder="Supervisor signature"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
            <div className="flex items-center gap-3">
              {onRefresh && !isViewMode && (
                <button
                  type="button"
                  onClick={onRefresh}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                {isViewMode ? 'Close' : 'Cancel'}
              </button>

              {!isViewMode && (
                <>
                  {/* Save Changes button for mechanic/parts modes */}
                  {(isMechanicMode || isPartsMode) && (
                    <button
                      type="button"
                      onClick={handleSaveChanges}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save Changes
                    </button>
                  )}

                  {/* Complete/Save button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 ${
                      isMechanicMode || isPartsMode
                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                    }`}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isMechanicMode || isPartsMode ? 'Complete' : isCreateMode ? 'Create Job Card' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};