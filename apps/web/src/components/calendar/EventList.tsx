'use client';

import type { CalendarEventDTO } from 'hayahub-business';
import { EventPriority } from 'hayahub-domain';
import { Calendar, Edit2, Trash2, MapPin, Clock } from 'lucide-react';

interface EventListProps {
  events: CalendarEventDTO[];
  onEdit: (event: CalendarEventDTO) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_COLORS: Record<EventPriority, string> = {
  [EventPriority.LOW]: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  [EventPriority.MEDIUM]: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  [EventPriority.HIGH]: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const PRIORITY_LABELS: Record<EventPriority, string> = {
  [EventPriority.LOW]: 'Thấp',
  [EventPriority.MEDIUM]: 'Trung bình',
  [EventPriority.HIGH]: 'Cao',
};

export function EventList({ events, onEdit, onDelete }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 dark:text-gray-400">Chưa có sự kiện nào</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Thêm sự kiện đầu tiên để bắt đầu lập kế hoạch
        </p>
      </div>
    );
  }

  const formatDateTime = (date: Date, isAllDay: boolean) => {
    const d = new Date(date);
    if (isAllDay) {
      return d.toLocaleDateString('vi-VN');
    }
    return d.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Title & Priority */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-gray-900 dark:text-white truncate">
                  {event.title}
                </h3>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded ${
                    PRIORITY_COLORS[event.priority]
                  }`}
                >
                  {PRIORITY_LABELS[event.priority]}
                </span>
                {event.isAllDay && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                    Cả ngày
                  </span>
                )}
              </div>

              {/* Description */}
              {event.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {event.description}
                </p>
              )}

              {/* Time */}
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-500 mb-1">
                <Clock className="w-4 h-4" />
                <span>
                  {formatDateTime(event.startDate, event.isAllDay)}
                  {' → '}
                  {formatDateTime(event.endDate, event.isAllDay)}
                </span>
              </div>

              {/* Location */}
              {event.location && (
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-4">
              <button
                onClick={() => onEdit(event)}
                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                title="Chỉnh sửa"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(event.id)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                title="Xóa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
