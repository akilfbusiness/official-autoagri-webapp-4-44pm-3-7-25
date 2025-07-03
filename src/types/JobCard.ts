export interface ServiceTaskProgress {
  task_name: string;
  status?: 'tick' | 'no' | 'na';
  description?: string;
  done_by?: string;
  hours?: number;
}

export interface TrailerElectricalTask {
  name: string;
  task: string;
  remarks?: string;
}

export interface TrailerTiresWheelsTask {
  name: string;
  task: string;
  remarks?: string;
}

export interface TrailerBrakeSystemTask {
  name: string;
  task: string;
  remarks?: string;
}

export interface TrailerSuspensionTask {
  name: string;
  task: string;
  remarks?: string;
}

export interface TrailerBodyChassisTask {
  name: string;
  task: string;
  remarks?: string;
}

export interface TrailerTaskProgress {
  trailer_date?: Date; // New field for editable date
  trailer_kms?: number; // New field for editable KMs
  plant_number?: string;
  electrical_tasks?: TrailerElectricalTask[];
  tires_wheels_tasks?: TrailerTiresWheelsTask[];
  brake_system_tasks?: TrailerBrakeSystemTask[];
  suspension_tasks?: TrailerSuspensionTask[];
  body_chassis_tasks?: TrailerBodyChassisTask[];
}

export interface OtherTaskProgress {
  id: string; // Unique identifier for each row
  task_name?: string;
  description?: string;
  done_by?: string;
  hours?: number;
}

export interface PartAndConsumable {
  id: string; // Unique identifier for each row
  part_number?: string;
  description?: string;
  price_aud?: number;
  qty_used?: number;
  total_cost_aud?: number; // Calculated field: price_aud * qty_used
  supplier?: string;
  remarks?: string;
}

export interface LubricantUsed {
  id: string; // Unique identifier for each row
  task_name: string;
  grade?: string;
  qty?: number;
  cost_per_litre?: number;
  total_cost?: number; // Calculated field: qty * cost_per_litre
  remarks?: string;
}

// New interface for customer/vehicle suggestions
export interface CustomerVehicleSuggestion {
  id: string; // For identification purposes
  customer_name?: string;
  company_name?: string;
  abn?: string;
  mobile?: string;
  email?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_month?: string;
  vehicle_year?: number;
  rego?: string;
  vin?: string;
  fuel_type?: string;
  // Display helper for dropdown
  displayText: string;
}

export interface JobCard {
  id: string;
  created_at: Date;
  updated_at: Date;
  is_archived: boolean;
  job_number?: string;
  job_start_date?: Date;
  expected_completion_date?: Date;
  completed_date?: Date;
  approximate_cost?: number;
  // Customer Details
  customer_name?: string;
  company_name?: string;
  abn?: string;
  mobile?: string;
  email?: string;
  // Vehicle Details
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_month?: string;
  vehicle_year?: number;
  vehicle_kms?: number;
  fuel_type?: string;
  vin?: string;
  rego?: string;
  tyre_size?: string;
  next_service_kms?: number;
  vehicle_type?: string[];
  vehicle_state?: string;
  service_selection?: string;
  // Assignment Fields
  assigned_worker?: string;
  assigned_parts?: string;
  // Completion Status Fields
  is_worker_assigned_complete?: boolean;
  is_parts_assigned_complete?: boolean;
  // Customer Declaration
  customer_declaration_authorized?: boolean;
  // Service Progress
  service_progress?: ServiceTaskProgress[];
  // Trailer Progress
  trailer_progress?: TrailerTaskProgress[];
  // Other Progress
  other_progress?: OtherTaskProgress[];
  // Mechanic Sections
  handover_valuables_to_customer?: string;
  check_all_tyres?: string;
  total_a?: number; // Changed from string to number
  future_work_notes?: string;
  // Images
  image_front?: string;
  image_back?: string;
  image_right_side?: string;
  image_left_side?: string;
  // Parts Information
  invoice_number?: string;
  part_location?: string;
  invoice_date?: Date;
  invoice_value?: number;
  issue_counter_sale?: string;
  // Parts and Consumables
  parts_and_consumables?: PartAndConsumable[];
  // Lubricants Used
  lubricants_used?: LubricantUsed[];
  // Payment Status
  payment_status?: 'paid' | 'unpaid';
  // Total C
  total_c?: number; // Changed from string to number
  // Signatures
  customer_signature?: string;
  supervisor_signature?: string;
}

export interface JobCardFormData {
  // Job Number Components
  job_number_year?: string;
  job_number_month?: string;
  job_number_num?: string;
  job_number?: string; // Full job number for submission
  job_start_date?: string;
  expected_completion_date?: string;
  completed_date?: string;
  approximate_cost?: string;
  // Customer Details
  customer_name?: string;
  company_name?: string;
  abn?: string;
  mobile?: string;
  email?: string;
  // Vehicle Details
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_month?: string;
  vehicle_year?: string;
  vehicle_kms?: string;
  fuel_type?: string;
  vin?: string;
  rego?: string;
  tyre_size?: string;
  next_service_kms?: string;
  vehicle_type?: string[];
  vehicle_state?: string;
  service_selection?: string;
  // Assignment Fields
  assigned_worker?: string;
  assigned_parts?: string;
  // Completion Status Fields
  is_worker_assigned_complete?: boolean;
  is_parts_assigned_complete?: boolean;
  // Customer Declaration
  customer_declaration_authorized?: boolean;
  // Service Progress
  service_progress?: ServiceTaskProgress[];
  // Trailer Progress
  trailer_progress?: TrailerTaskProgress[];
  // Other Progress
  other_progress?: OtherTaskProgress[];
  // Mechanic Sections
  handover_valuables_to_customer?: string;
  check_all_tyres?: string;
  total_a?: string; // Received as string from input
  future_work_notes?: string;
  // Images
  image_front?: string;
  image_back?: string;
  image_right_side?: string;
  image_left_side?: string;
  // Parts Information
  invoice_number?: string;
  part_location?: string;
  invoice_date?: string; // Received as string from input
  invoice_value?: string; // Received as string from input
  issue_counter_sale?: string;
  // Parts and Consumables
  parts_and_consumables?: PartAndConsumable[];
  // Lubricants Used
  lubricants_used?: LubricantUsed[];
  // Payment Status
  payment_status?: 'paid' | 'unpaid';
  // Total C
  total_c?: string; // Received as string from input
  // Signatures
  customer_signature?: string;
  supervisor_signature?: string;
}