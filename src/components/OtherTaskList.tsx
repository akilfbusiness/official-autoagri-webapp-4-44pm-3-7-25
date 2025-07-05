import React, { useEffect } from 'react';
import { Settings, Plus } from 'lucide-react';
import { OtherTaskProgress } from '../types/JobCard';
import { CollapsibleSection } from './CollapsibleSection';
import { OtherTaskRow } from './OtherTaskRow';

interface OtherTaskListProps {
  vehicleType?: string[];
  mode: 'create' | 'edit' | 'view';
  currentProgress?: OtherTaskProgress[];
  onProgressChange?: (progress: OtherTaskProgress[]) => void;
  isMandatoryCheckActive?: boolean;
  initialInvalidFields?: { [id: string]: { status?: boolean; description?: boolean; done_by?: boolean } };
}

const OtherTaskListComponent: React.FC<OtherTaskListProps> = ({
  vehicleType,
  mode,
  currentProgress = [],
  onProgressChange,
  isMandatoryCheckActive = false,
  initialInvalidFields = {},
}) => {
  const isViewMode = mode === 'view';

  // Only show if Other is selected in vehicle type
  const shouldShow = vehicleType?.includes('Other');

  // Generate unique ID for new tasks
  const generateId = () => {
    return `other_task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Create initial 5 empty rows
  const createInitialRows = () => {
    return Array.from({ length: 5 }, () => ({
      id: generateId(),
      task_name: '',
      status: undefined,
      description: '',
      done_by: '',
      hours: 0,
    }));
  };

  // Initialize with 5 rows if no progress exists
  useEffect(() => {
    if (shouldShow && currentProgress.length === 0 && mode === 'create' && onProgressChange) {
      const initialRows = createInitialRows();
      onProgressChange(initialRows);
    }
  }, [shouldShow, currentProgress.length, mode, onProgressChange]);

  const addNewRow = () => {
    if (!onProgressChange) return;
    
    const newTask: OtherTaskProgress = {
      id: generateId(),
      task_name: '',
      status: undefined,
      description: '',
      done_by: '',
      hours: 0,
    };
    onProgressChange([...currentProgress, newTask]);
  };

  const removeRow = (id: string) => {
    if (!onProgressChange) return;
    
    onProgressChange(currentProgress.filter(task => task.id !== id));
  };

  const updateTask = (id: string, field: keyof OtherTaskProgress, value: any) => {
    if (!onProgressChange) return;
    
    const updatedProgress = currentProgress.map(task => {
      if (task.id === id) {
        return { ...task, [field]: value };
      }
      return task;
    });

    // Filter out tasks that have no meaningful data
    const filteredProgress = updatedProgress.filter(task => 
      task.status || 
      (task.task_name && task.task_name.trim()) ||
      (task.description && task.description.trim()) ||
      (task.done_by && task.done_by.trim()) ||
      (task.hours && task.hours > 0)
    );

    onProgressChange(filteredProgress);
  };

  // Return null consistently without early return to avoid React reconciliation issues
  if (!shouldShow) {
    return null;
  }

  return (
    <CollapsibleSection
      title="Other Task List"
      icon={<Settings className="h-5 w-5 text-amber-600" />}
      defaultOpen={true}
      className="mb-6"
    >
      <div className="space-y-6">
        {/* Mandatory Fields Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            ALL <span className="font-bold text-black">Status</span>, <span className="font-bold text-black">Description</span> and <span className="font-bold text-black">Done By</span> fields are <span className="font-bold text-red-600">MANDATORY</span>, and need to be filled out for the Other Task List
          </p>
        </div>

        <div className="border-b border-gray-200 pb-2">
          <p className="text-sm text-gray-500">Custom tasks for other vehicle types</p>
        </div>

        {/* Add Row Button */}
        {!isViewMode && (
          <div className="flex justify-start">
            <button
              type="button"
              onClick={addNewRow}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Row
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                    Task Name
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    Done By
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                    Hours
                  </th>
                  {!isViewMode && (
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProgress.length === 0 ? (
                  <tr>
                    <td colSpan={isViewMode ? 5 : 6} className="px-4 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Settings className="h-8 w-8 text-gray-400" />
                        <p className="text-sm">No tasks added yet</p>
                        {!isViewMode && (
                          <p className="text-xs text-gray-400">Click "Add Row" to start adding tasks</p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentProgress.map((task) => (
                    <OtherTaskRow
                      key={task.id}
                      task={task}
                      isViewMode={isViewMode}
                      isMandatoryCheckActive={isMandatoryCheckActive}
                      invalidFields={initialInvalidFields[task.id] || {}}
                      onUpdate={updateTask}
                      onRemove={removeRow}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Settings className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-amber-900">Other Task List Instructions</h4>
              <p className="text-sm text-amber-700 mt-1">
                Add custom tasks for vehicles that don't fit standard categories. Include task names, descriptions, 
                assigned mechanics, and time spent on each task.
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
    </CollapsibleSection>
  );
};

// Apply React.memo to stabilize the component reference and prevent React reconciliation issues
export const OtherTaskList = React.memo(OtherTaskListComponent);