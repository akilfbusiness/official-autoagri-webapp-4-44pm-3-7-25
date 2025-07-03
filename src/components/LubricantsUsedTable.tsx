import React, { useEffect } from 'react';
import { Droplets, Plus, DollarSign } from 'lucide-react';
import { LubricantUsed } from '../types/JobCard';
import { LubricantRow } from './LubricantRow';

interface LubricantsUsedTableProps {
  lubricants: LubricantUsed[];
  onChange: (lubricants: LubricantUsed[]) => void;
  onTotalCChange: (total: number) => void;
  mode: 'create' | 'edit' | 'view';
}

const LUBRICANT_TASKS = [
  'Engine Oil',
  'Gearbox Oil',
  'Diff Oil',
  'Steering Oil',
  'Brake Oil',
  'Coolant',
  'Grease',
  'Windscreen Fluid',
  'Battery Fluid',
  'Brake Cleaner'
];

export const LubricantsUsedTable: React.FC<LubricantsUsedTableProps> = ({
  lubricants,
  onChange,
  onTotalCChange,
  mode,
}) => {
  const isViewMode = mode === 'view';

  // Generate unique ID for new lubricants
  const generateId = () => {
    return `lubricant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Create initial rows with predefined task names
  const createInitialRows = () => {
    return LUBRICANT_TASKS.map(taskName => ({
      id: generateId(),
      task_name: taskName,
      grade: '',
      qty: 0,
      cost_per_litre: 0,
      total_cost: 0,
      remarks: '',
    }));
  };

  // Initialize with predefined rows if needed
  useEffect(() => {
    if (mode !== 'view' && lubricants.length === 0) {
      const initialRows = createInitialRows();
      onChange(initialRows);
    }
  }, [mode, lubricants.length, onChange]);

  // Calculate total C whenever lubricants change
  useEffect(() => {
    const total = lubricants.reduce((sum, lubricant) => {
      return sum + (lubricant.total_cost || 0);
    }, 0);
    onTotalCChange(total);
  }, [lubricants, onTotalCChange]);

  const addNewRow = () => {
    const newLubricant: LubricantUsed = {
      id: generateId(),
      task_name: '',
      grade: '',
      qty: 0,
      cost_per_litre: 0,
      total_cost: 0,
      remarks: '',
    };
    onChange([...lubricants, newLubricant]);
  };

  const removeRow = (id: string) => {
    onChange(lubricants.filter(lubricant => lubricant.id !== id));
  };

  const updateLubricant = (id: string, field: keyof LubricantUsed, value: any) => {
    const updatedLubricants = lubricants.map(lubricant => {
      if (lubricant.id === id) {
        const updatedLubricant = { ...lubricant, [field]: value };
        
        // Auto-calculate total cost when qty or cost_per_litre changes
        if (field === 'qty' || field === 'cost_per_litre') {
          const qty = field === 'qty' ? parseFloat(value) || 0 : lubricant.qty || 0;
          const costPerLitre = field === 'cost_per_litre' ? parseFloat(value) || 0 : lubricant.cost_per_litre || 0;
          updatedLubricant.total_cost = qty * costPerLitre;
        }
        
        return updatedLubricant;
      }
      return lubricant;
    });
    onChange(updatedLubricants);
  };

  const totalC = lubricants.reduce((sum, lubricant) => sum + (lubricant.total_cost || 0), 0);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-2">
        <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-600" />
          Lubricants Used
        </h4>
        <p className="text-sm text-gray-500 mt-1">Track lubricants and fluids used in this service</p>
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
          <table className="w-full min-w-[1400px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Task Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Grade
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  QTY
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                  Cost Per Litre
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                  Total Cost
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
              {lubricants.length === 0 ? (
                <tr>
                  <td colSpan={isViewMode ? 6 : 7} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Droplets className="h-8 w-8 text-gray-400" />
                      <p className="text-sm">No lubricants added yet</p>
                      {!isViewMode && (
                        <p className="text-xs text-gray-400">Click "Add Row" to start adding lubricants</p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                lubricants.map((lubricant) => (
                  <LubricantRow
                    key={lubricant.id}
                    lubricant={lubricant}
                    isViewMode={isViewMode}
                    onUpdate={updateLubricant}
                    onRemove={removeRow}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total C */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-lg font-medium text-green-900">Total C</span>
          </div>
          <div className="text-2xl font-bold text-green-900">
            ${totalC.toFixed(2)}
          </div>
        </div>
        <p className="text-sm text-green-700 mt-1">
          Sum of all Total Cost values
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Droplets className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-gray-900">Lubricants Used Instructions</h4>
            <ul className="text-sm text-gray-600 mt-1 space-y-1">
              <li>• Track all lubricants and fluids used during this service</li>
              <li>• Total Cost is automatically calculated (QTY × Cost Per Litre)</li>
              <li>• Total C shows the sum of all lubricant costs</li>
              <li>• Use the remarks field for additional notes about each lubricant</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};