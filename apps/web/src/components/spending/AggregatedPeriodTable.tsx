import { Pencil, Trash2, Save, X, ArrowUp, ArrowDown } from 'lucide-react';
import { ExpenseCategory } from 'hayahub-domain';
import type { ExpenseRow } from '@/hooks/useExpenseData';
import type { AggregatedPeriod } from '@/lib/expense-aggregation';
import type { SortFieldAggregated, SortDirection } from '@/hooks/useExpenseSort';

interface AggregatedPeriodTableProps {
  periods: AggregatedPeriod[];
  isLoading: boolean;
  editingId: string | null;
  editForm: ExpenseRow | null;
  sortField: SortFieldAggregated;
  sortDirection: SortDirection;
  periodType: 'month' | 'year';
  categoryLabels: Record<ExpenseCategory, string>;
  formatCurrency: (amount: number) => string;
  onSort: (field: SortFieldAggregated) => void;
  onPeriodClick: (period: AggregatedPeriod) => void;
  onEdit: (period: AggregatedPeriod) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (period: AggregatedPeriod) => void;
  onEditFormChange: (form: ExpenseRow) => void;
  searchQuery?: string;
  selectedCategory?: ExpenseCategory | null;
}

export function AggregatedPeriodTable({
  periods,
  isLoading,
  editingId,
  editForm,
  sortField,
  sortDirection,
  periodType,
  categoryLabels,
  formatCurrency,
  onSort,
  onPeriodClick,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onEditFormChange,
  searchQuery,
  selectedCategory,
}: AggregatedPeriodTableProps) {
  const periodLabel = periodType === 'month' ? 'Ngày' : 'Tháng';
  const emptyMessage = periodType === 'month' 
    ? 'Chưa có chi tiêu nào trong tháng này.' 
    : 'Chưa có chi tiêu nào trong năm này.';

  return (
    <table className="w-full table-fixed">
      <colgroup>
        <col className="w-[150px]" />
        <col className="w-[350px]" />
        <col className="w-[150px]" />
        <col className="w-[200px]" />
        <col className="w-[120px]" />
      </colgroup>
      <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <tr>
          <th onClick={() => onSort('date')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-2">
              {periodLabel}
              {sortField === 'date' && (sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />)}
            </div>
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nội dung</th>
          <th onClick={() => onSort('amount')} className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center justify-end gap-2">
              Số tiền
              {sortField === 'amount' && (sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />)}
            </div>
          </th>
          <th onClick={() => onSort('notes')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-2">
              Ghi chú
              {sortField === 'notes' && (sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />)}
            </div>
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Thao tác</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {isLoading ? (
          <tr>
            <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-100 rounded-full animate-spin" />Đang tải...
              </div>
            </td>
          </tr>
        ) : periods.length === 0 ? (
          <tr>
            <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              {searchQuery ? `Không tìm thấy kết quả nào cho "${searchQuery}".` : selectedCategory ? `Không có chi tiêu nào trong danh mục "${categoryLabels[selectedCategory]}".` : emptyMessage}
            </td>
          </tr>
        ) : (
          periods.map((period) => (
            <tr key={period.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              {editingId === period.id && editForm ? (
                <>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-semibold">{period.periodLabel}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 italic">Không thể sửa</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right font-semibold">{formatCurrency(period.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <input type="text" value={editForm.notes} onChange={(e) => onEditFormChange({ ...editForm, notes: e.target.value })} placeholder="Ghi chú" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={onSave} className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Lưu"><Save className="w-4 h-4" /></button>
                      <button onClick={onCancel} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Hủy"><X className="w-4 h-4" /></button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-semibold cursor-pointer" onClick={() => onPeriodClick(period)}>{period.periodLabel}</td>
                  <td className="px-6 py-4 cursor-pointer" onClick={() => onPeriodClick(period)}>
                    <div className="flex flex-wrap gap-1">
                      {period.categories.map((cat) => (
                        <span key={cat.category} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {categoryLabels[cat.category]}<span className="text-gray-600 dark:text-gray-300 font-semibold">{formatCurrency(cat.total)}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right font-semibold cursor-pointer" onClick={() => onPeriodClick(period)}>{formatCurrency(period.totalAmount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{period.notes || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => onEdit(period)} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Sửa"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => onDelete(period)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Xóa"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
