export interface BaseUser {
  userId: number
  username: string
  email: string
  rightGroupId: number
  registered: number
  lastLogin: number
  isValid: number
  sessionLifetime: number
}

export interface CreateUser extends BaseUser {
  username: string
  email: string
  rightGroupId: number
  isAdmin: number
}

export interface User {
  _id: number
  _self: string
  email: string
  globalPermissionGroupId: number
  id?: number
  isComputedPassword: boolean
  isValid: boolean
  lastLoginDate: number
  name: string
  otp1: string
  otp2: string
  otp3: string
  otp4: string
  registeredSince: number
  sessionLifetime: number
  yubikey: string
}