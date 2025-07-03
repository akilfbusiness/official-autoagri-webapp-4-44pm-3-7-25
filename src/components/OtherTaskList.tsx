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
}

const OtherTaskListComponent: React.FC<OtherTaskListProps> = ({
  vehicleType,
  mode,
  currentProgress = [],
  onProgressChange,
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
    onProgressChange(updatedProgress);
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
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Task Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                    Done By
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
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
                    <td colSpan={isViewMode ? 4 : 5} className="px-4 py-8 text-center text-gray-500">
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