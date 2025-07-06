import React from 'react';
import { Settings } from 'lucide-react';
import { ServiceTaskProgress, ServiceATaskInvalidFields } from '../types/JobCard';
import { ServiceTaskRow } from './ServiceTaskRow';

interface ServiceBTaskListProps {
  serviceSelection?: string;
  mode: 'create' | 'edit' | 'view';
  currentProgress?: ServiceTaskProgress[];
  onProgressChange?: (progress: ServiceTaskProgress[]) => void;
  isMandatoryCheckActive?: boolean;
  initialInvalidFields?: ServiceATaskInvalidFields;
}

const SERVICE_B_TASKS = [
  'Adjust brakes',
  'Adjust brakes (raise axles)',
  'Brakes are in good serviceable condition; second check sign-off',
  'Check air cleaner restriction indicator and/or air cleaner element condition – replace if necessary',
  'Check air intake system for leaks, cracks or damage – report defects',
  'Check all air suspension components including airbags, height control valves, hoses – report defects',
  'Check all fleet I.D.; replace if missing, damaged or faded',
  'Check all steering components including king pins, ball joints & steering column – report defects',
  'Check all transmission, rear axles & hubs lubricant levels – report any leaks',
  'Check all tyre pressures; fit valve caps; report any abnormal wear or damage',
  'Check battery security & fluid levels; check terminals, clean & lubricate',
  'Check brake linings and record',
  'Check brake linings, drums, disc pads, rotors & adjusters for wear; check hub seals for leakage',
  'Check brakes system for audible air leaks',
  'Check cabin and bonnet tilt system, mounting bolts & operation, reservoir level, leaks & locks',
  'Check clutch free travel/clearance and adjust as required',
  'Check condition and security of mudflaps, mudguards and spray suppression',
  'Check condition and security of registration plates and marker plates',
  'Check condition of driveline components – report defects',
  'Check condition of fire extinguisher, security, current service tag – report if not fitted',
  'Check condition of windscreen, cabin glass, mirrors and mirror security',
  'Check cooling system level & condition of all hoses; top coolant up if necessary – record usage',
  'Check current registration and/or RWC label, label conditions and remove expired registration labels',
  'Check differential oil levels',
  'Check engine oil level & engine oil leaks; top up as required; report defects',
  'Check for any oil/fuel leaking',
  'Check gearbox oil level',
  'Check hub seals for leaking',
  'Check hydraulic hoses and connections for wear, leaks and potential issues',
  'Check hydraulic oil reservoir level; refill if necessary – record usage',
  'Check mechanical suspension components, springs, hangers, bushes and U-bolts – report defects',
  'Check operation & condition of all exterior lights & reflectors',
  'Check operation of all gauges, warning lights & buzzers, electrical accessories & ABS (if fitted)',
  'Check operation of reversing buzzer, interior lights, horn and all pedal pads/rubbers',
  'Check overhead mounting for cracks',
  'Check park brake operation',
  'Check power steering oil level; top up as required; report any leaks',
  'Check seat belt operation & condition; check seat condition – advise if repairs necessary',
  'Check shock absorber for leaks, damage and worn mountings – report defects',
  'Check steer axle wheel bearing adjustment, oil levels – report defects',
  'Check tension & condition of all Vee-belts; check component mountings for security',
  'Check turntable',
  'Check wheel bearing play',
  'Check windscreen wiper & washer operation; top up reservoir; replace wiper blades if required',
  'Check, record and clear any diagnostic fault codes – advise workshop manager of logged codes',
  'Clean and fit engine drain plug',
  'Completely grease including turntable; replace damaged or missing nipples (raise vehicle if necessary)',
  'Drain air tanks & build up air pressure; check brake systems valves, pipes & hoses for air leaks',
  'Drain engine oil (take oil sample for test on customer request if any)',
  'Drain water separator on Horton fan air supply; report excessive oil in air system',
  'Fill engine oil and record',
  'Fit wheel chocks and danger tags (render vehicle safe)',
  'Raise bonnet/cabin & visually check engine bay & components – report defects',
  'Remove grease marks from cabin area',
  'Replace air filter',
  'Replace cab filter',
  'Replace fuel filter',
  'Replace oil filters',
  'Return updated repair request to the vehicle or appropriate person. At completion of the A service, remove danger tag and wheel chocks',
  'Tension all wheel nuts; 10 stud rims to 450 ft/lbs',
  'Update service sticker & attach'
];

export const ServiceBTaskList: React.FC<ServiceBTaskListProps> = ({
  serviceSelection,
  mode,
  currentProgress = [],
  onProgressChange,
  isMandatoryCheckActive = false,
  initialInvalidFields = {},
}) => {
  // Only show if Service B is selected
  if (serviceSelection !== 'Service B') {
    return null;
  }

  const isViewMode = mode === 'view';

  const getTaskProgress = (taskName: string): ServiceTaskProgress => {
    return currentProgress.find(p => p.task_name === taskName) || { task_name: taskName };
  };

  const updateTaskProgress = (taskName: string, field: keyof ServiceTaskProgress, value: any) => {
    if (!onProgressChange) return;

    // Create a new progress array
    const updatedProgress = [...currentProgress];
    
    // Find existing task or create new one
    const existingIndex = updatedProgress.findIndex(p => p.task_name === taskName);
    
    if (existingIndex >= 0) {
      // Update existing task
      updatedProgress[existingIndex] = {
        ...updatedProgress[existingIndex],
        [field]: value
      };
    } else {
      // Add new task
      updatedProgress.push({
        task_name: taskName,
        [field]: value
      });
    }

    // Filter out tasks that have no meaningful data
    const filteredProgress = updatedProgress.filter(progress => 
      progress.status || 
      (progress.description && progress.description.trim()) ||
      (progress.done_by && progress.done_by.trim()) ||
      (progress.hours && progress.hours > 0)
    );

    onProgressChange(filteredProgress);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-2">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Settings className="h-5 w-5 text-purple-600" />
          Service B Task List
        </h3>
        <p className="text-sm text-gray-500 mt-1">Complete all required maintenance tasks</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  #
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                  Task Description
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Status
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                  Done by
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Hours
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {SERVICE_B_TASKS.map((task, index) => (
                <ServiceTaskRow
                  key={task}
                  task={task}
                  index={index}
                  progress={getTaskProgress(task)}
                  isViewMode={isViewMode}
                  isMandatoryCheckActive={isMandatoryCheckActive}
                  invalidFields={initialInvalidFields[task] || {}}
                  onUpdate={updateTaskProgress}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Settings className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-purple-900">Service B Completion</h4>
            <p className="text-sm text-purple-700 mt-1">
              Complete all {SERVICE_B_TASKS.length} tasks and mark their status. Add descriptions for any issues found
              and record the mechanic who performed each task along with time spent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};