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
import { ProjectRepositoryAdapter } from '../repositories/ProjectRepositoryAdapter';
import { TaskRepositoryAdapter } from '../repositories/TaskRepositoryAdapter';
import { WishItemRepositoryAdapter } from '../repositories/WishItemRepositoryAdapter';
import { DashboardWidgetRepositoryAdapter } from '../repositories/DashboardWidgetRepositoryAdapter';
import { CloudinaryPhotoRepositoryAdapter } from '../repositories/CloudinaryPhotoRepositoryAdapter';
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
  GetCalendarEventsUseCase,
  UpdateCalendarEventUseCase,
  DeleteCalendarEventUseCase,
  CreateQuoteUseCase,
  GetQuotesUseCase,
  UpdateQuoteUseCase,
  DeleteQuoteUseCase,
  CreateProjectUseCase,
  GetProjectsUseCase,
  UpdateProjectUseCase,
  DeleteProjectUseCase,
  CreateTaskUseCase,
  GetTasksUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  CreateWishItemUseCase,
  GetWishItemsUseCase,
  UpdateWishItemUseCase,
  DeleteWishItemUseCase,
  GetDashboardWidgetsUseCase,
  UpdateDashboardWidgetUseCase,
  UpdateManyDashboardWidgetsUseCase,
  UploadPhotoUseCase,
  GetPhotosUseCase,
  GetPhotoByIdUseCase,
  UpdatePhotoCaptionUseCase,
  DeletePhotoUseCase,
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
  private _projectRepository?: ProjectRepositoryAdapter;
  private _taskRepository?: TaskRepositoryAdapter;
  private _wishItemRepository?: WishItemRepositoryAdapter;
  private _dashboardWidgetRepository?: DashboardWidgetRepositoryAdapter;
  private _photoRepository?: CloudinaryPhotoRepositoryAdapter;

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
  private _getCalendarEventsUseCase?: GetCalendarEventsUseCase;
  private _updateCalendarEventUseCase?: UpdateCalendarEventUseCase;
  private _deleteCalendarEventUseCase?: DeleteCalendarEventUseCase;
  private _createQuoteUseCase?: CreateQuoteUseCase;
  private _getQuotesUseCase?: GetQuotesUseCase;
  private _updateQuoteUseCase?: UpdateQuoteUseCase;
  private _deleteQuoteUseCase?: DeleteQuoteUseCase;
  private _createProjectUseCase?: CreateProjectUseCase;
  private _getProjectsUseCase?: GetProjectsUseCase;
  private _updateProjectUseCase?: UpdateProjectUseCase;
  private _deleteProjectUseCase?: DeleteProjectUseCase;
  private _createTaskUseCase?: CreateTaskUseCase;
  private _getTasksUseCase?: GetTasksUseCase;
  private _updateTaskUseCase?: UpdateTaskUseCase;
  private _deleteTaskUseCase?: DeleteTaskUseCase;
  private _createWishItemUseCase?: CreateWishItemUseCase;
  private _getWishItemsUseCase?: GetWishItemsUseCase;
  private _updateWishItemUseCase?: UpdateWishItemUseCase;
  private _deleteWishItemUseCase?: DeleteWishItemUseCase;
  private _getDashboardWidgetsUseCase?: GetDashboardWidgetsUseCase;
  private _updateDashboardWidgetUseCase?: UpdateDashboardWidgetUseCase;
  private _updateManyDashboardWidgetsUseCase?: UpdateManyDashboardWidgetsUseCase;
  private _uploadPhotoUseCase?: UploadPhotoUseCase;
  private _getPhotosUseCase?: GetPhotosUseCase;
  private _getPhotoByIdUseCase?: GetPhotoByIdUseCase;
  private _updatePhotoCaptionUseCase?: UpdatePhotoCaptionUseCase;
  private _deletePhotoUseCase?: DeletePhotoUseCase;

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

  get projectRepository(): ProjectRepositoryAdapter {
    if (!this._projectRepository) {
      this._projectRepository = new ProjectRepositoryAdapter(this.storageService);
    }
    return this._projectRepository;
  }

  get taskRepository(): TaskRepositoryAdapter {
    if (!this._taskRepository) {
      this._taskRepository = new TaskRepositoryAdapter(this.storageService);
    }
    return this._taskRepository;
  }

  get wishItemRepository(): WishItemRepositoryAdapter {
    if (!this._wishItemRepository) {
      this._wishItemRepository = new WishItemRepositoryAdapter(this.storageService);
    }
    return this._wishItemRepository;
  }

  get dashboardWidgetRepository(): DashboardWidgetRepositoryAdapter {
    if (!this._dashboardWidgetRepository) {
      this._dashboardWidgetRepository = new DashboardWidgetRepositoryAdapter(this.storageService);
    }
    return this._dashboardWidgetRepository;
  }

  get photoRepository(): CloudinaryPhotoRepositoryAdapter {
    if (!this._photoRepository) {
      this._photoRepository = new CloudinaryPhotoRepositoryAdapter(this.storageService);
    }
    return this._photoRepository;
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

  get getCalendarEventsUseCase(): GetCalendarEventsUseCase {
    if (!this._getCalendarEventsUseCase) {
      this._getCalendarEventsUseCase = new GetCalendarEventsUseCase(this.calendarEventRepository);
    }
    return this._getCalendarEventsUseCase;
  }

  get updateCalendarEventUseCase(): UpdateCalendarEventUseCase {
    if (!this._updateCalendarEventUseCase) {
      this._updateCalendarEventUseCase = new UpdateCalendarEventUseCase(this.calendarEventRepository);
    }
    return this._updateCalendarEventUseCase;
  }

  get deleteCalendarEventUseCase(): DeleteCalendarEventUseCase {
    if (!this._deleteCalendarEventUseCase) {
      this._deleteCalendarEventUseCase = new DeleteCalendarEventUseCase(this.calendarEventRepository);
    }
    return this._deleteCalendarEventUseCase;
  }

  get createQuoteUseCase(): CreateQuoteUseCase {
    if (!this._createQuoteUseCase) {
      this._createQuoteUseCase = new CreateQuoteUseCase(this.quoteRepository);
    }
    return this._createQuoteUseCase;
  }

  get getQuotesUseCase(): GetQuotesUseCase {
    if (!this._getQuotesUseCase) {
      this._getQuotesUseCase = new GetQuotesUseCase(this.quoteRepository);
    }
    return this._getQuotesUseCase;
  }

  get updateQuoteUseCase(): UpdateQuoteUseCase {
    if (!this._updateQuoteUseCase) {
      this._updateQuoteUseCase = new UpdateQuoteUseCase(this.quoteRepository);
    }
    return this._updateQuoteUseCase;
  }

  get deleteQuoteUseCase(): DeleteQuoteUseCase {
    if (!this._deleteQuoteUseCase) {
      this._deleteQuoteUseCase = new DeleteQuoteUseCase(this.quoteRepository);
    }
    return this._deleteQuoteUseCase;
  }

  // Use Cases - Project
  get createProjectUseCase(): CreateProjectUseCase {
    if (!this._createProjectUseCase) {
      this._createProjectUseCase = new CreateProjectUseCase(this.projectRepository);
    }
    return this._createProjectUseCase;
  }

  get getProjectsUseCase(): GetProjectsUseCase {
    if (!this._getProjectsUseCase) {
      this._getProjectsUseCase = new GetProjectsUseCase(this.projectRepository);
    }
    return this._getProjectsUseCase;
  }

  get updateProjectUseCase(): UpdateProjectUseCase {
    if (!this._updateProjectUseCase) {
      this._updateProjectUseCase = new UpdateProjectUseCase(this.projectRepository);
    }
    return this._updateProjectUseCase;
  }

  get deleteProjectUseCase(): DeleteProjectUseCase {
    if (!this._deleteProjectUseCase) {
      this._deleteProjectUseCase = new DeleteProjectUseCase(this.projectRepository);
    }
    return this._deleteProjectUseCase;
  }

  // Use Cases - Task
  get createTaskUseCase(): CreateTaskUseCase {
    if (!this._createTaskUseCase) {
      this._createTaskUseCase = new CreateTaskUseCase(this.taskRepository);
    }
    return this._createTaskUseCase;
  }

  get getTasksUseCase(): GetTasksUseCase {
    if (!this._getTasksUseCase) {
      this._getTasksUseCase = new GetTasksUseCase(this.taskRepository);
    }
    return this._getTasksUseCase;
  }

  get updateTaskUseCase(): UpdateTaskUseCase {
    if (!this._updateTaskUseCase) {
      this._updateTaskUseCase = new UpdateTaskUseCase(this.taskRepository);
    }
    return this._updateTaskUseCase;
  }

  get deleteTaskUseCase(): DeleteTaskUseCase {
    if (!this._deleteTaskUseCase) {
      this._deleteTaskUseCase = new DeleteTaskUseCase(this.taskRepository);
    }
    return this._deleteTaskUseCase;
  }

  // Use Cases - WishItem
  get createWishItemUseCase(): CreateWishItemUseCase {
    if (!this._createWishItemUseCase) {
      this._createWishItemUseCase = new CreateWishItemUseCase(this.wishItemRepository);
    }
    return this._createWishItemUseCase;
  }

  get getWishItemsUseCase(): GetWishItemsUseCase {
    if (!this._getWishItemsUseCase) {
      this._getWishItemsUseCase = new GetWishItemsUseCase(this.wishItemRepository);
    }
    return this._getWishItemsUseCase;
  }

  get updateWishItemUseCase(): UpdateWishItemUseCase {
    if (!this._updateWishItemUseCase) {
      this._updateWishItemUseCase = new UpdateWishItemUseCase(this.wishItemRepository);
    }
    return this._updateWishItemUseCase;
  }

  get deleteWishItemUseCase(): DeleteWishItemUseCase {
    if (!this._deleteWishItemUseCase) {
      this._deleteWishItemUseCase = new DeleteWishItemUseCase(this.wishItemRepository);
    }
    return this._deleteWishItemUseCase;
  }

  // Use Cases - DashboardWidget
  get getDashboardWidgetsUseCase(): GetDashboardWidgetsUseCase {
    if (!this._getDashboardWidgetsUseCase) {
      this._getDashboardWidgetsUseCase = new GetDashboardWidgetsUseCase(this.dashboardWidgetRepository);
    }
    return this._getDashboardWidgetsUseCase;
  }

  get updateDashboardWidgetUseCase(): UpdateDashboardWidgetUseCase {
    if (!this._updateDashboardWidgetUseCase) {
      this._updateDashboardWidgetUseCase = new UpdateDashboardWidgetUseCase(this.dashboardWidgetRepository);
    }
    return this._updateDashboardWidgetUseCase;
  }

  get updateManyDashboardWidgetsUseCase(): UpdateManyDashboardWidgetsUseCase {
    if (!this._updateManyDashboardWidgetsUseCase) {
      this._updateManyDashboardWidgetsUseCase = new UpdateManyDashboardWidgetsUseCase(this.dashboardWidgetRepository);
    }
    return this._updateManyDashboardWidgetsUseCase;
  }

  // Use Cases - Photo
  get uploadPhotoUseCase(): UploadPhotoUseCase {
    if (!this._uploadPhotoUseCase) {
      this._uploadPhotoUseCase = new UploadPhotoUseCase(this.photoRepository);
    }
    return this._uploadPhotoUseCase;
  }

  get getPhotosUseCase(): GetPhotosUseCase {
    if (!this._getPhotosUseCase) {
      this._getPhotosUseCase = new GetPhotosUseCase(this.photoRepository);
    }
    return this._getPhotosUseCase;
  }

  get getPhotoByIdUseCase(): GetPhotoByIdUseCase {
    if (!this._getPhotoByIdUseCase) {
      this._getPhotoByIdUseCase = new GetPhotoByIdUseCase(this.photoRepository);
    }
    return this._getPhotoByIdUseCase;
  }

  get updatePhotoCaptionUseCase(): UpdatePhotoCaptionUseCase {
    if (!this._updatePhotoCaptionUseCase) {
      this._updatePhotoCaptionUseCase = new UpdatePhotoCaptionUseCase(this.photoRepository);
    }
    return this._updatePhotoCaptionUseCase;
  }

  get deletePhotoUseCase(): DeletePhotoUseCase {
    if (!this._deletePhotoUseCase) {
      this._deletePhotoUseCase = new DeletePhotoUseCase(this.photoRepository);
    }
    return this._deletePhotoUseCase;
  }
}

export const container = Container.getInstance();
export { Container };
