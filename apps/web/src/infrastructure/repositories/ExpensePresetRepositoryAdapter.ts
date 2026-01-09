import type { IExpensePresetRepository } from 'hayahub-business';
import type { ExpensePreset, ExpenseCategory } from 'hayahub-domain';
import { ExpensePreset as ExpensePresetDomain, Money } from 'hayahub-domain';
import type { IStorageService } from 'hayahub-business';

const STORAGE_KEY = 'hayahub_expense_presets';

interface ExpensePresetStorage {
  id: string;
  userId: string;
  name: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Infrastructure Layer - ExpensePreset Repository Adapter using LocalStorage
 */
export class ExpensePresetRepositoryAdapter implements IExpensePresetRepository {
  constructor(private readonly storage: IStorageService) {}

  async save(preset: ExpensePreset): Promise<void> {
    const presets = await this.loadAll();
    presets.push(this.toStorage(preset));
    await this.storage.set(STORAGE_KEY, presets);
  }

  async findById(id: string): Promise<ExpensePreset | null> {
    const presets = await this.loadAll();
    const preset = presets.find((p) => p.id === id);
    return preset ? this.toDomain(preset) : null;
  }

  async findByUserId(userId: string): Promise<ExpensePreset[]> {
    const presets = await this.loadAll();
    return presets.filter((p) => p.userId === userId).map((p) => this.toDomain(p));
  }

  async findByUserIdAndCategory(
    userId: string,
    category: ExpenseCategory
  ): Promise<ExpensePreset[]> {
    const presets = await this.loadAll();
    return presets
      .filter((p) => p.userId === userId && p.category === category)
      .map((p) => this.toDomain(p));
  }

  async update(preset: ExpensePreset): Promise<void> {
    const presets = await this.loadAll();
    const index = presets.findIndex((p) => p.id === preset.id);
    if (index !== -1) {
      presets[index] = this.toStorage(preset);
      await this.storage.set(STORAGE_KEY, presets);
    }
  }

  async delete(id: string): Promise<void> {
    const presets = await this.loadAll();
    const filtered = presets.filter((p) => p.id !== id);
    await this.storage.set(STORAGE_KEY, filtered);
  }

  async findAll(): Promise<ExpensePreset[]> {
    const presets = await this.loadAll();
    return presets.map((p) => this.toDomain(p));
  }

  private async loadAll(): Promise<ExpensePresetStorage[]> {
    return (await this.storage.get<ExpensePresetStorage[]>(STORAGE_KEY)) || [];
  }

  private toStorage(preset: ExpensePreset): ExpensePresetStorage {
    return {
      id: preset.id,
      userId: preset.userId,
      name: preset.name,
      amount: preset.amount.getAmount(),
      currency: preset.amount.getCurrency(),
      category: preset.category,
      notes: preset.notes,
      createdAt: preset.createdAt.toISOString(),
      updatedAt: preset.updatedAt.toISOString(),
    };
  }

  private toDomain(storage: ExpensePresetStorage): ExpensePreset {
    return ExpensePresetDomain.reconstruct(
      storage.id,
      storage.userId,
      storage.name,
      Money.create(storage.amount, storage.currency),
      storage.category,
      storage.notes,
      new Date(storage.createdAt),
      new Date(storage.updatedAt)
    );
  }
}
