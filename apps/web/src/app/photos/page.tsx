'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/layout/PageLoader';
import { LoginPromptModal } from '@/components/ui/LoginPromptModal';
import { Container } from '@/infrastructure/di/Container';
import type { Photo } from 'hayahub-domain';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, X, Image as ImageIcon, Loader2, Edit2, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PhotosPage() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPromptMessage, setLoginPromptMessage] = useState('');

  // Maximum file size for Cloudinary free tier unsigned upload (10MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  useEffect(() => {
    loadPhotos();
  }, [user]);

  const loadPhotos = async () => {
    // Load photos even if not logged in (for public viewing)
    setIsLoading(true);
    setError(null);
    
    // For now, only show photos if user is logged in
    // This can be modified to show public photos later
    if (!user) {
      setPhotos([]);
      setIsLoading(false);
      return;
    }
    
    const result = await Container.getPhotosUseCase().execute(user.id);
    
    if (result.success) {
      setPhotos(result.value);
    } else {
      setError(result.error.message);
    }
    setIsLoading(false);
  };

  const requireAuth = (action: string): boolean => {
    if (!user) {
      setLoginPromptMessage(`Bạn cần đăng nhập để ${action}`);
      setShowLoginPrompt(true);
      return false;
    }
    return true;
  };

  /**
   * Check if file is a browser-supported image format
   */
  const isBrowserSupportedImage = (file: File): boolean => {
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    return supportedTypes.includes(file.type.toLowerCase());
  };

  /**
   * Check if file is a RAW image format
   */
  const isRawImage = (file: File): boolean => {
    const rawExtensions = ['.arw', '.cr2', '.cr3', '.nef', '.orf', '.rw2', '.pef', '.raf', '.dng'];
    const fileName = file.name.toLowerCase();
    return rawExtensions.some(ext => fileName.endsWith(ext));
  };

  /**
   * Compress image file to meet size requirements
   * Converts to JPEG with adjustable quality
   */
  const compressImage = async (file: File, maxSizeBytes: number, quality = 0.85): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions if image is too large
          const maxDimension = 4096; // Max dimension in pixels
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to blob with specified quality
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Could not compress image'));
                return;
              }
              
              // Check if compressed size is within limit
              if (blob.size <= maxSizeBytes) {
                const compressedFile = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else if (quality > 0.1) {
                // Try again with lower quality
                reject(new Error('RETRY_WITH_LOWER_QUALITY'));
              } else {
                reject(new Error('Could not compress image to required size'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        
        img.onerror = () => reject(new Error('Không thể đọc file ảnh. Định dạng file có thể không được trình duyệt hỗ trợ.'));
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => reject(new Error('Không thể đọc file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!requireAuth('tải ảnh lên')) return;
    
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    setError(null);

    let fileToUpload = file;
    
    // Check if file is RAW format
    if (isRawImage(file)) {
      setError('⚠️ File RAW không thể upload trực tiếp. Vui lòng convert sang JPEG trước khi upload hoặc nâng cấp Cloudinary plan để hỗ trợ signed uploads.');
      setIsUploading(false);
      e.target.value = '';
      return;
    }

    // Check if file is browser-supported format
    if (!isBrowserSupportedImage(file)) {
      setError('⚠️ Định dạng file không được hỗ trợ. Vui lòng chọn file JPEG, PNG hoặc WebP.');
      setIsUploading(false);
      e.target.value = '';
      return;
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      try {
        setError(`File gốc ${formatFileSize(file.size)} vượt quá giới hạn 10MB. Đang nén ảnh...`);
        
        // Try to compress with multiple quality levels
        let quality = 0.85;
        let compressed = false;
        
        while (quality >= 0.3 && !compressed) {
          try {
            fileToUpload = await compressImage(file, MAX_FILE_SIZE, quality);
            compressed = true;
            setError(`Đã nén ảnh từ ${formatFileSize(file.size)} xuống ${formatFileSize(fileToUpload.size)}`);
            
            // Clear error after 3 seconds
            setTimeout(() => setError(null), 3000);
          } catch (err) {
            if ((err as Error).message === 'RETRY_WITH_LOWER_QUALITY') {
              quality -= 0.15;
            } else {
              throw err;
            }
          }
        }
        
        if (!compressed) {
          setError('Không thể nén ảnh xuống dưới 10MB. Vui lòng chọn ảnh khác hoặc nâng cấp Cloudinary plan.');
          setIsUploading(false);
          e.target.value = '';
          return;
        }
      } catch (err) {
        setError('Lỗi khi nén ảnh: ' + (err as Error).message);
        setIsUploading(false);
        e.target.value = '';
        return;
      }
    }

    const result = await Container.uploadPhotoUseCase().execute(fileToUpload, user.id);
    
    if (result.success) {
      setPhotos([result.value, ...photos]);
      setError(null);
    } else {
      setError(result.error.message);
    }
    
    setIsUploading(false);
    e.target.value = ''; // Reset input
  };

  const handleDelete = async (photoId: string) => {
    if (!requireAuth('xóa ảnh')) return;
    if (!confirm('Bạn có chắc chắn muốn xóa ảnh này?')) return;

    const result = await Container.deletePhotoUseCase().execute(photoId);
    
    if (result.success) {
      setPhotos(photos.filter(p => p.getId() !== photoId));
      setSelectedPhoto(null);
    } else {
      setError(result.error.message);
    }
  };

  const handleUpdateCaption = async (photoId: string, caption: string) => {
    if (!requireAuth('chỉnh sửa chú thích')) return;
    
    const result = await Container.updatePhotoCaptionUseCase().execute(photoId, caption || null);
    
    if (result.success) {
      setPhotos(photos.map(p => p.getId() === photoId ? result.value : p));
      if (selectedPhoto?.getId() === photoId) {
        setSelectedPhoto(result.value);
      }
      setEditingCaption(null);
    } else {
      setError(result.error.message);
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
              accept="image/*,.arw,.cr2,.nef,.raw,.dng"
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
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              File &gt; 10MB sẽ tự động nén xuống
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Hỗ trợ upload ảnh</p>
              <ul className="text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                <li><strong>JPEG, PNG, WebP</strong>: File &gt; 10MB sẽ tự động nén sang JPEG chất lượng cao</li>
                <li><strong>File RAW (.ARW, .CR2, .NEF...)</strong>: Cần convert sang JPEG trước khi upload (trình duyệt không hỗ trợ đọc RAW)</li>
              </ul>
            </div>
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
                  <Button
                    onClick={() => handleDelete(selectedPhoto.getId())}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </PageLoader>
  );
}
