import type { ErrorResponse, NotFoundResponse } from './common';

export type NotificationSettingCreate = {
  data: {
    type: 'notificationSetting';
    attributes: {
      actionFilter: string;
      action: 'createNotification' | 'setActive' | 'deleteNotification';
      notification:
        | 'taskComplete'
        | 'agentError'
        | 'ownAgentError'
        | 'logError'
        | 'newTask'
        | 'newHashlist'
        | 'hashlistAllCracked'
        | 'hashlistCrackedHash'
        | 'userCreated'
        | 'userDeleted'
        | 'userLoginFailed'
        | 'logWarn'
        | 'logFatal'
        | 'newAgent'
        | 'deleteTask'
        | 'deleteHashlist'
        | 'deleteAgent';
      receiver: string;
    };
  };
};

export type NotificationSettingPatch = {
  data: {
    type: 'notificationSetting';
    attributes: {
      action?: 'createNotification' | 'setActive' | 'deleteNotification';
      isActive?: boolean;
      notification?:
        | 'taskComplete'
        | 'agentError'
        | 'ownAgentError'
        | 'logError'
        | 'newTask'
        | 'newHashlist'
        | 'hashlistAllCracked'
        | 'hashlistCrackedHash'
        | 'userCreated'
        | 'userDeleted'
        | 'userLoginFailed'
        | 'logWarn'
        | 'logFatal'
        | 'newAgent'
        | 'deleteTask'
        | 'deleteHashlist'
        | 'deleteAgent';
      receiver?: string;
    };
  };
};

export type NotificationSettingResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links?: {
    self: string;
    first?: string;
    last?: string;
    next?: string | null;
    previous?: string | null;
  };
  data: {
    id: number;
    type: 'notificationSetting';
    attributes: {
      action: 'createNotification' | 'setActive' | 'deleteNotification';
      objectId: number;
      notification:
        | 'taskComplete'
        | 'agentError'
        | 'ownAgentError'
        | 'logError'
        | 'newTask'
        | 'newHashlist'
        | 'hashlistAllCracked'
        | 'hashlistCrackedHash'
        | 'userCreated'
        | 'userDeleted'
        | 'userLoginFailed'
        | 'logWarn'
        | 'logFatal'
        | 'newAgent'
        | 'deleteTask'
        | 'deleteHashlist'
        | 'deleteAgent';
      userId: number;
      receiver: string;
      isActive: boolean;
    };
  };
  relationships?: {
    user: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'user';
        id: number;
      } | null;
    };
  };
  included?: Array<{
    id: number;
    type: 'user';
    attributes: {
      name: string;
      email: string;
      isValid: boolean;
      isComputedPassword: boolean;
      lastLoginDate: number;
      registeredSince: number;
      sessionLifetime: number;
      globalPermissionGroupId: number;
      yubikey: string;
      otp1: string;
      otp2: string;
      otp3: string;
      otp4: string;
    };
  }>;
};

export type NotificationSettingPostPatchResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  data: {
    id: number;
    type: 'notificationSetting';
    attributes: {
      action: 'createNotification' | 'setActive' | 'deleteNotification';
      objectId: number;
      notification:
        | 'taskComplete'
        | 'agentError'
        | 'ownAgentError'
        | 'logError'
        | 'newTask'
        | 'newHashlist'
        | 'hashlistAllCracked'
        | 'hashlistCrackedHash'
        | 'userCreated'
        | 'userDeleted'
        | 'userLoginFailed'
        | 'logWarn'
        | 'logFatal'
        | 'newAgent'
        | 'deleteTask'
        | 'deleteHashlist'
        | 'deleteAgent';
      userId: number;
      receiver: string;
      isActive: boolean;
    };
  };
};

export type NotificationSettingListResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links?: {
    self: string;
    first?: string;
    last?: string;
    next?: string | null;
    previous?: string | null;
  };
  data: Array<{
    id: number;
    type: 'notificationSetting';
    attributes: {
      action: 'createNotification' | 'setActive' | 'deleteNotification';
      objectId: number;
      notification:
        | 'taskComplete'
        | 'agentError'
        | 'ownAgentError'
        | 'logError'
        | 'newTask'
        | 'newHashlist'
        | 'hashlistAllCracked'
        | 'hashlistCrackedHash'
        | 'userCreated'
        | 'userDeleted'
        | 'userLoginFailed'
        | 'logWarn'
        | 'logFatal'
        | 'newAgent'
        | 'deleteTask'
        | 'deleteHashlist'
        | 'deleteAgent';
      userId: number;
      receiver: string;
      isActive: boolean;
    };
  }>;
  relationships?: {
    user: {
      links: {
        self: string;
        related: string;
      };
      data?: {
        type: 'user';
        id: number;
      } | null;
    };
  };
  included?: Array<{
    id: number;
    type: 'user';
    attributes: {
      name: string;
      email: string;
      isValid: boolean;
      isComputedPassword: boolean;
      lastLoginDate: number;
      registeredSince: number;
      sessionLifetime: number;
      globalPermissionGroupId: number;
      yubikey: string;
      otp1: string;
      otp2: string;
      otp3: string;
      otp4: string;
    };
  }>;
};

export type NotificationSettingRelationUser = {
  data: {
    type: 'user';
    id: number;
  };
};

export type NotificationSettingRelationUserGetResponse = {
  data: {
    type: 'user';
    id: number;
  };
};

export type DeleteNotificationsData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/ui/notifications';
};

export type DeleteNotificationsErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type DeleteNotificationsError = DeleteNotificationsErrors[keyof DeleteNotificationsErrors];

export type DeleteNotificationsResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetNotificationsData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Pointer to paginate to retrieve the data after the value provided
     */
    'page[after]'?: number;
    /**
     * Pointer to paginate to retrieve the data before the value provided
     */
    'page[before]'?: number;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query
     */
    filter?: {
      [key: string]: unknown;
    };
    /**
     * Items to include, comma seperated. Possible options: Array
     */
    include?: string;
  };
  url: '/api/v2/ui/notifications';
};

export type GetNotificationsErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetNotificationsError = GetNotificationsErrors[keyof GetNotificationsErrors];

export type GetNotificationsResponses = {
  /**
   * successful operation
   */
  200: NotificationSettingListResponse;
};

export type GetNotificationsResponse = GetNotificationsResponses[keyof GetNotificationsResponses];

export type PatchNotificationsData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/ui/notifications';
};

export type PatchNotificationsErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PatchNotificationsError = PatchNotificationsErrors[keyof PatchNotificationsErrors];

export type PatchNotificationsResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type PostNotificationsData = {
  body: NotificationSettingCreate;
  path?: never;
  query?: never;
  url: '/api/v2/ui/notifications';
};

export type PostNotificationsErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type PostNotificationsError = PostNotificationsErrors[keyof PostNotificationsErrors];

export type PostNotificationsResponses = {
  /**
   * successful operation
   */
  201: NotificationSettingPostPatchResponse;
};

export type PostNotificationsResponse = PostNotificationsResponses[keyof PostNotificationsResponses];

export type GetNotificationsCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Pointer to paginate to retrieve the data after the value provided
     */
    'page[after]'?: number;
    /**
     * Pointer to paginate to retrieve the data before the value provided
     */
    'page[before]'?: number;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query
     */
    filter?: {
      [key: string]: unknown;
    };
    /**
     * Items to include, comma seperated. Possible options: Array
     */
    include?: string;
  };
  url: '/api/v2/ui/notifications/count';
};

export type GetNotificationsCountErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
};

export type GetNotificationsCountError = GetNotificationsCountErrors[keyof GetNotificationsCountErrors];

export type GetNotificationsCountResponses = {
  /**
   * successful operation
   */
  200: NotificationSettingListResponse;
};

export type GetNotificationsCountResponse = GetNotificationsCountResponses[keyof GetNotificationsCountResponses];

export type GetNotificationsByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/notifications/{id}/{relation}';
};

export type GetNotificationsByIdByRelationErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Not Found
   */
  404: NotFoundResponse;
};

export type GetNotificationsByIdByRelationError =
  GetNotificationsByIdByRelationErrors[keyof GetNotificationsByIdByRelationErrors];

export type GetNotificationsByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: NotificationSettingRelationUserGetResponse;
};

export type GetNotificationsByIdByRelationResponse =
  GetNotificationsByIdByRelationResponses[keyof GetNotificationsByIdByRelationResponses];

export type GetNotificationsByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/notifications/{id}/relationships/{relation}';
};

export type GetNotificationsByIdRelationshipsByRelationErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Not Found
   */
  404: NotFoundResponse;
};

export type GetNotificationsByIdRelationshipsByRelationError =
  GetNotificationsByIdRelationshipsByRelationErrors[keyof GetNotificationsByIdRelationshipsByRelationErrors];

export type GetNotificationsByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: NotificationSettingResponse;
};

export type GetNotificationsByIdRelationshipsByRelationResponse =
  GetNotificationsByIdRelationshipsByRelationResponses[keyof GetNotificationsByIdRelationshipsByRelationResponses];

export type PatchNotificationsByIdRelationshipsByRelationData = {
  body: NotificationSettingRelationUser;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/notifications/{id}/relationships/{relation}';
};

export type PatchNotificationsByIdRelationshipsByRelationErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Not Found
   */
  404: NotFoundResponse;
};

export type PatchNotificationsByIdRelationshipsByRelationError =
  PatchNotificationsByIdRelationshipsByRelationErrors[keyof PatchNotificationsByIdRelationshipsByRelationErrors];

export type PatchNotificationsByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchNotificationsByIdRelationshipsByRelationResponse =
  PatchNotificationsByIdRelationshipsByRelationResponses[keyof PatchNotificationsByIdRelationshipsByRelationResponses];

export type DeleteNotificationsByIdData = {
  body: {
    [key: string]: unknown;
  };
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/notifications/{id}';
};

export type DeleteNotificationsByIdErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Not Found
   */
  404: NotFoundResponse;
};

export type DeleteNotificationsByIdError = DeleteNotificationsByIdErrors[keyof DeleteNotificationsByIdErrors];

export type DeleteNotificationsByIdResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteNotificationsByIdResponse = DeleteNotificationsByIdResponses[keyof DeleteNotificationsByIdResponses];

export type GetNotificationsByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: {
    /**
     * Items to include. Comma seperated
     */
    include?: string;
  };
  url: '/api/v2/ui/notifications/{id}';
};

export type GetNotificationsByIdErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Not Found
   */
  404: NotFoundResponse;
};

export type GetNotificationsByIdError = GetNotificationsByIdErrors[keyof GetNotificationsByIdErrors];

export type GetNotificationsByIdResponses = {
  /**
   * successful operation
   */
  200: NotificationSettingResponse;
};

export type GetNotificationsByIdResponse = GetNotificationsByIdResponses[keyof GetNotificationsByIdResponses];

export type PatchNotificationsByIdData = {
  body: NotificationSettingPatch;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/ui/notifications/{id}';
};

export type PatchNotificationsByIdErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Not Found
   */
  404: NotFoundResponse;
};

export type PatchNotificationsByIdError = PatchNotificationsByIdErrors[keyof PatchNotificationsByIdErrors];

export type PatchNotificationsByIdResponses = {
  /**
   * successful operation
   */
  200: NotificationSettingPostPatchResponse;
};

export type PatchNotificationsByIdResponse = PatchNotificationsByIdResponses[keyof PatchNotificationsByIdResponses];
