import React, { useEffect } from 'react';
import { Truck, Calendar, Gauge, Hash, Zap, Disc, Settings, Wrench, Shield } from 'lucide-react';
import { TrailerTaskProgress, TrailerElectricalTask, TrailerTiresWheelsTask, TrailerBrakeSystemTask, TrailerSuspensionTask, TrailerBodyChassisTask } from '../types/JobCard';
import { TrailerTaskRow } from './TrailerTaskRow';

interface TrailerTaskListProps {
  vehicleType?: string[];
  mode: 'create' | 'edit' | 'view';
  currentProgress?: TrailerTaskProgress[];
  onProgressChange?: (progress: TrailerTaskProgress[]) => void;
  isMandatoryCheckActive?: boolean;
  initialInvalidFields?: {
    electrical_tasks?: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } };
    tires_wheels_tasks?: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } };
    brake_system_tasks?: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } };
    suspension_tasks?: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } };
    body_chassis_tasks?: { [index: number]: { status?: boolean; description?: boolean; done_by?: boolean } };
  };
}

const ELECTRICAL_SYSTEM_TASKS: { name: string; task: string; status?: 'tick' | 'no' | 'na'; description?: string; done_by?: string; hours?: number }[] = [
  { name: 'Battery', task: 'Check Battery Charge and Switch Operation', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'Trailer lights', task: 'Check That All Are Working', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'Check plugs', task: 'Check all electrical plugs', status: 'na', description: '', done_by: '', hours: 0 },
];

const TIRES_WHEELS_TASKS: { name: string; task: string; status?: 'tick' | 'no' | 'na'; description?: string; done_by?: string; hours?: number }[] = [
  { name: 'Tire Pressure', task: 'Inflate to Manufacturer Specifications', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'Tire Condition', task: 'Inspect for Cuts, Wear or Bulging', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'Wheels', task: 'Tighten to Specified Torque', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'Wheel Nuts and Bolts', task: 'Inspect for Cracks, Dents or Distortion', status: 'na', description: '', done_by: '', hours: 0 },
];

const BRAKE_SYSTEM_TASKS: { name: string; task: string; status?: 'tick' | 'no' | 'na'; description?: string; done_by?: string; hours?: number }[] = [
  { name: 'Brakes', task: 'Test for Functionality', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'Brake Adjustment', task: 'Adjust to Proper Operating Clearance', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'Brake Magnets', task: 'Inspect for Wear and Current Draw', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'Brake Linings', task: 'Inspect for Wear or Contamination', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'Brake Controller', task: 'Check Settings and Proper Operation', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'Brake Cylinders', task: 'Check for Leaks, Sticking', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'Brake Lines', task: 'Inspect for Cracks, Leaks or Kinks', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'Hubs / Drums', task: 'Inspect for Abnormal Wear or Scoring', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'Wheel Bearings & Cups', task: 'Inspect for Corrosion or Wear – Clean and Repack', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'Hand brake', task: 'check hand brake cable and adjustment', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'lubrication', task: 'lubricate all grease points', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'Brake fluid level', task: 'Check / top up if required', status: 'na', description: '', done_by: '', hours: 0 },
];

const SUSPENSION_TASKS: { name: string; task: string; status?: 'tick' | 'no' | 'na'; description?: string; done_by?: string; hours?: number }[] = [
  { name: 'Springs', task: 'Inspect for Wear and Loss of Arch', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'Suspension Parts', task: 'Inspect for Bending, Loose Fasteners and Wear', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'U-Bolts', task: 'Check for Wear and Confirm Tightness', status: 'na', description: '', done_by: '', hours: 0 },
];

const BODY_CHASSIS_TASKS: { name: string; task: string; status?: 'tick' | 'no' | 'na'; description?: string; done_by?: string; hours?: number }[] = [
  { name: 'Hitch', task: 'Check tow hitch eye wear with in limit', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'Hitch mounting', task: 'Check tow hitch mounting and any crack', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'Tail Gate', task: 'Check Tail gate pins/safety Chains/safety bars and lubricate', status: 'na', description: '', done_by: '', hours: 0 },
  { name: 'Landing leg', task: 'Check operation of landing leg', status: 'na', description: '', done_by: '', hours: 0 },
];

export const TrailerTaskList: React.FC<TrailerTaskListProps> = ({
  vehicleType,
  mode,
  currentProgress = [],
  onProgressChange,
  isMandatoryCheckActive = false,
  initialInvalidFields = {},
}) => {
  const shouldShow = vehicleType?.includes('Trailer');
  const isViewMode = mode === 'view';

  // Initialize trailer progress if needed
  useEffect(() => {
    if (shouldShow && currentProgress.length === 0 && (mode === 'create' || mode === 'edit') && onProgressChange) {
      const initialTrailerProgress: TrailerTaskProgress = {
        trailer_date: undefined,
        trailer_kms: undefined,
        plant_number: '',
        electrical_tasks: ELECTRICAL_SYSTEM_TASKS.map(task => ({
          name: task.name,
          task: task.task,
          status: task.status,
          description: task.description || '',
          done_by: task.done_by || '',
          hours: task.hours || 0
        })),
        tires_wheels_tasks: TIRES_WHEELS_TASKS.map(task => ({
          name: task.name,
          task: task.task,
          status: task.status,
          description: task.description || '',
          done_by: task.done_by || '',
          hours: task.hours || 0
        })),
        brake_system_tasks: BRAKE_SYSTEM_TASKS.map(task => ({
          name: task.name,
          task: task.task,
          status: task.status,
          description: task.description || '',
          done_by: task.done_by || '',
          hours: task.hours || 0
        })),
        suspension_tasks: SUSPENSION_TASKS.map(task => ({
          name: task.name,
          task: task.task,
          status: task.status,
          description: task.description || '',
          done_by: task.done_by || '',
          hours: task.hours || 0
        })),
        body_chassis_tasks: BODY_CHASSIS_TASKS.map(task => ({
          name: task.name,
          task: task.task,
          status: task.status,
          description: task.description || '',
          done_by: task.done_by || '',
          hours: task.hours || 0
        })),
      };
      
      onProgressChange([initialTrailerProgress]);
    }
  }, [shouldShow, currentProgress.length, mode, onProgressChange]);

  // Get the first (and likely only) trailer progress entry
  const trailerProgress = currentProgress[0] || {};

  const updateTrailerProgress = (field: keyof TrailerTaskProgress, value: any) => {
    if (!onProgressChange) return;

    const updatedProgress = [{
      ...trailerProgress,
      [field]: value
    }];

    // Always keep the trailer progress object - no filtering
    onProgressChange(updatedProgress);
  };

  const updateElectricalTask = (index: number, field: string, value: any) => {
    const currentElectricalTasks = trailerProgress.electrical_tasks || ELECTRICAL_SYSTEM_TASKS.map(task => ({
      name: task.name,
      task: task.task,
      status: task.status,
      description: task.description || '',
      done_by: task.done_by || '',
      hours: task.hours || 0
    }));

    const updatedTasks = [...currentElectricalTasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value
    };

    updateTrailerProgress('electrical_tasks', updatedTasks);
  };

  const updateTiresWheelsTask = (index: number, field: string, value: any) => {
    const currentTiresWheelsTasks = trailerProgress.tires_wheels_tasks || TIRES_WHEELS_TASKS.map(task => ({
      name: task.name,
      task: task.task,
      status: task.status,
      description: task.description || '',
      done_by: task.done_by || '',
      hours: task.hours || 0
    }));

    const updatedTasks = [...currentTiresWheelsTasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value
    };

    updateTrailerProgress('tires_wheels_tasks', updatedTasks);
  };

  const updateBrakeSystemTask = (index: number, field: string, value: any) => {
    const currentBrakeSystemTasks = trailerProgress.brake_system_tasks || BRAKE_SYSTEM_TASKS.map(task => ({
      name: task.name,
      task: task.task,
      status: task.status,
      description: task.description || '',
      done_by: task.done_by || '',
      hours: task.hours || 0
    }));

    const updatedTasks = [...currentBrakeSystemTasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value
    };

    updateTrailerProgress('brake_system_tasks', updatedTasks);
  };

  const updateSuspensionTask = (index: number, field: string, value: any) => {
    const currentSuspensionTasks = trailerProgress.suspension_tasks || SUSPENSION_TASKS.map(task => ({
      name: task.name,
      task: task.task,
      status: task.status,
      description: task.description || '',
      done_by: task.done_by || '',
      hours: task.hours || 0
    }));

    const updatedTasks = [...currentSuspensionTasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value
    };

    updateTrailerProgress('suspension_tasks', updatedTasks);
  };

  const updateBodyChassisTask = (index: number, field: string, value: any) => {
    const currentBodyChassisTasks = trailerProgress.body_chassis_tasks || BODY_CHASSIS_TASKS.map(task => ({
      name: task.name,
      task: task.task,
      status: task.status,
      description: task.description || '',
      done_by: task.done_by || '',
      hours: task.hours || 0
    }));

    const updatedTasks = [...currentBodyChassisTasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [field]: value
    };

    updateTrailerProgress('body_chassis_tasks', updatedTasks);
  };

  // Initialize tasks if they don't exist
  const electricalTasks = trailerProgress.electrical_tasks || ELECTRICAL_SYSTEM_TASKS.map(task => ({
    name: task.name,
    task: task.task,
    status: task.status,
    description: task.description || '',
    done_by: task.done_by || '',
    hours: task.hours || 0
  }));

  const tiresWheelsTasks = trailerProgress.tires_wheels_tasks || TIRES_WHEELS_TASKS.map(task => ({
    name: task.name,
    task: task.task,
    status: task.status,
    description: task.description || '',
    done_by: task.done_by || '',
    hours: task.hours || 0
  }));

  const brakeSystemTasks = trailerProgress.brake_system_tasks || BRAKE_SYSTEM_TASKS.map(task => ({
    name: task.name,
    task: task.task,
    status: task.status,
    description: task.description || '',
    done_by: task.done_by || '',
    hours: task.hours || 0
  }));

  const suspensionTasks = trailerProgress.suspension_tasks || SUSPENSION_TASKS.map(task => ({
    name: task.name,
    task: task.task,
    status: task.status,
    description: task.description || '',
    done_by: task.done_by || '',
    hours: task.hours || 0
  }));

  const bodyChassisTasks = trailerProgress.body_chassis_tasks || BODY_CHASSIS_TASKS.map(task => ({
    name: task.name,
    task: task.task,
    status: task.status,
    description: task.description || '',
    done_by: task.done_by || '',
    hours: task.hours || 0
  }));

  // Format date for display
  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    try {
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Handle date input change
  const handleDateChange = (dateString: string) => {
    if (dateString) {
      const date = new Date(dateString);
      updateTrailerProgress('trailer_date', date);
    } else {
      updateTrailerProgress('trailer_date', undefined);
    }
  };

  // Handle KMs input change
  const handleKmsChange = (kmsString: string) => {
    if (kmsString) {
      const kms = parseInt(kmsString, 10);
      if (!isNaN(kms)) {
        updateTrailerProgress('trailer_kms', kms);
      }
    } else {
      updateTrailerProgress('trailer_kms', undefined);
    }
  };

  return (
    <>
      {shouldShow ? (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-2">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Truck className="h-5 w-5 text-indigo-600" />
          Trailer Task List
        </h3>
        <p className="text-sm text-gray-500 mt-1">Trailer inspection and maintenance checklist</p>
      </div>

      {/* Basic Information Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Date Field (Now Editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              Date
            </label>
            <input
              type="date"
              value={formatDateForInput(trailerProgress.trailer_date)}
              onChange={(e) => handleDateChange(e.target.value)}
              disabled={isViewMode}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                isViewMode ? 'bg-gray-50' : ''
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">Select the inspection date</p>
          </div>

          {/* KM Field (Now Editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Gauge className="h-4 w-4 text-green-600" />
              KM
            </label>
            <input
              type="number"
              value={trailerProgress.trailer_kms || ''}
              onChange={(e) => handleKmsChange(e.target.value)}
              disabled={isViewMode}
              placeholder="Enter kilometers"
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                isViewMode ? 'bg-gray-50' : ''
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">Enter current kilometers</p>
          </div>

          {/* Plant Number Field (Editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Hash className="h-4 w-4 text-purple-600" />
              Plant Number
            </label>
            <input
              type="text"
              value={trailerProgress.plant_number || ''}
              onChange={(e) => updateTrailerProgress('plant_number', e.target.value)}
              disabled={isViewMode}
              placeholder="Enter plant number"
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                isViewMode ? 'bg-gray-50' : ''
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">Unique identifier for this trailer</p>
          </div>
        </div>
      </div>

      {/* Mandatory Fields Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          ALL <span className="font-bold text-black">Status</span>, <span className="font-bold text-black">Description</span> and <span className="font-bold text-black">Done By</span> fields are <span className="font-bold text-red-600">MANDATORY</span>, and need to be filled out for the Trailer Task List
        </p>
      </div>

      {/* Electrical System Section */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-4">
          <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Electrical System
          </h4>
          <p className="text-sm text-gray-600 mt-1">Check all electrical components and systems</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56">
                  Name
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Done by
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Hours
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {electricalTasks.map((task, index) => (
                <TrailerTaskRow
                  key={index}
                  task={task}
                  index={index}
                  isViewMode={isViewMode}
                  isMandatoryCheckActive={isMandatoryCheckActive}
                  invalidFields={initialInvalidFields.electrical_tasks?.[index] || {}}
                  onUpdate={updateElectricalTask}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tires and Wheels Section */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
          <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Disc className="h-5 w-5 text-blue-600" />
            Tires and Wheels
          </h4>
          <p className="text-sm text-gray-600 mt-1">Inspect tires, wheels, and related components</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56">
                  Name
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Done by
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Hours
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tiresWheelsTasks.map((task, index) => (
                <TrailerTaskRow
                  key={index}
                  task={task}
                  index={index}
                  isViewMode={isViewMode}
                  isMandatoryCheckActive={isMandatoryCheckActive}
                  invalidFields={initialInvalidFields.tires_wheels_tasks?.[index] || {}}
                  onUpdate={updateTiresWheelsTask}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Brake System Section */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-red-50 border-b border-red-200 px-6 py-4">
          <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Settings className="h-5 w-5 text-red-600" />
            Brake System
          </h4>
          <p className="text-sm text-gray-600 mt-1">Comprehensive brake system inspection and maintenance</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56">
                  Name
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Done by
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Hours
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {brakeSystemTasks.map((task, index) => (
                <TrailerTaskRow
                  key={index}
                  task={task}
                  index={index}
                  isViewMode={isViewMode}
                  isMandatoryCheckActive={isMandatoryCheckActive}
                  invalidFields={initialInvalidFields.brake_system_tasks?.[index] || {}}
                  onUpdate={updateBrakeSystemTask}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suspension Section */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-green-50 border-b border-green-200 px-6 py-4">
          <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Wrench className="h-5 w-5 text-green-600" />
            Suspension
          </h4>
          <p className="text-sm text-gray-600 mt-1">Inspect suspension components and systems</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56">
                  Name
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Done by
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Hours
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suspensionTasks.map((task, index) => (
                <TrailerTaskRow
                  key={index}
                  task={task}
                  index={index}
                  isViewMode={isViewMode}
                  isMandatoryCheckActive={isMandatoryCheckActive}
                  invalidFields={initialInvalidFields.suspension_tasks?.[index] || {}}
                  onUpdate={updateSuspensionTask}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Body/Chassis Section */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-purple-50 border-b border-purple-200 px-6 py-4">
          <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            Body/Chassis
          </h4>
          <p className="text-sm text-gray-600 mt-1">Inspect body and chassis components</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56">
                  Name
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Done by
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Hours
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bodyChassisTasks.map((task, index) => (
                <TrailerTaskRow
                  key={index}
                  task={task}
                  index={index}
                  isViewMode={isViewMode}
                  isMandatoryCheckActive={isMandatoryCheckActive}
                  invalidFields={initialInvalidFields.body_chassis_tasks?.[index] || {}}
                  onUpdate={updateBodyChassisTask}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Truck className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-indigo-900">Trailer Checklist Progress</h4>
            <p className="text-sm text-indigo-700 mt-1">
              Complete all sections of the trailer inspection checklist. Mark status for each task and add descriptions for items that require attention or have issues found.
              {isMandatoryCheckActive && (
                <span className="block mt-2 font-medium text-red-700">
                  Note: Status, Description, and Done By fields are mandatory for completion.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
      ) : null}
    </>
  );
};