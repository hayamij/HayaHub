/**
 * UserSettings Value Object
 * Represents user preferences and configuration
 */
export class UserSettings {
  private constructor(
    private readonly theme: 'light' | 'dark',
    private readonly preferredDashboardView: 'grid' | 'workspace' = 'grid'
  ) {}

  static create(
    theme: 'light' | 'dark' = 'light',
    preferredDashboardView: 'grid' | 'workspace' = 'grid'
  ): UserSettings {
    return new UserSettings(theme, preferredDashboardView);
  }

  getTheme(): 'light' | 'dark' {
    return this.theme;
  }

  getPreferredDashboardView(): 'grid' | 'workspace' {
    return this.preferredDashboardView;
  }

  withTheme(theme: 'light' | 'dark'): UserSettings {
    return new UserSettings(theme, this.preferredDashboardView);
  }

  withPreferredDashboardView(view: 'grid' | 'workspace'): UserSettings {
    return new UserSettings(this.theme, view);
  }

  equals(other: UserSettings): boolean {
    return this.theme === other.theme && this.preferredDashboardView === other.preferredDashboardView;
  }

  toJSON() {
    return {
      theme: this.theme,
      preferredDashboardView: this.preferredDashboardView,
    };
  }

  static fromJSON(data: { theme?: string; preferredDashboardView?: string }): UserSettings {
    const theme = data.theme === 'dark' ? 'dark' : 'light';
    const preferredDashboardView = data.preferredDashboardView === 'workspace' ? 'workspace' : 'grid';
    return new UserSettings(theme, preferredDashboardView);
  }
}
