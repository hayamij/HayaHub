'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/layout/PageLoader';
import { LoginPromptModal } from '@/components/ui/LoginPromptModal';
import type { Photo } from 'hayahub-domain';
import { useAuth } from '@/contexts/AuthContext';
import { usePhotos } from '@/hooks/usePhotos';
import { usePhotoActions } from '@/hooks/usePhotoActions';
import { Upload, X, Image as ImageIcon, Loader2, Edit2, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PhotosPage() {
  const { user } = useAuth();
  const { photos, isLoading, refetch } = usePhotos(user?.id);
  const { uploadPhoto, deletePhoto, updatePhotoCaption, isUploading } = usePhotoActions();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPromptMessage, setLoginPromptMessage] = useState('');

  const requireAuth = (action: string): boolean => {
    if (!user) {
      setLoginPromptMessage(`Bạn cần đăng nhập để ${action}`);
      setShowLoginPrompt(true);
      return false;
    }
    return true;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!requireAuth('tải ảnh lên')) return;
    
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const result = await uploadPhoto(file, user.id);
    
    if (result.success) {
      await refetch();
      setError(null);
    } else {
      setError(result.error || 'Upload failed');
    }
    
    e.target.value = ''; // Reset input
  };

  const handleDelete = async (photoId: string) => {
    if (!requireAuth('xóa ảnh')) return;
    if (!confirm('Bạn có chắc chắn muốn xóa ảnh này?')) return;

    const result = await deletePhoto(photoId);
    
    if (result.success) {
      await refetch();
      setSelectedPhoto(null);
    } else {
      setError(result.error || 'Delete failed');
    }
  };

  const handleUpdateCaption = async (photoId: string, caption: string) => {
    if (!requireAuth('chỉnh sửa chú thích')) return;
    
    const result = await updatePhotoCaption(photoId, caption || null);
    
    if (result.success) {
      await refetch();
      // Clear selection to force re-render with updated data
      if (selectedPhoto?.getId() === photoId) {
        setSelectedPhoto(null);
      }
      setEditingCaption(null);
    } else {
      setError(result.error || 'Update caption failed');
    }
  };

  const handleUploadClick = () => {
    if (!requireAuth('tải ảnh lên')) return;
    document.getElementById('file-upload')?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <PageLoader>
      <DashboardLayout>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Bộ sưu tập ảnh
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {photos.length} {photos.length === 1 ? 'ảnh' : 'ảnh'}
              {!user && ' • Đăng nhập để tải ảnh lên'}
            </p>
          </div>
          
          {/* Upload Button */}
          <div className="text-right">
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
            <Button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tải lên...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Tải ảnh lên
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 dark:text-gray-600" />
          </div>
        ) : photos.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="w-10 h-10 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Chưa có ảnh nào
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {user ? 'Tải ảnh đầu tiên của bạn lên' : 'Đăng nhập để tải ảnh lên'}
            </p>
          </div>
        ) : (
          /* Photo Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.getId()}
                className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:shadow-lg transition-all"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.getThumbnailUrl() || photo.getUrl()}
                  alt={photo.getCaption() || photo.getFilename()}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform">
                    {photo.getCaption() && (
                      <p className="text-xs text-white font-medium truncate mb-1">
                        {photo.getCaption()}
                      </p>
                    )}
                    <p className="text-xs text-white/70">
                      {formatFileSize(photo.getBytes())}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Login Prompt Modal */}
        <LoginPromptModal
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
          message={loginPromptMessage}
        />

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedPhoto.getUrl()}
                alt={selectedPhoto.getCaption() || selectedPhoto.getFilename()}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
              
              {/* Photo Details */}
              <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    {/* Caption Section */}
                    {editingCaption !== null ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          defaultValue={selectedPhoto.getCaption() || ''}
                          placeholder="Thêm chú thích..."
                          className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateCaption(selectedPhoto.getId(), e.currentTarget.value);
                            } else if (e.key === 'Escape') {
                              setEditingCaption(null);
                            }
                          }}
                          autoFocus
                        />
                        <Button
                          onClick={() => setEditingCaption(null)}
                          variant="secondary"
                          className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          Hủy
                        </Button>
                      </div>
                    ) : (
                      <div>
                        {selectedPhoto.getCaption() ? (
                          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {selectedPhoto.getCaption()}
                          </p>
                        ) : (
                          <p className="text-lg text-gray-500 dark:text-gray-500 mb-2">
                            Chưa có chú thích
                          </p>
                        )}
                        <button
                          onClick={() => {
                            if (requireAuth('chỉnh sửa chú thích')) {
                              setEditingCaption(selectedPhoto.getCaption());
                            }
                          }}
                          className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Chỉnh sửa chú thích
                        </button>
                      </div>
                    )}
                    
                    {/* Photo Metadata */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm pt-4 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-500">Tên file:</span>
                        <span className="text-gray-900 dark:text-white font-medium truncate">
                          {selectedPhoto.getFilename()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-500">Định dạng:</span>
                        <span className="text-gray-900 dark:text-white font-medium uppercase">
                          {selectedPhoto.getFormat()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-500">Kích thước:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {selectedPhoto.getWidth()} × {selectedPhoto.getHeight()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-500">Dung lượng:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {formatFileSize(selectedPhoto.getBytes())}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-500" />
                        <span className="text-gray-500 dark:text-gray-500">Tải lên:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {formatDate(selectedPhoto.getCreatedAt())}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(selectedPhoto.getId())}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </PageLoader>
  );
}
