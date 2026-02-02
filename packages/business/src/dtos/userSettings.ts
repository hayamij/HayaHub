import type { UserId } from 'hayahub-domain';

export interface GetUserSettingsDTO {
  userId: UserId;
}

export interface UpdateUserSettingsDTO {
  userId: UserId;
  theme?: 'light' | 'dark';
  preferredDashboardView?: 'grid' | 'workspace';
}

export interface UserSettingsDTO {
  theme: 'light' | 'dark';
  preferredDashboardView: 'grid' | 'workspace';
}
