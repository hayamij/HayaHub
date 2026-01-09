'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';
import { ExpenseCategory } from 'hayahub-domain';
import { Container } from '@/infrastructure/di/Container';
import type {
  CreateExpenseDTO,
  ExpensePresetDTO,
  CreateExpensePresetDTO,
  UpdateExpensePresetDTO,
} from 'hayahub-business';
import { useToast } from '@/contexts/ToastContext';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
}

const CATEGORIES = [
  { value: ExpenseCategory.FOOD, label: 'Ăn uống' },
  { value: ExpenseCategory.TRANSPORT, label: 'Di chuyển' },
  { value: ExpenseCategory.SHOPPING, label: 'Mua sắm' },
  { value: ExpenseCategory.ENTERTAINMENT, label: 'Giải trí' },
  { value: ExpenseCategory.UTILITIES, label: 'Tiện ích' },
  { value: ExpenseCategory.HEALTHCARE, label: 'Y tế' },
  { value: ExpenseCategory.EDUCATION, label: 'Giáo dục' },
  { value: ExpenseCategory.HOUSING, label: 'Nhà ở' },
  { value: ExpenseCategory.INSURANCE, label: 'Bảo hiểm' },
  { value: ExpenseCategory.SAVINGS, label: 'Tiết kiệm' },
  { value: ExpenseCategory.BILLS, label: 'Hóa đơn' },
  { value: ExpenseCategory.TRAVEL, label: 'Du lịch' },
  { value: ExpenseCategory.OTHER, label: 'Khác' },
];

export function AddExpenseModal({ isOpen, onClose, userId, onSuccess }: AddExpenseModalProps) {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Selected presets (each will be a separate expense)
  const [selectedPresets, setSelectedPresets] = useState<ExpensePresetDTO[]>([]);

  // Preset states
  const [presets, setPresets] = useState<ExpensePresetDTO[]>([]);
  const [filteredPresets, setFilteredPresets] = useState<ExpensePresetDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPresetForm, setShowPresetForm] = useState(false);
  const [editingPreset, setEditingPreset] = useState<ExpensePresetDTO | null>(null);
  const [presetFormData, setPresetFormData] = useState({
    name: '',
    amount: '',
    notes: '',
  });

  // Get current date in Vietnam timezone (UTC+7)
  const getVietnamDate = () => {
    const now = new Date();
    const vietnamTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    const year = vietnamTime.getFullYear();
    const month = String(vietnamTime.getMonth() + 1).padStart(2, '0');
    const day = String(vietnamTime.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '' as ExpenseCategory | '',
    date: getVietnamDate(),
    notes: '',
  });

  // Load presets when modal opens
  useEffect(() => {
    if (isOpen) {
      loadPresets();
      // Reset form when modal opens
      setFormData({
        description: '',
        amount: '',
        category: '',
        date: getVietnamDate(),
        notes: '',
      });
      setSelectedPresets([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId]);

  useEffect(() => {
    filterPresetsByCategory(formData.category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.category, presets, searchQuery]);

  const loadPresets = async () => {
    try {
      const container = Container.getInstance();
      const getPresetsUseCase = container.getExpensePresetsUseCase;
      const result = await getPresetsUseCase.execute(userId);

      if (result.isSuccess()) {
        setPresets(result.value);
      }
    } catch (err) {
      console.error('Failed to load presets', err);
    }
  };

  const filterPresetsByCategory = (category: ExpenseCategory | '') => {
    let filtered = presets;

    // Filter by category
    if (category) {
      filtered = filtered.filter((preset) => preset.category === category);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (preset) =>
          preset.name.toLowerCase().includes(query) ||
          preset.amount.toString().includes(query) ||
          preset.notes.toLowerCase().includes(query)
      );
    }

    setFilteredPresets(filtered);
  };

  // Add preset to selection (each click adds another instance)
  const addPresetToSelection = (preset: ExpensePresetDTO) => {
    setSelectedPresets([...selectedPresets, preset]);
  };

  // Remove specific instance of preset
  const removePresetFromSelection = (index: number) => {
    setSelectedPresets(selectedPresets.filter((_, i) => i !== index));
  };

  const clearSelection = () => {
    setSelectedPresets([]);
  };

  const getSelectionTotal = () => {
    return selectedPresets.reduce((sum, preset) => sum + preset.amount, 0);
  };

  if (!isOpen) return null;

  const handleCategoryChange = (newCategory: ExpenseCategory | '') => {
    setFormData({ ...formData, category: newCategory });
  };

  // Submit all selected presets + manual entry as separate expenses
  const handleSubmitAll = async () => {
    if (selectedPresets.length === 0 && !formData.description && !formData.amount) {
      showError('Vui lòng chọn preset hoặc nhập thủ công');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const container = Container.getInstance();
      const createExpenseUseCase = container.createExpenseUseCase;

      const allExpenses: CreateExpenseDTO[] = [];

      // Add each selected preset as separate expense
      for (const preset of selectedPresets) {
        allExpenses.push({
          userId,
          description: preset.name,
          amount: preset.amount,
          currency: 'VND',
          category: preset.category,
          date: new Date(formData.date),
          tags: preset.notes ? [preset.notes] : [],
        });
      }

      // Add manual entry if filled
      if (formData.description && formData.amount && formData.category) {
        allExpenses.push({
          userId,
          description: formData.description,
          amount: parseFloat(formData.amount),
          currency: 'VND',
          category: formData.category as ExpenseCategory,
          date: new Date(formData.date),
          tags: formData.notes ? [formData.notes] : [],
        });
      }

      // Create all expenses
      let successCount = 0;
      for (const dto of allExpenses) {
        const result = await createExpenseUseCase.execute(dto);
        if (result.isSuccess()) {
          successCount++;
        }
      }

      if (successCount > 0) {
        showSuccess(`Đã thêm ${successCount} chi tiêu thành công!`);
        setFormData({
          description: '',
          amount: '',
          category: '',
          date: getVietnamDate(),
          notes: '',
        });
        clearSelection();
        onClose();
        onSuccess();
      } else {
        showError('Không thể thêm chi tiêu');
      }
    } catch (err) {
      const errorMessage = 'Có lỗi xảy ra khi thêm chi tiêu';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || !formData.amount || !formData.category) {
      showError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const container = Container.getInstance();
      const createExpenseUseCase = container.createExpenseUseCase;

      const dto: CreateExpenseDTO = {
        userId,
        description: formData.description,
        amount: parseFloat(formData.amount),
        currency: 'VND',
        category: formData.category as ExpenseCategory,
        date: new Date(formData.date),
        tags: formData.notes ? [formData.notes] : [],
      };

      const result = await createExpenseUseCase.execute(dto);

      if (result.isSuccess()) {
        showSuccess('Đã thêm chi tiêu thành công!');
        setFormData({
          description: '',
          amount: '',
          category: '',
          date: getVietnamDate(),
          notes: '',
        });
        onClose();
        onSuccess();
      } else {
        setError(result.error.message);
        showError(`Thất bại: ${result.error.message}`);
      }
    } catch (err) {
      const errorMessage = 'Có lỗi xảy ra khi thêm chi tiêu';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePreset = async () => {
    const category = formData.category || ExpenseCategory.OTHER;

    try {
      const container = Container.getInstance();
      const createPresetUseCase = container.createExpensePresetUseCase;

      const dto: CreateExpensePresetDTO = {
        userId,
        name: presetFormData.name,
        amount: parseFloat(presetFormData.amount),
        currency: 'VND',
        category: category as ExpenseCategory,
        notes: presetFormData.notes,
      };

      const result = await createPresetUseCase.execute(dto);

      if (result.isSuccess()) {
        showSuccess('Đã thêm preset thành công!');
        setPresetFormData({ name: '', amount: '', notes: '' });
        setShowPresetForm(false);
        loadPresets();
      } else {
        showError(`Thất bại: ${result.error.message}`);
      }
    } catch (err) {
      showError('Có lỗi xảy ra khi thêm preset');
    }
  };

  const handleUpdatePreset = async () => {
    if (!editingPreset) return;

    const category = formData.category || editingPreset.category;

    try {
      const container = Container.getInstance();
      const updatePresetUseCase = container.updateExpensePresetUseCase;

      const dto: UpdateExpensePresetDTO = {
        id: editingPreset.id,
        name: presetFormData.name,
        amount: parseFloat(presetFormData.amount),
        currency: 'VND',
        category: category as ExpenseCategory,
        notes: presetFormData.notes,
      };

      const result = await updatePresetUseCase.execute(dto);

      if (result.isSuccess()) {
        showSuccess('Đã cập nhật preset thành công!');
        setPresetFormData({ name: '', amount: '', notes: '' });
        setEditingPreset(null);
        setShowPresetForm(false);
        loadPresets();
      } else {
        showError(`Thất bại: ${result.error.message}`);
      }
    } catch (err) {
      showError('Có lỗi xảy ra khi cập nhật preset');
    }
  };

  const handleDeletePreset = async (presetId: string) => {
    if (!confirm('Bạn có chắc muốn xóa preset này?')) return;

    try {
      const container = Container.getInstance();
      const deletePresetUseCase = container.deleteExpensePresetUseCase;

      const result = await deletePresetUseCase.execute(presetId);

      if (result.isSuccess()) {
        showSuccess('Đã xóa preset thành công!');
        loadPresets();
      } else {
        showError(`Thất bại: ${result.error.message}`);
      }
    } catch (err) {
      showError('Có lỗi xảy ra khi xóa preset');
    }
  };

  const startEditPreset = (preset: ExpensePresetDTO) => {
    setEditingPreset(preset);
    setPresetFormData({
      name: preset.name,
      amount: preset.amount.toString(),
      notes: preset.notes,
    });
    setShowPresetForm(true);
  };

  const cancelPresetForm = () => {
    setShowPresetForm(false);
    setEditingPreset(null);
    setPresetFormData({ name: '', amount: '', notes: '' });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Thêm chi tiêu</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Nhập thông tin hoặc chọn từ preset
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: Main Form */}
          <div className="w-[35%] border-r border-gray-200 dark:border-gray-800 flex flex-col">
            <form onSubmit={handleSubmitManual} className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="mb-4 bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mô tả
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                    placeholder="Ví dụ: Ăn trưa"
                    required
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số tiền (VND)
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                    placeholder="50000"
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Danh mục
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value as ExpenseCategory | '')}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ngày
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 resize-none"
                    placeholder="Thêm ghi chú..."
                    rows={3}
                  />
                </div>

                {/* Selected Presets Summary */}
                {selectedPresets.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Đã chọn {selectedPresets.length} preset
                      </span>
                      <button
                        type="button"
                        onClick={clearSelection}
                        className="text-xs text-red-600 dark:text-red-400 hover:underline"
                      >
                        Xóa tất cả
                      </button>
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      Tổng: {getSelectionTotal().toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                )}
              </div>
            </form>

            {/* Action Buttons - Fixed at bottom */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
                {selectedPresets.length > 0 ? (
                  <button
                    type="button"
                    onClick={handleSubmitAll}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? 'Đang lưu...'
                      : `Thêm ${selectedPresets.length + (formData.description ? 1 : 0)} chi tiêu`}
                  </button>
                ) : (
                  <button
                    type="submit"
                    onClick={handleSubmitManual}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Đang lưu...' : 'Thêm chi tiêu'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Preset Library */}
          <div className="w-[65%] flex flex-col bg-gray-50 dark:bg-gray-950">
            {/* Preset Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Thư viện Preset</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.category
                      ? `Hiển thị: ${CATEGORIES.find((c) => c.value === formData.category)?.label}`
                      : 'Hiển thị: Tất cả'}
                  </p>
                </div>
                <button
                  onClick={() => setShowPresetForm(!showPresetForm)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Tạo preset
                </button>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm preset..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
              />
            </div>

            {/* Preset Form */}
            {showPresetForm && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  {editingPreset ? 'Sửa preset' : 'Preset mới'}
                </h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Tên preset (vd: Bánh mì)"
                    value={presetFormData.name}
                    onChange={(e) => setPresetFormData({ ...presetFormData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Số tiền (VND)"
                    value={presetFormData.amount}
                    onChange={(e) =>
                      setPresetFormData({ ...presetFormData, amount: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white"
                    min="0"
                    step="1000"
                  />
                  <textarea
                    placeholder="Ghi chú (tùy chọn)"
                    value={presetFormData.notes}
                    onChange={(e) => setPresetFormData({ ...presetFormData, notes: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-white resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={cancelPresetForm}
                      className="flex-1 px-3 py-2 text-sm bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 font-medium"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={editingPreset ? handleUpdatePreset : handleCreatePreset}
                      className="flex-1 px-3 py-2 text-sm bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:opacity-90 font-medium"
                    >
                      {editingPreset ? 'Cập nhật' : 'Lưu preset'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preset Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredPresets.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 mb-2">Chưa có preset nào</p>
                  <button
                    onClick={() => setShowPresetForm(true)}
                    className="text-sm text-gray-900 dark:text-gray-100 underline hover:no-underline"
                  >
                    Tạo preset đầu tiên
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {filteredPresets.map((preset) => (
                    <div key={preset.id} className="relative">
                      <div
                        onClick={() => addPresetToSelection(preset)}
                        className="group bg-white dark:bg-gray-900 rounded-lg p-4 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-100 transition-all cursor-pointer h-[125px] flex flex-col"
                      >                       
                        <div className="font-semibold text-base text-gray-900 dark:text-white mb-2 line-clamp-1">
                          {preset.name}
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                          {preset.amount.toLocaleString('vi-VN')} đ
                        </div>
                        {preset.notes && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                            {preset.notes}
                          </div>
                        )}
                      </div>

                      {/* Action buttons - Always visible */}
                      <div className="absolute top-2 right-2 flex gap-1.5">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditPreset(preset);
                          }}
                          className="p-2 bg-white dark:bg-gray-800 rounded shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          title="Sửa"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePreset(preset.id);
                          }}
                          className="p-2 bg-white dark:bg-gray-800 rounded shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Presets List */}
              {selectedPresets.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Đã chọn ({selectedPresets.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedPresets.map((preset, index) => (
                      <div
                        key={`${preset.id}-${index}`}
                        className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-lg p-2 border border-gray-200 dark:border-gray-800"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {preset.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {preset.amount.toLocaleString('vi-VN')} đ
                          </div>
                        </div>
                        <button
                          onClick={() => removePresetFromSelection(index)}
                          className="ml-2 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
