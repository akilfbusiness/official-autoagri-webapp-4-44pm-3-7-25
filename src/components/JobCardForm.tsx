import React, { useState, useEffect } from 'react';
import { X, FileText, Wrench, Package, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { JobCard, JobCardFormData, CustomerVehicleSuggestion } from '../types/JobCard';
import { useJobCards } from '../hooks/useJobCards';

// Import all the tab components
import { InformationTab } from './tabs/InformationTab';
import { MechanicTab } from './tabs/MechanicTab';
import { PartsTab } from './tabs/PartsTab';
import { PaymentsTab } from './tabs/PaymentsTab';

interface JobCardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: JobCardFormData) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(false);
  const [isMandatoryCheckActive, setIsMandatoryCheckActive] = useState(false);
  const [trailerInvalidFields, setTrailerInvalidFields] = useState<{
    electrical_tasks?: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } };
    tires_wheels_tasks?: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } };
    brake_system_tasks?: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } };
    suspension_tasks?: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } };
    body_chassis_tasks?: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } };
  }>({});

  const isViewMode = mode === 'view';
  const isCreateMode = mode === 'create';
  const isEditMode = mode === 'edit';
  const isMechanicMode = mode === 'mechanic';
  const isPartsMode = mode === 'parts';

  // Initialize form data
  useEffect(() => {
    const initializeFormData = async () => {
      if (editingJobCard) {
        // Editing existing job card
        const jobStartDate = editingJobCard.job_start_date ? editingJobCard.job_start_date.toISOString().split('T')[0] : '';
        const expectedCompletionDate = editingJobCard.expected_completion_date ? editingJobCard.expected_completion_date.toISOString().split('T')[0] : '';
        const completedDate = editingJobCard.completed_date ? editingJobCard.completed_date.toISOString().split('T')[0] : '';
        const invoiceDate = editingJobCard.invoice_date ? editingJobCard.invoice_date.toISOString().split('T')[0] : '';

        setFormData({
          job_number: editingJobCard.job_number || '',
          job_start_date: jobStartDate,
          expected_completion_date: expectedCompletionDate,
          completed_date: completedDate,
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
          // Parts Information
          invoice_number: editingJobCard.invoice_number || '',
          part_location: editingJobCard.part_location || '',
          invoice_date: invoiceDate,
          invoice_value: editingJobCard.invoice_value?.toString() || '',
          issue_counter_sale: editingJobCard.issue_counter_sale || '',
          // Parts and Consumables
          parts_and_consumables: editingJobCard.parts_and_consumables || [],
          // Lubricants Used
          lubricants_used: editingJobCard.lubricants_used || [],
          // Payment Status
          payment_status: editingJobCard.payment_status || 'unpaid',
          // Total C
          total_c: editingJobCard.total_c?.toString() || '',
          // Signatures
          customer_signature: editingJobCard.customer_signature || '',
          supervisor_signature: editingJobCard.supervisor_signature || '',
        });
      } else if (initialCustomerData) {
        // Creating new job card with customer data pre-filled
        const today = new Date().toISOString().split('T')[0];
        const currentYear = new Date().getFullYear().toString();
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');

        try {
          const nextJobNum = await getNextJobNumber(currentYear, currentMonth);
          const jobNumber = `JC-${currentYear.slice(-2)}-${currentMonth}-${nextJobNum}`;

          setFormData({
            job_number: jobNumber,
            job_start_date: today,
            expected_completion_date: '',
            completed_date: '',
            approximate_cost: '',
            // Pre-fill customer data
            customer_name: initialCustomerData.customer_name || '',
            company_name: initialCustomerData.company_name || '',
            abn: initialCustomerData.abn || '',
            mobile: initialCustomerData.mobile || '',
            email: initialCustomerData.email || '',
            // Pre-fill vehicle data
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
            is_worker_assigned_complete: false,
            is_parts_assigned_complete: false,
            customer_declaration_authorized: false,
            service_progress: [],
            trailer_progress: [],
            other_progress: [],
            handover_valuables_to_customer: '',
            check_all_tyres: '',
            total_a: '',
            future_work_notes: '',
            image_front: '',
            image_back: '',
            image_right_side: '',
            image_left_side: '',
            // Parts Information
            invoice_number: '',
            part_location: '',
            invoice_date: '',
            invoice_value: '',
            issue_counter_sale: '',
            // Parts and Consumables
            parts_and_consumables: [],
            // Lubricants Used
            lubricants_used: [],
            // Payment Status
            payment_status: 'unpaid',
            // Total C
            total_c: '',
            // Signatures
            customer_signature: '',
            supervisor_signature: '',
          });
        } catch (error) {
          console.error('Error generating job number:', error);
        }
      } else if (isCreateMode) {
        // Creating new job card without customer data
        const today = new Date().toISOString().split('T')[0];
        const currentYear = new Date().getFullYear().toString();
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');

        try {
          const nextJobNum = await getNextJobNumber(currentYear, currentMonth);
          const jobNumber = `JC-${currentYear.slice(-2)}-${currentMonth}-${nextJobNum}`;

          setFormData({
            job_number: jobNumber,
            job_start_date: today,
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
            is_worker_assigned_complete: false,
            is_parts_assigned_complete: false,
            customer_declaration_authorized: false,
            service_progress: [],
            trailer_progress: [],
            other_progress: [],
            handover_valuables_to_customer: '',
            check_all_tyres: '',
            total_a: '',
            future_work_notes: '',
            image_front: '',
            image_back: '',
            image_right_side: '',
            image_left_side: '',
            // Parts Information
            invoice_number: '',
            part_location: '',
            invoice_date: '',
            invoice_value: '',
            issue_counter_sale: '',
            // Parts and Consumables
            parts_and_consumables: [],
            // Lubricants Used
            lubricants_used: [],
            // Payment Status
            payment_status: 'unpaid',
            // Total C
            total_c: '',
            // Signatures
            customer_signature: '',
            supervisor_signature: '',
          });
        } catch (error) {
          console.error('Error generating job number:', error);
        }
      }
    };

    if (isOpen) {
      initializeFormData();
    }
  }, [isOpen, editingJobCard, isCreateMode, getNextJobNumber, initialCustomerData]);

  // Reset mandatory check state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsMandatoryCheckActive(false);
      setTrailerInvalidFields({});
    }
  }, [isOpen]);

  const validateMandatoryFields = () => {
    const missingFields: string[] = [];
    const newTrailerInvalidFields: typeof trailerInvalidFields = {};

    // Check assigned worker and parts for create mode
    if (isCreateMode) {
      if (!formData.assigned_worker || formData.assigned_worker.trim() === '') {
        missingFields.push('Assigned Worker');
      }
      if (!formData.assigned_parts || formData.assigned_parts.trim() === '') {
        missingFields.push('Assigned Parts');
      }
    }

    // Check trailer task list if Trailer is selected
    if (formData.vehicle_type?.includes('Trailer') && formData.trailer_progress && formData.trailer_progress.length > 0) {
      const trailerProgress = formData.trailer_progress[0];
      
      // Check electrical tasks
      if (trailerProgress.electrical_tasks) {
        const electricalInvalid: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } } = {};
        trailerProgress.electrical_tasks.forEach((task, index) => {
          const taskInvalid: { status?: boolean; description?: boolean; done_by?: boolean } = {};
          
          if (!task.status) {
            taskInvalid.status = true;
            missingFields.push(`Electrical Task ${index + 1} - Status`);
          }
          if (!task.description || task.description.trim() === '') {
            taskInvalid.description = true;
            missingFields.push(`Electrical Task ${index + 1} - Description`);
          }
          if (!task.done_by || task.done_by.trim() === '') {
            taskInvalid.done_by = true;
            missingFields.push(`Electrical Task ${index + 1} - Done By`);
          }
          
          if (Object.keys(taskInvalid).length > 0) {
            electricalInvalid[index] = taskInvalid;
          }
        });
        if (Object.keys(electricalInvalid).length > 0) {
          newTrailerInvalidFields.electrical_tasks = electricalInvalid;
        }
      }

      // Check tires and wheels tasks
      if (trailerProgress.tires_wheels_tasks) {
        const tiresInvalid: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } } = {};
        trailerProgress.tires_wheels_tasks.forEach((task, index) => {
          const taskInvalid: { status?: boolean; description?: boolean; done_by?: boolean } = {};
          
          if (!task.status) {
            taskInvalid.status = true;
            missingFields.push(`Tires & Wheels Task ${index + 1} - Status`);
          }
          if (!task.description || task.description.trim() === '') {
            taskInvalid.description = true;
            missingFields.push(`Tires & Wheels Task ${index + 1} - Description`);
          }
          if (!task.done_by || task.done_by.trim() === '') {
            taskInvalid.done_by = true;
            missingFields.push(`Tires & Wheels Task ${index + 1} - Done By`);
          }
          
          if (Object.keys(taskInvalid).length > 0) {
            tiresInvalid[index] = taskInvalid;
          }
        });
        if (Object.keys(tiresInvalid).length > 0) {
          newTrailerInvalidFields.tires_wheels_tasks = tiresInvalid;
        }
      }

      // Check brake system tasks
      if (trailerProgress.brake_system_tasks) {
        const brakeInvalid: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } } = {};
        trailerProgress.brake_system_tasks.forEach((task, index) => {
          const taskInvalid: { status?: boolean; description?: boolean; done_by?: boolean } = {};
          
          if (!task.status) {
            taskInvalid.status = true;
            missingFields.push(`Brake System Task ${index + 1} - Status`);
          }
          if (!task.description || task.description.trim() === '') {
            taskInvalid.description = true;
            missingFields.push(`Brake System Task ${index + 1} - Description`);
          }
          if (!task.done_by || task.done_by.trim() === '') {
            taskInvalid.done_by = true;
            missingFields.push(`Brake System Task ${index + 1} - Done By`);
          }
          
          if (Object.keys(taskInvalid).length > 0) {
            brakeInvalid[index] = taskInvalid;
          }
        });
        if (Object.keys(brakeInvalid).length > 0) {
          newTrailerInvalidFields.brake_system_tasks = brakeInvalid;
        }
      }

      // Check suspension tasks
      if (trailerProgress.suspension_tasks) {
        const suspensionInvalid: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } } = {};
        trailerProgress.suspension_tasks.forEach((task, index) => {
          const taskInvalid: { status?: boolean; description?: boolean; done_by?: boolean } = {};
          
          if (!task.status) {
            taskInvalid.status = true;
            missingFields.push(`Suspension Task ${index + 1} - Status`);
          }
          if (!task.description || task.description.trim() === '') {
            taskInvalid.description = true;
            missingFields.push(`Suspension Task ${index + 1} - Description`);
          }
          if (!task.done_by || task.done_by.trim() === '') {
            taskInvalid.done_by = true;
            missingFields.push(`Suspension Task ${index + 1} - Done By`);
          }
          
          if (Object.keys(taskInvalid).length > 0) {
            suspensionInvalid[index] = taskInvalid;
          }
        });
        if (Object.keys(suspensionInvalid).length > 0) {
          newTrailerInvalidFields.suspension_tasks = suspensionInvalid;
        }
      }

      // Check body/chassis tasks
      if (trailerProgress.body_chassis_tasks) {
        const bodyInvalid: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } } = {};
        trailerProgress.body_chassis_tasks.forEach((task, index) => {
          const taskInvalid: { status?: boolean; description?: boolean; done_by?: boolean } = {};
          
          if (!task.status) {
            taskInvalid.status = true;
            missingFields.push(`Body/Chassis Task ${index + 1} - Status`);
          }
          if (!task.description || task.description.trim() === '') {
            taskInvalid.description = true;
            missingFields.push(`Body/Chassis Task ${index + 1} - Description`);
          }
          if (!task.done_by || task.done_by.trim() === '') {
            taskInvalid.done_by = true;
            missingFields.push(`Body/Chassis Task ${index + 1} - Done By`);
          }
          
          if (Object.keys(taskInvalid).length > 0) {
            bodyInvalid[index] = taskInvalid;
          }
        });
        if (Object.keys(bodyInvalid).length > 0) {
          newTrailerInvalidFields.body_chassis_tasks = bodyInvalid;
        }
      }
    }

    setTrailerInvalidFields(newTrailerInvalidFields);
    return missingFields;
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setIsMandatoryCheckActive(true);

      // Validate mandatory fields
      const missingFields = validateMandatoryFields();

      if (missingFields.length > 0) {
        // Show alert with missing fields
        const fieldsList = missingFields.slice(0, 10).join('\n• '); // Show first 10 fields
        const moreFieldsText = missingFields.length > 10 ? `\n... and ${missingFields.length - 10} more fields` : '';
        
        alert(`Please fill out the following mandatory fields:\n\n• ${fieldsList}${moreFieldsText}`);
        return;
      }

      // Reset mandatory check state on successful validation
      setIsMandatoryCheckActive(false);
      setTrailerInvalidFields({});

      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving job card:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: keyof JobCardFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

  const getTabColor = (tab: string, isActive: boolean) => {
    if (isActive) {
      switch (tab) {
        case 'information':
          return 'border-blue-500 text-blue-600';
        case 'mechanic':
          return 'border-green-500 text-green-600';
        case 'parts':
          return 'border-purple-500 text-purple-600';
        case 'payments':
          return 'border-orange-500 text-orange-600';
        default:
          return 'border-blue-500 text-blue-600';
      }
    }
    return 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  };

  const getAvailableTabs = () => {
    if (restrictedMode) {
      if (isMechanicMode) {
        return ['mechanic'];
      } else if (isPartsMode) {
        return ['parts'];
      }
    }
    return ['information', 'mechanic', 'parts', 'payments'];
  };

  const availableTabs = getAvailableTabs();

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
                <h3 className="text-lg font-semibold text-gray-900">
                  {isCreateMode ? 'Create New Job Card' : 
                   isEditMode ? 'Edit Job Card' : 
                   isMechanicMode ? 'Mechanic Portal - Edit Job Card' :
                   isPartsMode ? 'Parts Portal - Edit Job Card' :
                   'View Job Card'}
                </h3>
                <p className="text-sm text-gray-500">
                  Job Number: {formData.job_number || 'Auto-generated'}
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

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {availableTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab as any)}
                  className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors ${getTabColor(tab, activeTab === tab)}`}
                >
                  {getTabIcon(tab)}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto">
            {activeTab === 'information' && (
              <InformationTab
                formData={formData}
                onFieldChange={handleFieldChange}
                mode={mode}
                isMandatoryCheckActive={isMandatoryCheckActive}
                trailerInvalidFields={trailerInvalidFields}
              />
            )}
            {activeTab === 'mechanic' && (
              <MechanicTab
                formData={formData}
                onFieldChange={handleFieldChange}
                mode={mode}
                isMandatoryCheckActive={isMandatoryCheckActive}
                trailerInvalidFields={trailerInvalidFields}
              />
            )}
            {activeTab === 'parts' && (
              <PartsTab
                formData={formData}
                onFieldChange={handleFieldChange}
                mode={mode}
              />
            )}
            {activeTab === 'payments' && (
              <PaymentsTab
                formData={formData}
                onFieldChange={handleFieldChange}
                mode={mode}
              />
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50 rounded-b-xl">
            <div className="flex items-center gap-3">
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <CheckCircle className="h-4 w-4" />
                  Refresh
                </button>
              )}
              
              {isMandatoryCheckActive && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Please complete all mandatory fields</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {isViewMode ? 'Close' : 'Cancel'}
              </button>
              {!isViewMode && (
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      {isCreateMode ? 'Create Job Card' : 'Save Changes'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};