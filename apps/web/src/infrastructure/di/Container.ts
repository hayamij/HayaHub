/**
 * Dependency Injection Container
 * Creates and wires up all dependencies
 */

import { HybridStorageAdapter } from '../storage/HybridStorageAdapter';
import { ExpenseRepositoryAdapter } from '../repositories/ExpenseRepositoryAdapter';
import { UserRepositoryAdapter } from '../repositories/UserRepositoryAdapter';
import {
  CreateExpenseUseCase,
  GetExpensesUseCase,
  UpdateExpenseUseCase,
  DeleteExpenseUseCase,
  RegisterUserUseCase,
  LoginUserUseCase,
  GetUserUseCase,
} from 'hayahub-business';
import type { IStorageService } from 'hayahub-business';

class Container {
  private static instance: Container;

  // Infrastructure
  private _storageService?: IStorageService;

  // Repositories
  private _expenseRepository?: ExpenseRepositoryAdapter;
  private _userRepository?: UserRepositoryAdapter;

  // Use Cases
  private _createExpenseUseCase?: CreateExpenseUseCase;
  private _getExpensesUseCase?: GetExpensesUseCase;
  private _updateExpenseUseCase?: UpdateExpenseUseCase;
  private _deleteExpenseUseCase?: DeleteExpenseUseCase;
  private _registerUserUseCase?: RegisterUserUseCase;
  private _loginUserUseCase?: LoginUserUseCase;
  private _getUserUseCase?: GetUserUseCase;

  private constructor() {}

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  // Infrastructure
  get storageService(): IStorageService {
    if (!this._storageService) {
      this._storageService = new HybridStorageAdapter();
    }
    return this._storageService;
  }

  // Repositories
  get expenseRepository(): ExpenseRepositoryAdapter {
    if (!this._expenseRepository) {
      this._expenseRepository = new ExpenseRepositoryAdapter(this.storageService);
    }
    return this._expenseRepository;
  }

  get userRepository(): UserRepositoryAdapter {
    if (!this._userRepository) {
      this._userRepository = new UserRepositoryAdapter(this.storageService);
    }
    return this._userRepository;
  }

  // Use Cases - Expense
  get createExpenseUseCase(): CreateExpenseUseCase {
    if (!this._createExpenseUseCase) {
      this._createExpenseUseCase = new CreateExpenseUseCase(this.expenseRepository);
    }
    return this._createExpenseUseCase;
  }

  get getExpensesUseCase(): GetExpensesUseCase {
    if (!this._getExpensesUseCase) {
      this._getExpensesUseCase = new GetExpensesUseCase(this.expenseRepository);
    }
    return this._getExpensesUseCase;
  }

  get updateExpenseUseCase(): UpdateExpenseUseCase {
    if (!this._updateExpenseUseCase) {
      this._updateExpenseUseCase = new UpdateExpenseUseCase(this.expenseRepository);
    }
    return this._updateExpenseUseCase;
  }

  get deleteExpenseUseCase(): DeleteExpenseUseCase {
    if (!this._deleteExpenseUseCase) {
      this._deleteExpenseUseCase = new DeleteExpenseUseCase(this.expenseRepository);
    }
    return this._deleteExpenseUseCase;
  }

  // Use Cases - User
  get registerUserUseCase(): RegisterUserUseCase {
    if (!this._registerUserUseCase) {
      this._registerUserUseCase = new RegisterUserUseCase(this.userRepository);
    }
    return this._registerUserUseCase;
  }

  get loginUserUseCase(): LoginUserUseCase {
    if (!this._loginUserUseCase) {
      this._loginUserUseCase = new LoginUserUseCase(this.userRepository);
    }
    return this._loginUserUseCase;
  }

  get getUserUseCase(): GetUserUseCase {
    if (!this._getUserUseCase) {
      this._getUserUseCase = new GetUserUseCase(this.userRepository);
    }
    return this._getUserUseCase;
  }
}

export const container = Container.getInstance();
export { Container };
