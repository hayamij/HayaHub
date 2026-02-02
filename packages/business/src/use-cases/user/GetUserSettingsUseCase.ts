import { success, failure, type Result } from 'hayahub-shared';
import type { IUserSettingsRepository } from '../../ports/IUserSettingsRepository';
import type { GetUserSettingsDTO, UserSettingsDTO } from '../../dtos/userSettings';

export class GetUserSettingsUseCase {
  constructor(private readonly userSettingsRepository: IUserSettingsRepository) {}

  async execute(dto: GetUserSettingsDTO): Promise<Result<UserSettingsDTO, Error>> {
    try {
      const settings = await this.userSettingsRepository.get(dto.userId);
      
      return success({
        theme: settings.getTheme(),
        preferredDashboardView: settings.getPreferredDashboardView(),
      });
    } catch (error) {
      return failure(error as Error);
    }
  }
}
