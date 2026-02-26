'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/layout/PageLoader';
import { LoginPromptModal } from '@/components/ui/LoginPromptModal';
import { useAuth } from '@/contexts/AuthContext';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { EventModal } from '@/components/calendar/EventModal';
import { MonthView } from '@/components/calendar/MonthView';
import { WeekView } from '@/components/calendar/WeekView';
import { YearView } from '@/components/calendar/YearView';
import { Plus, Calendar as CalendarIcon, Clock, CalendarDays } from 'lucide-react';
import type { CalendarEventDTO, CreateCalendarEventDTO } from 'hayahub-business';
import { Button } from '@/components/ui/Button';

type ViewMode = 'month' | 'week' | 'year';

export default function CalendarPage() {
  const { user } = useAuth();
  const {
    events,
    loading: isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useCalendarEvents();
  
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEventDTO | null>(null);
  const [quickAddDate, setQuickAddDate] = useState<Date | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Show login prompt if not authenticated
  useEffect(() => {
    if (!user) {
      setShowLoginPrompt(true);
    }
  }, [user]);

  const handleAdd = () => {
    setEditingEvent(null);
    setQuickAddDate(null);
    setIsModalOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setEditingEvent(null);
    setQuickAddDate(date);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEventDTO) => {
    setEditingEvent(event);
    setQuickAddDate(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) return;

    try {
      await deleteEvent(id);
    } catch (err) {
      alert('Lỗi khi xóa sự kiện: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleSave = async (data: Omit<CreateCalendarEventDTO, 'userId'> | Partial<CalendarEventDTO>) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, data);
      } else {
        // Pre-fill with quick add date if available
        const eventData: Omit<CreateCalendarEventDTO, 'userId'> = quickAddDate
          ? {
              ...(data as Omit<CreateCalendarEventDTO, 'userId'>),
              startDate: data.startDate || quickAddDate,
              endDate: data.endDate || new Date(quickAddDate.getTime() + 60 * 60 * 1000),
            }
          : (data as Omit<CreateCalendarEventDTO, 'userId'>);
        await createEvent(eventData);
      }
      setIsModalOpen(false);
      setEditingEvent(null);
      setQuickAddDate(null);
    } catch (error) {
      alert('Lỗi: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setQuickAddDate(null);
  };

  const handleMonthClick = (month: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
    setViewMode('month');
  };

  // Stats for sidebar
  const todayEvents = events.filter((e) => {
    const today = new Date();
    const eventDate = new Date(e.startDate);
    return eventDate.toDateString() === today.toDateString();
  });

  const upcomingEvents = events
    .filter((e) => new Date(e.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  return (
    <PageLoader>
      <DashboardLayout>
        <div className="flex gap-6 h-[calc(100vh-120px)]">
          {/* Sidebar */}
          <div className="w-80 space-y-4 overflow-y-auto">
            {/* Quick Add Button */}
            <Button
              onClick={handleAdd}
              variant="primary"
              fullWidth
              size="lg"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Tạo sự kiện</span>
            </Button>

            {/* Mini Calendar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Tháng {currentDate.getMonth() + 1}/{currentDate.getFullYear()}
                </h3>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                  <div key={day} className="text-gray-500 dark:text-gray-500 font-semibold py-1">
                    {day}
                  </div>
                ))}
                {(() => {
                  const year = currentDate.getFullYear();
                  const month = currentDate.getMonth();
                  const firstDay = new Date(year, month, 1);
                  const lastDay = new Date(year, month + 1, 0);
                  const daysInMonth = lastDay.getDate();
                  const startingDay = firstDay.getDay();
                  const days = [];

                  // Empty cells
                  for (let i = 0; i < startingDay; i++) {
                    days.push(<div key={`empty-${i}`} className="py-1" />);
                  }

                  // Days
                  for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(year, month, day);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const hasEvents = events.some(
                      (e) => new Date(e.startDate).toDateString() === date.toDateString()
                    );

                    days.push(
                      <div
                        key={day}
                        className={`py-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded ${
                          isToday
                            ? 'bg-blue-600 text-white font-bold'
                            : hasEvents
                            ? 'font-bold text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                        onClick={() => handleDateClick(date)}
                      >
                        {day}
                      </div>
                    );
                  }

                  return days;
                })()}
              </div>
            </div>

            {/* Today's Events */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="w-4 h-4 text-blue-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Hôm nay</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({todayEvents.length})
                </span>
              </div>
              {todayEvents.length > 0 ? (
                <div className="space-y-2">
                  {todayEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
                    >
                      <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {event.title}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {event.isAllDay
                          ? 'Cả ngày'
                          : new Date(event.startDate).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Không có sự kiện</p>
              )}
            </div>

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-orange-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Sắp tới</h3>
              </div>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-2">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {event.title}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(event.startDate).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Không có sự kiện</p>
              )}
            </div>
          </div>

          {/* Main Calendar Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* View Mode Selector */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Lịch của tôi
              </h1>
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('month')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    viewMode === 'month'
                      ? 'bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-gray-100'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  Tháng
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    viewMode === 'week'
                      ? 'bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-gray-100'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" />
                  Tuần
                </button>
                <button
                  onClick={() => setViewMode('year')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    viewMode === 'year'
                      ? 'bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-gray-100'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  Năm
                </button>
              </div>
            </div>

            {/* Calendar Content */}
            <div className="flex-1 overflow-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-800 border-t-gray-900 dark:border-t-gray-100 rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
                  <p className="text-red-600 dark:text-red-400">Có lỗi xảy ra: {error}</p>
                </div>
              ) : viewMode === 'month' ? (
                <MonthView
                  events={events}
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
                  onEventClick={handleEventClick}
                  onDateClick={handleDateClick}
                />
              ) : viewMode === 'week' ? (
                <WeekView
                  events={events}
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
                  onEventClick={handleEventClick}
                  onDateClick={handleDateClick}
                />
              ) : (
                <YearView
                  events={events}
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
                  onMonthClick={handleMonthClick}
                />
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        <EventModal
          isOpen={isModalOpen}
          editingEvent={editingEvent}
          onClose={handleCloseModal}
          onSave={handleSave}
          onDelete={handleDelete}
          quickAddDate={quickAddDate}
        />

        {/* Login Prompt Modal */}
        <LoginPromptModal
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
          message="Bạn cần đăng nhập để quản lý lịch của mình"
        />
      </DashboardLayout>
    </PageLoader>
  );
}
