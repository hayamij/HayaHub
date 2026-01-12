import type { UserId } from 'hayahub-domain';

export interface GetUserSettingsDTO {
  userId: UserId;
}

export interface UpdateUserSettingsDTO {
  userId: UserId;
  theme: 'light' | 'dark';
}

export interface UserSettingsDTO {
  theme: 'light' | 'dark';
}
