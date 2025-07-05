import React, { useState, useEffect } from 'react';
import { X, FileText, Wrench, Package, CreditCard, Calendar, User, Car, RefreshCw } from 'lucide-react';
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
  const [isSaving, setIsSaving] = useState(false);
  const [totalB, setTotalB] = useState(0);
  const [totalC, setTotalC] = useState(0);

  // Helper function to get initial form data
  const getInitialFormData = (): JobCardFormData => {
    const now = new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    
    return {
      // Job Number Components (auto-generated for new cards)
      job_number_year: currentYear,
      job_number_month: currentMonth,
      job_number_num: '',
      job_number: '',
      job_start_date: now.toISOString().split('T')[0],
      expected_completion_date: '',
      completed_date: '',
      approximate_cost: '',
      // Customer Details
      customer_name: '',
      company_name: '',
      abn: '',
      mobile: '',
      email: '',
      // Vehicle Details
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
      // Assignment Fields
      assigned_worker: '',
      assigned_parts: '',
      // Completion Status Fields
      is_worker_assigned_complete: false,
      is_parts_assigned_complete: false,
      // Customer Declaration
      customer_declaration_authorized: false,
      // Service Progress
      service_progress: [],
      // Trailer Progress
      trailer_progress: [],
      // Other Progress
      other_progress: [],
      // Mechanic Sections
      handover_valuables_to_customer: '',
      check_all_tyres: '',
      total_a: '',
      future_work_notes: '',
      // Images
      image_front: undefined,
      image_back: undefined,
      image_right_side: undefined,
      image_left_side: undefined,
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
      customer_signature: undefined,
      supervisor_signature: undefined,
    };
  };

  const [formData, setFormData] = useState<JobCardFormData>(getInitialFormData());

  // Reset form data when modal opens/closes or mode changes
  useEffect(() => {
    if (!isOpen) {
      // When modal closes, always reset to initial state
      setFormData(getInitialFormData());
      setTotalB(0);
      setTotalC(0);
      return;
    }

    // When modal opens, determine what to do based on mode and data
    if (mode === 'create') {
      // For create mode, start with fresh data
      const initialData = getInitialFormData();
      
      // If we have initial customer data, populate those fields
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
      setTotalB(0);
      setTotalC(0);
    } else if (editingJobCard && (mode === 'edit' || mode === 'view' || mode === 'mechanic' || mode === 'parts')) {
      // For edit/view modes, populate with existing data
      const editData: JobCardFormData = {
        job_number_year: editingJobCard.job_number?.split('-')[1] ? `20${editingJobCard.job_number.split('-')[1]}` : new Date().getFullYear().toString(),
        job_number_month: editingJobCard.job_number?.split('-')[2] || (new Date().getMonth() + 1).toString().padStart(2, '0'),
        job_number_num: editingJobCard.job_number?.split('-')[3] || '',
        job_number: editingJobCard.job_number || '',
        job_start_date: editingJobCard.job_start_date ? editingJobCard.job_start_date.toISOString().split('T')[0] : '',
        expected_completion_date: editingJobCard.expected_completion_date ? editingJobCard.expected_completion_date.toISOString().split('T')[0] : '',
        completed_date: editingJobCard.completed_date ? editingJobCard.completed_date.toISOString().split('T')[0] : '',
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
        image_front: editingJobCard.image_front,
        image_back: editingJobCard.image_back,
        image_right_side: editingJobCard.image_right_side,
        image_left_side: editingJobCard.image_left_side,
        invoice_number: editingJobCard.invoice_number || '',
        part_location: editingJobCard.part_location || '',
        invoice_date: editingJobCard.invoice_date ? editingJobCard.invoice_date.toISOString().split('T')[0] : '',
        invoice_value: editingJobCard.invoice_value?.toString() || '',
        issue_counter_sale: editingJobCard.issue_counter_sale || '',
        parts_and_consumables: editingJobCard.parts_and_consumables || [],
        lubricants_used: editingJobCard.lubricants_used || [],
        payment_status: editingJobCard.payment_status || 'unpaid',
        total_c: editingJobCard.total_c?.toString() || '',
        customer_signature: editingJobCard.customer_signature,
        supervisor_signature: editingJobCard.supervisor_signature,
      };
      
      setFormData(editData);
      
      // Calculate totals for existing data
      const partsTotal = (editingJobCard.parts_and_consumables || []).reduce((sum, part) => sum + (part.total_cost_aud || 0), 0);
      const lubricantsTotal = (editingJobCard.lubricants_used || []).reduce((sum, lubricant) => sum + (lubricant.total_cost || 0), 0);
      setTotalB(partsTotal);
      setTotalC(lubricantsTotal);
    }
  }, [isOpen, mode, editingJobCard, initialCustomerData]);

  // Auto-generate job number for new job cards
  useEffect(() => {
    if (mode === 'create' && formData.job_number_year && formData.job_number_month && !formData.job_number_num) {
      const generateJobNumber = async () => {
        try {
          const nextNum = await getNextJobNumber(formData.job_number_year!, formData.job_number_month!);
          const fullJobNumber = `JC-${formData.job_number_year!.slice(-2)}-${formData.job_number_month}-${nextNum}`;
          
          setFormData(prev => ({
            ...prev,
            job_number_num: nextNum,
            job_number: fullJobNumber
          }));
        } catch (error) {
          console.error('Error generating job number:', error);
        }
      };

      generateJobNumber();
    }
  }, [mode, formData.job_number_year, formData.job_number_month, formData.job_number_num, getNextJobNumber]);

  const handleInputChange = (field: keyof JobCardFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
    
    if (mode === 'view') return;

    // Validation for required fields
    if (mode === 'create' || mode === 'edit') {
      if (!formData.job_number) {
        alert('Job number is required');
        return;
      }

      // Check if job number already exists (only for create mode)
      if (mode === 'create') {
        try {
          const exists = await checkJobNumberExists(formData.job_number);
          if (exists) {
            alert('This job number already exists. Please try again.');
            return;
          }
        } catch (error) {
          console.error('Error checking job number:', error);
          alert('Error validating job number. Please try again.');
          return;
        }
      }
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving job card:', error);
      // Don't close the form if there's an error
    } finally {
      setIsSaving(false);
    }
  };

  const isViewMode = mode === 'view';
  const isMechanicMode = mode === 'mechanic';
  const isPartsMode = mode === 'parts';

  // Determine which tabs to show based on mode
  const getAvailableTabs = () => {
    if (isMechanicMode) {
      return [
        { id: 'information' as const, label: 'Information', icon: <FileText className="h-4 w-4" /> },
        { id: 'mechanic' as const, label: 'Mechanic', icon: <Wrench className="h-4 w-4" /> },
      ];
    } else if (isPartsMode) {
      return [
        { id: 'information' as const, label: 'Information', icon: <FileText className="h-4 w-4" /> },
        { id: 'parts' as const, label: 'Parts', icon: <Package className="h-4 w-4" /> },
      ];
    } else {
      return [
        { id: 'information' as const, label: 'Information', icon: <FileText className="h-4 w-4" /> },
        { id: 'mechanic' as const, label: 'Mechanic', icon: <Wrench className="h-4 w-4" /> },
        { id: 'parts' as const, label: 'Parts', icon: <Package className="h-4 w-4" /> },
        { id: 'payments' as const, label: 'Payments', icon: <CreditCard className="h-4 w-4" /> },
      ];
    }
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
                  {mode === 'create' ? 'Create New Job Card' : 
                   mode === 'edit' ? 'Edit Job Card' : 
                   mode === 'view' ? 'View Job Card' :
                   mode === 'mechanic' ? 'Mechanic Portal - Job Card' :
                   'Parts Portal - Job Card'}
                </h3>
                {formData.job_number && (
                  <p className="text-sm text-gray-500">Job Number: {formData.job_number}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onRefresh && (mode === 'mechanic' || mode === 'parts') && (
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

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100vh-200px)]">
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'information' && (
                <div className="space-y-8">
                  {/* Job Information Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-medium text-gray-900">Job Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Job Number Display (Read-only) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Number
                        </label>
                        <input
                          type="text"
                          value={formData.job_number || 'Generating...'}
                          disabled
                          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 font-medium"
                        />
                        <p className="text-xs text-gray-500 mt-1">Auto-generated</p>
                      </div>

                      {/* Job Start Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Start Date
                        </label>
                        <input
                          type="date"
                          value={formData.job_start_date || ''}
                          onChange={(e) => handleInputChange('job_start_date', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      {/* Expected Completion Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expected Completion Date
                        </label>
                        <input
                          type="date"
                          value={formData.expected_completion_date || ''}
                          onChange={(e) => handleInputChange('expected_completion_date', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      {/* Completed Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Completed Date
                        </label>
                        <input
                          type="date"
                          value={formData.completed_date || ''}
                          onChange={(e) => handleInputChange('completed_date', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      {/* Approximate Cost */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Approximate Cost
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.approximate_cost || ''}
                          onChange={(e) => handleInputChange('approximate_cost', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          placeholder="0.00"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Customer Details Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-medium text-gray-900">Customer Details</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Customer Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Customer Name
                        </label>
                        <input
                          type="text"
                          value={formData.customer_name || ''}
                          onChange={(e) => handleInputChange('customer_name', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          placeholder="Enter customer name"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      {/* Company Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={formData.company_name || ''}
                          onChange={(e) => handleInputChange('company_name', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          placeholder="Enter company name"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      {/* ABN */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ABN
                        </label>
                        <input
                          type="text"
                          value={formData.abn || ''}
                          onChange={(e) => handleInputChange('abn', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          placeholder="Enter ABN"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      {/* Mobile */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile
                        </label>
                        <input
                          type="tel"
                          value={formData.mobile || ''}
                          onChange={(e) => handleInputChange('mobile', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          placeholder="Enter mobile number"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      {/* Email */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          placeholder="Enter email address"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Details Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Car className="h-5 w-5 text-purple-600" />
                      <h3 className="text-lg font-medium text-gray-900">Vehicle Details</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Vehicle Make */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle Make
                        </label>
                        <input
                          type="text"
                          value={formData.vehicle_make || ''}
                          onChange={(e) => handleInputChange('vehicle_make', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          placeholder="Enter vehicle make"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      {/* Vehicle Model */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle Model
                        </label>
                        <input
                          type="text"
                          value={formData.vehicle_model || ''}
                          onChange={(e) => handleInputChange('vehicle_model', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          placeholder="Enter vehicle model"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      {/* Vehicle Month */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle Month
                        </label>
                        <select
                          value={formData.vehicle_month || ''}
                          onChange={(e) => handleInputChange('vehicle_month', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        >
                          <option value="">Select month</option>
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

                      {/* Vehicle Year */}
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
                          disabled={isViewMode || restrictedMode}
                          placeholder="Enter year"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      {/* Vehicle KMs */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle KMs
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.vehicle_kms || ''}
                          onChange={(e) => handleInputChange('vehicle_kms', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          placeholder="Enter kilometers"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      {/* Fuel Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fuel Type
                        </label>
                        <select
                          value={formData.fuel_type || ''}
                          onChange={(e) => handleInputChange('fuel_type', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        >
                          <option value="">Select fuel type</option>
                          <option value="Petrol">Petrol</option>
                          <option value="Diesel">Diesel</option>
                        </select>
                      </div>

                      {/* VIN */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          VIN
                        </label>
                        <input
                          type="text"
                          value={formData.vin || ''}
                          onChange={(e) => handleInputChange('vin', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          placeholder="Enter VIN"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      {/* REGO */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          REGO
                        </label>
                        <input
                          type="text"
                          value={formData.rego || ''}
                          onChange={(e) => handleInputChange('rego', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          placeholder="Enter registration"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <select
                          value={formData.vehicle_state || ''}
                          onChange={(e) => handleInputChange('vehicle_state', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        >
                          <option value="">Select state</option>
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

                      {/* Tyre Size */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tyre Size
                        </label>
                        <input
                          type="text"
                          value={formData.tyre_size || ''}
                          onChange={(e) => handleInputChange('tyre_size', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          placeholder="Enter tyre size"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      {/* Next Service KMs */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Next Service KMs
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.next_service_kms || ''}
                          onChange={(e) => handleInputChange('next_service_kms', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          placeholder="Enter kilometers"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Vehicle Type Checkboxes */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Vehicle Type
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['HR Truck', 'Prime Mover', 'Trailer', 'Other'].map((type) => (
                          <label key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={(formData.vehicle_type || []).includes(type)}
                              onChange={(e) => handleVehicleTypeChange(type, e.target.checked)}
                              disabled={isViewMode || restrictedMode}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Service Selection - Only show for HR Truck or Prime Mover */}
                    {(formData.vehicle_type?.includes('HR Truck') || formData.vehicle_type?.includes('Prime Mover')) && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service Selection
                        </label>
                        <select
                          value={formData.service_selection || ''}
                          onChange={(e) => handleInputChange('service_selection', e.target.value)}
                          disabled={isViewMode || restrictedMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode || restrictedMode ? 'bg-gray-50' : ''
                          }`}
                        >
                          <option value="">Select service type</option>
                          <option value="Service A">Service A</option>
                          <option value="Service B">Service B</option>
                          <option value="Service C">Service C</option>
                          <option value="Service D">Service D</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Assignment Section - Only show in admin mode */}
                  {!restrictedMode && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Assignments</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Assigned Worker */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assigned Worker
                          </label>
                          <select
                            value={formData.assigned_worker || ''}
                            onChange={(e) => handleInputChange('assigned_worker', e.target.value)}
                            disabled={isViewMode}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              isViewMode ? 'bg-gray-50' : ''
                            }`}
                          >
                            <option value="">Select worker</option>
                            <option value="Worker 1">Worker 1</option>
                            <option value="Worker 2">Worker 2</option>
                            <option value="Worker 3">Worker 3</option>
                            <option value="Worker 4">Worker 4</option>
                          </select>
                        </div>

                        {/* Assigned Parts */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assigned Parts
                          </label>
                          <select
                            value={formData.assigned_parts || ''}
                            onChange={(e) => handleInputChange('assigned_parts', e.target.value)}
                            disabled={isViewMode}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              isViewMode ? 'bg-gray-50' : ''
                            }`}
                          >
                            <option value="">Select parts team</option>
                            <option value="Parts 1">Parts 1</option>
                            <option value="Parts 2">Parts 2</option>
                            <option value="Parts 3">Parts 3</option>
                            <option value="Parts 4">Parts 4</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Customer Declaration */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Declaration</h3>
                    
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={formData.customer_declaration_authorized || false}
                        onChange={(e) => handleInputChange('customer_declaration_authorized', e.target.checked)}
                        disabled={isViewMode || restrictedMode}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">Customer Authorization</span>
                        <p className="mt-1">
                          I authorize the work to be performed and agree to the terms and conditions of service.
                        </p>
                      </div>
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
                  <div className="space-y-6">
                    {/* Handover Valuables */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Handover Valuables to Customer
                      </label>
                      <textarea
                        value={formData.handover_valuables_to_customer || ''}
                        onChange={(e) => handleInputChange('handover_valuables_to_customer', e.target.value)}
                        disabled={isViewMode}
                        placeholder="Enter notes about valuables handover..."
                        rows={3}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          isViewMode ? 'bg-gray-50' : ''
                        }`}
                      />
                    </div>

                    {/* Check All Tyres */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check All Tyres
                      </label>
                      <textarea
                        value={formData.check_all_tyres || ''}
                        onChange={(e) => handleInputChange('check_all_tyres', e.target.value)}
                        disabled={isViewMode}
                        placeholder="Enter tyre inspection notes..."
                        rows={3}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          isViewMode ? 'bg-gray-50' : ''
                        }`}
                      />
                    </div>

                    {/* Total A */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total A (Labor Cost)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.total_a || ''}
                        onChange={(e) => handleInputChange('total_a', e.target.value)}
                        disabled={isViewMode}
                        placeholder="0.00"
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          isViewMode ? 'bg-gray-50' : ''
                        }`}
                      />
                    </div>

                    {/* Future Work Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Future Work Notes
                      </label>
                      <textarea
                        value={formData.future_work_notes || ''}
                        onChange={(e) => handleInputChange('future_work_notes', e.target.value)}
                        disabled={isViewMode}
                        placeholder="Enter future work recommendations..."
                        rows={4}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          isViewMode ? 'bg-gray-50' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Vehicle Images */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Vehicle Images</h3>
                    
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

              {activeTab === 'parts' && (
                <div className="space-y-8">
                  {/* Parts Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Parts Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Invoice Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Invoice Number
                        </label>
                        <input
                          type="text"
                          value={formData.invoice_number || ''}
                          onChange={(e) => handleInputChange('invoice_number', e.target.value)}
                          disabled={isViewMode}
                          placeholder="Enter invoice number"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      {/* Part Location */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Part Location
                        </label>
                        <input
                          type="text"
                          value={formData.part_location || ''}
                          onChange={(e) => handleInputChange('part_location', e.target.value)}
                          disabled={isViewMode}
                          placeholder="Enter part location"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      {/* Invoice Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Invoice Date
                        </label>
                        <input
                          type="date"
                          value={formData.invoice_date || ''}
                          onChange={(e) => handleInputChange('invoice_date', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      {/* Invoice Value */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Invoice Value
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.invoice_value || ''}
                          onChange={(e) => handleInputChange('invoice_value', e.target.value)}
                          disabled={isViewMode}
                          placeholder="0.00"
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      {/* Issue Counter Sale */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Issue Counter Sale
                        </label>
                        <input
                          type="text"
                          value={formData.issue_counter_sale || ''}
                          onChange={(e) => handleInputChange('issue_counter_sale', e.target.value)}
                          disabled={isViewMode}
                          placeholder="Enter issue counter sale information"
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
                    onChange={(parts) => handleInputChange('parts_and_consumables', parts)}
                    onTotalBChange={setTotalB}
                    mode={mode}
                  />

                  {/* Lubricants Used Table */}
                  <LubricantsUsedTable
                    lubricants={formData.lubricants_used || []}
                    onChange={(lubricants) => handleInputChange('lubricants_used', lubricants)}
                    onTotalCChange={setTotalC}
                    mode={mode}
                  />
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="space-y-8">
                  {/* Payment Status */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Status</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Status
                        </label>
                        <select
                          value={formData.payment_status || 'unpaid'}
                          onChange={(e) => handleInputChange('payment_status', e.target.value)}
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
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Summary</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Total A */}
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="text-sm font-medium text-gray-600">Total A (Labor)</div>
                        <div className="text-2xl font-bold text-blue-600">
                          ${parseFloat(formData.total_a || '0').toFixed(2)}
                        </div>
                      </div>

                      {/* Total B */}
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="text-sm font-medium text-gray-600">Total B (Parts)</div>
                        <div className="text-2xl font-bold text-purple-600">
                          ${totalB.toFixed(2)}
                        </div>
                      </div>

                      {/* Total C */}
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="text-sm font-medium text-gray-600">Total C (Lubricants)</div>
                        <div className="text-2xl font-bold text-green-600">
                          ${totalC.toFixed(2)}
                        </div>
                      </div>

                      {/* Grand Total */}
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="text-sm font-medium text-yellow-800">Grand Total</div>
                        <div className="text-2xl font-bold text-yellow-900">
                          ${(parseFloat(formData.total_a || '0') + totalB + totalC).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Signatures</h3>
                    
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
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
              {!isViewMode && (
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : mode === 'create' ? 'Create Job Card' : 'Save Changes'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};