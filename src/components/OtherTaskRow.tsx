import React from 'react';
import { Trash2, Check, X, Minus } from 'lucide-react';
import { OtherTaskProgress } from '../types/JobCard';

interface OtherTaskRowProps {
  task: OtherTaskProgress;
  isViewMode: boolean;
  onUpdate: (id: string, field: keyof OtherTaskProgress, value: any) => void;
  onRemove: (id: string) => void;
}

export const OtherTaskRow: React.FC<OtherTaskRowProps> = React.memo(({
  task,
  isViewMode,
  onUpdate,
  onRemove,
}) => {
  const handleFieldChange = (field: keyof OtherTaskProgress, value: any) => {
    onUpdate(task.id, field, value);
  };

  const StatusButton: React.FC<{
    status: 'tick' | 'no' | 'na';
    icon: React.ReactNode;
    label: string;
    colorClass: string;
  }> = ({ status, icon, label, colorClass }) => {
    const isSelected = task.status === status;
    
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleFieldChange('status', isSelected ? undefined : status);
    };
    
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isViewMode}
        className={`flex items-center justify-center w-8 h-8 rounded-md border-2 transition-all ${
          isSelected 
            ? `${colorClass} border-current` 
            : 'border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600'
        } ${isViewMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={label}
      >
        {icon}
      </button>
    );
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4 align-top">
        <input
          type="text"
          value={task.task_name || ''}
          onChange={(e) => handleFieldChange('task_name', e.target.value)}
          disabled={isViewMode}
          placeholder="Task name"
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
            isViewMode ? 'bg-gray-50' : ''
          }`}
        />
      </td>
      <td className="px-4 py-4 align-top">
        <div className="flex items-center justify-center gap-1">
          <StatusButton
            status="tick"
            icon={<Check className="h-4 w-4" />}
            label="Completed"
            colorClass="text-green-600 bg-green-50"
          />
          <StatusButton
            status="no"
            icon={<X className="h-4 w-4" />}
            label="Not Completed"
            colorClass="text-red-600 bg-red-50"
          />
          <StatusButton
            status="na"
            icon={<Minus className="h-4 w-4" />}
            label="Not Applicable"
            colorClass="text-gray-600 bg-gray-50"
          />
        </div>
      </td>
      <td className="px-4 py-4 align-top">
        <textarea
          value={task.description || ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          disabled={isViewMode}
          placeholder="Task description"
          rows={2}
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-y min-h-[2.5rem] ${
            isViewMode ? 'bg-gray-50' : ''
          }`}
        />
      </td>
      <td className="px-4 py-4 align-top">
        <input
          type="text"
          value={task.done_by || ''}
          onChange={(e) => handleFieldChange('done_by', e.target.value)}
          disabled={isViewMode}
          placeholder="Mechanic name"
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
            isViewMode ? 'bg-gray-50' : ''
          }`}
        />
      </td>
      <td className="px-4 py-4 align-top">
        <input
          type="number"
          value={task.hours || ''}
          onChange={(e) => handleFieldChange('hours', e.target.value ? parseFloat(e.target.value) : 0)}
          disabled={isViewMode}
          placeholder="0.0"
          step="0.1"
          min="0"
          max="999"
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-center ${
            isViewMode ? 'bg-gray-50' : ''
          }`}
        />
      </td>
      {!isViewMode && (
        <td className="px-4 py-4 align-top text-center">
          <button
            type="button"
            onClick={() => onRemove(task.id)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            title="Remove row"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </td>
      )}
    </tr>
  );
});

OtherTaskRow.displayName = 'OtherTaskRow';