/**
 * UserSettings Value Object
 * Represents user preferences and configuration
 */
export class UserSettings {
  private constructor(
    private readonly theme: 'light' | 'dark'
  ) {}

  static create(theme: 'light' | 'dark' = 'light'): UserSettings {
    return new UserSettings(theme);
  }

  getTheme(): 'light' | 'dark' {
    return this.theme;
  }

  withTheme(theme: 'light' | 'dark'): UserSettings {
    return new UserSettings(theme);
  }

  equals(other: UserSettings): boolean {
    return this.theme === other.theme;
  }

  toJSON() {
    return {
      theme: this.theme,
    };
  }

  static fromJSON(data: { theme?: string }): UserSettings {
    const theme = data.theme === 'dark' ? 'dark' : 'light';
    return new UserSettings(theme);
  }
}
