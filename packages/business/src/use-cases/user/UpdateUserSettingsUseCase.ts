import { success, failure, type Result } from 'hayahub-shared';
import type { IUserSettingsRepository } from '../../ports/IUserSettingsRepository';
import type { UpdateUserSettingsDTO, UserSettingsDTO } from '../../dtos/userSettings';

export class UpdateUserSettingsUseCase {
  constructor(private readonly userSettingsRepository: IUserSettingsRepository) {}

  async execute(dto: UpdateUserSettingsDTO): Promise<Result<UserSettingsDTO, Error>> {
    try {
      // Get existing settings
      let settings = await this.userSettingsRepository.get(dto.userId);
      
      // Apply updates
      if (dto.theme !== undefined) {
        settings = settings.withTheme(dto.theme);
      }
      if (dto.preferredDashboardView !== undefined) {
        settings = settings.withPreferredDashboardView(dto.preferredDashboardView);
      }
      
      // Save
      await this.userSettingsRepository.save(dto.userId, settings);
      
      return success({
        theme: settings.getTheme(),
        preferredDashboardView: settings.getPreferredDashboardView(),
      });
    } catch (error) {
      return failure(error as Error);
    }
  }
}
