import { Pencil, Trash2, Save, X } from 'lucide-react';
import { ExpenseCategory } from 'hayahub-domain';
import type { ExpenseRow } from '@/hooks/useExpenseData';
import type { SortField, SortDirection } from '@/hooks/useExpenseSort';
import { SortIndicator } from './SortIndicator';
import { formatTimeOnly } from '@/lib/expense-aggregation';

interface DayViewTableProps {
  expenses: ExpenseRow[];
  isLoading: boolean;
  editingId: string | null;
  editForm: ExpenseRow | null;
  sortField: SortField;
  sortDirection: SortDirection;
  categoryLabels: Record<ExpenseCategory, string>;
  formatCurrency: (amount: number) => string;
  onSort: (field: SortField) => void;
  onEdit: (expense: ExpenseRow) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onEditFormChange: (form: ExpenseRow) => void;
  searchQuery?: string;
  selectedCategory?: ExpenseCategory | null;
}

export function DayViewTable({
  expenses,
  isLoading,
  editingId,
  editForm,
  sortField,
  sortDirection,
  categoryLabels,
  formatCurrency,
  onSort,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onEditFormChange,
  searchQuery,
  selectedCategory,
}: DayViewTableProps) {
  const formatDateTime = (date: Date): string => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <table className="w-full table-fixed">
      <colgroup>
        <col className="w-[100px]" />
        <col className="w-[140px]" />
        <col className="w-[250px]" />
        <col className="w-[150px]" />
        <col className="w-[200px]" />
        <col className="w-[120px]" />
      </colgroup>
      <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <tr>
          <th
            onClick={() => onSort('date')}
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              Giờ
              <SortIndicator field="date" currentField={sortField} currentDirection={sortDirection} />
            </div>
          </th>
          <th
            onClick={() => onSort('category')}
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              Danh mục
              <SortIndicator field="category" currentField={sortField} currentDirection={sortDirection} />
            </div>
          </th>
          <th
            onClick={() => onSort('description')}
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              Nội dung
              <SortIndicator field="description" currentField={sortField} currentDirection={sortDirection} />
            </div>
          </th>
          <th
            onClick={() => onSort('amount')}
            className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center justify-end gap-2">
              Số tiền
              <SortIndicator field="amount" currentField={sortField} currentDirection={sortDirection} />
            </div>
          </th>
          <th
            onClick={() => onSort('notes')}
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              Ghi chú
              <SortIndicator field="notes" currentField={sortField} currentDirection={sortDirection} />
            </div>
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Thao tác
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {isLoading ? (
          <tr>
            <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-100 rounded-full animate-spin" />
                Đang tải...
              </div>
            </td>
          </tr>
        ) : expenses.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              {searchQuery 
                ? `Không tìm thấy kết quả nào cho "${searchQuery}".` 
                : selectedCategory 
                ? `Không có chi tiêu nào trong danh mục "${categoryLabels[selectedCategory]}".` 
                : 'Chưa có chi tiêu nào. Nhấn "Thêm chi tiêu" để bắt đầu.'}
            </td>
          </tr>
        ) : (
          expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              {editingId === expense.id && editForm ? (
                <>
                  <td className="px-6 py-4">
                    <input
                      type="time"
                      value={formatDateTime(editForm.date).split('T')[1]}
                      onChange={(e) => {
                        const currentDate = new Date(editForm.date);
                        const [hours, minutes] = e.target.value.split(':');
                        currentDate.setHours(parseInt(hours), parseInt(minutes));
                        onEditFormChange({ ...editForm, date: currentDate });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={editForm.category}
                      onChange={(e) => onEditFormChange({ ...editForm, category: e.target.value as ExpenseCategory })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                    >
                      {Object.values(ExpenseCategory).map((cat) => (
                        <option key={cat} value={cat}>{categoryLabels[cat]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => onEditFormChange({ ...editForm, description: e.target.value })}
                      placeholder="Mô tả chi tiêu"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={editForm.amount}
                      onChange={(e) => onEditFormChange({ ...editForm, amount: Number(e.target.value) })}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm text-right focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={editForm.notes}
                      onChange={(e) => onEditFormChange({ ...editForm, notes: e.target.value })}
                      placeholder="Ghi chú"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={onSave} className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Lưu">
                        <Save className="w-4 h-4" />
                      </button>
                      <button onClick={onCancel} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Hủy">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white cursor-pointer font-semibold" onClick={() => onEdit(expense)}>
                    {formatTimeOnly(expense.date)}
                  </td>
                  <td className="px-6 py-4 text-sm cursor-pointer" onClick={() => onEdit(expense)}>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                      {categoryLabels[expense.category]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white cursor-pointer" onClick={() => onEdit(expense)}>
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right cursor-pointer font-semibold" onClick={() => onEdit(expense)}>
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 cursor-pointer" onClick={() => onEdit(expense)}>
                    {expense.notes || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => onEdit(expense)} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Sửa">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(expense.id)} className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
