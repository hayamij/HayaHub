/**
 * Base Mapper Interface
 * Defines contract for Entity <-> DTO conversion
 * Follows Single Responsibility Principle
 */
export interface IMapper<TEntity, TDTO> {
  /**
   * Convert domain entity to DTO
   */
  toDTO(entity: TEntity): TDTO;

  /**
   * Convert multiple domain entities to DTOs
   */
  toDTOs(entities: TEntity[]): TDTO[];
}

/**
 * Abstract Base Mapper
 * Implements common mapping logic to eliminate duplication
 */
export abstract class BaseMapper<TEntity, TDTO> implements IMapper<TEntity, TDTO> {
  abstract toDTO(entity: TEntity): TDTO;

  toDTOs(entities: TEntity[]): TDTO[] {
    return entities.map((entity) => this.toDTO(entity));
  }
}
