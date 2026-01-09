'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AddExpenseModal } from '@/components/dashboard/AddExpenseModal';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X, Calendar, TrendingUp } from 'lucide-react';
import { Container } from '@/infrastructure/di/Container';
import { ExpenseCategory } from 'hayahub-domain';
import type { ExpenseDTO } from 'hayahub-business';

type TimeView = 'day' | 'month' | 'year' | 'all';

interface ExpenseRow {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: ExpenseCategory;
  notes: string;
}

interface CategorySummary {
  category: ExpenseCategory;
  total: number;
  count: number;
}

export default function SpendingPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ExpenseRow | null>(null);
  const [timeView, setTimeView] = useState<TimeView>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Category labels in Vietnamese
  const categoryLabels: Record<ExpenseCategory, string> = {
    [ExpenseCategory.FOOD]: 'Ăn uống',
    [ExpenseCategory.TRANSPORT]: 'Di chuyển',
    [ExpenseCategory.SHOPPING]: 'Mua sắm',
    [ExpenseCategory.ENTERTAINMENT]: 'Giải trí',
    [ExpenseCategory.UTILITIES]: 'Tiện ích',
    [ExpenseCategory.HEALTHCARE]: 'Sức khỏe',
    [ExpenseCategory.EDUCATION]: 'Giáo dục',
    [ExpenseCategory.HOUSING]: 'Nhà ở',
    [ExpenseCategory.INSURANCE]: 'Bảo hiểm',
    [ExpenseCategory.SAVINGS]: 'Tiết kiệm',
    [ExpenseCategory.BILLS]: 'Hóa đơn',
    [ExpenseCategory.TRAVEL]: 'Du lịch',
    [ExpenseCategory.OTHER]: 'Khác',
  };

  // Load expenses when component mounts or time view changes
  useEffect(() => {
    if (user) {
      loadExpenses();
    }
  }, [user, timeView, selectedDate]);

  const loadExpenses = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const getExpensesUseCase = Container.getExpensesUseCase();
      
      // Calculate date range based on timeView
      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (timeView === 'day') {
        startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(selectedDate);
        endDate.setHours(23, 59, 59, 999);
      } else if (timeView === 'month') {
        startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999);
      } else if (timeView === 'year') {
        startDate = new Date(selectedDate.getFullYear(), 0, 1);
        endDate = new Date(selectedDate.getFullYear(), 11, 31, 23, 59, 59, 999);
      }
      // For 'all', startDate and endDate remain undefined

      const result = await getExpensesUseCase.execute({ 
        userId: user.id,
        startDate,
        endDate,
      });

      if (result.isSuccess()) {
        const expenseRows: ExpenseRow[] = result.value.map((exp: ExpenseDTO) => ({
          id: exp.id,
          date: new Date(exp.date),
          description: exp.description,
          amount: exp.amount,
          category: exp.category,
          notes: exp.tags.join(', '),
        }));
        setExpenses(expenseRows);
      }
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = async () => {
    await loadExpenses();
  };

  const handleEdit = (expense: ExpenseRow) => {
    setEditingId(expense.id);
    setEditForm({ ...expense });
  };

  const handleSave = async () => {
    if (!editForm || !user) return;

    try {
      if (editForm.id.startsWith('temp-')) {
        // Create new expense
        const createExpenseUseCase = Container.createExpenseUseCase();
        const result = await createExpenseUseCase.execute({
          userId: user.id,
          description: editForm.description,
          amount: editForm.amount,
          currency: 'VND',
          category: editForm.category,
          date: editForm.date,
          tags: editForm.notes.split(',').map((t) => t.trim()).filter((t) => t),
        });

        if (result.isSuccess()) {
          await loadExpenses();
        }
      } else {
        // Update existing expense
        const updateExpenseUseCase = Container.updateExpenseUseCase();
        const result = await updateExpenseUseCase.execute(
          editForm.id,
          user.id,
          {
            description: editForm.description,
            amount: editForm.amount,
            currency: 'VND',
            category: editForm.category,
            date: editForm.date,
            tags: editForm.notes.split(',').map((t) => t.trim()).filter((t) => t),
          }
        );

        if (result.isSuccess()) {
          await loadExpenses();
        }
      }

      setEditingId(null);
      setEditForm(null);
    } catch (error) {
      console.error('Failed to save expense:', error);
    }
  };

  const handleCancel = () => {
    if (editForm?.id.startsWith('temp-')) {
      setExpenses(expenses.filter((e) => e.id !== editForm.id));
    }
    setEditingId(null);
    setEditForm(null);
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm('Bạn có chắc muốn xóa chi tiêu này?')) return;

    try {
      const deleteExpenseUseCase = Container.deleteExpenseUseCase();
      const result = await deleteExpenseUseCase.execute(id, user.id);

      if (result.isSuccess()) {
        await loadExpenses();
      }
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const formatDate = (date: Date): string => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleCellClick = (expense: ExpenseRow) => {
    if (editingId !== expense.id) {
      handleEdit(expense);
    }
  };

  // Filter expenses by selected category
  const getFilteredExpenses = (): ExpenseRow[] => {
    if (!selectedCategory) {
      return expenses;
    }
    return expenses.filter((expense) => expense.category === selectedCategory);
  };

  // Calculate category summaries
  const getCategorySummaries = (): CategorySummary[] => {
    const summaries = new Map<ExpenseCategory, { total: number; count: number }>();

    expenses.forEach((expense) => {
      const current = summaries.get(expense.category) || { total: 0, count: 0 };
      summaries.set(expense.category, {
        total: current.total + expense.amount,
        count: current.count + 1,
      });
    });

    return Array.from(summaries.entries())
      .map(([category, { total, count }]) => ({ category, total, count }))
      .sort((a, b) => b.total - a.total);
  };

  // Get time period label
  const getTimePeriodLabel = (): string => {
    const date = selectedDate;
    switch (timeView) {
      case 'day':
        return formatDate(date);
      case 'month':
        return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
      case 'year':
        return `Năm ${date.getFullYear()}`;
      case 'all':
        return 'Tất cả';
    }
  };

  // Navigate time period
  const navigatePeriod = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    
    if (timeView === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (timeView === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (timeView === 'year') {
      newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
    }
    
    setSelectedDate(newDate);
  };

  // Handle category filter click
  const handleCategoryClick = (category: ExpenseCategory) => {
    if (selectedCategory === category) {
      // Toggle off if clicking the same category
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(null);
  };

  const categorySummaries = getCategorySummaries();
  const filteredExpenses = getFilteredExpenses();
  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Quản lý Chi tiêu
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Theo dõi và quản lý các khoản chi tiêu của bạn
            </p>
          </div>

          <button
            onClick={handleAdd}
            disabled={editingId !== null}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Thêm chi tiêu
          </button>
        </div>

        {/* Time View Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {(['day', 'month', 'year', 'all'] as TimeView[]).map((view) => (
                <button
                  key={view}
                  onClick={() => {
                    setTimeView(view);
                    if (view !== 'all') {
                      setSelectedDate(new Date());
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeView === view
                      ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {view === 'day' && 'Ngày'}
                  {view === 'month' && 'Tháng'}
                  {view === 'year' && 'Năm'}
                  {view === 'all' && 'Tất cả'}
                </button>
              ))}
            </div>

            {timeView !== 'all' && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigatePeriod('prev')}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  ←
                </button>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white min-w-[150px] justify-center">
                  <Calendar className="w-4 h-4" />
                  {getTimePeriodLabel()}
                </div>
                <button
                  onClick={() => navigatePeriod('next')}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        {expenses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Summary */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-gray-900 dark:text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {selectedCategory ? `${categoryLabels[selectedCategory]}` : 'Tổng chi tiêu'}
                </h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalAmount)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {filteredExpenses.length} giao dịch
                {selectedCategory && expenses.length !== filteredExpenses.length && (
                  <span className="ml-1">/ {expenses.length} tổng</span>
                )}
              </p>
            </div>

            {/* Top 2 Categories */}
            {categorySummaries.slice(0, 2).map((summary, index) => (
              <div
                key={summary.category}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <span className="text-lg">{index === 0 ? '🥇' : '🥈'}</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {categoryLabels[summary.category]}
                  </h3>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(summary.total)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {summary.count} giao dịch • {((summary.total / totalAmount) * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Category Breakdown */}
        {categorySummaries.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Chi tiết theo danh mục
              </h3>
              {selectedCategory && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors underline"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorySummaries.map((summary) => {
                const isSelected = selectedCategory === summary.category;
                const isOtherCategorySelected = selectedCategory && selectedCategory !== summary.category;
                
                return (
                  <button
                    key={summary.category}
                    onClick={() => handleCategoryClick(summary.category)}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all text-left ${
                      isSelected
                        ? 'bg-gray-900 dark:bg-gray-100 ring-2 ring-gray-900 dark:ring-gray-100'
                        : isOtherCategorySelected
                        ? 'bg-gray-50 dark:bg-gray-800 opacity-50'
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        isSelected
                          ? 'text-white dark:text-gray-900'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {categoryLabels[summary.category]}
                      </p>
                      <p className={`text-xs mt-1 ${
                        isSelected
                          ? 'text-gray-300 dark:text-gray-600'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {summary.count} giao dịch
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${
                        isSelected
                          ? 'text-white dark:text-gray-900'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {formatCurrency(summary.total)}
                      </p>
                      <p className={`text-xs mt-1 ${
                        isSelected
                          ? 'text-gray-300 dark:text-gray-600'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {((summary.total / expenses.reduce((sum, e) => sum + e.amount, 0)) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter indicator */}
        {selectedCategory && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Đang lọc theo:
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
                  {categoryLabels[selectedCategory]}
                </span>
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ngày
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nội dung
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ghi chú
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      Đang tải...
                    </td>
                  </tr>
                ) : filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      {selectedCategory 
                        ? `Không có chi tiêu nào trong danh mục "${categoryLabels[selectedCategory]}".`
                        : 'Chưa có chi tiêu nào. Nhấn "Thêm chi tiêu" để bắt đầu.'
                      }
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      {editingId === expense.id && editForm ? (
                        <>
                          <td className="px-6 py-4">
                            <input
                              type="date"
                              value={editForm.date.toISOString().split('T')[0]}
                              onChange={(e) =>
                                setEditForm({ ...editForm, date: new Date(e.target.value) })
                              }
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={editForm.category}
                              onChange={(e) =>
                                setEditForm({ ...editForm, category: e.target.value as ExpenseCategory })
                              }
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            >
                              {Object.values(ExpenseCategory).map((cat) => (
                                <option key={cat} value={cat}>
                                  {categoryLabels[cat]}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={editForm.description}
                              onChange={(e) =>
                                setEditForm({ ...editForm, description: e.target.value })
                              }
                              placeholder="Mô tả chi tiêu"
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={editForm.amount}
                              onChange={(e) =>
                                setEditForm({ ...editForm, amount: Number(e.target.value) })
                              }
                              placeholder="0"
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm text-right"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={editForm.notes}
                              onChange={(e) =>
                                setEditForm({ ...editForm, notes: e.target.value })
                              }
                              placeholder="Ghi chú"
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={handleSave}
                                className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                title="Lưu"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancel}
                                className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                title="Hủy"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td
                            className="px-6 py-4 text-sm text-gray-900 dark:text-white cursor-pointer"
                            onClick={() => handleCellClick(expense)}
                          >
                            {formatDate(expense.date)}
                          </td>
                          <td
                            className="px-6 py-4 text-sm cursor-pointer"
                            onClick={() => handleCellClick(expense)}
                          >
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                              {categoryLabels[expense.category]}
                            </span>
                          </td>
                          <td
                            className="px-6 py-4 text-sm text-gray-900 dark:text-white cursor-pointer"
                            onClick={() => handleCellClick(expense)}
                          >
                            {expense.description}
                          </td>
                          <td
                            className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right cursor-pointer font-medium"
                            onClick={() => handleCellClick(expense)}
                          >
                            {formatCurrency(expense.amount)}
                          </td>
                          <td
                            className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 cursor-pointer"
                            onClick={() => handleCellClick(expense)}
                          >
                            {expense.notes}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(expense)}
                                className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                title="Sửa"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(expense.id)}
                                className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                title="Xóa"
                              >
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
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {user && (
        <AddExpenseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          userId={user.id}
          onSuccess={handleAddSuccess}
        />
      )}
    </DashboardLayout>
  );
}
