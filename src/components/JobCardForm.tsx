import React, { useState, useEffect } from 'react';
import { X, FileText, User, Car, Wrench, Package, CreditCard, RefreshCw } from 'lucide-react';
import { JobCard, JobCardFormData, CustomerVehicleSuggestion } from '../types/JobCard';
import { useJobCards } from '../hooks/useJobCards';
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
  onRefresh,
  initialCustomerData,
}) => {
  const { getNextJobNumber, checkJobNumberExists } = useJobCards();
  const [formData, setFormData] = useState<JobCardFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalB, setTotalB] = useState(0);
  const [totalC, setTotalC] = useState(0);

  const isViewMode = mode === 'view';
  const isMechanicMode = mode === 'mechanic';
  const isPartsMode = mode === 'parts';
  const isCreateMode = mode === 'create';
  const isEditMode = mode === 'edit';

  // Check if mandatory field validation should be active
  const isMandatoryCheckActive = (isMechanicMode || isPartsMode) && editingJobCard && !isViewMode;

  // Initialize form data
  useEffect(() => {
    if (editingJobCard) {
      // Editing existing job card
      setFormData({
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
        customer_declaration_authorized: editingJobCard.customer_declaration_authorized || false,
        service_progress: editingJobCard.service_progress || [],
        trailer_progress: editingJobCard.trailer_progress || [],
        other_progress: editingJobCard.other_progress || [],
        handover_valuables_to_customer: editingJobCard.handover_valuables_to_customer || '',
        check_all_tyres: editingJobCard.check_all_tyres || '',
        total_a: editingJobCard.total_a?.toString() || '',
        future_work_notes: editingJobCard.future_work_notes || '',
        image_front: editingJobCard.image_front,
        image_back: editingJobCard.image_back,
        image_right_side: editingJobCard.image_right_side,
        image_left_side: editingJobCard.image_left_side,
        invoice_number: editingJobCard.invoice_number || '',
        part_location: editingJobCard.part_location || '',
        invoice_date: editingJobCard.invoice_date?.toISOString().split('T')[0] || '',
        invoice_value: editingJobCard.invoice_value?.toString() || '',
        issue_counter_sale: editingJobCard.issue_counter_sale || '',
        parts_and_consumables: editingJobCard.parts_and_consumables || [],
        lubricants_used: editingJobCard.lubricants_used || [],
        payment_status: editingJobCard.payment_status || 'unpaid',
        total_c: editingJobCard.total_c?.toString() || '',
        customer_signature: editingJobCard.customer_signature,
        supervisor_signature: editingJobCard.supervisor_signature,
      });
    } else if (initialCustomerData) {
      // Creating new job card with customer data
      const currentDate = new Date();
      const year = currentDate.getFullYear().toString();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      
      setFormData({
        job_number_year: year.slice(-2),
        job_number_month: month,
        job_number_num: '',
        job_start_date: currentDate.toISOString().split('T')[0],
        expected_completion_date: '',
        completed_date: '',
        approximate_cost: '',
        customer_name: initialCustomerData.customer_name || '',
        company_name: initialCustomerData.company_name || '',
        abn: initialCustomerData.abn || '',
        mobile: initialCustomerData.mobile || '',
        email: initialCustomerData.email || '',
        vehicle_make: initialCustomerData.vehicle_make || '',
        vehicle_model: initialCustomerData.vehicle_model || '',
        vehicle_month: initialCustomerData.vehicle_month || '',
        vehicle_year: initialCustomerData.vehicle_year?.toString() || '',
        vehicle_kms: '',
        fuel_type: initialCustomerData.fuel_type || '',
        vin: initialCustomerData.vin || '',
        rego: initialCustomerData.rego || '',
        tyre_size: '',
        next_service_kms: '',
        vehicle_type: [],
        vehicle_state: '',
        service_selection: '',
        assigned_worker: '',
        assigned_parts: '',
        customer_declaration_authorized: false,
        service_progress: [],
        trailer_progress: [],
        other_progress: [],
        handover_valuables_to_customer: '',
        check_all_tyres: '',
        total_a: '',
        future_work_notes: '',
        invoice_number: '',
        part_location: '',
        invoice_date: '',
        invoice_value: '',
        issue_counter_sale: '',
        parts_and_consumables: [],
        lubricants_used: [],
        payment_status: 'unpaid',
        total_c: '',
      });
    } else {
      // Creating new job card without customer data
      const currentDate = new Date();
      const year = currentDate.getFullYear().toString();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      
      setFormData({
        job_number_year: year.slice(-2),
        job_number_month: month,
        job_number_num: '',
        job_start_date: currentDate.toISOString().split('T')[0],
        expected_completion_date: '',
        completed_date: '',
        approximate_cost: '',
        customer_name: '',
        company_name: '',
        abn: '',
        mobile: '',
        email: '',
        vehicle_make: '',
        vehicle_model: '',
        vehicle_month: '',
        vehicle_year: '',
        vehicle_kms: '',
        fuel_type: '',
        vin: '',
        rego: '',
        tyre_size: '',
        next_service_kms: '',
        vehicle_type: [],
        vehicle_state: '',
        service_selection: '',
        assigned_worker: '',
        assigned_parts: '',
        customer_declaration_authorized: false,
        service_progress: [],
        trailer_progress: [],
        other_progress: [],
        handover_valuables_to_customer: '',
        check_all_tyres: '',
        total_a: '',
        future_work_notes: '',
        invoice_number: '',
        part_location: '',
        invoice_date: '',
        invoice_value: '',
        issue_counter_sale: '',
        parts_and_consumables: [],
        lubricants_used: [],
        payment_status: 'unpaid',
        total_c: '',
      });
    }
  }, [editingJobCard, initialCustomerData]);

  // Auto-generate job number for new job cards
  useEffect(() => {
    if (isCreateMode && formData.job_number_year && formData.job_number_month && !formData.job_number_num) {
      const generateJobNumber = async () => {
        try {
          const nextNum = await getNextJobNumber(`20${formData.job_number_year}`, formData.job_number_month);
          setFormData(prev => ({ ...prev, job_number_num: nextNum }));
        } catch (error) {
          console.error('Error generating job number:', error);
        }
      };
      generateJobNumber();
    }
  }, [isCreateMode, formData.job_number_year, formData.job_number_month, formData.job_number_num, getNextJobNumber]);

  // Update full job number when components change
  useEffect(() => {
    if (formData.job_number_year && formData.job_number_month && formData.job_number_num) {
      const fullJobNumber = `JC-${formData.job_number_year}-${formData.job_number_month}-${formData.job_number_num}`;
      setFormData(prev => ({ ...prev, job_number: fullJobNumber }));
    }
  }, [formData.job_number_year, formData.job_number_month, formData.job_number_num]);

  const handleInputChange = (field: keyof JobCardFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVehicleTypeChange = (type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      vehicle_type: checked
        ? [...(prev.vehicle_type || []), type]
        : (prev.vehicle_type || []).filter(t => t !== type)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isViewMode) {
      onClose();
      return;
    }

    // Validate job number uniqueness for new job cards
    if (isCreateMode && formData.job_number) {
      const exists = await checkJobNumberExists(formData.job_number);
      if (exists) {
        alert('This job number already exists. Please try again.');
        return;
      }
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

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'information':
        return <FileText className="h-4 w-4" />;
      case 'mechanic':
        return <Wrench className="h-4 w-4" />;
      case 'parts':
        return <Package className="h-4 w-4" />;
      case 'payments':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTabColor = (tab: string) => {
    switch (tab) {
      case 'information':
        return 'text-blue-600 border-blue-500';
      case 'mechanic':
        return 'text-green-600 border-green-500';
      case 'parts':
        return 'text-purple-600 border-purple-500';
      case 'payments':
        return 'text-orange-600 border-orange-500';
      default:
        return 'text-blue-600 border-blue-500';
    }
  };

  const getFormTitle = () => {
    if (isViewMode) return 'View Job Card';
    if (isMechanicMode) return 'Mechanic Portal - Edit Job Card';
    if (isPartsMode) return 'Parts Portal - Edit Job Card';
    if (isEditMode) return 'Edit Job Card';
    return 'Create New Job Card';
  };

  const getSubmitButtonText = () => {
    if (isViewMode) return 'Close';
    if (isSubmitting) return 'Saving...';
    if (isEditMode || isMechanicMode || isPartsMode) return 'Update Job Card';
    return 'Create Job Card';
  };

  // Function to validate mandatory fields and get invalid field indicators
  const getMandatoryFieldValidation = () => {
    if (!isMandatoryCheckActive || !editingJobCard) {
      return {
        serviceInvalidFields: {},
        trailerInvalidFields: {},
        otherInvalidFields: {}
      };
    }

    const serviceInvalidFields: { [taskName: string]: { status?: boolean; description?: boolean; done_by?: boolean } } = {};
    const trailerInvalidFields: {
      electrical_tasks?: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } };
      tires_wheels_tasks?: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } };
      brake_system_tasks?: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } };
      suspension_tasks?: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } };
      body_chassis_tasks?: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } };
    } = {};
    const otherInvalidFields: { [id: string]: { status?: boolean; description?: boolean; done_by?: boolean } } = {};

    // Check Service tasks
    if (editingJobCard.service_selection && ['Service A', 'Service B', 'Service C', 'Service D'].includes(editingJobCard.service_selection)) {
      const serviceProgress = formData.service_progress || [];
      serviceProgress.forEach(task => {
        const invalid: { status?: boolean; description?: boolean; done_by?: boolean } = {};
        if (!task.status) invalid.status = true;
        if (!task.description?.trim()) invalid.description = true;
        if (!task.done_by?.trim()) invalid.done_by = true;
        
        if (Object.keys(invalid).length > 0) {
          serviceInvalidFields[task.task_name] = invalid;
        }
      });
    }

    // Check Trailer tasks
    if (editingJobCard.vehicle_type?.includes('Trailer')) {
      const trailerProgress = formData.trailer_progress?.[0];
      if (trailerProgress) {
        // Check electrical tasks
        trailerProgress.electrical_tasks?.forEach((task, index) => {
          const invalid: { status?: boolean; description?: boolean; done_by?: boolean } = {};
          if (!task.status) invalid.status = true;
          if (!task.description?.trim()) invalid.description = true;
          if (!task.done_by?.trim()) invalid.done_by = true;
          
          if (Object.keys(invalid).length > 0) {
            if (!trailerInvalidFields.electrical_tasks) trailerInvalidFields.electrical_tasks = {};
            trailerInvalidFields.electrical_tasks[index] = invalid;
          }
        });

        // Check tires and wheels tasks
        trailerProgress.tires_wheels_tasks?.forEach((task, index) => {
          const invalid: { status?: boolean; description?: boolean; done_by?: boolean } = {};
          if (!task.status) invalid.status = true;
          if (!task.description?.trim()) invalid.description = true;
          if (!task.done_by?.trim()) invalid.done_by = true;
          
          if (Object.keys(invalid).length > 0) {
            if (!trailerInvalidFields.tires_wheels_tasks) trailerInvalidFields.tires_wheels_tasks = {};
            trailerInvalidFields.tires_wheels_tasks[index] = invalid;
          }
        });

        // Check brake system tasks
        trailerProgress.brake_system_tasks?.forEach((task, index) => {
          const invalid: { status?: boolean; description?: boolean; done_by?: boolean } = {};
          if (!task.status) invalid.status = true;
          if (!task.description?.trim()) invalid.description = true;
          if (!task.done_by?.trim()) invalid.done_by = true;
          
          if (Object.keys(invalid).length > 0) {
            if (!trailerInvalidFields.brake_system_tasks) trailerInvalidFields.brake_system_tasks = {};
            trailerInvalidFields.brake_system_tasks[index] = invalid;
          }
        });

        // Check suspension tasks
        trailerProgress.suspension_tasks?.forEach((task, index) => {
          const invalid: { status?: boolean; description?: boolean; done_by?: boolean } = {};
          if (!task.status) invalid.status = true;
          if (!task.description?.trim()) invalid.description = true;
          if (!task.done_by?.trim()) invalid.done_by = true;
          
          if (Object.keys(invalid).length > 0) {
            if (!trailerInvalidFields.suspension_tasks) trailerInvalidFields.suspension_tasks = {};
            trailerInvalidFields.suspension_tasks[index] = invalid;
          }
        });

        // Check body chassis tasks
        trailerProgress.body_chassis_tasks?.forEach((task, index) => {
          const invalid: { status?: boolean; description?: boolean; done_by?: boolean } = {};
          if (!task.status) invalid.status = true;
          if (!task.description?.trim()) invalid.description = true;
          if (!task.done_by?.trim()) invalid.done_by = true;
          
          if (Object.keys(invalid).length > 0) {
            if (!trailerInvalidFields.body_chassis_tasks) trailerInvalidFields.body_chassis_tasks = {};
            trailerInvalidFields.body_chassis_tasks[index] = invalid;
          }
        });
      }
    }

    // Check Other tasks
    if (editingJobCard.vehicle_type?.includes('Other')) {
      const otherProgress = formData.other_progress || [];
      otherProgress.forEach(task => {
        const invalid: { status?: boolean; description?: boolean; done_by?: boolean } = {};
        if (!task.status) invalid.status = true;
        if (!task.description?.trim()) invalid.description = true;
        if (!task.done_by?.trim()) invalid.done_by = true;
        
        if (Object.keys(invalid).length > 0) {
          otherInvalidFields[task.id] = invalid;
        }
      });
    }

    return { serviceInvalidFields, trailerInvalidFields, otherInvalidFields };
  };

  const { serviceInvalidFields, trailerInvalidFields, otherInvalidFields } = getMandatoryFieldValidation();

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
                <h3 className="text-lg font-semibold text-gray-900">{getFormTitle()}</h3>
                <p className="text-sm text-gray-500">
                  Job Number: {formData.job_number || 'Auto-generated'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {onRefresh && (isMechanicMode || isPartsMode) && (
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
          <div className="border-b border-gray-200">
            <nav className="flex px-6">
              {[
                { id: 'information', label: 'Information', icon: 'information' },
                { id: 'mechanic', label: 'Mechanic', icon: 'mechanic' },
                { id: 'parts', label: 'Parts', icon: 'parts' },
                { id: 'payments', label: 'Payments', icon: 'payments' },
              ].map((tab) => {
                // Hide tabs based on restricted mode
                if (restrictedMode) {
                  if (isMechanicMode && tab.id !== 'mechanic') return null;
                  if (isPartsMode && tab.id !== 'parts') return null;
                }

                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                      isActive
                        ? getTabColor(tab.icon)
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {getTabIcon(tab.icon)}
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100vh-200px)]">
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Information Tab */}
              {activeTab === 'information' && (
                <div className="space-y-8">
                  {/* Job Information Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Job Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Job Number Components */}
                      {isCreateMode && (
                        <div className="lg:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Number
                          </label>
                          <div className="flex gap-2">
                            <div className="flex items-center">
                              <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-l-md text-sm text-gray-600">
                                JC-
                              </span>
                            </div>
                            <input
                              type="text"
                              value={formData.job_number_year || ''}
                              onChange={(e) => handleInputChange('job_number_year', e.target.value)}
                              placeholder="YY"
                              maxLength={2}
                              className="w-16 px-3 py-2 border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              disabled={isViewMode}
                            />
                            <span className="flex items-center text-gray-400">-</span>
                            <input
                              type="text"
                              value={formData.job_number_month || ''}
                              onChange={(e) => handleInputChange('job_number_month', e.target.value)}
                              placeholder="MM"
                              maxLength={2}
                              className="w-16 px-3 py-2 border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              disabled={isViewMode}
                            />
                            <span className="flex items-center text-gray-400">-</span>
                            <input
                              type="text"
                              value={formData.job_number_num || ''}
                              onChange={(e) => handleInputChange('job_number_num', e.target.value)}
                              placeholder="NN"
                              maxLength={2}
                              className="w-16 px-3 py-2 border border-gray-300 rounded-r-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              disabled={isViewMode}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Format: JC-YY-MM-NN (Year-Month-Number)
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Start Date
                        </label>
                        <input
                          type="date"
                          value={formData.job_start_date || ''}
                          onChange={(e) => handleInputChange('job_start_date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expected Completion Date
                        </label>
                        <input
                          type="date"
                          value={formData.expected_completion_date || ''}
                          onChange={(e) => handleInputChange('expected_completion_date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Completed Date
                        </label>
                        <input
                          type="date"
                          value={formData.completed_date || ''}
                          onChange={(e) => handleInputChange('completed_date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
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
                          onChange={(e) => handleInputChange('approximate_cost', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Customer Information Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-green-600" />
                      Customer Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Customer Name
                        </label>
                        <input
                          type="text"
                          value={formData.customer_name || ''}
                          onChange={(e) => handleInputChange('customer_name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="Enter customer name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={formData.company_name || ''}
                          onChange={(e) => handleInputChange('company_name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="Enter company name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ABN
                        </label>
                        <input
                          type="text"
                          value={formData.abn || ''}
                          onChange={(e) => handleInputChange('abn', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="Enter ABN"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile
                        </label>
                        <input
                          type="tel"
                          value={formData.mobile || ''}
                          onChange={(e) => handleInputChange('mobile', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="Enter mobile number"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Car className="h-5 w-5 text-purple-600" />
                      Vehicle Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle Make
                        </label>
                        <input
                          type="text"
                          value={formData.vehicle_make || ''}
                          onChange={(e) => handleInputChange('vehicle_make', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="e.g., Toyota, Ford"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle Model
                        </label>
                        <input
                          type="text"
                          value={formData.vehicle_model || ''}
                          onChange={(e) => handleInputChange('vehicle_model', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="e.g., Camry, F-150"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle Month
                        </label>
                        <select
                          value={formData.vehicle_month || ''}
                          onChange={(e) => handleInputChange('vehicle_month', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                        >
                          <option value="">Select Month</option>
                          <option value="01">January</option>
                          <option value="02">February</option>
                          <option value="03">March</option>
                          <option value="04">April</option>
                          <option value="05">May</option>
                          <option value="06">June</option>
                          <option value="07">July</option>
                          <option value="08">August</option>
                          <option value="09">September</option>
                          <option value="10">October</option>
                          <option value="11">November</option>
                          <option value="12">December</option>
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
                          onChange={(e) => handleInputChange('vehicle_year', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="e.g., 2020"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle KMs
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.vehicle_kms || ''}
                          onChange={(e) => handleInputChange('vehicle_kms', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="Current kilometers"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fuel Type
                        </label>
                        <select
                          value={formData.fuel_type || ''}
                          onChange={(e) => handleInputChange('fuel_type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
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
                          onChange={(e) => handleInputChange('vin', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="Vehicle Identification Number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          REGO
                        </label>
                        <input
                          type="text"
                          value={formData.rego || ''}
                          onChange={(e) => handleInputChange('rego', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="Registration number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle State
                        </label>
                        <select
                          value={formData.vehicle_state || ''}
                          onChange={(e) => handleInputChange('vehicle_state', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
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
                          onChange={(e) => handleInputChange('tyre_size', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="e.g., 225/60R16"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Next Service KMs
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.next_service_kms || ''}
                          onChange={(e) => handleInputChange('next_service_kms', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="Next service due at"
                        />
                      </div>

                      <div className="lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle Type
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {['HR Truck', 'Prime Mover', 'Trailer', 'Other'].map((type) => (
                            <label key={type} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={(formData.vehicle_type || []).includes(type)}
                                onChange={(e) => handleVehicleTypeChange(type, e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                disabled={isViewMode}
                              />
                              <span className="ml-2 text-sm text-gray-700">{type}</span>
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
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['Service A', 'Service B', 'Service C', 'Service D'].map((service) => (
                              <label key={service} className="flex items-center">
                                <input
                                  type="radio"
                                  name="service_selection"
                                  value={service}
                                  checked={formData.service_selection === service}
                                  onChange={(e) => handleInputChange('service_selection', e.target.value)}
                                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
                                  disabled={isViewMode}
                                />
                                <span className="ml-2 text-sm text-gray-700">{service}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Assignment Fields */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assigned Worker
                        </label>
                        <select
                          value={formData.assigned_worker || ''}
                          onChange={(e) => handleInputChange('assigned_worker', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                        >
                          <option value="">Select Worker</option>
                          <option value="Worker 1">Worker 1</option>
                          <option value="Worker 2">Worker 2</option>
                          <option value="Worker 3">Worker 3</option>
                          <option value="Worker 4">Worker 4</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assigned Parts
                        </label>
                        <select
                          value={formData.assigned_parts || ''}
                          onChange={(e) => handleInputChange('assigned_parts', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                        >
                          <option value="">Select Parts Team</option>
                          <option value="Parts 1">Parts 1</option>
                          <option value="Parts 2">Parts 2</option>
                          <option value="Parts 3">Parts 3</option>
                          <option value="Parts 4">Parts 4</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Customer Declaration */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Customer Declaration</h4>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={formData.customer_declaration_authorized || false}
                        onChange={(e) => handleInputChange('customer_declaration_authorized', e.target.checked)}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={isViewMode}
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        I authorize the work to be performed and understand that additional charges may apply for work not covered in the original estimate.
                      </span>
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
                    onProgressChange={(progress) => handleInputChange('service_progress', progress)}
                    isMandatoryCheckActive={isMandatoryCheckActive}
                    initialInvalidFields={serviceInvalidFields}
                  />

                  <ServiceBTaskList
                    serviceSelection={formData.service_selection}
                    mode={mode}
                    currentProgress={formData.service_progress}
                    onProgressChange={(progress) => handleInputChange('service_progress', progress)}
                    isMandatoryCheckActive={isMandatoryCheckActive}
                    initialInvalidFields={serviceInvalidFields}
                  />

                  <ServiceCTaskList
                    serviceSelection={formData.service_selection}
                    mode={mode}
                    currentProgress={formData.service_progress}
                    onProgressChange={(progress) => handleInputChange('service_progress', progress)}
                    isMandatoryCheckActive={isMandatoryCheckActive}
                    initialInvalidFields={serviceInvalidFields}
                  />

                  <ServiceDTaskList
                    serviceSelection={formData.service_selection}
                    mode={mode}
                    currentProgress={formData.service_progress}
                    onProgressChange={(progress) => handleInputChange('service_progress', progress)}
                    isMandatoryCheckActive={isMandatoryCheckActive}
                    initialInvalidFields={serviceInvalidFields}
                  />

                  {/* Trailer Task List */}
                  <TrailerTaskList
                    vehicleType={formData.vehicle_type}
                    mode={mode}
                    currentProgress={formData.trailer_progress}
                    onProgressChange={(progress) => handleInputChange('trailer_progress', progress)}
                    isMandatoryCheckActive={isMandatoryCheckActive}
                    initialInvalidFields={trailerInvalidFields}
                  />

                  {/* Other Task List */}
                  <OtherTaskList
                    vehicleType={formData.vehicle_type}
                    mode={mode}
                    currentProgress={formData.other_progress}
                    onProgressChange={(progress) => handleInputChange('other_progress', progress)}
                    isMandatoryCheckActive={isMandatoryCheckActive}
                    initialInvalidFields={otherInvalidFields}
                  />

                  {/* Mechanic Sections */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-green-600" />
                      Mechanic Sections
                    </h4>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Handover Valuables to Customer
                        </label>
                        <textarea
                          value={formData.handover_valuables_to_customer || ''}
                          onChange={(e) => handleInputChange('handover_valuables_to_customer', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="Notes about valuables handover..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Check All Tyres
                        </label>
                        <textarea
                          value={formData.check_all_tyres || ''}
                          onChange={(e) => handleInputChange('check_all_tyres', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
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
                          onChange={(e) => handleInputChange('total_a', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Future Work Notes
                        </label>
                        <textarea
                          value={formData.future_work_notes || ''}
                          onChange={(e) => handleInputChange('future_work_notes', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
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
                        label="Right Side"
                        value={formData.image_right_side}
                        onChange={(value) => handleInputChange('image_right_side', value)}
                        disabled={isViewMode}
                      />
                      <ImageUpload
                        label="Left Side"
                        value={formData.image_left_side}
                        onChange={(value) => handleInputChange('image_left_side', value)}
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
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Package className="h-5 w-5 text-purple-600" />
                      Parts Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Invoice Number
                        </label>
                        <input
                          type="text"
                          value={formData.invoice_number || ''}
                          onChange={(e) => handleInputChange('invoice_number', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="Enter invoice number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Part Location
                        </label>
                        <input
                          type="text"
                          value={formData.part_location || ''}
                          onChange={(e) => handleInputChange('part_location', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="Where parts are stored"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Invoice Date
                        </label>
                        <input
                          type="date"
                          value={formData.invoice_date || ''}
                          onChange={(e) => handleInputChange('invoice_date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
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
                          onChange={(e) => handleInputChange('invoice_value', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="0.00"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Issue Counter Sale
                        </label>
                        <input
                          type="text"
                          value={formData.issue_counter_sale || ''}
                          onChange={(e) => handleInputChange('issue_counter_sale', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isViewMode}
                          placeholder="Counter sale information"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Parts and Consumables Table */}
                  <PartsAndConsumablesTable
                    parts={formData.parts_and_consumables || []}
                    onChange={(parts) => handleInputChange('parts_and_consumables', parts)}
                    onTotalBChange={setTotalB}
                    mode={mode}
                  />

                  {/* Lubricants Used Table */}
                  <LubricantsUsedTable
                    lubricants={formData.lubricants_used || []}
                    onChange={(lubricants) => handleInputChange('lubricants_used', lubricants)}
                    onTotalCChange={(total) => {
                      setTotalC(total);
                      handleInputChange('total_c', total.toString());
                    }}
                    mode={mode}
                  />
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === 'payments' && (
                <div className="space-y-8">
                  {/* Payment Status */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-orange-600" />
                      Payment Information
                    </h4>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Status
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="payment_status"
                              value="unpaid"
                              checked={formData.payment_status === 'unpaid'}
                              onChange={(e) => handleInputChange('payment_status', e.target.value)}
                              className="border-gray-300 text-orange-600 focus:ring-orange-500"
                              disabled={isViewMode}
                            />
                            <span className="ml-2 text-sm text-gray-700">Unpaid</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="payment_status"
                              value="paid"
                              checked={formData.payment_status === 'paid'}
                              onChange={(e) => handleInputChange('payment_status', e.target.value)}
                              className="border-gray-300 text-orange-600 focus:ring-orange-500"
                              disabled={isViewMode}
                            />
                            <span className="ml-2 text-sm text-gray-700">Paid</span>
                          </label>
                        </div>
                      </div>

                      {/* Cost Summary */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h5 className="text-lg font-medium text-gray-900 mb-4">Cost Summary</h5>
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
                              ${(parseFloat(formData.total_a || '0') + totalB + totalC).toFixed(2)}
                            </div>
                          </div>
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
                          onChange={(signature) => handleInputChange('customer_signature', signature)}
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
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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