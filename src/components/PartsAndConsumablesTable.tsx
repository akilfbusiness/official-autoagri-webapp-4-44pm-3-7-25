import React, { useEffect } from 'react';
import { Plus, Package, DollarSign } from 'lucide-react';
import { PartAndConsumable } from '../types/JobCard';
import { PartRow } from './PartRow';

interface PartsAndConsumablesTableProps {
  parts: PartAndConsumable[];
  onChange: (parts: PartAndConsumable[]) => void;
  onTotalBChange: (total: number) => void;
  mode: 'create' | 'edit' | 'view';
}

export const PartsAndConsumablesTable: React.FC<PartsAndConsumablesTableProps> = ({
  parts,
  onChange,
  onTotalBChange,
  mode,
}) => {
  const isViewMode = mode === 'view';

  // Generate unique ID for new parts
  const generateId = () => {
    return `part_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Create initial 5 empty rows
  const createInitialRows = () => {
    return Array.from({ length: 5 }, () => ({
      id: generateId(),
      part_number: '',
      description: '',
      price_aud: 0,
      qty_used: 0,
      total_cost_aud: 0,
      supplier: '',
      remarks: '',
    }));
  };

  // Initialize with empty rows if needed
  useEffect(() => {
    if (mode !== 'view' && parts.length === 0) {
      const initialRows = createInitialRows();
      onChange(initialRows);
    }
  }, [mode, parts.length, onChange]);

  // Calculate total B whenever parts change
  useEffect(() => {
    const total = parts.reduce((sum, part) => {
      return sum + (part.total_cost_aud || 0);
    }, 0);
    onTotalBChange(total);
  }, [parts, onTotalBChange]);

  const addNewRow = () => {
    const newPart: PartAndConsumable = {
      id: generateId(),
      part_number: '',
      description: '',
      price_aud: 0,
      qty_used: 0,
      total_cost_aud: 0,
      supplier: '',
      remarks: '',
    };
    onChange([...parts, newPart]);
  };

  const removeRow = (id: string) => {
    onChange(parts.filter(part => part.id !== id));
  };

  const updatePart = (id: string, field: keyof PartAndConsumable, value: any) => {
    const updatedParts = parts.map(part => {
      if (part.id === id) {
        const updatedPart = { ...part, [field]: value };
        
        // Auto-calculate total cost when price or quantity changes
        if (field === 'price_aud' || field === 'qty_used') {
          const price = field === 'price_aud' ? parseFloat(value) || 0 : part.price_aud || 0;
          const qty = field === 'qty_used' ? parseFloat(value) || 0 : part.qty_used || 0;
          updatedPart.total_cost_aud = price * qty;
        }
        
        return updatedPart;
      }
      return part;
    });
    onChange(updatedParts);
  };

  const totalB = parts.reduce((sum, part) => sum + (part.total_cost_aud || 0), 0);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-2">
        <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Package className="h-5 w-5 text-purple-600" />
          Parts and Consumables
        </h4>
        <p className="text-sm text-gray-500 mt-1">Track parts used and their costs</p>
      </div>

      {/* Add Row Button */}
      {!isViewMode && (
        <div className="flex justify-start">
          <button
            type="button"
            onClick={addNewRow}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Row
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                  Part Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Price (AUD)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  QTY Used
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                  Total Cost (AUD)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                  Supplier
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                  Remarks
                </th>
                {!isViewMode && (
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parts.length === 0 ? (
                <tr>
                  <td colSpan={isViewMode ? 7 : 8} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Package className="h-8 w-8 text-gray-400" />
                      <p className="text-sm">No parts added yet</p>
                      {!isViewMode && (
                        <p className="text-xs text-gray-400">Click "Add Row" to start adding parts</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                parts.map((part) => (
                  <PartRow
                    key={part.id}
                    part={part}
                    isViewMode={isViewMode}
                    onUpdate={updatePart}
                    onRemove={removeRow}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total B */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-medium text-blue-900">Total B</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            ${totalB.toFixed(2)}
          </div>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          Sum of all Total Cost (AUD) values
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Package className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-gray-900">Parts and Consumables Instructions</h4>
            <ul className="text-sm text-gray-600 mt-1 space-y-1">
              <li>• Add rows for each part or consumable used in this job</li>
              <li>• Total Cost is automatically calculated (Price × Quantity)</li>
              <li>• Total B shows the sum of all parts costs</li>
              <li>• Use the remarks field for additional notes about each part</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};