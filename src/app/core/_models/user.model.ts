export interface BaseUser {
  userId: number;
  username: string;
  email: string;
  rightGroupId: number;
  registered: number;
  lastLogin: number;
  isValid: number;
  sessionLifetime: number;
}

export interface CreateUser extends BaseUser {
  username: string;
  email: string;
  rightGroupId: number;
  isAdmin: number;
}
