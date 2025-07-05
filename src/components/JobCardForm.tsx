import React, { useState, useEffect } from 'react';
import { X, FileText, Wrench, Package, CreditCard, AlertTriangle, RefreshCw } from 'lucide-react';
import { JobCard, JobCardFormData, CustomerVehicleSuggestion } from '../types/JobCard';
import { useJobCards } from '../hooks/useJobCards';
import { ServiceATaskList } from './ServiceATaskList';
import { ServiceBTaskList } from './ServiceBTaskList';
import { ServiceCTaskList } from './ServiceCTaskList';
import { ServiceDTaskList } from './ServiceDTaskList';
import { TrailerTaskList } from './TrailerTaskList';
import { OtherTaskList } from './OtherTaskList';
import { ImageUpload } from './ImageUpload';
import { PartsAndConsumablesTable } from './PartsAndConsumablesTable';
import { LubricantsUsedTable } from './LubricantsUsedTable';
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
  const [isSaving, setIsSaving] = useState(false);
  const [missingMandatoryFields, setMissingMandatoryFields] = useState<string[]>([]);
  const [showMandatoryAlert, setShowMandatoryAlert] = useState(false);

  // Form state
  const [formData, setFormData] = useState<JobCardFormData>({
    job_number_year: new Date().getFullYear().toString().slice(-2),
    job_number_month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    job_number_num: '',
    job_number: '',
    job_start_date: new Date().toISOString().split('T')[0],
    expected_completion_date: '',
    completed_date: '',
    approximate_cost: '0.00',
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
    total_a: '0.00',
    future_work_notes: '',
    image_front: '',
    image_back: '',
    image_right_side: '',
    image_left_side: '',
    invoice_number: '',
    part_location: '',
    invoice_date: '',
    invoice_value: '',
    issue_counter_sale: '',
    parts_and_consumables: [],
    lubricants_used: [],
    payment_status: 'unpaid',
    total_c: '0.00',
    customer_signature: '',
    supervisor_signature: '',
  });

  // Auto-generate job number when year/month changes
  useEffect(() => {
    const generateJobNumber = async () => {
      if (mode === 'create' && formData.job_number_year && formData.job_number_month) {
        try {
          const nextNum = await getNextJobNumber(`20${formData.job_number_year}`, formData.job_number_month);
          const newJobNumber = `JC-${formData.job_number_year}-${formData.job_number_month}-${nextNum}`;
          
          setFormData(prev => ({
            ...prev,
            job_number_num: nextNum,
            job_number: newJobNumber
          }));
        } catch (error) {
          console.error('Error generating job number:', error);
        }
      }
    };

    generateJobNumber();
  }, [formData.job_number_year, formData.job_number_month, mode, getNextJobNumber]);

  // Load initial customer data when provided
  useEffect(() => {
    if (initialCustomerData && mode === 'create') {
      setFormData(prev => ({
        ...prev,
        customer_name: initialCustomerData.customer_name || '',
        company_name: initialCustomerData.company_name || '',
        abn: initialCustomerData.abn || '',
        mobile: initialCustomerData.mobile || '',
        email: initialCustomerData.email || '',
        vehicle_make: initialCustomerData.vehicle_make || '',
        vehicle_model: initialCustomerData.vehicle_model || '',
        vehicle_month: initialCustomerData.vehicle_month || '',
        vehicle_year: initialCustomerData.vehicle_year?.toString() || '',
        rego: initialCustomerData.rego || '',
        vin: initialCustomerData.vin || '',
        fuel_type: initialCustomerData.fuel_type || '',
      }));
    }
  }, [initialCustomerData, mode]);

  // Load editing data
  useEffect(() => {
    if (editingJobCard && (mode === 'edit' || mode === 'view' || mode === 'mechanic' || mode === 'parts')) {
      const formatDateForInput = (date?: Date) => {
        if (!date) return '';
        try {
          return date.toISOString().split('T')[0];
        } catch {
          return '';
        }
      };

      // Parse job number components
      const jobNumberParts = editingJobCard.job_number?.split('-') || [];
      const year = jobNumberParts[1] || '';
      const month = jobNumberParts[2] || '';
      const num = jobNumberParts[3] || '';

      setFormData({
        job_number_year: year,
        job_number_month: month,
        job_number_num: num,
        job_number: editingJobCard.job_number || '',
        job_start_date: formatDateForInput(editingJobCard.job_start_date),
        expected_completion_date: formatDateForInput(editingJobCard.expected_completion_date),
        completed_date: formatDateForInput(editingJobCard.completed_date),
        approximate_cost: editingJobCard.approximate_cost?.toString() || '0.00',
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
        total_a: editingJobCard.total_a?.toString() || '0.00',
        future_work_notes: editingJobCard.future_work_notes || '',
        image_front: editingJobCard.image_front || '',
        image_back: editingJobCard.image_back || '',
        image_right_side: editingJobCard.image_right_side || '',
        image_left_side: editingJobCard.image_left_side || '',
        invoice_number: editingJobCard.invoice_number || '',
        part_location: editingJobCard.part_location || '',
        invoice_date: formatDateForInput(editingJobCard.invoice_date),
        invoice_value: editingJobCard.invoice_value?.toString() || '',
        issue_counter_sale: editingJobCard.issue_counter_sale || '',
        parts_and_consumables: editingJobCard.parts_and_consumables || [],
        lubricants_used: editingJobCard.lubricants_used || [],
        payment_status: editingJobCard.payment_status || 'unpaid',
        total_c: editingJobCard.total_c?.toString() || '0.00',
        customer_signature: editingJobCard.customer_signature || '',
        supervisor_signature: editingJobCard.supervisor_signature || '',
      });
    }
  }, [editingJobCard, mode]);

  // Clear missing fields alert when user starts typing
  useEffect(() => {
    if (showMandatoryAlert) {
      setShowMandatoryAlert(false);
      setMissingMandatoryFields([]);
    }
  }, [formData.assigned_worker, formData.assigned_parts, showMandatoryAlert]);

  const validateForm = (): string[] => {
    const missingFields: string[] = [];

    // Only validate mandatory fields for create mode
    if (mode === 'create') {
      // Assigned Worker is mandatory
      if (!formData.assigned_worker || formData.assigned_worker.trim() === '') {
        missingFields.push('Assigned Worker');
      }

      // Assigned Parts is mandatory
      if (!formData.assigned_parts || formData.assigned_parts.trim() === '') {
        missingFields.push('Assigned Parts');
      }
    }

    return missingFields;
  };

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

  const handleTotalBChange = (total: number) => {
    // Total B is calculated automatically from parts and consumables
    // No need to store it separately as it's derived from the parts data
  };

  const handleTotalCChange = (total: number) => {
    setFormData(prev => ({ ...prev, total_c: total.toString() }));
  };

  const dismissMandatoryAlert = () => {
    setShowMandatoryAlert(false);
    setMissingMandatoryFields([]);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Validate form and get missing fields
      const missingFields = validateForm();
      
      if (missingFields.length > 0) {
        setMissingMandatoryFields(missingFields);
        setShowMandatoryAlert(true);
        return; // Prevent form submission
      }

      // Clear any existing alerts
      setShowMandatoryAlert(false);
      setMissingMandatoryFields([]);

      // Check for duplicate job number in create mode
      if (mode === 'create' && formData.job_number) {
        const exists = await checkJobNumberExists(formData.job_number);
        if (exists) {
          alert('This job number already exists. Please refresh to get a new job number.');
          return;
        }
      }

      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving job card:', error);
      // Don't close the form if there's an error
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefreshClick = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const isViewMode = mode === 'view';
  const isRestrictedMode = restrictedMode && (mode === 'mechanic' || mode === 'parts');

  if (!isOpen) return null;

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

  const availableTabs = isRestrictedMode
    ? mode === 'mechanic'
      ? ['mechanic']
      : ['parts']
    : ['information', 'mechanic', 'parts', 'payments'];

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
                  {mode === 'create' ? 'Create New Job Card' : 
                   mode === 'edit' ? 'Edit Job Card' : 
                   mode === 'view' ? 'View Job Card' :
                   mode === 'mechanic' ? 'Mechanic Portal - Edit Job Card' :
                   'Parts Portal - Edit Job Card'}
                </h3>
                <p className="text-sm text-gray-500">
                  Job Number: {formData.job_number || 'Auto-generated'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onRefresh && (
                <button
                  onClick={handleRefreshClick}
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

          {/* Missing Mandatory Fields Alert */}
          {showMandatoryAlert && missingMandatoryFields.length > 0 && (
            <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-900 mb-1">
                    Missing Mandatory Fields
                  </h4>
                  <p className="text-sm text-red-700">
                    Please fill out the following mandatory fields: <strong>{missingMandatoryFields.join(', ')}</strong>
                  </p>
                </div>
                <button
                  onClick={dismissMandatoryAlert}
                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                  title="Dismiss alert"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 px-6">
            <nav className="-mb-px flex space-x-8">
              {availableTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${getTabColor(tab, activeTab === tab)}`}
                >
                  {getTabIcon(tab)}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
            {activeTab === 'information' && (
              <div className="space-y-8">
                {/* Job Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-6">Job Information</h4>
                  
                  {/* Job Number */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Number</label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">JC-</span>
                      <select
                        value={formData.job_number_year}
                        onChange={(e) => handleInputChange('job_number_year', e.target.value)}
                        disabled={isViewMode || mode === 'edit'}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
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
                      <span className="text-gray-500">-</span>
                      <select
                        value={formData.job_number_month}
                        onChange={(e) => handleInputChange('job_number_month', e.target.value)}
                        disabled={isViewMode || mode === 'edit'}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
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
                      <span className="text-gray-500">-</span>
                      <input
                        type="text"
                        value={formData.job_number_num}
                        disabled
                        className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 w-16 text-center"
                      />
                      <span className="text-blue-600 font-medium ml-4">
                        = {formData.job_number}
                      </span>
                    </div>
                  </div>

                  {/* Date Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Start Date</label>
                      <input
                        type="date"
                        value={formData.job_start_date}
                        onChange={(e) => handleInputChange('job_start_date', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expected Completion Date</label>
                      <input
                        type="date"
                        value={formData.expected_completion_date}
                        onChange={(e) => handleInputChange('expected_completion_date', e.target.value)}
                        disabled={isViewMode}
                        placeholder="dd/mm/yyyy"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Completed Date</label>
                      <input
                        type="date"
                        value={formData.completed_date}
                        onChange={(e) => handleInputChange('completed_date', e.target.value)}
                        disabled={isViewMode}
                        placeholder="dd/mm/yyyy"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* Approximate Cost */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Approximate Cost</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.approximate_cost}
                      onChange={(e) => handleInputChange('approximate_cost', e.target.value)}
                      disabled={isViewMode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-6">Customer Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                      <input
                        type="text"
                        value={formData.customer_name}
                        onChange={(e) => handleInputChange('customer_name', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        value={formData.company_name}
                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ABN</label>
                      <input
                        type="text"
                        value={formData.abn}
                        onChange={(e) => handleInputChange('abn', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-6">Vehicle Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Make</label>
                      <input
                        type="text"
                        value={formData.vehicle_make}
                        onChange={(e) => handleInputChange('vehicle_make', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Model</label>
                      <input
                        type="text"
                        value={formData.vehicle_model}
                        onChange={(e) => handleInputChange('vehicle_model', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Month</label>
                      <select
                        value={formData.vehicle_month}
                        onChange={(e) => handleInputChange('vehicle_month', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      >
                        <option value="">Select Month</option>
                        {[
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
                        ].map(month => (
                          <option key={month.value} value={month.value}>{month.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Year</label>
                      <input
                        type="number"
                        min="1900"
                        max="2100"
                        value={formData.vehicle_year}
                        onChange={(e) => handleInputChange('vehicle_year', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle KMs</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.vehicle_kms}
                        onChange={(e) => handleInputChange('vehicle_kms', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                      <select
                        value={formData.fuel_type}
                        onChange={(e) => handleInputChange('fuel_type', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      >
                        <option value="">Select Fuel Type</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">VIN</label>
                      <input
                        type="text"
                        value={formData.vin}
                        onChange={(e) => handleInputChange('vin', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">REGO</label>
                      <input
                        type="text"
                        value={formData.rego}
                        onChange={(e) => handleInputChange('rego', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle State</label>
                      <select
                        value={formData.vehicle_state}
                        onChange={(e) => handleInputChange('vehicle_state', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tyre Size</label>
                      <input
                        type="text"
                        value={formData.tyre_size}
                        onChange={(e) => handleInputChange('tyre_size', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Next Service KMs</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.next_service_kms}
                        onChange={(e) => handleInputChange('next_service_kms', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* Vehicle Type */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Vehicle Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['HR Truck', 'Prime Mover', 'Trailer', 'Other'].map((type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.vehicle_type?.includes(type) || false}
                            onChange={(e) => handleVehicleTypeChange(type, e.target.checked)}
                            disabled={isViewMode}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Service Selection - Only show for HR Truck or Prime Mover */}
                  {(formData.vehicle_type?.includes('HR Truck') || formData.vehicle_type?.includes('Prime Mover')) && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Selection</label>
                      <select
                        value={formData.service_selection}
                        onChange={(e) => handleInputChange('service_selection', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
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

                {/* Assignment Fields */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-6">Assignments</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assigned Worker
                        {mode === 'create' && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <select
                        value={formData.assigned_worker}
                        onChange={(e) => handleInputChange('assigned_worker', e.target.value)}
                        disabled={isViewMode}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${
                          mode === 'create' && missingMandatoryFields.includes('Assigned Worker') ? 'border-red-300 focus:ring-red-500' : ''
                        }`}
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
                        {mode === 'create' && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <select
                        value={formData.assigned_parts}
                        onChange={(e) => handleInputChange('assigned_parts', e.target.value)}
                        disabled={isViewMode}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${
                          mode === 'create' && missingMandatoryFields.includes('Assigned Parts') ? 'border-red-300 focus:ring-red-500' : ''
                        }`}
                      >
                        <option value="">Select Parts</option>
                        <option value="Parts 1">Parts 1</option>
                        <option value="Parts 2">Parts 2</option>
                        <option value="Parts 3">Parts 3</option>
                        <option value="Parts 4">Parts 4</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Customer Declaration */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-6">Customer Declaration</h4>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.customer_declaration_authorized}
                      onChange={(e) => handleInputChange('customer_declaration_authorized', e.target.checked)}
                      disabled={isViewMode}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Customer authorizes the work to be performed
                    </span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'mechanic' && (
              <div className="space-y-8">
                {/* Service Task Lists */}
                <ServiceATaskList
                  serviceSelection={formData.service_selection}
                  mode={mode}
                  currentProgress={formData.service_progress}
                  onProgressChange={(progress) => handleInputChange('service_progress', progress)}
                />

                <ServiceBTaskList
                  serviceSelection={formData.service_selection}
                  mode={mode}
                  currentProgress={formData.service_progress}
                  onProgressChange={(progress) => handleInputChange('service_progress', progress)}
                />

                <ServiceCTaskList
                  serviceSelection={formData.service_selection}
                  mode={mode}
                  currentProgress={formData.service_progress}
                  onProgressChange={(progress) => handleInputChange('service_progress', progress)}
                />

                <ServiceDTaskList
                  serviceSelection={formData.service_selection}
                  mode={mode}
                  currentProgress={formData.service_progress}
                  onProgressChange={(progress) => handleInputChange('service_progress', progress)}
                />

                {/* Trailer Task List */}
                <TrailerTaskList
                  vehicleType={formData.vehicle_type}
                  mode={mode}
                  currentProgress={formData.trailer_progress}
                  onProgressChange={(progress) => handleInputChange('trailer_progress', progress)}
                />

                {/* Other Task List */}
                <OtherTaskList
                  vehicleType={formData.vehicle_type}
                  mode={mode}
                  currentProgress={formData.other_progress}
                  onProgressChange={(progress) => handleInputChange('other_progress', progress)}
                />

                {/* Mechanic Sections */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-6">Mechanic Sections</h4>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Handover Valuables to Customer</label>
                      <textarea
                        value={formData.handover_valuables_to_customer}
                        onChange={(e) => handleInputChange('handover_valuables_to_customer', e.target.value)}
                        disabled={isViewMode}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check All Tyres</label>
                      <textarea
                        value={formData.check_all_tyres}
                        onChange={(e) => handleInputChange('check_all_tyres', e.target.value)}
                        disabled={isViewMode}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total A</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.total_a}
                        onChange={(e) => handleInputChange('total_a', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Future Work Notes</label>
                      <textarea
                        value={formData.future_work_notes}
                        onChange={(e) => handleInputChange('future_work_notes', e.target.value)}
                        disabled={isViewMode}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Vehicle Images */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-6">Vehicle Images</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUpload
                      label="Front Image"
                      value={formData.image_front}
                      onChange={(value) => handleInputChange('image_front', value)}
                      disabled={isViewMode}
                    />
                    <ImageUpload
                      label="Back Image"
                      value={formData.image_back}
                      onChange={(value) => handleInputChange('image_back', value)}
                      disabled={isViewMode}
                    />
                    <ImageUpload
                      label="Right Side Image"
                      value={formData.image_right_side}
                      onChange={(value) => handleInputChange('image_right_side', value)}
                      disabled={isViewMode}
                    />
                    <ImageUpload
                      label="Left Side Image"
                      value={formData.image_left_side}
                      onChange={(value) => handleInputChange('image_left_side', value)}
                      disabled={isViewMode}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'parts' && (
              <div className="space-y-8">
                {/* Parts Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-6">Parts Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                      <input
                        type="text"
                        value={formData.invoice_number}
                        onChange={(e) => handleInputChange('invoice_number', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Part Location</label>
                      <input
                        type="text"
                        value={formData.part_location}
                        onChange={(e) => handleInputChange('part_location', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date</label>
                      <input
                        type="date"
                        value={formData.invoice_date}
                        onChange={(e) => handleInputChange('invoice_date', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Value</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.invoice_value}
                        onChange={(e) => handleInputChange('invoice_value', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Issue Counter Sale</label>
                      <input
                        type="text"
                        value={formData.issue_counter_sale}
                        onChange={(e) => handleInputChange('issue_counter_sale', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Parts and Consumables Table */}
                <PartsAndConsumablesTable
                  parts={formData.parts_and_consumables || []}
                  onChange={(parts) => handleInputChange('parts_and_consumables', parts)}
                  onTotalBChange={handleTotalBChange}
                  mode={mode}
                />

                {/* Lubricants Used Table */}
                <LubricantsUsedTable
                  lubricants={formData.lubricants_used || []}
                  onChange={(lubricants) => handleInputChange('lubricants_used', lubricants)}
                  onTotalCChange={handleTotalCChange}
                  mode={mode}
                />
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-8">
                {/* Payment Status */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-6">Payment Status</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                      <select
                        value={formData.payment_status}
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
                  <h4 className="text-lg font-medium text-gray-900 mb-6">Signatures</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Customer Signature</label>
                      <SignaturePad
                        value={formData.customer_signature}
                        onChange={(signature) => handleInputChange('customer_signature', signature)}
                        disabled={isViewMode}
                        placeholder="Customer signature"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Supervisor Signature</label>
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
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            {!isViewMode && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    {mode === 'create' ? 'Create Job Card' : 'Save Changes'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};