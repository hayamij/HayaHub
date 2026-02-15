export interface PhotoDTO {
  id: string;
  userId: string;
  cloudinaryId: string;
  url: string;
  thumbnailUrl: string;
  filename: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  caption: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePhotoDTO {
  userId: string;
  cloudinaryId: string;
  url: string;
  thumbnailUrl: string;
  filename: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  caption?: string | null;
}

export interface UpdatePhotoDTO {
  caption?: string | null;
}

export interface UploadPhotoDTO {
  userId: string;
  file: File;
  caption?: string | null;
}
