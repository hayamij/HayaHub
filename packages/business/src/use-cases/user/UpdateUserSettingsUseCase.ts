import { success, failure, type Result } from 'hayahub-shared';
import type { IUserSettingsRepository } from '../../ports/IUserSettingsRepository';
import type { UpdateUserSettingsDTO, UserSettingsDTO } from '../../dtos/userSettings';

export class UpdateUserSettingsUseCase {
  constructor(private readonly userSettingsRepository: IUserSettingsRepository) {}

  async execute(dto: UpdateUserSettingsDTO): Promise<Result<UserSettingsDTO, Error>> {
    try {
      // Get existing settings
      const existingSettings = await this.userSettingsRepository.get(dto.userId);
      
      // Create updated settings
      const updatedSettings = existingSettings.withTheme(dto.theme);
      
      // Save
      await this.userSettingsRepository.save(dto.userId, updatedSettings);
      
      return success({
        theme: updatedSettings.getTheme(),
      });
    } catch (error) {
      return failure(error as Error);
    }
  }
}
