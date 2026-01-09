'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AddExpenseModal } from '@/components/dashboard/AddExpenseModal';
import { SpendingChartCard } from '@/components/spending/SpendingChartCard';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import {
  Pencil,
  Trash2,
  Save,
  X,
  Calendar,
  TrendingUp,
  TrendingDown,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  DollarSign,
} from 'lucide-react';
import { Container } from '@/infrastructure/di/Container';
import { ExpenseCategory } from 'hayahub-domain';
import type { ExpenseDTO } from 'hayahub-business';

type TimeView = 'day' | 'month' | 'year' | 'all';
type SortField = 'date' | 'description' | 'amount' | 'category' | 'notes';
type SortDirection = 'asc' | 'desc';

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
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const pageSize = 20;

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

  // Load expenses when component mounts
  useEffect(() => {
    if (user) {
      loadExpenses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadExpenses = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const getExpensesUseCase = Container.getExpensesUseCase();

      // Always load expenses from the last 3 years for year comparison
      // This ensures we have data for any year view and comparison
      const currentYear = new Date().getFullYear();
      const startDate = new Date(currentYear - 2, 0, 1, 0, 0, 0, 0); // Jan 1, 2 years ago
      const endDate = new Date(currentYear, 11, 31, 23, 59, 59, 999); // Dec 31 of current year

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
      // Update existing expense
      const updateExpenseUseCase = Container.updateExpenseUseCase();
      const result = await updateExpenseUseCase.execute(editForm.id, user.id, {
        description: editForm.description,
        amount: editForm.amount,
        currency: 'VND',
        category: editForm.category,
        date: editForm.date,
        tags: editForm.notes ? editForm.notes.split(',').map((t) => t.trim()).filter((t) => t) : [],
      });

      if (result.isSuccess()) {
        await loadExpenses();
        setEditingId(null);
        setEditForm(null);
      }
    } catch (error) {
      console.error('Failed to save expense:', error);
    }
  };

  const handleCancel = () => {
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
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formatDateTime = (date: Date): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
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

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to desc
      setSortField(field);
      setSortDirection(field === 'date' || field === 'amount' ? 'desc' : 'asc');
    }
  };

  // Filter and sort expenses
  const getFilteredAndSortedExpenses = (): ExpenseRow[] => {
    let filtered = expenses;

    // Filter by timeView (day/month/year/all)
    if (timeView === 'day') {
      const dayStart = new Date(selectedDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(selectedDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter((exp) => {
        const expDate = new Date(exp.date);
        return expDate >= dayStart && expDate <= dayEnd;
      });
    } else if (timeView === 'month') {
      const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const monthEnd = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      
      filtered = filtered.filter((exp) => {
        const expDate = new Date(exp.date);
        return expDate >= monthStart && expDate <= monthEnd;
      });
    } else if (timeView === 'year') {
      const yearStart = new Date(selectedDate.getFullYear(), 0, 1);
      const yearEnd = new Date(selectedDate.getFullYear(), 11, 31, 23, 59, 59, 999);
      
      filtered = filtered.filter((exp) => {
        const expDate = new Date(exp.date);
        return expDate >= yearStart && expDate <= yearEnd;
      });
    }
    // For 'all', no time filtering needed

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((expense) => expense.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (expense) =>
          expense.description.toLowerCase().includes(query) ||
          expense.amount.toString().includes(query) ||
          expense.notes.toLowerCase().includes(query) ||
          categoryLabels[expense.category].toLowerCase().includes(query)
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortField) {
        case 'date':
          aValue = a.date.getTime();
          bValue = b.date.getTime();
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'category':
          aValue = categoryLabels[a.category].toLowerCase();
          bValue = categoryLabels[b.category].toLowerCase();
          break;
        case 'notes':
          aValue = a.notes.toLowerCase();
          bValue = b.notes.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  // Calculate category summaries (based on timeView filter)
  const getCategorySummaries = (): CategorySummary[] => {
    const summaries = new Map<ExpenseCategory, { total: number; count: number }>();

    // Get expenses filtered by timeView
    let filteredByTime = expenses;

    if (timeView === 'day') {
      const dayStart = new Date(selectedDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(selectedDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      filteredByTime = expenses.filter((exp) => {
        const expDate = new Date(exp.date);
        return expDate >= dayStart && expDate <= dayEnd;
      });
    } else if (timeView === 'month') {
      const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const monthEnd = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      
      filteredByTime = expenses.filter((exp) => {
        const expDate = new Date(exp.date);
        return expDate >= monthStart && expDate <= monthEnd;
      });
    } else if (timeView === 'year') {
      const yearStart = new Date(selectedDate.getFullYear(), 0, 1);
      const yearEnd = new Date(selectedDate.getFullYear(), 11, 31, 23, 59, 59, 999);
      
      filteredByTime = expenses.filter((exp) => {
        const expDate = new Date(exp.date);
        return expDate >= yearStart && expDate <= yearEnd;
      });
    }

    filteredByTime.forEach((expense) => {
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
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
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
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
  };

  const categorySummaries = getCategorySummaries();
  const filteredExpenses = getFilteredAndSortedExpenses();
  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate YEAR total (for Total Amount Card) - based on selected year
  const selectedYear = selectedDate.getFullYear();
  const yearStartDate = new Date(selectedYear, 0, 1, 0, 0, 0, 0);
  const yearEndDate = new Date(selectedYear, 11, 31, 23, 59, 59, 999);
  
  const selectedYearExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    return expDate >= yearStartDate && expDate <= yearEndDate;
  });
  
  const yearTotalAmount = selectedYearExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate year-to-date comparison (compare with same period last year)
  const calculateYearComparison = (): { 
    percentage: number; 
    isIncrease: boolean; 
    prevYearAmount: number 
  } => {
    const now = new Date();
    const currentYear = new Date().getFullYear();
    
    // If viewing current year, compare year-to-date; otherwise compare full years
    const isCurrentYear = selectedYear === currentYear;
    
    let currentYearAmount: number;
    let comparisonEndDate: Date;
    
    if (isCurrentYear) {
      // Compare year-to-date (Jan 1 to today)
      const currentDayOfYear = Math.floor((now.getTime() - yearStartDate.getTime()) / (1000 * 60 * 60 * 24));
      comparisonEndDate = new Date(selectedYear - 1, 0, 1 + currentDayOfYear, 23, 59, 59, 999);
      
      const currentYearToDate = expenses.filter((exp) => {
        const expDate = new Date(exp.date);
        return expDate >= yearStartDate && expDate <= now;
      });
      currentYearAmount = currentYearToDate.reduce((sum, e) => sum + e.amount, 0);
    } else {
      // Compare full years
      comparisonEndDate = new Date(selectedYear - 1, 11, 31, 23, 59, 59, 999);
      currentYearAmount = yearTotalAmount;
    }
    
    // Get previous year amount
    const prevYearStart = new Date(selectedYear - 1, 0, 1, 0, 0, 0, 0);
    const prevYearExpenses = expenses.filter((exp) => {
      const expDate = new Date(exp.date);
      return expDate >= prevYearStart && expDate <= comparisonEndDate;
    });
    
    const prevYearAmount = prevYearExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    if (prevYearAmount === 0) {
      return { 
        percentage: currentYearAmount > 0 ? 100 : 0, 
        isIncrease: currentYearAmount > 0,
        prevYearAmount 
      };
    }

    const change = ((currentYearAmount - prevYearAmount) / prevYearAmount) * 100;
    return { 
      percentage: Math.abs(change), 
      isIncrease: change > 0,
      prevYearAmount 
    };
  };

  const { percentage: yearPercentage, isIncrease: yearIsIncrease, prevYearAmount } = calculateYearComparison();

  // Calculate average per transaction (for filtered view)
  // const averagePerTransaction = filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0;

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / pageSize);
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, timeView, sortField, sortDirection]);

  // Sort indicator component
  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4 text-gray-900 dark:text-white" />
    ) : (
      <ArrowDown className="w-4 h-4 text-gray-900 dark:text-white" />
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chart Card with Add Button */}
          <SpendingChartCard
            expenses={expenses}
            timeView={timeView}
            selectedDate={selectedDate}
            onAddClick={handleAdd}
            isEditingDisabled={editingId !== null}
          />

          {/* Total Amount Card - Enhanced - YEARLY TOTAL ONLY */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tổng chi tiêu - Năm {selectedYear}
                </h3>
              </div>
              {/* Percentage change badge - Year comparison */}
              {yearPercentage > 0 && (
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  yearIsIncrease 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                    : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                }`}>
                  {yearIsIncrease ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {yearPercentage.toFixed(1)}%
                </div>
              )}
            </div>
            
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCurrency(yearTotalAmount)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {selectedYearExpenses.length} giao dịch
            </p>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-800 my-3"></div>

            {/* Average per transaction */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Trung bình/GD</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(selectedYearExpenses.length > 0 ? yearTotalAmount / selectedYearExpenses.length : 0)}
              </span>
            </div>

            {/* Comparison with same period last year */}
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Cùng kỳ năm {selectedYear - 1}
                </span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {formatCurrency(prevYearAmount)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {yearIsIncrease ? 'Tăng' : 'Giảm'} {yearPercentage.toFixed(1)}% so với cùng kỳ năm trước
              </p>
            </div>
          </div>

          {/* Top Category Card - Enhanced */}
          {categorySummaries[0] && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Chi nhiều nhất
                </h3>
              </div>
              
              <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {categoryLabels[categorySummaries[0].category]}
              </p>
              <p className="text-xl font-semibold text-amber-600 dark:text-amber-400 mb-3">
                {formatCurrency(categorySummaries[0].total)}
              </p>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-800 my-3"></div>

              {/* Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Số giao dịch</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {categorySummaries[0].count}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">% tổng chi tiêu</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {((categorySummaries[0].total / totalAmount) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">TB/giao dịch</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(categorySummaries[0].total / categorySummaries[0].count)}
                  </span>
                </div>
              </div>

              {/* Progress bar
              <div className="mt-3">
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 dark:bg-amber-600 rounded-full transition-all"
                    style={{ width: `${Math.min((categorySummaries[0].total / totalAmount) * 100, 100)}%` }}
                  ></div>
                </div>
              </div> */}
            </div>
          )}
        </div>

        {/* Filters Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Time View Tabs */}
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

            {/* Time Navigation */}
            {timeView !== 'all' && (
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <button
                  onClick={() => navigatePeriod('prev')}
                  className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-3" />
                </button>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white min-w-[120px] justify-center">
                  <Calendar className="w-4 h-3" />
                  {getTimePeriodLabel()}
                </div>
                <button
                  onClick={() => navigatePeriod('next')}
                  className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-3" />
                </button>
              </div>
            )}

            <div className="flex-1" />

            {/* Clear Filters */}
            {(selectedCategory || searchQuery) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        {categorySummaries.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categorySummaries.slice(0, 6).map((summary) => {
              const isSelected = selectedCategory === summary.category;
              return (
                <button
                  key={summary.category}
                  onClick={() => handleCategoryClick(summary.category)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 ring-2 ring-gray-900 dark:ring-gray-100'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {categoryLabels[summary.category]}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      isSelected
                        ? 'bg-white/20 dark:bg-gray-900/20'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    {formatCurrency(summary.total)}
                  </span>
                </button>
              );
            })}
            {categorySummaries.length > 6 && (
              <div className="relative">
                <button 
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Filter className="w-4 h-4" />+{categorySummaries.length - 6} khác
                </button>
                
                {/* Dropdown with remaining categories */}
                {showAllCategories && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-2 z-10">
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {categorySummaries.slice(6).map((summary) => {
                        const isSelected = selectedCategory === summary.category;
                        return (
                          <button
                            key={summary.category}
                            onClick={() => {
                              handleCategoryClick(summary.category);
                              setShowAllCategories(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                              isSelected
                                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <span className="font-medium">{categoryLabels[summary.category]}</span>
                            <span className={`text-xs ${
                              isSelected ? 'text-white/80 dark:text-gray-900/80' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {formatCurrency(summary.total)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Overlay to close dropdown */}
        {showAllCategories && (
          <div 
            className="fixed inset-0 z-[5]" 
            onClick={() => setShowAllCategories(false)}
          ></div>
        )}

        {/* Search and Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo nội dung, số tiền, ghi chú, danh mục..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent"
              />
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Tìm thấy {filteredExpenses.length} kết quả
              </p>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-[150px]" />
                <col className="w-[140px]" />
                <col className="w-[250px]" />
                <col className="w-[150px]" />
                <col className="w-[200px]" />
                <col className="w-[120px]" />
              </colgroup>
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th
                    onClick={() => handleSort('date')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Ngày giờ
                      <SortIndicator field="date" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('category')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Danh mục
                      <SortIndicator field="category" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('description')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Nội dung
                      <SortIndicator field="description" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('amount')}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-end gap-2">
                      Số tiền
                      <SortIndicator field="amount" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('notes')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Ghi chú
                      <SortIndicator field="notes" />
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
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-100 rounded-full animate-spin" />
                        Đang tải...
                      </div>
                    </td>
                  </tr>
                ) : filteredExpenses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      {searchQuery
                        ? `Không tìm thấy kết quả nào cho "${searchQuery}".`
                        : selectedCategory
                        ? `Không có chi tiêu nào trong danh mục "${categoryLabels[selectedCategory]}".`
                        : 'Chưa có chi tiêu nào. Nhấn "Thêm chi tiêu" để bắt đầu.'}
                    </td>
                  </tr>
                ) : (
                  paginatedExpenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      {editingId === expense.id && editForm ? (
                        <>
                          <td className="px-6 py-4">
                            <input
                              type="datetime-local"
                              value={formatDateTime(editForm.date)}
                              onChange={(e) =>
                                setEditForm({ ...editForm, date: new Date(e.target.value) })
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={editForm.category}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  category: e.target.value as ExpenseCategory,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
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
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
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
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm text-right focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
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
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={handleSave}
                                className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                title="Lưu"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancel}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
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
                            className="px-6 py-4 text-sm text-gray-900 dark:text-white text-right cursor-pointer font-semibold"
                            onClick={() => handleCellClick(expense)}
                          >
                            {formatCurrency(expense.amount)}
                          </td>
                          <td
                            className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 cursor-pointer"
                            onClick={() => handleCellClick(expense)}
                          >
                            {expense.notes || '-'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(expense)}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Sửa"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(expense.id)}
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Hiển thị {(currentPage - 1) * pageSize + 1} -{' '}
                  {Math.min(currentPage * pageSize, filteredExpenses.length)} trong tổng số{' '}
                  {filteredExpenses.length} giao dịch
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Trước
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        return (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        );
                      })
                      .map((page, index, array) => {
                        const prevPage = array[index - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;

                        return (
                          <div key={page} className="flex items-center gap-1">
                            {showEllipsis && (
                              <span className="px-2 text-gray-500 dark:text-gray-400">
                                ...
                              </span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === page
                                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                                  : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              {page}
                            </button>
                          </div>
                        );
                      })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Tiếp
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
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
