import type { ErrorResponse } from './common';

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

export type NotificationSettingPatchMultiple = {
  data: Array<{
    id: string;
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
  }>;
};

export type NotificationSettingDeleteMultiple = {
  data: Array<{
    id: string;
    type: 'notificationSetting';
  }>;
};

export type NotificationSettingResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'notificationSetting';
    attributes: {
      action: 'createNotification' | 'setActive' | 'deleteNotification';
      objectId: number | null;
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
      userId: string;
      receiver: string;
      isActive: boolean;
    };
    links: {
      self: string;
    };
    relationships: {
      user: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'user';
          id: string;
        } | null;
      };
    };
  };
  included?: Array<{
    id: string;
    type: 'user';
    attributes: {
      name: string;
      email: string;
      isValid: boolean;
      isComputedPassword: boolean;
      lastLoginDate: number;
      registeredSince: number;
      sessionLifetime: number;
      globalPermissionGroupId: string;
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
  links: {
    self: string;
  };
  data: {
    id: string;
    type: 'notificationSetting';
    attributes: {
      action: 'createNotification' | 'setActive' | 'deleteNotification';
      objectId: number | null;
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
      userId: string;
      receiver: string;
      isActive: boolean;
    };
    links: {
      self: string;
    };
    relationships: {
      user: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'user';
          id: string;
        } | null;
      };
    };
  };
  included?: Array<{
    id: string;
    type: 'user';
    attributes: {
      name: string;
      email: string;
      isValid: boolean;
      isComputedPassword: boolean;
      lastLoginDate: number;
      registeredSince: number;
      sessionLifetime: number;
      globalPermissionGroupId: string;
      yubikey: string;
      otp1: string;
      otp2: string;
      otp3: string;
      otp4: string;
    };
  }>;
};

export type NotificationSettingListResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  links: {
    self: string;
    first: string;
    last: string | null;
    next: string | null;
    prev: string | null;
  };
  meta: {
    page: {
      total_elements: number;
    };
  };
  data: Array<{
    id: string;
    type: 'notificationSetting';
    attributes: {
      action: 'createNotification' | 'setActive' | 'deleteNotification';
      objectId: number | null;
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
      userId: string;
      receiver: string;
      isActive: boolean;
    };
    links: {
      self: string;
    };
    relationships: {
      user: {
        links: {
          self: string;
          related: string;
        };
        data?: {
          type: 'user';
          id: string;
        } | null;
      };
    };
  }>;
  included?: Array<{
    id: string;
    type: 'user';
    attributes: {
      name: string;
      email: string;
      isValid: boolean;
      isComputedPassword: boolean;
      lastLoginDate: number;
      registeredSince: number;
      sessionLifetime: number;
      globalPermissionGroupId: string;
      yubikey: string;
      otp1: string;
      otp2: string;
      otp3: string;
      otp4: string;
    };
  }>;
};

export type NotificationSettingCountResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  meta: {
    /**
     * Number of objects matching the given filters
     */
    count: number;
    /**
     * Number of objects without any filter applied, only present when `include_total=true` was requested
     */
    total_count?: number;
  };
  /**
   * Always empty: the count is reported under meta.
   */
  data: Array<{
    [key: string]: unknown;
  }>;
};

export type NotificationSettingRelationUser = {
  data: {
    type: 'user';
    id: string;
  };
};

export type NotificationSettingRelationUserGetResponse = {
  data: {
    type: 'user';
    id: string;
  };
};

export type DeleteNotificationsData = {
  body: NotificationSettingDeleteMultiple;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type DeleteNotificationsError = DeleteNotificationsErrors[keyof DeleteNotificationsErrors];

export type DeleteNotificationsResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteNotificationsResponse = DeleteNotificationsResponses[keyof DeleteNotificationsResponses];

export type GetNotificationsData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Pointer to paginate to retrieve the data after the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"notificationSettingId": 123}}` -> `eyJwcmltYXJ5Ijp7Im5vdGlmaWNhdGlvblNldHRpbmdJZCI6IDEyM319`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"notificationSettingId": 123}}` -> `eyJwcmltYXJ5Ijp7Im5vdGlmaWNhdGlvblNldHRpbmdJZCI6IDEyM319`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[notificationSettingId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: user
     */
    include?: Array<'user'>;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
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
  body: NotificationSettingPatchMultiple;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Resource already exists
   */
  409: ErrorResponse;
};

export type PatchNotificationsError = PatchNotificationsErrors[keyof PatchNotificationsErrors];

export type PatchNotificationsResponses = {
  /**
   * successfully updated
   */
  204: void;
};

export type PatchNotificationsResponse = PatchNotificationsResponses[keyof PatchNotificationsResponses];

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
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Resource already exists
   */
  409: ErrorResponse;
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
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[notificationSettingId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
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
  /**
   * Permission denied
   */
  403: ErrorResponse;
};

export type GetNotificationsCountError = GetNotificationsCountErrors[keyof GetNotificationsCountErrors];

export type GetNotificationsCountResponses = {
  /**
   * successful operation
   */
  200: NotificationSettingCountResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Resource already exists
   */
  409: ErrorResponse;
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
  body?: never;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
     * Relationships to include in the response, comma seperated. Possible options: user
     */
    include?: Array<'user'>;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
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
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Resource already exists
   */
  409: ErrorResponse;
};

export type PatchNotificationsByIdError = PatchNotificationsByIdErrors[keyof PatchNotificationsByIdErrors];

export type PatchNotificationsByIdResponses = {
  /**
   * successful operation
   */
  200: NotificationSettingPostPatchResponse;
};

export type PatchNotificationsByIdResponse = PatchNotificationsByIdResponses[keyof PatchNotificationsByIdResponses];
