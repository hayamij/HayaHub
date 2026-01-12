import type { IUserSettingsRepository } from 'hayahub-business';
import type { UserSettings } from 'hayahub-domain';
import { UserSettings as UserSettingsDomain } from 'hayahub-domain';
import type { UserId } from 'hayahub-domain';
import type { IStorageService } from 'hayahub-business';

const STORAGE_KEY_PREFIX = 'hayahub_user_settings_';

/**
 * Infrastructure Layer - UserSettings Repository Adapter using Storage Service
 */
export class UserSettingsRepositoryAdapter implements IUserSettingsRepository {
  constructor(private readonly storage: IStorageService) {}

  async get(userId: UserId): Promise<UserSettings> {
    try {
      const key = this.getStorageKey(userId);
      const data = await this.storage.get<{ theme?: string }>(key);
      
      if (!data) {
        // Return default settings
        return UserSettingsDomain.create('light');
      }
      
      return UserSettingsDomain.fromJSON(data);
    } catch (error) {
      console.error(`Failed to get settings for user ${userId}:`, error);
      return UserSettingsDomain.create('light');
    }
  }

  async save(userId: UserId, settings: UserSettings): Promise<void> {
    try {
      const key = this.getStorageKey(userId);
      await this.storage.set(key, settings.toJSON());
    } catch (error) {
      console.error(`Failed to save settings for user ${userId}:`, error);
      throw error;
    }
  }

  private getStorageKey(userId: UserId): string {
    return `${STORAGE_KEY_PREFIX}${userId}`;
  }
}
