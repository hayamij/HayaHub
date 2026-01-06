// Domain Layer - Core Business Entities and Rules
// NO DEPENDENCIES on other layers allowed

// Entities
export * from './entities/User';
export * from './entities/Expense';
export * from './entities/Project';
export * from './entities/Task';
export * from './entities/Event';
export * from './entities/WishItem';

// Value Objects
export * from './value-objects/Money';
export * from './value-objects/DateRange';
export * from './value-objects/Email';
export * from './value-objects/UserId';

// Exceptions
export * from './exceptions/DomainException';
export * from './exceptions/ValidationException';

// Enums
export * from './enums/ExpenseCategory';
export * from './enums/ProjectStatus';
export * from './enums/TaskPriority';
export * from './enums/UserRole';
