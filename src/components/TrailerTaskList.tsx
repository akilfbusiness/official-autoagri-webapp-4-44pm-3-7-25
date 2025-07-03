import React from 'react';
import { Truck, Calendar, Gauge, Hash, Zap, Disc, Settings, Wrench, Shield } from 'lucide-react';
import { TrailerTaskProgress, TrailerElectricalTask, TrailerTiresWheelsTask, TrailerBrakeSystemTask, TrailerSuspensionTask, TrailerBodyChassisTask } from '../types/JobCard';

interface TrailerTaskListProps {
  vehicleType?: string[];
  mode: 'create' | 'edit' | 'view';
  currentProgress?: TrailerTaskProgress[];
  onProgressChange?: (progress: TrailerTaskProgress[]) => void;
}

const ELECTRICAL_SYSTEM_TASKS: { name: string; task: string }[] = [
  { name: 'Battery', task: 'Check Battery Charge and Switch Operation' },
  { name: 'Trailer lights', task: 'Check That All Are Working' },
  { name: 'Check plugs', task: 'Check all electrical plugs' },
];

const TIRES_WHEELS_TASKS: { name: string; task: string }[] = [
  { name: 'Tire Pressure', task: 'Inflate to Manufacturer Specifications' },
  { name: 'Tire Condition', task: 'Inspect for Cuts, Wear or Bulging' },
  { name: 'Wheels', task: 'Tighten to Specified Torque' },
  { name: 'Wheel Nuts and Bolts', task: 'Inspect for Cracks, Dents or Distortion' },
];

const BRAKE_SYSTEM_TASKS: { name: string; task: string }[] = [
  { name: 'Brakes', task: 'Test for Functionality' },
  { name: 'Brake Adjustment', task: 'Adjust to Proper Operating Clearance' },
  { name: 'Brake Magnets', task: 'Inspect for Wear and Current Draw' },
  { name: 'Brake Linings', task: 'Inspect for Wear or Contamination' },
  { name: 'Brake Controller', task: 'Check Settings and Proper Operation' },
  { name: 'Brake Cylinders', task: 'Check for Leaks, Sticking' },
  { name: 'Brake Lines', task: 'Inspect for Cracks, Leaks or Kinks' },
  { name: 'Hubs / Drums', task: 'Inspect for Abnormal Wear or Scoring' },
  { name: 'Wheel Bearings & Cups', task: 'Inspect for Corrosion or Wear – Clean and Repack' },
  { name: 'Hand brake', task: 'check hand brake cable and adjustment' },
  { name: 'lubrication', task: 'lubricate all grease points' },
  { name: 'Brake fluid level', task: 'Check / top up if required' },
];

const SUSPENSION_TASKS: { name: string; task: string }[] = [
  { name: 'Springs', task: 'Inspect for Wear and Loss of Arch' },
  { name: 'Suspension Parts', task: 'Inspect for Bending, Loose Fasteners and Wear' },
  { name: 'U-Bolts', task: 'Check for Wear and Confirm Tightness' },
];

const BODY_CHASSIS_TASKS: { name: string; task: string }[] = [
  { name: 'Hitch', task: 'Check tow hitch eye wear with in limit' },
  { name: 'Hitch mounting', task: 'Check tow hitch mounting and any crack' },
  { name: 'Tail Gate', task: 'Check Tail gate pins/safety Chains/safety bars and lubricate' },
  { name: 'Landing leg', task: 'Check operation of landing leg' },
];

export const TrailerTaskList: React.FC<TrailerTaskListProps> = ({
  vehicleType,
  mode,
  currentProgress = [],
  onProgressChange,
}) => {
  // Only show if Trailer is selected
  if (!vehicleType?.includes('Trailer')) {
    return null;
  }

  const isViewMode = mode === 'view';

  // Get the first (and likely only) trailer progress entry
  const trailerProgress = currentProgress[0] || {};

  const updateTrailerProgress = (field: keyof TrailerTaskProgress, value: any) => {
    if (!onProgressChange) return;

    const updatedProgress = [{
      ...trailerProgress,
      [field]: value
    }];

    // Filter out empty progress (but keep if it has any meaningful data)
    const filteredProgress = updatedProgress.filter(progress => 
      (progress.trailer_date) ||
      (progress.trailer_kms !== undefined && progress.trailer_kms !== null) ||
      (progress.plant_number && progress.plant_number.trim()) ||
      (progress.electrical_tasks && progress.electrical_tasks.some(task => task.remarks && task.remarks.trim())) ||
      (progress.tires_wheels_tasks && progress.tires_wheels_tasks.some(task => task.remarks && task.remarks.trim())) ||
      (progress.brake_system_tasks && progress.brake_system_tasks.some(task => task.remarks && task.remarks.trim())) ||
      (progress.suspension_tasks && progress.suspension_tasks.some(task => task.remarks && task.remarks.trim())) ||
      (progress.body_chassis_tasks && progress.body_chassis_tasks.some(task => task.remarks && task.remarks.trim()))
    );

    onProgressChange(filteredProgress);
  };

  const updateElectricalTask = (index: number, remarks: string) => {
    const currentElectricalTasks = trailerProgress.electrical_tasks || ELECTRICAL_SYSTEM_TASKS.map(task => ({
      name: task.name,
      task: task.task,
      remarks: ''
    }));

    const updatedTasks = [...currentElectricalTasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      remarks
    };

    updateTrailerProgress('electrical_tasks', updatedTasks);
  };

  const updateTiresWheelsTask = (index: number, remarks: string) => {
    const currentTiresWheelsTasks = trailerProgress.tires_wheels_tasks || TIRES_WHEELS_TASKS.map(task => ({
      name: task.name,
      task: task.task,
      remarks: ''
    }));

    const updatedTasks = [...currentTiresWheelsTasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      remarks
    };

    updateTrailerProgress('tires_wheels_tasks', updatedTasks);
  };

  const updateBrakeSystemTask = (index: number, remarks: string) => {
    const currentBrakeSystemTasks = trailerProgress.brake_system_tasks || BRAKE_SYSTEM_TASKS.map(task => ({
      name: task.name,
      task: task.task,
      remarks: ''
    }));

    const updatedTasks = [...currentBrakeSystemTasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      remarks
    };

    updateTrailerProgress('brake_system_tasks', updatedTasks);
  };

  const updateSuspensionTask = (index: number, remarks: string) => {
    const currentSuspensionTasks = trailerProgress.suspension_tasks || SUSPENSION_TASKS.map(task => ({
      name: task.name,
      task: task.task,
      remarks: ''
    }));

    const updatedTasks = [...currentSuspensionTasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      remarks
    };

    updateTrailerProgress('suspension_tasks', updatedTasks);
  };

  const updateBodyChassisTask = (index: number, remarks: string) => {
    const currentBodyChassisTasks = trailerProgress.body_chassis_tasks || BODY_CHASSIS_TASKS.map(task => ({
      name: task.name,
      task: task.task,
      remarks: ''
    }));

    const updatedTasks = [...currentBodyChassisTasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      remarks
    };

    updateTrailerProgress('body_chassis_tasks', updatedTasks);
  };

  // Initialize tasks if they don't exist
  const electricalTasks = trailerProgress.electrical_tasks || ELECTRICAL_SYSTEM_TASKS.map(task => ({
    name: task.name,
    task: task.task,
    remarks: ''
  }));

  const tiresWheelsTasks = trailerProgress.tires_wheels_tasks || TIRES_WHEELS_TASKS.map(task => ({
    name: task.name,
    task: task.task,
    remarks: ''
  }));

  const brakeSystemTasks = trailerProgress.brake_system_tasks || BRAKE_SYSTEM_TASKS.map(task => ({
    name: task.name,
    task: task.task,
    remarks: ''
  }));

  const suspensionTasks = trailerProgress.suspension_tasks || SUSPENSION_TASKS.map(task => ({
    name: task.name,
    task: task.task,
    remarks: ''
  }));

  const bodyChassisTasks = trailerProgress.body_chassis_tasks || BODY_CHASSIS_TASKS.map(task => ({
    name: task.name,
    task: task.task,
    remarks: ''
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {electricalTasks.map((task, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {task.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {task.task}
                  </td>
                  <td className="px-6 py-4">
                    <textarea
                      value={task.remarks || ''}
                      onChange={(e) => updateElectricalTask(index, e.target.value)}
                      disabled={isViewMode}
                      placeholder="Add remarks..."
                      rows={2}
                      className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y min-h-[2.5rem] ${
                        isViewMode ? 'bg-gray-50' : ''
                      }`}
                    />
                  </td>
                </tr>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tiresWheelsTasks.map((task, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {task.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {task.task}
                  </td>
                  <td className="px-6 py-4">
                    <textarea
                      value={task.remarks || ''}
                      onChange={(e) => updateTiresWheelsTask(index, e.target.value)}
                      disabled={isViewMode}
                      placeholder="Add remarks..."
                      rows={2}
                      className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y min-h-[2.5rem] ${
                        isViewMode ? 'bg-gray-50' : ''
                      }`}
                    />
                  </td>
                </tr>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {brakeSystemTasks.map((task, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {task.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {task.task}
                  </td>
                  <td className="px-6 py-4">
                    <textarea
                      value={task.remarks || ''}
                      onChange={(e) => updateBrakeSystemTask(index, e.target.value)}
                      disabled={isViewMode}
                      placeholder="Add remarks..."
                      rows={2}
                      className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y min-h-[2.5rem] ${
                        isViewMode ? 'bg-gray-50' : ''
                      }`}
                    />
                  </td>
                </tr>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suspensionTasks.map((task, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {task.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {task.task}
                  </td>
                  <td className="px-6 py-4">
                    <textarea
                      value={task.remarks || ''}
                      onChange={(e) => updateSuspensionTask(index, e.target.value)}
                      disabled={isViewMode}
                      placeholder="Add remarks..."
                      rows={2}
                      className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y min-h-[2.5rem] ${
                        isViewMode ? 'bg-gray-50' : ''
                      }`}
                    />
                  </td>
                </tr>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bodyChassisTasks.map((task, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {task.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {task.task}
                  </td>
                  <td className="px-6 py-4">
                    <textarea
                      value={task.remarks || ''}
                      onChange={(e) => updateBodyChassisTask(index, e.target.value)}
                      disabled={isViewMode}
                      placeholder="Add remarks..."
                      rows={2}
                      className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y min-h-[2.5rem] ${
                        isViewMode ? 'bg-gray-50' : ''
                      }`}
                    />
                  </td>
                </tr>
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
              Complete all sections of the trailer inspection checklist. Add remarks only for items that require attention or have issues found.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};