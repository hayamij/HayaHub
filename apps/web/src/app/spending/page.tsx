'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AddExpenseModal } from '@/components/dashboard/AddExpenseModal';
import { SpendingChartCard } from '@/components/spending/SpendingChartCard';
import { TimeViewSelector } from '@/components/spending/TimeViewSelector';
import { CategoryFilter } from '@/components/spending/CategoryFilter';
import { SearchBar } from '@/components/spending/SearchBar';
import { TotalAmountCard } from '@/components/spending/TotalAmountCard';
import { TopCategoryCard } from '@/components/spending/TopCategoryCard';
import { DayViewTable } from '@/components/spending/DayViewTable';
import { AllViewTable } from '@/components/spending/AllViewTable';
import { AggregatedPeriodTable } from '@/components/spending/AggregatedPeriodTable';
import { Pagination } from '@/components/spending/Pagination';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import { ExpenseCategory } from 'hayahub-domain';
import { useExpenseFilters } from '@/hooks/useExpenseFilters';
import { useExpenseSort } from '@/hooks/useExpenseSort';
import { useExpensePagination } from '@/hooks/useExpensePagination';
import { useExpenseData, type ExpenseRow } from '@/hooks/useExpenseData';
import { useExpenseAggregation } from '@/hooks/useExpenseAggregation';
import { useExpenseStats } from '@/hooks/useExpenseStats';
import type { AggregatedPeriod } from '@/lib/expense-aggregation';


// Category labels in Vietnamese
const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
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

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const getTimePeriodLabel = (timeView: 'day' | 'month' | 'year' | 'all', selectedDate: Date): string => {
  const labels = {
    day: `${String(selectedDate.getDate()).padStart(2, '0')}/${String(selectedDate.getMonth() + 1).padStart(2, '0')}/${selectedDate.getFullYear()}`,
    month: `Tháng ${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`,
    year: `Năm ${selectedDate.getFullYear()}`,
    all: 'Tất cả',
  };
  return labels[timeView];
};

export default function SpendingPage() {
  const { user } = useAuth();
  
  // State management using custom hooks
  const filters = useExpenseFilters();
  const sort = useExpenseSort();
  const { expenses, isLoading, loadExpenses, updateExpense, deleteExpense } = useExpenseData(user?.id);
  
  // Aggregation and filtering
  const {
    filteredExpenses,
    sortedExpenses,
    sortedAggregatedData,
    updatePeriodNotes,
    removePeriodNotes,
  } = useExpenseAggregation({
    expenses,
    timeView: filters.timeView,
    selectedDate: filters.selectedDate,
    selectedCategory: filters.selectedCategory,
    searchQuery: filters.searchQuery,
    sortField: sort.sortField,
    sortDirection: sort.sortDirection,
    sortFieldMonth: sort.sortFieldMonth,
    sortDirectionMonth: sort.sortDirectionMonth,
    sortFieldYear: sort.sortFieldYear,
    sortDirectionYear: sort.sortDirectionYear,
    categoryLabels: CATEGORY_LABELS,
  });
  
  // Statistics
  const { categorySummaries, displayTotalAmount, displayTransactionCount, yearComparison } = useExpenseStats(
    expenses,
    filters.timeView,
    filters.selectedDate
  );
  
  // Local state for editing and modal
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ExpenseRow | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Determine items to display based on view
  const itemsToDisplay: (ExpenseRow | AggregatedPeriod)[] = (filters.timeView === 'month' || filters.timeView === 'year') 
    ? sortedAggregatedData 
    : sortedExpenses;
  
  // Pagination
  const pagination = useExpensePagination(itemsToDisplay.length, 20);
  const paginatedItems = pagination.getPaginatedSlice<ExpenseRow | AggregatedPeriod>(itemsToDisplay);
  
  // Load expenses on mount
  useEffect(() => {
    if (user) loadExpenses();
  }, [user, loadExpenses]);
  
  // Handlers - Memoized for optimal performance
  const handleAdd = useCallback(() => setIsAddModalOpen(true), []);
  const handleAddSuccess = useCallback(() => loadExpenses(), [loadExpenses]);
  
  const handleEdit = useCallback((expense: ExpenseRow) => {
    setEditingId(expense.id);
    setEditForm({ ...expense });
  }, []);
  
  const handleSave = useCallback(async () => {
    if (!editForm || !user) return;
    
    const success = await updateExpense(editForm.id, {
      description: editForm.description,
      amount: editForm.amount,
      currency: 'VND',
      category: editForm.category,
      date: editForm.date,
      tags: editForm.notes ? editForm.notes.split(',').map(t => t.trim()).filter(Boolean) : [],
    });
    
    if (success) {
      setEditingId(null);
      setEditForm(null);
    }
  }, [editForm, user, updateExpense]);
  
  const handleCancel = useCallback(() => {
    setEditingId(null);
    setEditForm(null);
  }, []);
  
  const handleDelete = useCallback(async (id: string) => {
    if (!user || !confirm('Bạn có chắc muốn xóa chi tiêu này?')) return;
    await deleteExpense(id);
  }, [user, deleteExpense]);
  
  const handleEditPeriod = useCallback((period: AggregatedPeriod) => {
    setEditingId(period.id);
    setEditForm({
      id: period.id,
      date: period.periodDate,
      description: '',
      amount: period.totalAmount,
      category: ExpenseCategory.OTHER,
      notes: period.notes,
    });
  }, []);
  
  const handleSavePeriodNotes = useCallback(() => {
    if (!editForm) return;
    updatePeriodNotes(editForm.id, editForm.notes);
    setEditingId(null);
    setEditForm(null);
  }, [editForm, updatePeriodNotes]);
  
  const handleDeletePeriod = useCallback(async (period: AggregatedPeriod) => {
    if (!user) return;
    
    const periodName = filters.timeView === 'month' 
      ? `ngày ${period.periodLabel}`
      : period.periodLabel;
    
    if (!confirm(`Bạn có chắc muốn xóa tất cả ${period.transactionCount} giao dịch trong ${periodName}?`)) return;
    
    await Promise.all(period.expenses.map(expense => deleteExpense((expense as ExpenseRow).id)));
    removePeriodNotes(period.id);
  }, [user, filters.timeView, deleteExpense, removePeriodNotes]);
  
  const handlePeriodClick = useCallback((period: AggregatedPeriod) => {
    if (editingId === period.id) return;
    const drillDownMap = { month: 'day' as const, year: 'month' as const };
    const newView = drillDownMap[filters.timeView as keyof typeof drillDownMap];
    if (newView) {
      filters.setTimeView(newView);
      filters.setSelectedDate(new Date(period.periodDate));
    }
  }, [editingId, filters]);
  
  const hasFiltersActive = filters.selectedCategory !== null || filters.searchQuery !== '';


  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header with Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Chart Card with Add Button */}
          <SpendingChartCard
            expenses={expenses}
            timeView={filters.timeView}
            selectedDate={filters.selectedDate}
            onAddClick={handleAdd}
            isEditingDisabled={editingId !== null}
          />

          {/* Total Amount Card */}
          <TotalAmountCard
            totalAmount={displayTotalAmount}
            transactionCount={displayTransactionCount}
            yearPercentage={yearComparison.percentage}
            yearIsIncrease={yearComparison.isIncrease}
            prevYearAmount={yearComparison.prevYearAmount}
            timeView={filters.timeView}
            selectedYear={filters.selectedDate.getFullYear()}
            formatCurrency={formatCurrency}
          />

          {/* Top Category Card */}
          {categorySummaries[0] && (
            <TopCategoryCard
              category={categorySummaries[0].category}
              total={categorySummaries[0].total}
              count={categorySummaries[0].count}
              totalAmount={displayTotalAmount}
              categoryLabel={CATEGORY_LABELS[categorySummaries[0].category]}
              formatCurrency={formatCurrency}
            />
          )}
        </div>


        {/* Filters Bar */}
        <TimeViewSelector
          timeView={filters.timeView}
          selectedDate={filters.selectedDate}
          onTimeViewChange={filters.setTimeView}
          onNavigatePeriod={filters.navigatePeriod}
          periodLabel={getTimePeriodLabel(filters.timeView, filters.selectedDate)}
          hasFiltersActive={hasFiltersActive}
          onClearFilters={filters.clearFilters}
        />

        {/* Category Pills */}
        <CategoryFilter
          categories={categorySummaries}
          selectedCategory={filters.selectedCategory}
          onCategoryClick={filters.toggleCategory}
          categoryLabels={CATEGORY_LABELS}
          formatCurrency={formatCurrency}
        />

        {/* Search and Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Search Bar */}
          <SearchBar
            value={filters.searchQuery}
            onChange={filters.setSearchQuery}
            resultsCount={filteredExpenses.length}
          />

          {/* Table - Horizontal scroll on mobile */}
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">{filters.timeView === 'day' && (
              <DayViewTable
                expenses={paginatedItems as ExpenseRow[]}
                isLoading={isLoading}
                editingId={editingId}
                editForm={editForm}
                sortField={sort.sortField}
                sortDirection={sort.sortDirection}
                categoryLabels={CATEGORY_LABELS}
                formatCurrency={formatCurrency}
                onSort={sort.handleSort}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={handleDelete}
                onEditFormChange={setEditForm}
                searchQuery={filters.searchQuery}
                selectedCategory={filters.selectedCategory}
              />
            )}

            {filters.timeView === 'all' && (
              <AllViewTable
                expenses={paginatedItems as ExpenseRow[]}
                isLoading={isLoading}
                editingId={editingId}
                editForm={editForm}
                sortField={sort.sortField}
                sortDirection={sort.sortDirection}
                categoryLabels={CATEGORY_LABELS}
                formatCurrency={formatCurrency}
                onSort={sort.handleSort}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={handleDelete}
                onEditFormChange={setEditForm}
                searchQuery={filters.searchQuery}
                selectedCategory={filters.selectedCategory}
              />
            )}

            {(filters.timeView === 'month' || filters.timeView === 'year') && (
              <AggregatedPeriodTable
                periods={paginatedItems as AggregatedPeriod[]}
                isLoading={isLoading}
                editingId={editingId}
                editForm={editForm}
                sortField={filters.timeView === 'month' ? sort.sortFieldMonth : sort.sortFieldYear}
                sortDirection={filters.timeView === 'month' ? sort.sortDirectionMonth : sort.sortDirectionYear}
                periodType={filters.timeView}
                categoryLabels={CATEGORY_LABELS}
                formatCurrency={formatCurrency}
                onSort={filters.timeView === 'month' ? sort.handleSortMonth : sort.handleSortYear}
                onPeriodClick={handlePeriodClick}
                onEdit={handleEditPeriod}
                onSave={handleSavePeriodNotes}
                onCancel={handleCancel}
                onDelete={handleDeletePeriod}
                onEditFormChange={setEditForm}
                searchQuery={filters.searchQuery}
                selectedCategory={filters.selectedCategory}
              />
            )}
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.setCurrentPage}
            itemsCount={itemsToDisplay.length}
            pageSize={pagination.pageSize}
            itemLabel={filters.timeView === 'month' || filters.timeView === 'year' ? 'khoảng thời gian' : 'giao dịch'}
          />
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
