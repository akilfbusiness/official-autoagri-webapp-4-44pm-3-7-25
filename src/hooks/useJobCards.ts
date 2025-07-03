import { useState, useEffect } from 'react';
import { JobCard, CustomerVehicleSuggestion } from '../types/JobCard';
import { supabase } from '../lib/supabase';

export const useJobCards = () => {
  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to ensure numeric conversion for parts and consumables
  const formatPartsAndConsumables = (items: any[]) => {
    return (items || []).map(item => ({
      ...item,
      price_aud: item.price_aud ? Number(item.price_aud) : 0,
      qty_used: item.qty_used ? Number(item.qty_used) : 0,
      total_cost_aud: item.total_cost_aud ? Number(item.total_cost_aud) : 0,
    }));
  };

  // Helper function to ensure numeric conversion for lubricants
  const formatLubricantsUsed = (items: any[]) => {
    return (items || []).map(item => ({
      ...item,
      qty: item.qty ? Number(item.qty) : 0,
      cost_per_litre: item.cost_per_litre ? Number(item.cost_per_litre) : 0,
      total_cost: item.total_cost ? Number(item.total_cost) : 0,
    }));
  };

  // Helper function to format job card data
  const formatJobCardData = (card: any): JobCard => ({
    id: card.id,
    created_at: new Date(card.created_at),
    updated_at: new Date(card.updated_at),
    is_archived: card.is_archived || false,
    job_number: card.job_number,
    job_start_date: card.job_start_date ? new Date(card.job_start_date) : undefined,
    expected_completion_date: card.expected_completion_date ? new Date(card.expected_completion_date) : undefined,
    completed_date: card.completed_date ? new Date(card.completed_date) : undefined,
    approximate_cost: card.approximate_cost ? Number(card.approximate_cost) : 0,
    customer_name: card.customer_name,
    company_name: card.company_name,
    abn: card.abn,
    mobile: card.mobile,
    email: card.email,
    vehicle_make: card.vehicle_make,
    vehicle_model: card.vehicle_model,
    vehicle_month: card.vehicle_month,
    vehicle_year: card.vehicle_year,
    vehicle_kms: card.vehicle_kms,
    fuel_type: card.fuel_type,
    vin: card.vin,
    rego: card.rego,
    tyre_size: card.tyre_size,
    next_service_kms: card.next_service_kms,
    vehicle_type: card.vehicle_type,
    vehicle_state: card.vehicle_state,
    service_selection: card.service_selection,
    assigned_worker: card.assigned_worker,
    assigned_parts: card.assigned_parts,
    is_worker_assigned_complete: card.is_worker_assigned_complete || false,
    is_parts_assigned_complete: card.is_parts_assigned_complete || false,
    customer_declaration_authorized: card.customer_declaration_authorized,
    service_progress: card.service_progress || [],
    trailer_progress: (card.trailer_progress || []).map((trailer: any) => ({
      ...trailer,
      trailer_date: trailer.trailer_date ? new Date(trailer.trailer_date) : undefined,
      trailer_kms: trailer.trailer_kms,
    })),
    other_progress: card.other_progress || [],
    handover_valuables_to_customer: card.handover_valuables_to_customer,
    check_all_tyres: card.check_all_tyres,
    total_a: card.total_a ? Number(card.total_a) : 0,
    future_work_notes: card.future_work_notes,
    image_front: card.image_front,
    image_back: card.image_back,
    image_right_side: card.image_right_side,
    image_left_side: card.image_left_side,
    invoice_number: card.invoice_number,
    part_location: card.part_location,
    invoice_date: card.invoice_date ? new Date(card.invoice_date) : undefined,
    invoice_value: card.invoice_value ? Number(card.invoice_value) : undefined,
    issue_counter_sale: card.issue_counter_sale,
    parts_and_consumables: formatPartsAndConsumables(card.parts_and_consumables),
    lubricants_used: formatLubricantsUsed(card.lubricants_used),
    payment_status: card.payment_status || 'unpaid',
    total_c: card.total_c ? Number(card.total_c) : 0,
    customer_signature: card.customer_signature,
    supervisor_signature: card.supervisor_signature,
  });

  // Fetch job cards from database (optimized for table view)
  const fetchJobCards = async () => {
    try {
      setLoading(true);
      // Fetch all columns for comprehensive data access
      const { data, error } = await supabase
        .from('job_cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching job cards:', error);
        return;
      }

      const formattedJobCards: JobCard[] = (data || []).map(formatJobCardData);
      setJobCards(formattedJobCards);
    } catch (error) {
      console.error('Error fetching job cards:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch archived job cards directly for Database page
  const fetchArchivedJobCardsDirectly = async (): Promise<JobCard[]> => {
    try {
      const { data, error } = await supabase
        .from('job_cards')
        .select('*')
        .eq('is_archived', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching archived job cards:', error);
        throw error;
      }

      return (data || []).map(formatJobCardData);
    } catch (error) {
      console.error('Error fetching archived job cards:', error);
      throw error;
    }
  };

  // Fetch customer/vehicle suggestions for autofill
  const fetchCustomerVehicleSuggestions = async (searchTerm: string): Promise<CustomerVehicleSuggestion[]> => {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        return [];
      }

      const { data, error } = await supabase
        .from('job_cards')
        .select(`
          id,
          customer_name,
          company_name,
          abn,
          mobile,
          email,
          vehicle_make,
          vehicle_model,
          vehicle_month,
          vehicle_year,
          rego,
          vin,
          fuel_type
        `)
        .or(`customer_name.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%,abn.ilike.%${searchTerm}%,mobile.ilike.%${searchTerm}%,rego.ilike.%${searchTerm}%`)
        .limit(50); // Limit results for performance

      if (error) {
        console.error('Error fetching customer suggestions:', error);
        return [];
      }

      // Create unique suggestions based on customer and vehicle combination
      const uniqueSuggestions = new Map<string, CustomerVehicleSuggestion>();

      (data || []).forEach(record => {
        // Create a unique key based on customer and vehicle details
        const customerKey = [
          record.customer_name?.toLowerCase().trim() || '',
          record.company_name?.toLowerCase().trim() || '',
          record.abn?.toLowerCase().trim() || '',
          record.mobile?.toLowerCase().trim() || '',
          record.email?.toLowerCase().trim() || ''
        ].filter(Boolean).join('|');

        const vehicleKey = [
          record.vehicle_make?.toLowerCase().trim() || '',
          record.vehicle_model?.toLowerCase().trim() || '',
          record.vehicle_month?.toLowerCase().trim() || '',
          record.vehicle_year?.toString() || '',
          record.rego?.toLowerCase().trim() || '',
          record.vin?.toLowerCase().trim() || '',
          record.fuel_type?.toLowerCase().trim() || ''
        ].filter(Boolean).join('|');

        const uniqueKey = `${customerKey}###${vehicleKey}`;

        // Only add if we haven't seen this exact combination before
        if (!uniqueSuggestions.has(uniqueKey)) {
          // Create display text for the dropdown
          const customerText = record.customer_name || record.company_name || 'Unknown Customer';
          const vehicleText = [record.vehicle_make, record.vehicle_model].filter(Boolean).join(' ') || 'Unknown Vehicle';
          const regoText = record.rego ? ` (${record.rego})` : '';
          const displayText = `${customerText} - ${vehicleText}${regoText}`;

          uniqueSuggestions.set(uniqueKey, {
            id: record.id,
            customer_name: record.customer_name,
            company_name: record.company_name,
            abn: record.abn,
            mobile: record.mobile,
            email: record.email,
            vehicle_make: record.vehicle_make,
            vehicle_model: record.vehicle_model,
            vehicle_month: record.vehicle_month,
            vehicle_year: record.vehicle_year,
            rego: record.rego,
            vin: record.vin,
            fuel_type: record.fuel_type,
            displayText
          });
        }
      });

      return Array.from(uniqueSuggestions.values())
        .sort((a, b) => a.displayText.localeCompare(b.displayText));

    } catch (error) {
      console.error('Error fetching customer suggestions:', error);
      return [];
    }
  };

  // Fetch complete job card details for editing/viewing
  const fetchJobCardDetails = async (id: string): Promise<JobCard | null> => {
    try {
      const { data, error } = await supabase
        .from('job_cards')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching job card details:', error);
        return null;
      }

      if (!data) return null;

      return formatJobCardData(data);
    } catch (error) {
      console.error('Error fetching job card details:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchJobCards();
  }, []);

  // Get next job number for a specific year and month (2-digit format)
  const getNextJobNumber = async (year: string, month: string): Promise<string> => {
    try {
      const prefix = `JC-${year.slice(-2)}-${month}`;
      const { data, error } = await supabase
        .from('job_cards')
        .select('job_number')
        .like('job_number', `${prefix}-%`);

      if (error) {
        console.error('Error fetching job numbers:', error);
        return '01';
      }

      if (!data || data.length === 0) {
        return '01';
      }

      // Extract job numbers and find the highest one
      const jobNumbers = data
        .map(card => card.job_number)
        .filter(jobNumber => jobNumber && jobNumber.startsWith(prefix))
        .map(jobNumber => {
          const parts = jobNumber.split('-');
          return parseInt(parts[3] || '0', 10);
        })
        .filter(num => !isNaN(num));

      const maxJobNumber = Math.max(...jobNumbers, 0);
      const nextJobNumber = maxJobNumber + 1;

      // Ensure it's within the 01-99 range
      if (nextJobNumber > 99) {
        throw new Error(`Maximum job number (99) reached for ${year}-${month}`);
      }

      return String(nextJobNumber).padStart(2, '0');
    } catch (error) {
      console.error('Error getting next job number:', error);
      return '01';
    }
  };

  // Check if job number exists
  const checkJobNumberExists = async (jobNumber: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('job_cards')
        .select('id')
        .eq('job_number', jobNumber);

      if (error) {
        console.error('Error checking job number:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking job number:', error);
      return false;
    }
  };

  const addJobCard = async (newJobCard: Omit<JobCard, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('useJobCards.ts - Adding job card with service_progress:', newJobCard.service_progress);
      console.log('useJobCards.ts - Adding job card with trailer_progress:', newJobCard.trailer_progress);
      console.log('useJobCards.ts - Adding job card with other_progress:', newJobCard.other_progress);
      console.log('useJobCards.ts - Adding job card with parts_and_consumables:', newJobCard.parts_and_consumables);
      console.log('useJobCards.ts - Adding job card with lubricants_used:', newJobCard.lubricants_used);
      
      const { data, error } = await supabase
        .from('job_cards')
        .insert([{
          job_number: newJobCard.job_number,
          job_start_date: newJobCard.job_start_date?.toISOString(),
          expected_completion_date: newJobCard.expected_completion_date?.toISOString(),
          completed_date: newJobCard.completed_date?.toISOString(),
          approximate_cost: newJobCard.approximate_cost,
          is_archived: newJobCard.is_archived || false,
          customer_name: newJobCard.customer_name,
          company_name: newJobCard.company_name,
          abn: newJobCard.abn,
          mobile: newJobCard.mobile,
          email: newJobCard.email,
          vehicle_make: newJobCard.vehicle_make,
          vehicle_model: newJobCard.vehicle_model,
          vehicle_month: newJobCard.vehicle_month,
          vehicle_year: newJobCard.vehicle_year,
          vehicle_kms: newJobCard.vehicle_kms,
          fuel_type: newJobCard.fuel_type,
          vin: newJobCard.vin,
          rego: newJobCard.rego,
          tyre_size: newJobCard.tyre_size,
          next_service_kms: newJobCard.next_service_kms,
          vehicle_type: newJobCard.vehicle_type,
          vehicle_state: newJobCard.vehicle_state,
          service_selection: newJobCard.service_selection,
          assigned_worker: newJobCard.assigned_worker,
          assigned_parts: newJobCard.assigned_parts,
          is_worker_assigned_complete: newJobCard.is_worker_assigned_complete || false,
          is_parts_assigned_complete: newJobCard.is_parts_assigned_complete || false,
          customer_declaration_authorized: newJobCard.customer_declaration_authorized,
          service_progress: newJobCard.service_progress || [],
          trailer_progress: (newJobCard.trailer_progress || []).map(trailer => ({
            ...trailer,
            trailer_date: trailer.trailer_date?.toISOString(),
          })),
          other_progress: newJobCard.other_progress || [],
          handover_valuables_to_customer: newJobCard.handover_valuables_to_customer,
          check_all_tyres: newJobCard.check_all_tyres,
          total_a: newJobCard.total_a || 0,
          future_work_notes: newJobCard.future_work_notes,
          image_front: newJobCard.image_front,
          image_back: newJobCard.image_back,
          image_right_side: newJobCard.image_right_side,
          image_left_side: newJobCard.image_left_side,
          // Parts Information
          invoice_number: newJobCard.invoice_number,
          part_location: newJobCard.part_location,
          invoice_date: newJobCard.invoice_date?.toISOString().split('T')[0], // Format for 'date' type in Supabase
          invoice_value: newJobCard.invoice_value,
          issue_counter_sale: newJobCard.issue_counter_sale,
          // Parts and Consumables - ensure numeric values
          parts_and_consumables: formatPartsAndConsumables(newJobCard.parts_and_consumables || []),
          // Lubricants Used - ensure numeric values
          lubricants_used: formatLubricantsUsed(newJobCard.lubricants_used || []),
          // Payment Status
          payment_status: newJobCard.payment_status || 'unpaid',
          // Total C
          total_c: newJobCard.total_c || 0,
          // Signatures
          customer_signature: newJobCard.customer_signature,
          supervisor_signature: newJobCard.supervisor_signature,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding job card:', error);
        throw error;
      }

      if (data) {
        // Refresh the job cards list to include the new card
        await fetchJobCards();
        return data;
      }
    } catch (error) {
      console.error('Error adding job card:', error);
      throw error;
    }
  };

  const updateJobCard = async (id: string, updates: Partial<JobCard>) => {
    try {
      console.log('useJobCards.ts - Updating job card with service_progress:', updates.service_progress);
      console.log('useJobCards.ts - Updating job card with trailer_progress:', updates.trailer_progress);
      console.log('useJobCards.ts - Updating job card with other_progress:', updates.other_progress);
      console.log('useJobCards.ts - Updating job card with parts_and_consumables:', updates.parts_and_consumables);
      console.log('useJobCards.ts - Updating job card with lubricants_used:', updates.lubricants_used);
      
      // Build update object with only the fields that are explicitly provided
      const updatePayload: any = {};

      // Only include fields that are explicitly provided (not undefined)
      if (updates.job_number !== undefined) updatePayload.job_number = updates.job_number;
      if (updates.job_start_date !== undefined) updatePayload.job_start_date = updates.job_start_date?.toISOString();
      if (updates.expected_completion_date !== undefined) updatePayload.expected_completion_date = updates.expected_completion_date?.toISOString();
      if (updates.completed_date !== undefined) updatePayload.completed_date = updates.completed_date?.toISOString();
      if (updates.approximate_cost !== undefined) updatePayload.approximate_cost = updates.approximate_cost;
      if (updates.is_archived !== undefined) updatePayload.is_archived = updates.is_archived;
      if (updates.customer_name !== undefined) updatePayload.customer_name = updates.customer_name;
      if (updates.company_name !== undefined) updatePayload.company_name = updates.company_name;
      if (updates.abn !== undefined) updatePayload.abn = updates.abn;
      if (updates.mobile !== undefined) updatePayload.mobile = updates.mobile;
      if (updates.email !== undefined) updatePayload.email = updates.email;
      if (updates.vehicle_make !== undefined) updatePayload.vehicle_make = updates.vehicle_make;
      if (updates.vehicle_model !== undefined) updatePayload.vehicle_model = updates.vehicle_model;
      if (updates.vehicle_month !== undefined) updatePayload.vehicle_month = updates.vehicle_month;
      if (updates.vehicle_year !== undefined) updatePayload.vehicle_year = updates.vehicle_year;
      if (updates.vehicle_kms !== undefined) updatePayload.vehicle_kms = updates.vehicle_kms;
      if (updates.fuel_type !== undefined) updatePayload.fuel_type = updates.fuel_type;
      if (updates.vin !== undefined) updatePayload.vin = updates.vin;
      if (updates.rego !== undefined) updatePayload.rego = updates.rego;
      if (updates.tyre_size !== undefined) updatePayload.tyre_size = updates.tyre_size;
      if (updates.next_service_kms !== undefined) updatePayload.next_service_kms = updates.next_service_kms;
      if (updates.vehicle_type !== undefined) updatePayload.vehicle_type = updates.vehicle_type;
      if (updates.vehicle_state !== undefined) updatePayload.vehicle_state = updates.vehicle_state;
      if (updates.service_selection !== undefined) updatePayload.service_selection = updates.service_selection;
      if (updates.assigned_worker !== undefined) updatePayload.assigned_worker = updates.assigned_worker;
      if (updates.assigned_parts !== undefined) updatePayload.assigned_parts = updates.assigned_parts;
      if (updates.is_worker_assigned_complete !== undefined) updatePayload.is_worker_assigned_complete = updates.is_worker_assigned_complete;
      if (updates.is_parts_assigned_complete !== undefined) updatePayload.is_parts_assigned_complete = updates.is_parts_assigned_complete;
      if (updates.customer_declaration_authorized !== undefined) updatePayload.customer_declaration_authorized = updates.customer_declaration_authorized;
      if (updates.service_progress !== undefined) updatePayload.service_progress = updates.service_progress;
      if (updates.trailer_progress !== undefined) {
        updatePayload.trailer_progress = updates.trailer_progress.map(trailer => ({
          ...trailer,
          trailer_date: trailer.trailer_date?.toISOString(),
        }));
      }
      if (updates.other_progress !== undefined) updatePayload.other_progress = updates.other_progress;
      if (updates.handover_valuables_to_customer !== undefined) updatePayload.handover_valuables_to_customer = updates.handover_valuables_to_customer;
      if (updates.check_all_tyres !== undefined) updatePayload.check_all_tyres = updates.check_all_tyres;
      if (updates.total_a !== undefined) updatePayload.total_a = updates.total_a;
      if (updates.future_work_notes !== undefined) updatePayload.future_work_notes = updates.future_work_notes;
      if (updates.image_front !== undefined) updatePayload.image_front = updates.image_front;
      if (updates.image_back !== undefined) updatePayload.image_back = updates.image_back;
      if (updates.image_right_side !== undefined) updatePayload.image_right_side = updates.image_right_side;
      if (updates.image_left_side !== undefined) updatePayload.image_left_side = updates.image_left_side;
      // Parts Information
      if (updates.invoice_number !== undefined) updatePayload.invoice_number = updates.invoice_number;
      if (updates.part_location !== undefined) updatePayload.part_location = updates.part_location;
      if (updates.invoice_date !== undefined) updatePayload.invoice_date = updates.invoice_date?.toISOString().split('T')[0];
      if (updates.invoice_value !== undefined) updatePayload.invoice_value = updates.invoice_value;
      if (updates.issue_counter_sale !== undefined) updatePayload.issue_counter_sale = updates.issue_counter_sale;
      // Parts and Consumables - ensure numeric values
      if (updates.parts_and_consumables !== undefined) updatePayload.parts_and_consumables = formatPartsAndConsumables(updates.parts_and_consumables);
      // Lubricants Used - ensure numeric values
      if (updates.lubricants_used !== undefined) updatePayload.lubricants_used = formatLubricantsUsed(updates.lubricants_used);
      // Payment Status
      if (updates.payment_status !== undefined) updatePayload.payment_status = updates.payment_status;
      // Total C
      if (updates.total_c !== undefined) updatePayload.total_c = updates.total_c;
      // Signatures
      if (updates.customer_signature !== undefined) updatePayload.customer_signature = updates.customer_signature;
      if (updates.supervisor_signature !== undefined) updatePayload.supervisor_signature = updates.supervisor_signature;

      const { data, error } = await supabase
        .from('job_cards')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating job card:', error);
        throw error;
      }

      if (data) {
        // Update the local state with the updated job card
        setJobCards(prev => prev.map(card => {
          if (card.id === id) {
            // Merge the updated data with the existing card
            return {
              ...card,
              ...updates,
              updated_at: new Date(data.updated_at),
            };
          }
          return card;
        }));
      }
    } catch (error) {
      console.error('Error updating job card:', error);
      throw error;
    }
  };

  const deleteJobCard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('job_cards')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting job card:', error);
        throw error;
      }

      setJobCards(prev => prev.filter(card => card.id !== id));
    } catch (error) {
      console.error('Error deleting job card:', error);
      throw error;
    }
  };

  const archiveJobCard = (id: string) => {
    updateJobCard(id, { is_archived: true });
  };

  const unarchiveJobCard = (id: string) => {
    updateJobCard(id, { is_archived: false });
  };

  // Toggle worker completion status
  const toggleWorkerCompletion = async (id: string, isComplete: boolean) => {
    try {
      await updateJobCard(id, { is_worker_assigned_complete: isComplete });
    } catch (error) {
      console.error('Error toggling worker completion:', error);
      throw error;
    }
  };

  // Toggle parts completion status
  const togglePartsCompletion = async (id: string, isComplete: boolean) => {
    try {
      await updateJobCard(id, { is_parts_assigned_complete: isComplete });
    } catch (error) {
      console.error('Error toggling parts completion:', error);
      throw error;
    }
  };

  // Complete worker assignment (called from mechanic portal)
  const completeWorkerAssignment = async (id: string) => {
    try {
      await updateJobCard(id, { is_worker_assigned_complete: true });
    } catch (error) {
      console.error('Error completing worker assignment:', error);
      throw error;
    }
  };

  // Complete parts assignment (called from parts portal)
  const completePartsAssignment = async (id: string) => {
    try {
      await updateJobCard(id, { is_parts_assigned_complete: true });
    } catch (error) {
      console.error('Error completing parts assignment:', error);
      throw error;
    }
  };

  const getActiveJobCards = () => jobCards.filter(card => !card.is_archived);
  const getArchivedJobCards = () => jobCards.filter(card => card.is_archived);

  // Get job cards for mechanic portal (only incomplete worker assignments)
  const getIncompleteWorkerJobCards = () => 
    jobCards.filter(card => 
      !card.is_archived && 
      card.assigned_worker && 
      !card.is_worker_assigned_complete
    );

  // Get job cards for parts portal (only incomplete parts assignments)
  const getIncompletePartsJobCards = () => 
    jobCards.filter(card => 
      !card.is_archived && 
      card.assigned_parts && 
      !card.is_parts_assigned_complete
    );

  return {
    jobCards,
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
    getNextJobNumber,
    checkJobNumberExists,
    refreshJobCards: fetchJobCards,
    fetchJobCardDetails, // Function for fetching complete details
    fetchCustomerVehicleSuggestions, // New function for customer suggestions
    fetchArchivedJobCardsDirectly, // New function for Database page
  };
};