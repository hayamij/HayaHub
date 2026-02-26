'use client';

import { useState, useEffect } from 'react';
import type { CalendarEventDTO, CreateCalendarEventDTO } from 'hayahub-business';
import { EventPriority } from 'hayahub-domain';
import { X } from 'lucide-react';
import { toLocalDateString, toLocalTimeString } from '@/lib/date-utils';
import { Button } from '@/components/ui/Button';

interface EventModalProps {
  isOpen: boolean;
  editingEvent: CalendarEventDTO | null;
  onClose: () => void;
  onSave: (data: Omit<CreateCalendarEventDTO, 'userId'> | Partial<CalendarEventDTO>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  quickAddDate?: Date | null;
}

const PRIORITY_LABELS: Record<EventPriority, string> = {
  [EventPriority.LOW]: 'Thấp',
  [EventPriority.MEDIUM]: 'Trung bình',
  [EventPriority.HIGH]: 'Cao',
};

export function EventModal({ isOpen, editingEvent, onClose, onSave, onDelete, quickAddDate }: EventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    priority: EventPriority.MEDIUM,
    isAllDay: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingEvent) {
      const startDate = new Date(editingEvent.startDate);
      const endDate = new Date(editingEvent.endDate);
      
      setFormData({
        title: editingEvent.title,
        description: editingEvent.description,
        startDate: toLocalDateString(startDate),
        startTime: toLocalTimeString(startDate),
        endDate: toLocalDateString(endDate),
        endTime: toLocalTimeString(endDate),
        location: editingEvent.location || '',
        priority: editingEvent.priority,
        isAllDay: editingEvent.isAllDay,
      });
    } else {
      // Use quickAddDate if available, otherwise default to today
      const now = quickAddDate || new Date();
      
      setFormData({
        title: '',
        description: '',
        startDate: toLocalDateString(now),
        startTime: '09:00',
        endDate: toLocalDateString(now),
        endTime: '10:00',
        location: '',
        priority: EventPriority.MEDIUM,
        isAllDay: false,
      });
    }
  }, [editingEvent, quickAddDate]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const startDate = new Date(`${formData.startDate}T${formData.startTime || '00:00'}`);
      const endDate = new Date(`${formData.endDate}T${formData.endTime || '23:59'}`);

      if (editingEvent) {
        await onSave({
          title: formData.title,
          description: formData.description,
          startDate,
          endDate,
          location: formData.location || undefined,
          priority: formData.priority,
          isAllDay: formData.isAllDay,
        });
      } else {
        await onSave({
          title: formData.title,
          description: formData.description,
          startDate,
          endDate,
          location: formData.location || undefined,
          priority: formData.priority,
          isAllDay: formData.isAllDay,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {editingEvent ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Nhập tiêu đề sự kiện"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Thêm mô tả..."
              rows={3}
            />
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAllDay"
              checked={formData.isAllDay}
              onChange={(e) => setFormData({ ...formData, isAllDay: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="isAllDay" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Cả ngày
            </label>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            {!formData.isAllDay && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Giờ bắt đầu
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            {!formData.isAllDay && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Giờ kết thúc
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Địa điểm
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Thêm địa điểm..."
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Độ ưu tiên
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as EventPriority })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {editingEvent && onDelete && (
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  if (confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
                    onDelete(editingEvent.id);
                    onClose();
                  }
                }}
              >
                Xóa
              </Button>
            )}
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              fullWidth
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              fullWidth
            >
              Lưu
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
