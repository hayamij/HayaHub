/**
 * Photo Entity
 * Represents a photo stored in the gallery
 */
export class Photo {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly cloudinaryId: string,
    private readonly url: string,
    private readonly thumbnailUrl: string | null,
    private readonly filename: string,
    private readonly format: string,
    private readonly width: number,
    private readonly height: number,
    private readonly bytes: number,
    private caption: string | null,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {
    this.validate();
  }

  static create(
    id: string,
    userId: string,
    cloudinaryId: string,
    url: string,
    thumbnailUrl: string | null,
    filename: string,
    format: string,
    width: number,
    height: number,
    bytes: number,
    caption: string | null = null
  ): Photo {
    const now = new Date();
    return new Photo(
      id,
      userId,
      cloudinaryId,
      url,
      thumbnailUrl,
      filename,
      format,
      width,
      height,
      bytes,
      caption,
      now,
      now
    );
  }

  static fromProps(props: PhotoProps): Photo {
    return new Photo(
      props.id,
      props.userId,
      props.cloudinaryId,
      props.url,
      props.thumbnailUrl,
      props.filename,
      props.format,
      props.width,
      props.height,
      props.bytes,
      props.caption,
      props.createdAt,
      props.updatedAt
    );
  }

  private validate(): void {
    if (!this.id || this.id.trim() === '') {
      throw new Error('Photo ID is required');
    }
    if (!this.userId || this.userId.trim() === '') {
      throw new Error('User ID is required');
    }
    if (!this.cloudinaryId || this.cloudinaryId.trim() === '') {
      throw new Error('Cloudinary ID is required');
    }
    if (!this.url || this.url.trim() === '') {
      throw new Error('Photo URL is required');
    }
    if (this.width <= 0 || this.height <= 0) {
      throw new Error('Photo dimensions must be positive');
    }
    if (this.bytes <= 0) {
      throw new Error('Photo size must be positive');
    }
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getCloudinaryId(): string {
    return this.cloudinaryId;
  }

  getUrl(): string {
    return this.url;
  }

  getThumbnailUrl(): string | null {
    return this.thumbnailUrl;
  }

  getFilename(): string {
    return this.filename;
  }

  getFormat(): string {
    return this.format;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getBytes(): number {
    return this.bytes;
  }

  getCaption(): string | null {
    return this.caption;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Immutable update methods
  withCaption(caption: string | null): Photo {
    return new Photo(
      this.id,
      this.userId,
      this.cloudinaryId,
      this.url,
      this.thumbnailUrl,
      this.filename,
      this.format,
      this.width,
      this.height,
      this.bytes,
      caption,
      this.createdAt,
      new Date()
    );
  }

  toProps(): PhotoProps {
    return {
      id: this.id,
      userId: this.userId,
      cloudinaryId: this.cloudinaryId,
      url: this.url,
      thumbnailUrl: this.thumbnailUrl,
      filename: this.filename,
      format: this.format,
      width: this.width,
      height: this.height,
      bytes: this.bytes,
      caption: this.caption,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export interface PhotoProps {
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
  createdAt: Date;
  updatedAt: Date;
}
