/**
 * Dependency Injection Container
 * Creates and wires up all dependencies using Strategy Pattern
 */

import { HybridStorageAdapter } from '../storage/HybridStorageAdapter';
import { LocalStorageStrategy } from '../storage/strategies/LocalStorageStrategy';
import { GitHubStorageStrategy } from '../storage/strategies/GitHubStorageStrategy';
import { ExpenseRepositoryAdapter } from '../repositories/ExpenseRepositoryAdapter';
import { ExpensePresetRepositoryAdapter } from '../repositories/ExpensePresetRepositoryAdapter';
import { UserRepositoryAdapter } from '../repositories/UserRepositoryAdapter';
import { UserSettingsRepositoryAdapter } from '../repositories/UserSettingsRepositoryAdapter';
import { SubscriptionRepositoryAdapter } from '../repositories/SubscriptionRepositoryAdapter';
import { CalendarEventRepositoryAdapter } from '../repositories/CalendarEventRepositoryAdapter';
import { QuoteRepositoryAdapter } from '../repositories/QuoteRepositoryAdapter';
import {
  CreateExpenseUseCase,
  GetExpensesUseCase,
  UpdateExpenseUseCase,
  DeleteExpenseUseCase,
  CreateExpensePresetUseCase,
  GetExpensePresetsUseCase,
  UpdateExpensePresetUseCase,
  DeleteExpensePresetUseCase,
  RegisterUserUseCase,
  LoginUserUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
  GetUserSettingsUseCase,
  UpdateUserSettingsUseCase,
  CreateSubscriptionUseCase,
  GetSubscriptionsUseCase,
  UpdateSubscriptionUseCase,
  DeleteSubscriptionUseCase,
  CreateCalendarEventUseCase,
  CreateQuoteUseCase,
} from 'hayahub-business';
import type { IStorageService } from 'hayahub-business';

class Container {
  private static instance: Container;

  // Infrastructure
  private _storageService?: IStorageService;

  // Repositories
  private _expenseRepository?: ExpenseRepositoryAdapter;
  private _expensePresetRepository?: ExpensePresetRepositoryAdapter;
  private _userRepository?: UserRepositoryAdapter;
  private _userSettingsRepository?: UserSettingsRepositoryAdapter;
  private _subscriptionRepository?: SubscriptionRepositoryAdapter;
  private _calendarEventRepository?: CalendarEventRepositoryAdapter;
  private _quoteRepository?: QuoteRepositoryAdapter;

  // Use Cases
  private _createExpenseUseCase?: CreateExpenseUseCase;
  private _getExpensesUseCase?: GetExpensesUseCase;
  private _updateExpenseUseCase?: UpdateExpenseUseCase;
  private _deleteExpenseUseCase?: DeleteExpenseUseCase;
  private _createExpensePresetUseCase?: CreateExpensePresetUseCase;
  private _getExpensePresetsUseCase?: GetExpensePresetsUseCase;
  private _updateExpensePresetUseCase?: UpdateExpensePresetUseCase;
  private _deleteExpensePresetUseCase?: DeleteExpensePresetUseCase;
  private _registerUserUseCase?: RegisterUserUseCase;
  private _loginUserUseCase?: LoginUserUseCase;
  private _getUserUseCase?: GetUserUseCase;
  private _updateUserUseCase?: UpdateUserUseCase;
  private _getUserSettingsUseCase?: GetUserSettingsUseCase;
  private _updateUserSettingsUseCase?: UpdateUserSettingsUseCase;
  private _createSubscriptionUseCase?: CreateSubscriptionUseCase;
  private _getSubscriptionsUseCase?: GetSubscriptionsUseCase;
  private _updateSubscriptionUseCase?: UpdateSubscriptionUseCase;
  private _deleteSubscriptionUseCase?: DeleteSubscriptionUseCase;
  private _createCalendarEventUseCase?: CreateCalendarEventUseCase;
  private _createQuoteUseCase?: CreateQuoteUseCase;

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
      // Strategy Pattern: Inject storage strategies
      const primaryStorage = new LocalStorageStrategy();
      const secondaryStorage = new GitHubStorageStrategy();
      this._storageService = new HybridStorageAdapter(primaryStorage, secondaryStorage);
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

  get expensePresetRepository(): ExpensePresetRepositoryAdapter {
    if (!this._expensePresetRepository) {
      this._expensePresetRepository = new ExpensePresetRepositoryAdapter(this.storageService);
    }
    return this._expensePresetRepository;
  }

  get userRepository(): UserRepositoryAdapter {
    if (!this._userRepository) {
      this._userRepository = new UserRepositoryAdapter(this.storageService);
    }
    return this._userRepository;
  }

  get userSettingsRepository(): UserSettingsRepositoryAdapter {
    if (!this._userSettingsRepository) {
      this._userSettingsRepository = new UserSettingsRepositoryAdapter(this.storageService);
    }
    return this._userSettingsRepository;
  }

  get subscriptionRepository(): SubscriptionRepositoryAdapter {
    if (!this._subscriptionRepository) {
      this._subscriptionRepository = new SubscriptionRepositoryAdapter(this.storageService);
    }
    return this._subscriptionRepository;
  }

  get calendarEventRepository(): CalendarEventRepositoryAdapter {
    if (!this._calendarEventRepository) {
      this._calendarEventRepository = new CalendarEventRepositoryAdapter(this.storageService);
    }
    return this._calendarEventRepository;
  }

  get quoteRepository(): QuoteRepositoryAdapter {
    if (!this._quoteRepository) {
      this._quoteRepository = new QuoteRepositoryAdapter(this.storageService);
    }
    return this._quoteRepository;
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

  // Use Cases - Expense Presets
  get createExpensePresetUseCase(): CreateExpensePresetUseCase {
    if (!this._createExpensePresetUseCase) {
      this._createExpensePresetUseCase = new CreateExpensePresetUseCase(
        this.expensePresetRepository
      );
    }
    return this._createExpensePresetUseCase;
  }

  get getExpensePresetsUseCase(): GetExpensePresetsUseCase {
    if (!this._getExpensePresetsUseCase) {
      this._getExpensePresetsUseCase = new GetExpensePresetsUseCase(
        this.expensePresetRepository
      );
    }
    return this._getExpensePresetsUseCase;
  }

  get updateExpensePresetUseCase(): UpdateExpensePresetUseCase {
    if (!this._updateExpensePresetUseCase) {
      this._updateExpensePresetUseCase = new UpdateExpensePresetUseCase(
        this.expensePresetRepository
      );
    }
    return this._updateExpensePresetUseCase;
  }

  get deleteExpensePresetUseCase(): DeleteExpensePresetUseCase {
    if (!this._deleteExpensePresetUseCase) {
      this._deleteExpensePresetUseCase = new DeleteExpensePresetUseCase(
        this.expensePresetRepository
      );
    }
    return this._deleteExpensePresetUseCase;
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

  get updateUserUseCase(): UpdateUserUseCase {
    if (!this._updateUserUseCase) {
      this._updateUserUseCase = new UpdateUserUseCase(this.userRepository);
    }
    return this._updateUserUseCase;
  }

  get getUserSettingsUseCase(): GetUserSettingsUseCase {
    if (!this._getUserSettingsUseCase) {
      this._getUserSettingsUseCase = new GetUserSettingsUseCase(this.userSettingsRepository);
    }
    return this._getUserSettingsUseCase;
  }

  get updateUserSettingsUseCase(): UpdateUserSettingsUseCase {
    if (!this._updateUserSettingsUseCase) {
      this._updateUserSettingsUseCase = new UpdateUserSettingsUseCase(this.userSettingsRepository);
    }
    return this._updateUserSettingsUseCase;
  }

  // Use Cases - Subscription
  get createSubscriptionUseCase(): CreateSubscriptionUseCase {
    if (!this._createSubscriptionUseCase) {
      this._createSubscriptionUseCase = new CreateSubscriptionUseCase(this.subscriptionRepository);
    }
    return this._createSubscriptionUseCase;
  }

  get getSubscriptionsUseCase(): GetSubscriptionsUseCase {
    if (!this._getSubscriptionsUseCase) {
      this._getSubscriptionsUseCase = new GetSubscriptionsUseCase(this.subscriptionRepository);
    }
    return this._getSubscriptionsUseCase;
  }

  get updateSubscriptionUseCase(): UpdateSubscriptionUseCase {
    if (!this._updateSubscriptionUseCase) {
      this._updateSubscriptionUseCase = new UpdateSubscriptionUseCase(this.subscriptionRepository);
    }
    return this._updateSubscriptionUseCase;
  }

  get deleteSubscriptionUseCase(): DeleteSubscriptionUseCase {
    if (!this._deleteSubscriptionUseCase) {
      this._deleteSubscriptionUseCase = new DeleteSubscriptionUseCase(this.subscriptionRepository);
    }
    return this._deleteSubscriptionUseCase;
  }

  // Use Cases - Other Features
  get createCalendarEventUseCase(): CreateCalendarEventUseCase {
    if (!this._createCalendarEventUseCase) {
      this._createCalendarEventUseCase = new CreateCalendarEventUseCase(this.calendarEventRepository);
    }
    return this._createCalendarEventUseCase;
  }

  get createQuoteUseCase(): CreateQuoteUseCase {
    if (!this._createQuoteUseCase) {
      this._createQuoteUseCase = new CreateQuoteUseCase(this.quoteRepository);
    }
    return this._createQuoteUseCase;
  }

  // Static convenience methods
  static createExpenseUseCase(): CreateExpenseUseCase {
    return Container.getInstance().createExpenseUseCase;
  }

  static getExpensesUseCase(): GetExpensesUseCase {
    return Container.getInstance().getExpensesUseCase;
  }

  static updateExpenseUseCase(): UpdateExpenseUseCase {
    return Container.getInstance().updateExpenseUseCase;
  }

  static deleteExpenseUseCase(): DeleteExpenseUseCase {
    return Container.getInstance().deleteExpenseUseCase;
  }

  static createExpensePresetUseCase(): CreateExpensePresetUseCase {
    return Container.getInstance().createExpensePresetUseCase;
  }

  static getExpensePresetsUseCase(): GetExpensePresetsUseCase {
    return Container.getInstance().getExpensePresetsUseCase;
  }

  static updateExpensePresetUseCase(): UpdateExpensePresetUseCase {
    return Container.getInstance().updateExpensePresetUseCase;
  }

  static deleteExpensePresetUseCase(): DeleteExpensePresetUseCase {
    return Container.getInstance().deleteExpensePresetUseCase;
  }

  static registerUserUseCase(): RegisterUserUseCase {
    return Container.getInstance().registerUserUseCase;
  }

  static loginUserUseCase(): LoginUserUseCase {
    return Container.getInstance().loginUserUseCase;
  }

  static getUserUseCase(): GetUserUseCase {
    return Container.getInstance().getUserUseCase;
  }

  static updateUserUseCase(): UpdateUserUseCase {
    return Container.getInstance().updateUserUseCase;
  }

  static getUserSettingsUseCase(): GetUserSettingsUseCase {
    return Container.getInstance().getUserSettingsUseCase;
  }

  static updateUserSettingsUseCase(): UpdateUserSettingsUseCase {
    return Container.getInstance().updateUserSettingsUseCase;
  }

  static createSubscriptionUseCase(): CreateSubscriptionUseCase {
    return Container.getInstance().createSubscriptionUseCase;
  }

  static getSubscriptionsUseCase(): GetSubscriptionsUseCase {
    return Container.getInstance().getSubscriptionsUseCase;
  }

  static updateSubscriptionUseCase(): UpdateSubscriptionUseCase {
    return Container.getInstance().updateSubscriptionUseCase;
  }

  static deleteSubscriptionUseCase(): DeleteSubscriptionUseCase {
    return Container.getInstance().deleteSubscriptionUseCase;
  }

  static createCalendarEventUseCase(): CreateCalendarEventUseCase {
    return Container.getInstance().createCalendarEventUseCase;
  }

  static createQuoteUseCase(): CreateQuoteUseCase {
    return Container.getInstance().createQuoteUseCase;
  }
}

export const container = Container.getInstance();
export { Container };
