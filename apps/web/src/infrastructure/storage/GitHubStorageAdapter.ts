import type { IStorageService } from 'hayahub-business';

interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content?: string;
  encoding?: string;
}

/**
 * GitHub API adapter for storage
 * Uses GitHub repository as a database by storing JSON files
 */
export class GitHubStorageAdapter implements IStorageService {
  private config: GitHubConfig;
  private baseUrl = 'https://api.github.com';
  private isConfigured: boolean;

  constructor() {
    this.config = {
      token: process.env.NEXT_PUBLIC_GITHUB_TOKEN || '',
      owner: process.env.NEXT_PUBLIC_GITHUB_OWNER || '',
      repo: process.env.NEXT_PUBLIC_GITHUB_REPO || '',
      branch: process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'data',
    };

    this.isConfigured = !!(this.config.token && this.config.owner && this.config.repo);

    if (!this.isConfigured) {
      console.warn('GitHub storage not configured - using localStorage only mode');
    }
  }

  private getHeaders(): HeadersInit {
    return {
      Authorization: `Bearer ${this.config.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  private getFilePath(key: string): string {
    return `data/${key}.json`;
  }

  async get<T>(key: string): Promise<T | null> {
    // Return null if not configured - let HybridStorageAdapter fallback to localStorage
    if (!this.isConfigured) {
      return null;
    }

    try {
      const path = this.getFilePath(key);
      const url = `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${this.config.branch}`;

      const response = await fetch(url, {
        headers: this.getHeaders(),
        cache: 'no-store',
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const file: GitHubFile = await response.json();

      if (!file.content) {
        return null;
      }

      // Decode base64 content
      const content = Buffer.from(file.content, 'base64').toString('utf-8');
      return JSON.parse(content) as T;
    } catch (error) {
      console.error(`Error getting ${key} from GitHub:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    // Skip if not configured - HybridStorageAdapter will use localStorage only
    if (!this.isConfigured) {
      return;
    }

    try {
      const path = this.getFilePath(key);
      const content = JSON.stringify(value, null, 2);
      const contentBase64 = Buffer.from(content).toString('base64');

      // First, try to get the file to get its SHA (needed for updates)
      let sha: string | undefined;
      const getUrl = `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${this.config.branch}`;

      try {
        const getResponse = await fetch(getUrl, {
          headers: this.getHeaders(),
          cache: 'no-store',
        });

        if (getResponse.ok) {
          const existingFile: GitHubFile = await getResponse.json();
          sha = existingFile.sha;
        }
      } catch (error) {
        // File doesn't exist, will create new
      }

      // Create or update file
      const putUrl = `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`;

      const body: any = {
        message: `Update ${key}`,
        content: contentBase64,
        branch: this.config.branch,
      };

      if (sha) {
        body.sha = sha;
      }

      const response = await fetch(putUrl, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`GitHub API error: ${error}`);
      }
    } catch (error) {
      console.error(`Error setting ${key} to GitHub:`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    // Skip if not configured
    if (!this.isConfigured) {
      return;
    }

    try {
      const path = this.getFilePath(key);

      // Get file SHA first
      const getUrl = `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${this.config.branch}`;

      const getResponse = await fetch(getUrl, {
        headers: this.getHeaders(),
        cache: 'no-store',
      });

      if (!getResponse.ok) {
        // File doesn't exist
        return;
      }

      const file: GitHubFile = await getResponse.json();

      // Delete file
      const deleteUrl = `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/${path}`;

      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: this.getHeaders(),
        body: JSON.stringify({
          message: `Delete ${key}`,
          sha: file.sha,
          branch: this.config.branch,
        }),
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error removing ${key} from GitHub:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    // Not implemented - would need to list and delete all files
    console.warn('Clear operation not implemented for GitHub storage');
  }

  async getAllKeys(): Promise<string[]> {
    // Return empty array if not configured
    if (!this.isConfigured) {
      return [];
    }

    try {
      const url = `${this.baseUrl}/repos/${this.config.owner}/${this.config.repo}/contents/data?ref=${this.config.branch}`;

      const response = await fetch(url, {
        headers: this.getHeaders(),
        cache: 'no-store',
      });

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const files: GitHubFile[] = await response.json();
      
      // Extract keys from .json files (remove .json extension)
      return files
        .filter(file => file.type === 'file' && file.name.endsWith('.json'))
        .map(file => file.name.replace('.json', ''));
    } catch (error) {
      console.error('Error getting all keys from GitHub:', error);
      return [];
    }
  }
}
