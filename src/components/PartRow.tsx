import React from 'react';
import { Trash2 } from 'lucide-react';
import { PartAndConsumable } from '../types/JobCard';

interface PartRowProps {
  part: PartAndConsumable;
  isViewMode: boolean;
  onUpdate: (id: string, field: keyof PartAndConsumable, value: any) => void;
  onRemove: (id: string) => void;
}

export const PartRow: React.FC<PartRowProps> = React.memo(({
  part,
  isViewMode,
  onUpdate,
  onRemove,
}) => {
  const handleFieldChange = (field: keyof PartAndConsumable, value: any) => {
    onUpdate(part.id, field, value);
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4 align-top">
        <input
          type="text"
          value={part.part_number || ''}
          onChange={(e) => handleFieldChange('part_number', e.target.value)}
          disabled={isViewMode}
          placeholder="Part #"
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            isViewMode ? 'bg-gray-50' : ''
          }`}
        />
      </td>
      <td className="px-4 py-4 align-top">
        <textarea
          value={part.description || ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          disabled={isViewMode}
          placeholder="Description"
          rows={2}
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-y min-h-[2.5rem] ${
            isViewMode ? 'bg-gray-50' : ''
          }`}
        />
      </td>
      <td className="px-4 py-4 align-top">
        <input
          type="number"
          step="0.01"
          min="0"
          value={part.price_aud || ''}
          onChange={(e) => handleFieldChange('price_aud', e.target.value)}
          disabled={isViewMode}
          placeholder="0.00"
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-right ${
            isViewMode ? 'bg-gray-50' : ''
          }`}
        />
      </td>
      <td className="px-4 py-4 align-top">
        <input
          type="number"
          step="0.01"
          min="0"
          value={part.qty_used || ''}
          onChange={(e) => handleFieldChange('qty_used', e.target.value)}
          disabled={isViewMode}
          placeholder="0"
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center ${
            isViewMode ? 'bg-gray-50' : ''
          }`}
        />
      </td>
      <td className="px-4 py-4 align-top">
        <div className="px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded text-right font-medium text-gray-900">
          ${(part.total_cost_aud || 0).toFixed(2)}
        </div>
      </td>
      <td className="px-4 py-4 align-top">
        <input
          type="text"
          value={part.supplier || ''}
          onChange={(e) => handleFieldChange('supplier', e.target.value)}
          disabled={isViewMode}
          placeholder="Supplier name"
          className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            isViewMode ? 'bg-gray-50' : ''
          }`}
        />
      </td>
      <td className="px-4 py-4 align-top">
        <textarea
          value={part.remarks || ''}
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
            onClick={() => onRemove(part.id)}
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

PartRow.displayName = 'PartRow';