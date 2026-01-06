import type { Project } from 'hayahub-domain';

/**
 * Port (Interface) for Project Repository
 */
export interface IProjectRepository {
  save(project: Project): Promise<void>;
  findById(id: string): Promise<Project | null>;
  findByUserId(userId: string): Promise<Project[]>;
  update(project: Project): Promise<void>;
  delete(id: string): Promise<void>;
}
