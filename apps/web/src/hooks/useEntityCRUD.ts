'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Result } from 'hayahub-shared';

/**
 * Generic CRUD Hook for Entity Management
 * Follows DRY principle by extracting common CRUD patterns
 * @template TEntity - The entity DTO type
 * @template TCreateDTO - The creation DTO type
 * @template TUpdateDTO - The update DTO type
 * @template TGetParams - Optional parameters for the get operation
 */
interface UseEntityCRUDOptions<TEntity, TCreateDTO, TUpdateDTO, TGetParams = string> {
  getUseCase: {
    execute: (params: TGetParams) => Promise<Result<TEntity[], Error>>;
  };
  createUseCase?: {
    execute: (dto: TCreateDTO) => Promise<Result<TEntity, Error>>;
  };
  updateUseCase?: {
    execute: (id: string, dto: TUpdateDTO) => Promise<Result<TEntity, Error>>;
  };
  deleteUseCase?: {
    execute: (id: string) => Promise<Result<void, Error>>;
  };
  getParams: TGetParams;
  autoLoad?: boolean;
}

interface UseEntityCRUDReturn<TEntity, TCreateDTO, TUpdateDTO> {
  entities: TEntity[];
  isLoading: boolean;
  error: Error | null;
  load: () => Promise<void>;
  create: (dto: TCreateDTO) => Promise<boolean>;
  update: (id: string, dto: TUpdateDTO) => Promise<boolean>;
  deleteEntity: (id: string) => Promise<boolean>;
}

/**
 * Generic CRUD Hook - Reusable abstraction for entity management
 * Eliminates ~500 lines of duplicated code across multiple hooks
 * 
 * Usage example:
 * ```ts
 * const projects = useEntityCRUD({
 *   getUseCase: container.getProjectsUseCase,
 *   createUseCase: container.createProjectUseCase,
 *   updateUseCase: container.updateProjectUseCase,
 *   deleteUseCase: container.deleteProjectUseCase,
 *   getParams: userId
 * });
 * ```
 */
export function useEntityCRUD<TEntity, TCreateDTO, TUpdateDTO, TGetParams = string>({
  getUseCase,
  createUseCase,
  updateUseCase,
  deleteUseCase,
  getParams,
  autoLoad = true,
}: UseEntityCRUDOptions<TEntity, TCreateDTO, TUpdateDTO, TGetParams>): UseEntityCRUDReturn<
  TEntity,
  TCreateDTO,
  TUpdateDTO
> {
  const [entities, setEntities] = useState<TEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    // Skip if no params provided (e.g., userId is undefined)
    if (!getParams) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getUseCase.execute(getParams);

      if (result.isSuccess()) {
        setEntities(result.value);
      } else {
        setError(result.error);
        setEntities([]);
      }
    } catch (err) {
      setError(err as Error);
      setEntities([]);
    } finally {
      setIsLoading(false);
    }
  }, [getUseCase, getParams]);

  const create = useCallback(
    async (dto: TCreateDTO): Promise<boolean> => {
      if (!createUseCase) {
        console.warn('Create use case not provided');
        return false;
      }

      try {
        const result = await createUseCase.execute(dto);

        if (result.isSuccess()) {
          await load();
          return true;
        } else {
          setError(result.error);
          return false;
        }
      } catch (err) {
        setError(err as Error);
        return false;
      }
    },
    [createUseCase, load]
  );

  const update = useCallback(
    async (id: string, dto: TUpdateDTO): Promise<boolean> => {
      if (!updateUseCase) {
        console.warn('Update use case not provided');
        return false;
      }

      try {
        const result = await updateUseCase.execute(id, dto);

        if (result.isSuccess()) {
          await load();
          return true;
        } else {
          setError(result.error);
          return false;
        }
      } catch (err) {
        setError(err as Error);
        return false;
      }
    },
    [updateUseCase, load]
  );

  const deleteEntity = useCallback(
    async (id: string): Promise<boolean> => {
      if (!deleteUseCase) {
        console.warn('Delete use case not provided');
        return false;
      }

      try {
        const result = await deleteUseCase.execute(id);

        if (result.isSuccess()) {
          await load();
          return true;
        } else {
          setError(result.error);
          return false;
        }
      } catch (err) {
        setError(err as Error);
        return false;
      }
    },
    [deleteUseCase, load]
  );

  useEffect(() => {
    if (autoLoad) {
      load();
    }
  }, [load, autoLoad]);

  return {
    entities,
    isLoading,
    error,
    load,
    create,
    update,
    deleteEntity,
  };
}
