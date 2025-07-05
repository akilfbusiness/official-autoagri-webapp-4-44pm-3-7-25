import React, { useState } from 'react';
import { Wrench, Archive, Plus, FileText, Settings, Users, Package, Edit, CheckCircle, X, Menu, Database } from 'lucide-react';
import { JobCardTable } from './components/JobCardTable';
import { JobCardForm } from './components/JobCardForm';
import { ConfirmationModal } from './components/ConfirmationModal';
import { CustomerSelectionModal } from './components/CustomerSelectionModal';
import { Sidebar } from './components/Sidebar';
import { DatabasePage } from './components/DatabasePage';
import { useJobCards } from './hooks/useJobCards';
import { JobCard, JobCardFormData, CustomerVehicleSuggestion } from './types/JobCard';

type TabType = 'active' | 'archived';
type FormMode = 'create' | 'edit' | 'view' | 'mechanic' | 'parts';
type FormTabType = 'information' | 'mechanic' | 'parts' | 'payments';
type PortalType = 'admin' | 'mechanic' | 'parts';
type PageType = 'dashboard' | 'database';

function App() {
  const {
    loading,
    addJobCard,
    updateJobCard,
    deleteJobCard,
    archiveJobCard,
    unarchiveJobCard,
    toggleWorkerCompletion,
    togglePartsCompletion,
    completeWorkerAssignment,
    completePartsAssignment,
    getActiveJobCards,
    getArchivedJobCards,
    getIncompleteWorkerJobCards,
    getIncompletePartsJobCards,
    fetchJobCardDetails,
  } = useJobCards();

  const [activePortal, setActivePortal] = useState<PortalType>('admin');
  const [activePage, setActivePage] = useState<PageType>('dashboard');
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [editingJobCard, setEditingJobCard] = useState<JobCard | null>(null);
  const [activeFormTab, setActiveFormTab] = useState<FormTabType>('information');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Customer selection modal state
  const [isCustomerSelectionOpen, setIsCustomerSelectionOpen] = useState(false);
  const [selectedCustomerData, setSelectedCustomerData] = useState<CustomerVehicleSuggestion | null>(null);

  // Confirmation modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalTitle, setConfirmModalTitle] = useState('');
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [confirmModalConfirmText, setConfirmModalConfirmText] = useState('');
  const [confirmModalType, setConfirmModalType] = useState<'archive' | 'unarchive' | 'delete' | 'complete' | 'download' | 'discard'>('archive');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Close confirmation modal state
  const [isCloseConfirmModalOpen, setIsCloseConfirmModalOpen] = useState(false);

  const activeJobCards = getActiveJobCards();
  const archivedJobCards = getArchivedJobCards();
  const incompleteWorkerJobCards = getIncompleteWorkerJobCards();
  const incompletePartsJobCards = getIncompletePartsJobCards();
  
  const currentJobCards = activeTab === 'active' ? activeJobCards : archivedJobCards.slice(0, 5); // Limit archived to 5

  const handleCreateNew = () => {
    // Open customer selection modal instead of directly opening the form
    setIsCustomerSelectionOpen(true);
  };

  const handleNewCustomer = () => {
    // User selected "New Customer" - clear any existing customer data and open form
    setSelectedCustomerData(null);
    setFormMode('create');
    setEditingJobCard(null);
    setActiveFormTab('information');
    setIsFormOpen(true);
  };

  const handleExistingCustomer = (customerData: CustomerVehicleSuggestion) => {
    // User selected an existing customer - store the data and open form
    setSelectedCustomerData(customerData);
    setFormMode('create');
    setEditingJobCard(null);
    setActiveFormTab('information');
    setIsFormOpen(true);
  };

  const handleEdit = (jobCard: JobCard) => {
    // Fetch complete job card details before editing
    const loadJobCardDetails = async () => {
      try {
        const detailedJobCard = await fetchJobCardDetails(jobCard.id);
        if (detailedJobCard) {
          setSelectedCustomerData(null); // Clear any existing customer data for edits
          setFormMode('edit');
          setEditingJobCard(detailedJobCard);
          setActiveFormTab('information');
          setIsFormOpen(true);
        } else {
          alert('Error loading job card details. Please try again.');
        }
      } catch (error) {
        console.error('Error loading job card details:', error);
        alert('Error loading job card details. Please try again.');
      }
    };
    loadJobCardDetails();
  };

  const handleView = (jobCard: JobCard) => {
    // Fetch complete job card details before viewing
    const loadJobCardDetails = async () => {
      try {
        const detailedJobCard = await fetchJobCardDetails(jobCard.id);
        if (detailedJobCard) {
          setSelectedCustomerData(null); // Clear any existing customer data for views
          setFormMode('view');
          setEditingJobCard(detailedJobCard);
          setActiveFormTab('information');
          setIsFormOpen(true);
        } else {
          alert('Error loading job card details. Please try again.');
        }
      } catch (error) {
        console.error('Error loading job card details:', error);
        alert('Error loading job card details. Please try again.');
      }
    };
    loadJobCardDetails();
  };

  // New handler for mechanic portal edit
  const handleMechanicEdit = (jobCard: JobCard) => {
    // Fetch complete job card details before editing
    const loadJobCardDetails = async () => {
      try {
        const detailedJobCard = await fetchJobCardDetails(jobCard.id);
        if (detailedJobCard) {
          setSelectedCustomerData(null); // Clear any existing customer data
          setFormMode('mechanic');
          setEditingJobCard(detailedJobCard);
          setActiveFormTab('mechanic');
          setIsFormOpen(true);
        } else {
          alert('Error loading job card details. Please try again.');
        }
      } catch (error) {
        console.error('Error loading job card details:', error);
        alert('Error loading job card details. Please try again.');
      }
    };
    loadJobCardDetails();
  };

  // New handler for parts portal edit
  const handlePartsEdit = (jobCard: JobCard) => {
    // Fetch complete job card details before editing
    const loadJobCardDetails = async () => {
      try {
        const detailedJobCard = await fetchJobCardDetails(jobCard.id);
        if (detailedJobCard) {
          setSelectedCustomerData(null); // Clear any existing customer data
          setFormMode('parts');
          setEditingJobCard(detailedJobCard);
          setActiveFormTab('parts');
          setIsFormOpen(true);
        } else {
          alert('Error loading job card details. Please try again.');
        }
      } catch (error) {
        console.error('Error loading job card details:', error);
        alert('Error loading job card details. Please try again.');
      }
    };
    loadJobCardDetails();
  };

  // New handler for completing a job from mechanic portal
  const handleCompleteWorkerJob = (jobCard: JobCard) => {
    setConfirmModalTitle('Complete Worker Assignment');
    setConfirmModalMessage(`Are you sure you want to mark the worker assignment for job card ${jobCard.job_number} as completed? This will remove the job from your active tasks.`);
    setConfirmModalConfirmText('Complete Assignment');
    setConfirmModalType('complete');
    setPendingAction(() => async () => {
      try {
        await completeWorkerAssignment(jobCard.id);
      } catch (error) {
        console.error('Error completing worker assignment:', error);
        alert('Error completing worker assignment. Please try again.');
      }
    });
    setIsConfirmModalOpen(true);
  };

  // New handler for completing a job from parts portal
  const handleCompletePartsJob = (jobCard: JobCard) => {
    setConfirmModalTitle('Complete Parts Assignment');
    setConfirmModalMessage(`Are you sure you want to mark the parts assignment for job card ${jobCard.job_number} as completed? This will remove the job from your active tasks.`);
    setConfirmModalConfirmText('Complete Assignment');
    setConfirmModalType('complete');
    setPendingAction(() => async () => {
      try {
        await completePartsAssignment(jobCard.id);
      } catch (error) {
        console.error('Error completing parts assignment:', error);
        alert('Error completing parts assignment. Please try again.');
      }
    });
    setIsConfirmModalOpen(true);
  };

  // Handler for refreshing job card data in the edit modal
  const handleRefreshJobCard = async () => {
    if (!editingJobCard) return;
    
    try {
      const refreshedJobCard = await fetchJobCardDetails(editingJobCard.id);
      if (refreshedJobCard) {
        setEditingJobCard(refreshedJobCard);
      } else {
        alert('Error refreshing job card details. Please try again.');
      }
    } catch (error) {
      console.error('Error refreshing job card details:', error);
      alert('Error refreshing job card details. Please try again.');
    }
  };

  // Handler for toggling worker completion from admin portal
  const handleToggleWorkerCompletion = async (jobCard: JobCard, isComplete: boolean) => {
    try {
      await toggleWorkerCompletion(jobCard.id, isComplete);
    } catch (error) {
      console.error('Error toggling worker completion:', error);
      alert('Error updating worker completion status. Please try again.');
    }
  };

  // Handler for toggling parts completion from admin portal
  const handleTogglePartsCompletion = async (jobCard: JobCard, isComplete: boolean) => {
    try {
      await togglePartsCompletion(jobCard.id, isComplete);
    } catch (error) {
      console.error('Error toggling parts completion:', error);
      alert('Error updating parts completion status. Please try again.');
    }
  };

  const handleArchive = (jobCard: JobCard) => {
    setConfirmModalTitle('Archive Job Card');
    setConfirmModalMessage(`Are you sure you want to archive job card ${jobCard.job_number}? This will move it to the archived section where it can be restored later if needed.`);
    setConfirmModalConfirmText('Archive Job Card');
    setConfirmModalType('archive');
    setPendingAction(() => () => archiveJobCard(jobCard.id));
    setIsConfirmModalOpen(true);
  };

  const handleUnarchive = (jobCard: JobCard) => {
    setConfirmModalTitle('Restore Job Card');
    setConfirmModalMessage(`Are you sure you want to restore job card ${jobCard.job_number}? This will move it back to the active job cards section.`);
    setConfirmModalConfirmText('Restore Job Card');
    setConfirmModalType('unarchive');
    setPendingAction(() => () => unarchiveJobCard(jobCard.id));
    setIsConfirmModalOpen(true);
  };

  const handleDelete = (jobCard: JobCard) => {
    setConfirmModalTitle('Delete Job Card');
    setConfirmModalMessage(`Are you sure you want to permanently delete job card ${jobCard.job_number}? This action cannot be undone and all associated data will be lost forever.`);
    setConfirmModalConfirmText('Delete Permanently');
    setConfirmModalType('delete');
    setPendingAction(() => () => deleteJobCard(jobCard.id));
    setIsConfirmModalOpen(true);
  };

  // New handler for PDF download confirmation
  const handleConfirmDownload = (jobCard: JobCard) => {
    setConfirmModalTitle('Download PDF Confirmation');
    setConfirmModalMessage(`Please confirm that all information for job card ${jobCard.job_number} has been filled out correctly before downloading the PDF. Once downloaded, please review the document for accuracy and completeness.`);
    setConfirmModalConfirmText('Download PDF');
    setConfirmModalType('download');
    setPendingAction(() => async () => {
      try {
        // First, fetch the complete job card details to ensure all data is included in PDF
        const completeJobCard = await fetchJobCardDetails(jobCard.id);
        if (!completeJobCard) {
          throw new Error('Failed to fetch complete job card details');
        }

        // Dynamic import to avoid build issues
        const { PDFDownloadLink, pdf } = await import('@react-pdf/renderer');
        const { JobCardPdfDocument } = await import('./components/JobCardPdfDocument');
        
        // Generate PDF blob using the complete job card data
        const doc = React.createElement(JobCardPdfDocument, { jobCard: completeJobCard });
        const asPdf = pdf(doc);
        const blob = await asPdf.toBlob();
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `JobCard-${completeJobCard.job_number || completeJobCard.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
      }
    });
    setIsConfirmModalOpen(true);
  };

  // New handler for generating invoice and sending to webhook
  const handleGenerateInvoiceAndSendWebhook = async (jobCard: JobCard) => {
    try {
      // First, fetch the complete job card details to ensure all data is included in PDF
      const completeJobCard = await fetchJobCardDetails(jobCard.id);
      if (!completeJobCard) {
        throw new Error('Failed to fetch complete job card details');
      }

      // Dynamic import to avoid build issues
      const { pdf } = await import('@react-pdf/renderer');
      const { JobCardPdfDocument } = await import('./components/JobCardPdfDocument');
      
      // Generate PDF blob using the complete job card data
      const doc = React.createElement(JobCardPdfDocument, { jobCard: completeJobCard });
      const asPdf = pdf(doc);
      const blob = await asPdf.toBlob();
      
      // Convert blob to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove the data URL prefix to get just the base64 string
          const base64String = result.split(',')[1];
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Prepare the payload for the webhook
      const payload = {
        jobCardId: completeJobCard.id,
        jobNumber: completeJobCard.job_number || completeJobCard.id,
        customerName: completeJobCard.customer_name || 'Unknown Customer',
        companyName: completeJobCard.company_name || '',
        filename: `JobCard-${completeJobCard.job_number || completeJobCard.id}.pdf`,
        pdfData: base64,
        timestamp: new Date().toISOString(),
        metadata: {
          vehicleMake: completeJobCard.vehicle_make,
          vehicleModel: completeJobCard.vehicle_model,
          rego: completeJobCard.rego,
          serviceSelection: completeJobCard.service_selection,
          paymentStatus: completeJobCard.payment_status,
          totalCost: (completeJobCard.total_a || 0) + 
                    (completeJobCard.parts_and_consumables?.reduce((sum, part) => sum + (part.total_cost_aud || 0), 0) || 0) + 
                    (completeJobCard.total_c || 0)
        }
      };

      // Send POST request to webhook
      const response = await fetch('https://n8n-customer-automations.onrender.com/webhook-test/6190039c-fa1d-45c7-9efd-8477318c3e29', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed with status: ${response.status}`);
      }

      alert(`Invoice PDF for job card ${completeJobCard.job_number} has been successfully generated and sent to the webhook!`);
    } catch (error) {
      console.error('Error generating invoice and sending to webhook:', error);
      alert('Error generating invoice and sending to webhook. Please try again.');
    }
  };

  const handleConfirmAction = async () => {
    if (pendingAction) {
      await pendingAction();
    }
    setIsConfirmModalOpen(false);
    setPendingAction(null);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setPendingAction(null);
  };

  const handleFormSave = async (formData: JobCardFormData) => {
    try {
      console.log('App.tsx - Form data received:', formData.service_progress);
      console.log('App.tsx - Form data received:', formData.trailer_progress);
      console.log('App.tsx - Form data received:', formData.other_progress);
      console.log('App.tsx - Form data received:', formData.parts_and_consumables);
      console.log('App.tsx - Form data received:', formData.lubricants_used);
      
      if (formMode === 'create') {
        await addJobCard({
          job_number: formData.job_number,
          job_start_date: formData.job_start_date ? new Date(formData.job_start_date) : undefined,
          expected_completion_date: formData.expected_completion_date ? new Date(formData.expected_completion_date) : undefined,
          completed_date: formData.completed_date ? new Date(formData.completed_date) : undefined,
          approximate_cost: formData.approximate_cost ? parseFloat(formData.approximate_cost) : undefined,
          is_archived: false,
          customer_name: formData.customer_name,
          company_name: formData.company_name,
          abn: formData.abn,
          mobile: formData.mobile,
          email: formData.email,
          vehicle_make: formData.vehicle_make,
          vehicle_model: formData.vehicle_model,
          vehicle_month: formData.vehicle_month,
          vehicle_year: formData.vehicle_year ? parseInt(formData.vehicle_year, 10) : undefined,
          vehicle_kms: formData.vehicle_kms ? parseInt(formData.vehicle_kms, 10) : undefined,
          fuel_type: formData.fuel_type,
          vin: formData.vin,
          rego: formData.rego,
          tyre_size: formData.tyre_size,
          next_service_kms: formData.next_service_kms ? parseInt(formData.next_service_kms, 10) : undefined,
          vehicle_type: formData.vehicle_type,
          vehicle_state: formData.vehicle_state,
          service_selection: formData.service_selection,
          assigned_worker: formData.assigned_worker,
          assigned_parts: formData.assigned_parts,
          is_worker_assigned_complete: false, // Default to incomplete when creating
          is_parts_assigned_complete: false, // Default to incomplete when creating
          customer_declaration_authorized: formData.customer_declaration_authorized,
          service_progress: formData.service_progress,
          trailer_progress: formData.trailer_progress,
          other_progress: formData.other_progress,
          handover_valuables_to_customer: formData.handover_valuables_to_customer,
          check_all_tyres: formData.check_all_tyres,
          total_a: formData.total_a ? parseFloat(formData.total_a) : undefined,
          future_work_notes: formData.future_work_notes,
          image_front: formData.image_front,
          image_back: formData.image_back,
          image_right_side: formData.image_right_side,
          image_left_side: formData.image_left_side,
          // Parts Information
          invoice_number: formData.invoice_number,
          part_location: formData.part_location,
          invoice_date: formData.invoice_date ? new Date(formData.invoice_date) : undefined,
          invoice_value: formData.invoice_value ? parseFloat(formData.invoice_value) : undefined,
          issue_counter_sale: formData.issue_counter_sale,
          // Parts and Consumables
          parts_and_consumables: formData.parts_and_consumables,
          // Lubricants Used
          lubricants_used: formData.lubricants_used,
          // Payment Status
          payment_status: formData.payment_status,
          // Total C
          total_c: formData.total_c ? parseFloat(formData.total_c) : undefined,
          // Signatures
          customer_signature: formData.customer_signature,
          supervisor_signature: formData.supervisor_signature,
        });
      } else if ((formMode === 'edit' || formMode === 'mechanic' || formMode === 'parts') && editingJobCard) {
        await updateJobCard(editingJobCard.id, {
          job_number: formData.job_number,
          job_start_date: formData.job_start_date ? new Date(formData.job_start_date) : undefined,
          expected_completion_date: formData.expected_completion_date ? new Date(formData.expected_completion_date) : undefined,
          completed_date: formData.completed_date ? new Date(formData.completed_date) : undefined,
          approximate_cost: formData.approximate_cost ? parseFloat(formData.approximate_cost) : undefined,
          customer_name: formData.customer_name,
          company_name: formData.company_name,
          abn: formData.abn,
          mobile: formData.mobile,
          email: formData.email,
          vehicle_make: formData.vehicle_make,
          vehicle_model: formData.vehicle_model,
          vehicle_month: formData.vehicle_month,
          vehicle_year: formData.vehicle_year ? parseInt(formData.vehicle_year, 10) : undefined,
          vehicle_kms: formData.vehicle_kms ? parseInt(formData.vehicle_kms, 10) : undefined,
          fuel_type: formData.fuel_type,
          vin: formData.vin,
          rego: formData.rego,
          tyre_size: formData.tyre_size,
          next_service_kms: formData.next_service_kms ? parseInt(formData.next_service_kms, 10) : undefined,
          vehicle_type: formData.vehicle_type,
          vehicle_state: formData.vehicle_state,
          service_selection: formData.service_selection,
          assigned_worker: formData.assigned_worker,
          assigned_parts: formData.assigned_parts,
          customer_declaration_authorized: formData.customer_declaration_authorized,
          service_progress: formData.service_progress,
          trailer_progress: formData.trailer_progress,
          other_progress: formData.other_progress,
          handover_valuables_to_customer: formData.handover_valuables_to_customer,
          check_all_tyres: formData.check_all_tyres,
          total_a: formData.total_a ? parseFloat(formData.total_a) : undefined,
          future_work_notes: formData.future_work_notes,
          image_front: formData.image_front,
          image_back: formData.image_back,
          image_right_side: formData.image_right_side,
          image_left_side: formData.image_left_side,
          // Parts Information
          invoice_number: formData.invoice_number,
          part_location: formData.part_location,
          invoice_date: formData.invoice_date ? new Date(formData.invoice_date) : undefined,
          invoice_value: formData.invoice_value ? parseFloat(formData.invoice_value) : undefined,
          issue_counter_sale: formData.issue_counter_sale,
          // Parts and Consumables
          parts_and_consumables: formData.parts_and_consumables,
          // Lubricants Used
          lubricants_used: formData.lubricants_used,
          // Payment Status
          payment_status: formData.payment_status,
          // Total C
          total_c: formData.total_c ? parseFloat(formData.total_c) : undefined,
          // Signatures
          customer_signature: formData.customer_signature,
          supervisor_signature: formData.supervisor_signature,
        });
      }

      // Clear selected customer data after successful save
      setSelectedCustomerData(null);
    } catch (error) {
      console.error('Error saving job card:', error);
      alert('Error saving job card. Please try again.');
      throw error; // Re-throw to prevent form from closing
    }
  };

  const handleCloseJobCardForm = () => {
    // Show confirmation modal before closing
    setIsCloseConfirmModalOpen(true);
  };

  const handleConfirmCloseForm = () => {
    // Actually close the form and discard changes
    setIsFormOpen(false);
    setEditingJobCard(null); // Discard any changes for existing job card
    setSelectedCustomerData(null); // Clear any pre-filled data for new job card
    setIsCloseConfirmModalOpen(false);
  };

  const handleCancelCloseForm = () => {
    setIsCloseConfirmModalOpen(false);
  };

  const getPortalIcon = (portal: PortalType) => {
    switch (portal) {
      case 'admin':
        return <Settings className="h-5 w-5" />;
      case 'mechanic':
        return <Wrench className="h-5 w-5" />;
      case 'parts':
        return <Package className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  const getPortalColor = (portal: PortalType) => {
    switch (portal) {
      case 'admin':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'mechanic':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'parts':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getActivePortalColor = (portal: PortalType) => {
    switch (portal) {
      case 'admin':
        return 'border-blue-500 text-blue-600 bg-blue-50';
      case 'mechanic':
        return 'border-green-500 text-green-600 bg-green-50';
      case 'parts':
        return 'border-purple-500 text-purple-600 bg-purple-50';
      default:
        return 'border-blue-500 text-blue-600 bg-blue-50';
    }
  };

  // Helper function to get job cards for each worker (only incomplete assignments)
  const getJobCardsForWorker = (workerNumber: number) => {
    const workerName = `Worker ${workerNumber}`;
    return incompleteWorkerJobCards.filter(card => card.assigned_worker === workerName);
  };

  // Helper function to get job cards for each parts team (only incomplete assignments)
  const getJobCardsForParts = (partsNumber: number) => {
    const partsName = `Parts ${partsNumber}`;
    return incompletePartsJobCards.filter(card => card.assigned_parts === partsName);
  };

  // Job Card Ticket Component with Edit and Complete buttons (for Mechanic Portal)
  const JobCardTicket: React.FC<{ jobCard: JobCard }> = ({ jobCard }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:border-green-300">
      <div className="space-y-3">
        {/* Job Number */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-green-800">{jobCard.job_number}</h3>
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Active
          </span>
        </div>
        
        {/* Customer Name */}
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">Customer</p>
          <p className="text-base font-medium text-gray-900">
            {jobCard.customer_name || 'N/A'}
          </p>
        </div>
        
        {/* REGO */}
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">REGO</p>
          <p className="text-base font-medium text-gray-900">
            {jobCard.rego || 'N/A'}
          </p>
        </div>
        
        {/* Service */}
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">Service</p>
          <p className="text-base font-medium text-gray-900">
            {jobCard.service_selection || 'N/A'}
          </p>
        </div>

        {/* Additional Info */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {jobCard.vehicle_make} {jobCard.vehicle_model} • Started: {jobCard.job_start_date?.toLocaleDateString() || 'N/A'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMechanicEdit(jobCard);
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex-1 justify-center"
          >
            <Edit className="h-3 w-3" />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCompleteWorkerJob(jobCard);
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex-1 justify-center"
          >
            <CheckCircle className="h-3 w-3" />
            Complete
          </button>
        </div>
      </div>
    </div>
  );

  // Parts Job Card Ticket Component with Edit and Complete buttons (for Parts Portal)
  const PartsJobCardTicket: React.FC<{ jobCard: JobCard }> = ({ jobCard }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all hover:border-purple-300">
      <div className="space-y-3">
        {/* Job Number */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-purple-800">{jobCard.job_number}</h3>
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
            Parts Required
          </span>
        </div>
        
        {/* Customer Name */}
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">Customer</p>
          <p className="text-base font-medium text-gray-900">
            {jobCard.customer_name || 'N/A'}
          </p>
        </div>
        
        {/* REGO */}
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">REGO</p>
          <p className="text-base font-medium text-gray-900">
            {jobCard.rego || 'N/A'}
          </p>
        </div>
        
        {/* Parts Count */}
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">Parts Listed</p>
          <p className="text-base font-medium text-gray-900">
            {jobCard.parts_and_consumables?.length || 0} items
          </p>
        </div>

        {/* Additional Info */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {jobCard.vehicle_make} {jobCard.vehicle_model} • Started: {jobCard.job_start_date?.toLocaleDateString() || 'N/A'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePartsEdit(jobCard);
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex-1 justify-center"
          >
            <Edit className="h-3 w-3" />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCompletePartsJob(jobCard);
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex-1 justify-center"
          >
            <CheckCircle className="h-3 w-3" />
            Complete
          </button>
        </div>
      </div>
    </div>
  );

  // Worker Column Component
  const WorkerColumn: React.FC<{ workerNumber: number }> = ({ workerNumber }) => {
    const workerJobCards = getJobCardsForWorker(workerNumber);
    
    return (
      <div className="bg-gray-50 rounded-lg p-4 min-h-[600px]">
        {/* Column Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-lg">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Worker {workerNumber}</h3>
              <p className="text-sm text-gray-500">
                {workerJobCards.length} active job{workerJobCards.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="h-1 bg-green-200 rounded-full">
            <div 
              className="h-1 bg-green-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((workerJobCards.length / 5) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {workerJobCards.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Wrench className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">No assigned jobs</p>
              <p className="text-xs">Jobs will appear here when assigned</p>
            </div>
          ) : (
            workerJobCards.map(jobCard => (
              <JobCardTicket key={jobCard.id} jobCard={jobCard} />
            ))
          )}
        </div>
      </div>
    );
  };

  // Parts Column Component
  const PartsColumn: React.FC<{ partsNumber: number }> = ({ partsNumber }) => {
    const partsJobCards = getJobCardsForParts(partsNumber);
    
    return (
      <div className="bg-gray-50 rounded-lg p-4 min-h-[600px]">
        {/* Column Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Parts {partsNumber}</h3>
              <p className="text-sm text-gray-500">
                {partsJobCards.length} active job{partsJobCards.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="h-1 bg-purple-200 rounded-full">
            <div 
              className="h-1 bg-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((partsJobCards.length / 5) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {partsJobCards.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">No assigned jobs</p>
              <p className="text-xs">Jobs will appear here when assigned</p>
            </div>
          ) : (
            partsJobCards.map(jobCard => (
              <PartsJobCardTicket key={jobCard.id} jobCard={jobCard} />
            ))
          )}
        </div>
      </div>
    );
  };

  const renderPortalContent = () => {
    switch (activePortal) {
      case 'admin':
        return (
          <>
            {/* Admin Portal - Full Job Card Management */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'active'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Active Job Cards
                    <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                      {activeJobCards.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('archived')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'archived'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Archive className="h-4 w-4 inline mr-1" />
                    Archived Job Cards
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {archivedJobCards.length}
                    </span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Notice for archived tab */}
            {activeTab === 'archived' && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Archive className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Showing 5 most recent archived jobs
                      </p>
                      <p className="text-xs text-blue-700">
                        View complete history in Database section
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavigateToPage('database')}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Complete Database
                  </button>
                </div>
              </div>
            )}

            <JobCardTable
              jobCards={currentJobCards}
              onEdit={handleEdit}
              onView={handleView}
              onArchive={handleArchive}
              onUnarchive={handleUnarchive}
              onDelete={handleDelete}
              onCreateNew={handleCreateNew}
              onToggleWorkerCompletion={handleToggleWorkerCompletion}
              onTogglePartsCompletion={handleTogglePartsCompletion}
              onGenerateInvoiceAndSendWebhook={handleGenerateInvoiceAndSendWebhook}
              isLoading={loading}
              isArchivedView={activeTab === 'archived'}
              onConfirmDownload={handleConfirmDownload}
            />
          </>
        );

      case 'mechanic':
        return (
          <div className="space-y-6">
            {/* Portal Header */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Wrench className="h-8 w-8 text-green-600" />
                <div>
                  <h2 className="text-2xl font-bold text-green-900">Mechanic Portal</h2>
                  <p className="text-green-700">View and manage assigned job cards by worker</p>
                </div>
              </div>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                {[1, 2, 3, 4].map(workerNum => {
                  const jobCount = getJobCardsForWorker(workerNum).length;
                  return (
                    <div key={workerNum} className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-800">Worker {workerNum}</p>
                          <p className="text-2xl font-bold text-green-900">{jobCount}</p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                          <Wrench className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4-Column Worker Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(workerNumber => (
                <WorkerColumn key={workerNumber} workerNumber={workerNumber} />
              ))}
            </div>

            {/* No Jobs Message */}
            {incompleteWorkerJobCards.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Wrench className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Assigned Jobs</h3>
                <p className="text-gray-500">Job cards will appear here when assigned to workers</p>
              </div>
            )}
          </div>
        );

      case 'parts':
        return (
          <div className="space-y-6">
            {/* Portal Header */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-8 w-8 text-purple-600" />
                <div>
                  <h2 className="text-2xl font-bold text-purple-900">Parts Portal</h2>
                  <p className="text-purple-700">Manage parts inventory, orders, and job card parts requirements</p>
                </div>
              </div>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                {[1, 2, 3, 4].map(partsNum => {
                  const jobCount = getJobCardsForParts(partsNum).length;
                  return (
                    <div key={partsNum} className="bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-800">Parts {partsNum}</p>
                          <p className="text-2xl font-bold text-purple-900">{jobCount}</p>
                        </div>
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                          <Package className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4-Column Parts Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(partsNumber => (
                <PartsColumn key={partsNumber} partsNumber={partsNumber} />
              ))}
            </div>

            {/* No Jobs Message */}
            {incompletePartsJobCards.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Parts Assignments</h3>
                <p className="text-gray-500">Job cards will appear here when assigned to parts teams</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Navigation handlers
  const handleNavigateToPage = (page: PageType) => {
    setActivePage(page);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Burger Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AutoAgri Australia</h1>
                <p className="text-sm text-gray-500">Job Card Management System - Designed by Monarc Labs</p>
              </div>
            </div>
            
            {/* Portal Tabs - Only show on dashboard page */}
            {activePage === 'dashboard' && (
              <div className="flex items-center gap-1">
                {(['admin', 'mechanic', 'parts'] as PortalType[]).map((portal) => (
                  <button
                    key={portal}
                    onClick={() => setActivePortal(portal)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      activePortal === portal
                        ? getActivePortalColor(portal)
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {getPortalIcon(portal)}
                    {portal.charAt(0).toUpperCase() + portal.slice(1)} Portal
                  </button>
                ))}
              </div>
            )}

            {/* New Job Card Button - Only show in Admin Portal on dashboard */}
            {activePage === 'dashboard' && activePortal === 'admin' && (
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                New Job Card
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activePage={activePage}
        onNavigate={handleNavigateToPage}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activePage === 'dashboard' ? renderPortalContent() : (
          <DatabasePage
            onEdit={handleEdit}
            onView={handleView}
            onArchive={handleArchive}
            onUnarchive={handleUnarchive}
            onDelete={handleDelete}
            onConfirmDownload={handleConfirmDownload}
          />
        )}
      </main>

      {/* Customer Selection Modal */}
      <CustomerSelectionModal
        isOpen={isCustomerSelectionOpen}
        onClose={() => setIsCustomerSelectionOpen(false)}
        onSelectNewCustomer={handleNewCustomer}
        onSelectExistingCustomer={handleExistingCustomer}
      />

      {/* Job Card Form Modal */}
      <JobCardForm
        isOpen={isFormOpen}
        onClose={handleCloseJobCardForm}
        onSave={handleFormSave}
        editingJobCard={editingJobCard}
        mode={formMode}
        activeTab={activeFormTab}
        onTabChange={setActiveFormTab}
        restrictedMode={formMode === 'mechanic' || formMode === 'parts'} // Pass restricted mode flag for both portals
        onRefresh={handleRefreshJobCard}
        initialCustomerData={selectedCustomerData} // Pass the selected customer data
      />

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleConfirmAction}
          title={confirmModalTitle}
          message={confirmModalMessage}
          confirmButtonText={confirmModalConfirmText}
          type={confirmModalType}
        />
      )}

      {/* Close Form Confirmation Modal */}
      {isCloseConfirmModalOpen && (
        <ConfirmationModal
          isOpen={isCloseConfirmModalOpen}
          onClose={handleCancelCloseForm}
          onConfirm={handleConfirmCloseForm}
          title="Discard Changes"
          message={`Are you sure you want to discard all changes? ${
            formMode === 'create' 
              ? 'All information entered for this new job card will be lost.' 
              : 'All unsaved changes to this job card will be lost.'
          } This action cannot be undone.`}
          confirmButtonText="Discard Changes"
          type="discard"
        />
      )}
    </div>
  );
}

export default App;