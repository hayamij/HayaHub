import type { IProjectRepository } from 'hayahub-business';
import type { Project } from 'hayahub-domain';
import { Project as ProjectDomain, ProjectStatus, DateRange } from 'hayahub-domain';
import type { IStorageService } from 'hayahub-business';

const STORAGE_KEY = 'hayahub_projects';

interface ProjectStorage {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string | null;
  endDate: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Infrastructure Layer - Project Repository Adapter using LocalStorage
 */
export class ProjectRepositoryAdapter implements IProjectRepository {
  constructor(private readonly storage: IStorageService) {}

  async save(project: Project): Promise<void> {
    const projects = await this.loadAll();
    projects.push(this.toStorage(project));
    await this.storage.set(STORAGE_KEY, projects);
  }

  async findById(id: string): Promise<Project | null> {
    const projects = await this.loadAll();
    const project = projects.find((p) => p.id === id);
    return project ? this.toDomain(project) : null;
  }

  async findByUserId(userId: string): Promise<Project[]> {
    const projects = await this.loadAll();
    return projects.filter((p) => p.userId === userId).map(this.toDomain);
  }

  async update(project: Project): Promise<void> {
    const projects = await this.loadAll();
    const index = projects.findIndex((p) => p.id === project.id);
    if (index !== -1) {
      projects[index] = this.toStorage(project);
      await this.storage.set(STORAGE_KEY, projects);
    }
  }

  async delete(id: string): Promise<void> {
    const projects = await this.loadAll();
    const filtered = projects.filter((p) => p.id !== id);
    await this.storage.set(STORAGE_KEY, filtered);
  }

  private async loadAll(): Promise<ProjectStorage[]> {
    return (await this.storage.get<ProjectStorage[]>(STORAGE_KEY)) || [];
  }

  private toStorage(project: Project): ProjectStorage {
    return {
      id: project.id,
      userId: project.userId,
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.dateRange?.getStartDate().toISOString() || null,
      endDate: project.dateRange?.getEndDate().toISOString() || null,
      tags: project.tags,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }

  private toDomain(storage: ProjectStorage): Project {
    let dateRange: DateRange | null = null;
    if (storage.startDate && storage.endDate) {
      dateRange = DateRange.create(new Date(storage.startDate), new Date(storage.endDate));
    }

    return ProjectDomain.reconstruct(
      storage.id,
      storage.userId,
      storage.name,
      storage.description,
      storage.status,
      dateRange,
      storage.tags,
      new Date(storage.createdAt),
      new Date(storage.updatedAt)
    );
  }
}
