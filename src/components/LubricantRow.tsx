import React from 'react';
import { Trash2 } from 'lucide-react';
import { LubricantUsed } from '../types/JobCard';

interface LubricantRowProps {
  lubricant: LubricantUsed;
  isViewMode: boolean;
  onUpdate: (id: string, field: keyof LubricantUsed, value: any) => void;
  onRemove: (id: string) => void;
}

export const LubricantRow: React.FC<LubricantRowProps> = React.memo(({
  lubricant,
  isViewMode,
  onUpdate,
  onRemove,
}) => {
  const handleFieldChange = (field: keyof LubricantUsed, value: any) => {
    onUpdate(lubricant.id, field, value);
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4 align-top">
        <input
          type="text"
          value={lubricant.task_name || ''}
          onChange={(e) => handleFieldChange('task_name', e.target.value)}
          disabled={isViewMode}
          placeholder="Task name"
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            isViewMode ? 'bg-gray-50' : ''
          }`}
        />
      </td>
      <td className="px-4 py-4 align-top">
        <input
          type="text"
          value={lubricant.grade || ''}
          onChange={(e) => handleFieldChange('grade', e.target.value)}
          disabled={isViewMode}
          placeholder="Grade"
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            isViewMode ? 'bg-gray-50' : ''
          }`}
        />
      </td>
      <td className="px-4 py-4 align-top">
        <input
          type="number"
          step="0.01"
          min="0"
          value={lubricant.qty || ''}
          onChange={(e) => handleFieldChange('qty', e.target.value)}
          disabled={isViewMode}
          placeholder="0"
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center ${
            isViewMode ? 'bg-gray-50' : ''
          }`}
        />
      </td>
      <td className="px-4 py-4 align-top">
        <input
          type="number"
          step="0.01"
          min="0"
          value={lubricant.cost_per_litre || ''}
          onChange={(e) => handleFieldChange('cost_per_litre', e.target.value)}
          disabled={isViewMode}
          placeholder="0.00"
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-right ${
            isViewMode ? 'bg-gray-50' : ''
          }`}
        />
      </td>
      <td className="px-4 py-4 align-top">
        <div className="px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded text-right font-medium text-gray-900">
          ${(lubricant.total_cost || 0).toFixed(2)}
        </div>
      </td>
      <td className="px-4 py-4 align-top">
        <textarea
          value={lubricant.remarks || ''}
          onChange={(e) => handleFieldChange('remarks', e.target.value)}
          disabled={isViewMode}
          placeholder="Remarks"
          rows={2}
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y min-h-[2.5rem] ${
            isViewMode ? 'bg-gray-50' : ''
          }`}
        />
      </td>
      {!isViewMode && (
        <td className="px-4 py-4 align-top text-center">
          <button
            type="button"
            onClick={() => onRemove(lubricant.id)}
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

LubricantRow.displayName = 'LubricantRow';