import type { UserSettings } from 'hayahub-domain';
import type { UserId } from 'hayahub-domain';

/**
 * Port (Interface) for UserSettings Repository
 * Infrastructure layer will implement this
 */
export interface IUserSettingsRepository {
  get(userId: UserId): Promise<UserSettings>;
  save(userId: UserId, settings: UserSettings): Promise<void>;
}
