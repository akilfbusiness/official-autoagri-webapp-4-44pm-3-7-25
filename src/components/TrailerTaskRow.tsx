import React from 'react';
import { Check, X, Minus } from 'lucide-react';

interface TrailerTaskRowProps {
  task: {
    name: string;
    task: string;
    status?: 'tick' | 'no' | 'na';
    description?: string;
    done_by?: string;
    hours?: number;
  };
  index: number;
  isViewMode: boolean;
  isMandatoryCheckActive: boolean;
  invalidFields: { status?: boolean; description?: boolean; done_by?: boolean };
  onUpdate: (index: number, field: string, value: any) => void;
}

export const TrailerTaskRow: React.FC<TrailerTaskRowProps> = React.memo(({
  task,
  index,
  isViewMode,
  isMandatoryCheckActive,
  invalidFields,
  onUpdate,
}) => {
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
      // Prevent unsetting status - always set the chosen status
      onUpdate(index, 'status', status);
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

  const MandatoryIndicator: React.FC = () => (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2">
      mandatory
    </span>
  );

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 text-sm font-medium text-gray-500 align-top">
        {String(index + 1).padStart(2, '0')}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 align-top">
        <div className="text-xs leading-relaxed text-left break-words">
          <div className="font-medium text-gray-900 mb-1">{task.name}</div>
          <div className="text-gray-700">{task.task}</div>
        </div>
      </td>
      <td className="px-6 py-4 align-top">
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
        {isMandatoryCheckActive && invalidFields.status && <MandatoryIndicator />}
      </td>
      <td className="px-6 py-4 align-top">
        <textarea
          value={task.description || ''}
          onChange={(e) => onUpdate(index, 'description', e.target.value)}
          disabled={isViewMode}
          placeholder="Add notes..."
          rows={2}
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y min-h-[2.5rem] ${
            isViewMode ? 'bg-gray-50' : ''
          } ${isMandatoryCheckActive && invalidFields.description ? 'border-red-300 focus:ring-red-500' : ''}`}
        />
        {isMandatoryCheckActive && invalidFields.description && <MandatoryIndicator />}
      </td>
      <td className="px-6 py-4 align-top">
        <input
          type="text"
          value={task.done_by || ''}
          onChange={(e) => onUpdate(index, 'done_by', e.target.value)}
          disabled={isViewMode}
          placeholder="Mechanic name"
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            isViewMode ? 'bg-gray-50' : ''
          } ${isMandatoryCheckActive && invalidFields.done_by ? 'border-red-300 focus:ring-red-500' : ''}`}
        />
        {isMandatoryCheckActive && invalidFields.done_by && <MandatoryIndicator />}
      </td>
      <td className="px-6 py-4 align-top">
        <input
          type="number"
          value={task.hours || ''}
          onChange={(e) => onUpdate(index, 'hours', e.target.value ? parseFloat(e.target.value) : undefined)}
          disabled={isViewMode}
          placeholder="0.0"
          step="0.1"
          min="0"
          max="999"
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center ${
            isViewMode ? 'bg-gray-50' : ''
          }`}
        />
      </td>
    </tr>
  );
});

TrailerTaskRow.displayName = 'TrailerTaskRow';