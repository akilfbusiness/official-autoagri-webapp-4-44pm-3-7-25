import React, { useState, useEffect } from 'react';
import { X, FileText, Wrench, Package, CreditCard, User, Car, Users, CheckSquare, Calendar, DollarSign, MapPin, Truck, Settings, Camera, PenTool, RefreshCw } from 'lucide-react';
import { JobCard, JobCardFormData, CustomerVehicleSuggestion } from '../types/JobCard';
import { CollapsibleSection } from './CollapsibleSection';
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
import { useJobCards } from '../hooks/useJobCards';

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

// Dropdown options
const MONTH_OPTIONS = [
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

const FUEL_TYPE_OPTIONS = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

const AUSTRALIAN_STATES = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'SA', label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT', label: 'Northern Territory' },
];

const SERVICE_OPTIONS = ['Service A', 'Service B', 'Service C', 'Service D'];

const WORKER_OPTIONS = ['Worker 1', 'Worker 2', 'Worker 3', 'Worker 4'];

const PARTS_OPTIONS = ['Parts 1', 'Parts 2', 'Parts 3', 'Parts 4'];

const PAYMENT_STATUS_OPTIONS = [
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'paid', label: 'Paid' },
];

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
  const [formData, setFormData] = useState<JobCardFormData>({});

  // Auto-calculated totals
  const [totalB, setTotalB] = useState(0);
  const [totalC, setTotalC] = useState(0);

  // Initialize form data
  useEffect(() => {
    if (editingJobCard) {
      // Edit mode - populate from existing job card
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
        vehicle_state: editingJobCard.vehicle_state,
        tyre_size: editingJobCard.tyre_size,
        next_service_kms: editingJobCard.next_service_kms?.toString(),
        vehicle_type: editingJobCard.vehicle_type,
        service_selection: editingJobCard.service_selection,
        assigned_worker: editingJobCard.assigned_worker,
        assigned_parts: editingJobCard.assigned_parts,
        is_worker_assigned_complete: editingJobCard.is_worker_assigned_complete,
        is_parts_assigned_complete: editingJobCard.is_parts_assigned_complete,
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
      // Create mode with existing customer data
      setFormData({
        job_start_date: new Date().toISOString().split('T')[0],
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
        service_progress: [],
        trailer_progress: [],
        other_progress: [],
        parts_and_consumables: [],
        lubricants_used: [],
        payment_status: 'unpaid',
      });
    } else {
      // Create mode - initialize with defaults
      setFormData({
        job_start_date: new Date().toISOString().split('T')[0],
        service_progress: [],
        trailer_progress: [],
        other_progress: [],
        parts_and_consumables: [],
        lubricants_used: [],
        payment_status: 'unpaid',
      });
    }
  }, [editingJobCard, initialCustomerData]);

  // Auto-generate job number for new job cards
  useEffect(() => {
    if (mode === 'create' && !formData.job_number) {
      const generateJobNumber = async () => {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        
        try {
          const nextNum = await getNextJobNumber(year, month);
          const jobNumber = `JC-${year}-${month}-${nextNum}`;
          setFormData(prev => ({ ...prev, job_number: jobNumber }));
        } catch (error) {
          console.error('Error generating job number:', error);
        }
      };
      
      generateJobNumber();
    }
  }, [mode, formData.job_number, getNextJobNumber]);

  // Calculate approximate cost (Total A + Total B + Total C)
  useEffect(() => {
    const totalA = parseFloat(formData.total_a || '0');
    const approximateCost = totalA + totalB + totalC;
    setFormData(prev => ({ 
      ...prev, 
      approximate_cost: approximateCost.toFixed(2)
    }));
  }, [formData.total_a, totalB, totalC]);

  const handleInputChange = (field: keyof JobCardFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVehicleTypeChange = (type: string, checked: boolean) => {
    const currentTypes = formData.vehicle_type || [];
    if (checked) {
      handleInputChange('vehicle_type', [...currentTypes, type]);
    } else {
      handleInputChange('vehicle_type', currentTypes.filter(t => t !== type));
      // Clear service selection if HR Truck or Prime Mover is unchecked
      if ((type === 'HR Truck' || type === 'Prime Mover') && formData.service_selection) {
        handleInputChange('service_selection', '');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving job card:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isViewMode = mode === 'view';
  const isRestrictedMode = restrictedMode && (mode === 'mechanic' || mode === 'parts');

  // Show service selection dropdown if HR Truck or Prime Mover is selected
  const showServiceSelection = formData.vehicle_type?.includes('HR Truck') || formData.vehicle_type?.includes('Prime Mover');

  // Calculate grand total for payments tab
  const grandTotal = (parseFloat(formData.total_a || '0') + totalB + totalC).toFixed(2);

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
                   mode === 'mechanic' ? 'Mechanic Portal - Edit Job Card' :
                   'Parts Portal - Edit Job Card'}
                </h3>
                {formData.job_number && (
                  <p className="text-sm text-gray-500">Job Number: {formData.job_number}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onRefresh && (mode === 'edit' || mode === 'mechanic' || mode === 'parts') && (
                <button
                  type="button"
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
          <div className="border-b border-gray-200 px-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => onTabChange('information')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'information'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                disabled={isRestrictedMode}
              >
                <FileText className="h-4 w-4 inline mr-1" />
                Information
              </button>
              <button
                onClick={() => onTabChange('mechanic')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'mechanic'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                disabled={isRestrictedMode && mode === 'parts'}
              >
                <Wrench className="h-4 w-4 inline mr-1" />
                Mechanic
              </button>
              <button
                onClick={() => onTabChange('parts')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'parts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                disabled={isRestrictedMode && mode === 'mechanic'}
              >
                <Package className="h-4 w-4 inline mr-1" />
                Parts
              </button>
              <button
                onClick={() => onTabChange('payments')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'payments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                disabled={isRestrictedMode}
              >
                <CreditCard className="h-4 w-4 inline mr-1" />
                Payments
              </button>
            </nav>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100vh-200px)]">
            <div className="flex-1 overflow-y-auto p-6">
              {/* Information Tab */}
              {activeTab === 'information' && (
                <div className="space-y-6">
                  {/* Job Information Section */}
                  <CollapsibleSection
                    title="Job Information"
                    icon={<Calendar className="h-5 w-5 text-blue-600" />}
                    defaultOpen={true}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Number</label>
                        <input
                          type="text"
                          value={formData.job_number || ''}
                          onChange={(e) => handleInputChange('job_number', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                          placeholder="Auto-generated"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Start Date</label>
                        <input
                          type="date"
                          value={formData.job_start_date || ''}
                          onChange={(e) => handleInputChange('job_start_date', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expected Completion Date</label>
                        <input
                          type="date"
                          value={formData.expected_completion_date || ''}
                          onChange={(e) => handleInputChange('expected_completion_date', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Completed Date</label>
                        <input
                          type="date"
                          value={formData.completed_date || ''}
                          onChange={(e) => handleInputChange('completed_date', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Approximate Cost</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="text"
                            value={formData.approximate_cost || '0.00'}
                            readOnly
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                            placeholder="Auto-calculated"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Auto-calculated from Total A + Total B + Total C</p>
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* Customer Details Section */}
                  <CollapsibleSection
                    title="Customer Details"
                    icon={<User className="h-5 w-5 text-green-600" />}
                    defaultOpen={true}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                        <input
                          type="text"
                          value={formData.customer_name || ''}
                          onChange={(e) => handleInputChange('customer_name', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                          placeholder="Enter customer name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                        <input
                          type="text"
                          value={formData.company_name || ''}
                          onChange={(e) => handleInputChange('company_name', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                          placeholder="Enter company name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ABN</label>
                        <input
                          type="text"
                          value={formData.abn || ''}
                          onChange={(e) => handleInputChange('abn', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                          placeholder="Enter ABN"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
                        <input
                          type="tel"
                          value={formData.mobile || ''}
                          onChange={(e) => handleInputChange('mobile', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                          placeholder="Enter mobile number"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* Vehicle Details Section */}
                  <CollapsibleSection
                    title="Vehicle Details"
                    icon={<Car className="h-5 w-5 text-purple-600" />}
                    defaultOpen={true}
                  >
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Make</label>
                          <input
                            type="text"
                            value={formData.vehicle_make || ''}
                            onChange={(e) => handleInputChange('vehicle_make', e.target.value)}
                            disabled={isViewMode}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              isViewMode ? 'bg-gray-50' : ''
                            }`}
                            placeholder="Enter vehicle make"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Model</label>
                          <input
                            type="text"
                            value={formData.vehicle_model || ''}
                            onChange={(e) => handleInputChange('vehicle_model', e.target.value)}
                            disabled={isViewMode}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              isViewMode ? 'bg-gray-50' : ''
                            }`}
                            placeholder="Enter vehicle model"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Month</label>
                          <select
                            value={formData.vehicle_month || ''}
                            onChange={(e) => handleInputChange('vehicle_month', e.target.value)}
                            disabled={isViewMode}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              isViewMode ? 'bg-gray-50' : ''
                            }`}
                          >
                            <option value="">Select month</option>
                            {MONTH_OPTIONS.map(month => (
                              <option key={month.value} value={month.value}>{month.label}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Year</label>
                          <input
                            type="number"
                            value={formData.vehicle_year || ''}
                            onChange={(e) => handleInputChange('vehicle_year', e.target.value)}
                            disabled={isViewMode}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              isViewMode ? 'bg-gray-50' : ''
                            }`}
                            placeholder="Enter year"
                            min="1900"
                            max="2100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle KMs</label>
                          <input
                            type="number"
                            value={formData.vehicle_kms || ''}
                            onChange={(e) => handleInputChange('vehicle_kms', e.target.value)}
                            disabled={isViewMode}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              isViewMode ? 'bg-gray-50' : ''
                            }`}
                            placeholder="Enter kilometers"
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                          <select
                            value={formData.fuel_type || ''}
                            onChange={(e) => handleInputChange('fuel_type', e.target.value)}
                            disabled={isViewMode}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              isViewMode ? 'bg-gray-50' : ''
                            }`}
                          >
                            <option value="">Select fuel type</option>
                            {FUEL_TYPE_OPTIONS.map(fuel => (
                              <option key={fuel} value={fuel}>{fuel}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">VIN</label>
                          <input
                            type="text"
                            value={formData.vin || ''}
                            onChange={(e) => handleInputChange('vin', e.target.value)}
                            disabled={isViewMode}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              isViewMode ? 'bg-gray-50' : ''
                            }`}
                            placeholder="Enter VIN"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">REGO</label>
                          <input
                            type="text"
                            value={formData.rego || ''}
                            onChange={(e) => handleInputChange('rego', e.target.value)}
                            disabled={isViewMode}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              isViewMode ? 'bg-gray-50' : ''
                            }`}
                            placeholder="Enter registration"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                          <select
                            value={formData.vehicle_state || ''}
                            onChange={(e) => handleInputChange('vehicle_state', e.target.value)}
                            disabled={isViewMode}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              isViewMode ? 'bg-gray-50' : ''
                            }`}
                          >
                            <option value="">Select state</option>
                            {AUSTRALIAN_STATES.map(state => (
                              <option key={state.value} value={state.value}>{state.label}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tyre Size</label>
                          <input
                            type="text"
                            value={formData.tyre_size || ''}
                            onChange={(e) => handleInputChange('tyre_size', e.target.value)}
                            disabled={isViewMode}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              isViewMode ? 'bg-gray-50' : ''
                            }`}
                            placeholder="Enter tyre size"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Next Service KMs</label>
                          <input
                            type="number"
                            value={formData.next_service_kms || ''}
                            onChange={(e) => handleInputChange('next_service_kms', e.target.value)}
                            disabled={isViewMode}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              isViewMode ? 'bg-gray-50' : ''
                            }`}
                            placeholder="Enter next service KMs"
                            min="0"
                          />
                        </div>
                      </div>

                      {/* Vehicle Type Checkboxes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Vehicle Type</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {['HR Truck', 'Prime Mover', 'Trailer', 'Other'].map(type => (
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

                      {/* Service Selection - Only show if HR Truck or Prime Mover is selected */}
                      {showServiceSelection && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Service Selection</label>
                          <select
                            value={formData.service_selection || ''}
                            onChange={(e) => handleInputChange('service_selection', e.target.value)}
                            disabled={isViewMode}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              isViewMode ? 'bg-gray-50' : ''
                            }`}
                          >
                            <option value="">Select service type</option>
                            {SERVICE_OPTIONS.map(service => (
                              <option key={service} value={service}>{service}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </CollapsibleSection>

                  {/* Assignment Section */}
                  <CollapsibleSection
                    title="Assignment"
                    icon={<Users className="h-5 w-5 text-orange-600" />}
                    defaultOpen={true}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Worker</label>
                        <select
                          value={formData.assigned_worker || ''}
                          onChange={(e) => handleInputChange('assigned_worker', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        >
                          <option value="">Select worker</option>
                          {WORKER_OPTIONS.map(worker => (
                            <option key={worker} value={worker}>{worker}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Parts</label>
                        <select
                          value={formData.assigned_parts || ''}
                          onChange={(e) => handleInputChange('assigned_parts', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                        >
                          <option value="">Select parts team</option>
                          {PARTS_OPTIONS.map(parts => (
                            <option key={parts} value={parts}>{parts}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* Customer Declaration Section */}
                  <CollapsibleSection
                    title="Customer Declaration"
                    icon={<CheckSquare className="h-5 w-5 text-red-600" />}
                    defaultOpen={true}
                  >
                    <div className="space-y-6">
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.customer_declaration_authorized || false}
                            onChange={(e) => handleInputChange('customer_declaration_authorized', e.target.checked)}
                            disabled={isViewMode}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Customer Authorization - I authorize the work to be performed
                          </span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Customer Signature</label>
                        <SignaturePad
                          value={formData.customer_signature}
                          onChange={(signature) => handleInputChange('customer_signature', signature)}
                          disabled={isViewMode}
                          placeholder="Customer signature"
                        />
                      </div>
                    </div>
                  </CollapsibleSection>
                </div>
              )}

              {/* Mechanic Tab */}
              {activeTab === 'mechanic' && (
                <div className="space-y-6">
                  {/* Service Task Lists - Conditional based on service selection */}
                  {formData.service_selection === 'Service A' && (
                    <ServiceATaskList
                      serviceSelection={formData.service_selection}
                      mode={mode}
                      currentProgress={formData.service_progress}
                      onProgressChange={(progress) => handleInputChange('service_progress', progress)}
                    />
                  )}

                  {formData.service_selection === 'Service B' && (
                    <ServiceBTaskList
                      serviceSelection={formData.service_selection}
                      mode={mode}
                      currentProgress={formData.service_progress}
                      onProgressChange={(progress) => handleInputChange('service_progress', progress)}
                    />
                  )}

                  {formData.service_selection === 'Service C' && (
                    <ServiceCTaskList
                      serviceSelection={formData.service_selection}
                      mode={mode}
                      currentProgress={formData.service_progress}
                      onProgressChange={(progress) => handleInputChange('service_progress', progress)}
                    />
                  )}

                  {formData.service_selection === 'Service D' && (
                    <ServiceDTaskList
                      serviceSelection={formData.service_selection}
                      mode={mode}
                      currentProgress={formData.service_progress}
                      onProgressChange={(progress) => handleInputChange('service_progress', progress)}
                    />
                  )}

                  {/* Trailer Task List - Only show if Trailer is selected */}
                  {formData.vehicle_type?.includes('Trailer') && (
                    <TrailerTaskList
                      vehicleType={formData.vehicle_type}
                      mode={mode}
                      currentProgress={formData.trailer_progress}
                      onProgressChange={(progress) => handleInputChange('trailer_progress', progress)}
                    />
                  )}

                  {/* Other Task List - Only show if Other is selected */}
                  {formData.vehicle_type?.includes('Other') && (
                    <OtherTaskList
                      vehicleType={formData.vehicle_type}
                      mode={mode}
                      currentProgress={formData.other_progress}
                      onProgressChange={(progress) => handleInputChange('other_progress', progress)}
                    />
                  )}

                  {/* Mechanic Notes Section */}
                  <CollapsibleSection
                    title="Mechanic Notes"
                    icon={<PenTool className="h-5 w-5 text-blue-600" />}
                    defaultOpen={true}
                  >
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Handover Valuables to Customer</label>
                        <textarea
                          value={formData.handover_valuables_to_customer || ''}
                          onChange={(e) => handleInputChange('handover_valuables_to_customer', e.target.value)}
                          disabled={isViewMode}
                          rows={3}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                          placeholder="Enter notes about valuables handover"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Check All Tyres</label>
                        <textarea
                          value={formData.check_all_tyres || ''}
                          onChange={(e) => handleInputChange('check_all_tyres', e.target.value)}
                          disabled={isViewMode}
                          rows={3}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                          placeholder="Enter tyre inspection notes"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total A (Labor)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.total_a || ''}
                            onChange={(e) => handleInputChange('total_a', e.target.value)}
                            disabled={isViewMode}
                            className={`w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              isViewMode ? 'bg-gray-50' : ''
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Future Work Notes</label>
                        <textarea
                          value={formData.future_work_notes || ''}
                          onChange={(e) => handleInputChange('future_work_notes', e.target.value)}
                          disabled={isViewMode}
                          rows={4}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                          placeholder="Enter recommendations for future work"
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
                  </CollapsibleSection>

                  {/* Vehicle Images Section */}
                  <CollapsibleSection
                    title="Vehicle Images"
                    icon={<Camera className="h-5 w-5 text-purple-600" />}
                    defaultOpen={true}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ImageUpload
                        label="Front View"
                        value={formData.image_front}
                        onChange={(image) => handleInputChange('image_front', image)}
                        disabled={isViewMode}
                      />

                      <ImageUpload
                        label="Back View"
                        value={formData.image_back}
                        onChange={(image) => handleInputChange('image_back', image)}
                        disabled={isViewMode}
                      />

                      <ImageUpload
                        label="Right Side"
                        value={formData.image_right_side}
                        onChange={(image) => handleInputChange('image_right_side', image)}
                        disabled={isViewMode}
                      />

                      <ImageUpload
                        label="Left Side"
                        value={formData.image_left_side}
                        onChange={(image) => handleInputChange('image_left_side', image)}
                        disabled={isViewMode}
                      />
                    </div>
                  </CollapsibleSection>
                </div>
              )}

              {/* Parts Tab */}
              {activeTab === 'parts' && (
                <div className="space-y-6">
                  {/* Parts Information Section */}
                  <CollapsibleSection
                    title="Parts Information"
                    icon={<MapPin className="h-5 w-5 text-blue-600" />}
                    defaultOpen={true}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                        <input
                          type="text"
                          value={formData.invoice_number || ''}
                          onChange={(e) => handleInputChange('invoice_number', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                          placeholder="Enter invoice number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Parts Location</label>
                        <input
                          type="text"
                          value={formData.part_location || ''}
                          onChange={(e) => handleInputChange('part_location', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                          placeholder="Enter parts location"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date</label>
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Value</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.invoice_value || ''}
                            onChange={(e) => handleInputChange('invoice_value', e.target.value)}
                            disabled={isViewMode}
                            className={`w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                              isViewMode ? 'bg-gray-50' : ''
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Issue Counter Sale</label>
                        <input
                          type="text"
                          value={formData.issue_counter_sale || ''}
                          onChange={(e) => handleInputChange('issue_counter_sale', e.target.value)}
                          disabled={isViewMode}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            isViewMode ? 'bg-gray-50' : ''
                          }`}
                          placeholder="Enter issue counter sale information"
                        />
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* Parts and Consumables Section */}
                  <CollapsibleSection
                    title="Parts and Consumables"
                    icon={<Package className="h-5 w-5 text-purple-600" />}
                    defaultOpen={true}
                  >
                    <PartsAndConsumablesTable
                      parts={formData.parts_and_consumables || []}
                      onChange={(parts) => handleInputChange('parts_and_consumables', parts)}
                      onTotalBChange={setTotalB}
                      mode={mode}
                    />
                  </CollapsibleSection>

                  {/* Lubricants Used Section */}
                  <CollapsibleSection
                    title="Lubricants Used"
                    icon={<Truck className="h-5 w-5 text-blue-600" />}
                    defaultOpen={true}
                  >
                    <LubricantsUsedTable
                      lubricants={formData.lubricants_used || []}
                      onChange={(lubricants) => handleInputChange('lubricants_used', lubricants)}
                      onTotalCChange={setTotalC}
                      mode={mode}
                    />
                  </CollapsibleSection>
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  {/* Payment Status Section */}
                  <CollapsibleSection
                    title="Payment Status"
                    icon={<CreditCard className="h-5 w-5 text-green-600" />}
                    defaultOpen={true}
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                      <select
                        value={formData.payment_status || 'unpaid'}
                        onChange={(e) => handleInputChange('payment_status', e.target.value)}
                        disabled={isViewMode}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          isViewMode ? 'bg-gray-50' : ''
                        }`}
                      >
                        {PAYMENT_STATUS_OPTIONS.map(status => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </select>
                    </div>
                  </CollapsibleSection>

                  {/* Cost Summary Section */}
                  <CollapsibleSection
                    title="Cost Summary"
                    icon={<DollarSign className="h-5 w-5 text-blue-600" />}
                    defaultOpen={true}
                  >
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="text-center">
                            <p className="text-sm font-medium text-blue-800">Total A (Labor)</p>
                            <p className="text-2xl font-bold text-blue-900">${(parseFloat(formData.total_a || '0')).toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <div className="text-center">
                            <p className="text-sm font-medium text-purple-800">Total B (Parts)</p>
                            <p className="text-2xl font-bold text-purple-900">${totalB.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="text-center">
                            <p className="text-sm font-medium text-green-800">Total C (Lubricants)</p>
                            <p className="text-2xl font-bold text-green-900">${totalC.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="text-center">
                            <p className="text-sm font-medium text-yellow-800">Grand Total</p>
                            <p className="text-2xl font-bold text-yellow-900">${grandTotal}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-medium text-gray-900">Payment Status</p>
                            <p className="text-sm text-gray-600">Current payment status for this job card</p>
                          </div>
                          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                            formData.payment_status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {formData.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleSection>
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
                {isViewMode ? 'Close' : 'Cancel'}
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