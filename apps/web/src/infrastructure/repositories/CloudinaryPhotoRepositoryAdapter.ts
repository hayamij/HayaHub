import type { IPhotoRepository } from 'hayahub-business';
import type { Photo } from 'hayahub-domain';
import { Photo as PhotoDomain } from 'hayahub-domain';
import type { IStorageService } from 'hayahub-business';
import { success, failure, type Result } from 'hayahub-shared';

const STORAGE_KEY = 'hayahub_photos';

interface PhotoStorage {
  id: string;
  userId: string;
  cloudinaryId: string;
  url: string;
  thumbnailUrl: string | null;
  filename: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  caption: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Infrastructure Layer - Photo Repository Adapter using Cloudinary + LocalStorage
 */
export class CloudinaryPhotoRepositoryAdapter implements IPhotoRepository {
  private readonly cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dvw4ewdpi';
  private readonly uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'hayahub_photos';
  
  constructor(private readonly storage: IStorageService) {}

  async upload(file: File, userId: string, caption?: string | null): Promise<Result<Photo, Error>> {
    try {
      // Upload to Cloudinary using unsigned preset
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
      formData.append('folder', `hayahub/users/${userId}`);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        const errorMessage = error.error?.message || 'Failed to upload image to Cloudinary';
        
        // Provide helpful error messages
        if (errorMessage.includes('preset')) {
          return failure(new Error(
            'Upload preset not configured. Please create an unsigned upload preset named "hayahub_photos" in your Cloudinary dashboard (Settings > Upload > Upload presets)'
          ));
        }
        
        return failure(new Error(errorMessage));
      }

      const data = await response.json();

      // Create domain entity
      const photo = PhotoDomain.fromProps({
        id: crypto.randomUUID(),
        userId,
        cloudinaryId: data.public_id,
        url: data.secure_url,
        thumbnailUrl: data.eager?.[0]?.secure_url || null,
        filename: file.name,
        format: data.format,
        width: data.width,
        height: data.height,
        bytes: data.bytes,
        caption: caption || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Save to localStorage
      const photos = await this.loadAll();
      photos.push(this.toStorage(photo));
      await this.storage.set(STORAGE_KEY, photos);

      return success(photo);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Failed to upload photo'));
    }
  }

  async findByUserId(userId: string): Promise<Result<Photo[], Error>> {
    try {
      const photos = await this.loadAll();
      const userPhotos = photos
        .filter((p) => p.userId === userId)
        .map(this.toDomain)
        .sort((a, b) => b.getCreatedAt().getTime() - a.getCreatedAt().getTime()); // Sort by newest first
      
      return success(userPhotos);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Failed to fetch photos'));
    }
  }

  async findById(id: string): Promise<Result<Photo | null, Error>> {
    try {
      const photos = await this.loadAll();
      const photo = photos.find((p) => p.id === id);
      
      return success(photo ? this.toDomain(photo) : null);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Failed to fetch photo'));
    }
  }

  async update(id: string, caption: string | null): Promise<Result<Photo, Error>> {
    try {
      const photos = await this.loadAll();
      const index = photos.findIndex((p) => p.id === id);
      
      if (index === -1) {
        return failure(new Error('Photo not found'));
      }

      const photo = this.toDomain(photos[index]);
      const updatedPhoto = photo.withCaption(caption);
      
      photos[index] = this.toStorage(updatedPhoto);
      await this.storage.set(STORAGE_KEY, photos);

      return success(updatedPhoto);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Failed to update photo'));
    }
  }

  async delete(id: string): Promise<Result<void, Error>> {
    try {
      const photos = await this.loadAll();
      const photo = photos.find((p) => p.id === id);
      
      if (!photo) {
        return failure(new Error('Photo not found'));
      }

      // Delete from Cloudinary
      // Note: This requires backend API because destroy operation needs API secret
      // For now, we'll just remove from localStorage
      // TODO: Implement backend API for deletion
      
      const filtered = photos.filter((p) => p.id !== id);
      await this.storage.set(STORAGE_KEY, filtered);

      return success(undefined);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Failed to delete photo'));
    }
  }

  private async loadAll(): Promise<PhotoStorage[]> {
    return (await this.storage.get<PhotoStorage[]>(STORAGE_KEY)) || [];
  }

  private toStorage(photo: Photo): PhotoStorage {
    return {
      id: photo.getId(),
      userId: photo.getUserId(),
      cloudinaryId: photo.getCloudinaryId(),
      url: photo.getUrl(),
      thumbnailUrl: photo.getThumbnailUrl(),
      filename: photo.getFilename(),
      format: photo.getFormat(),
      width: photo.getWidth(),
      height: photo.getHeight(),
      bytes: photo.getBytes(),
      caption: photo.getCaption(),
      createdAt: photo.getCreatedAt().toISOString(),
      updatedAt: photo.getUpdatedAt().toISOString(),
    };
  }

  private toDomain(storage: PhotoStorage): Photo {
    return PhotoDomain.fromProps({
      id: storage.id,
      userId: storage.userId,
      cloudinaryId: storage.cloudinaryId,
      url: storage.url,
      thumbnailUrl: storage.thumbnailUrl,
      filename: storage.filename,
      format: storage.format,
      width: storage.width,
      height: storage.height,
      bytes: storage.bytes,
      caption: storage.caption,
      createdAt: new Date(storage.createdAt),
      updatedAt: new Date(storage.updatedAt),
    });
  }
}
