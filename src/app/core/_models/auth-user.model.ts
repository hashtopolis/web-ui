/**
 * Interface for authentication data
 * @prop _expires   Token expiry datetime
 * @prop _token     access token
 * @prop _username  Name of user
 */
export interface AuthData {
  _expires: Date;
  _token: string;
  _username: string;
}

/**
 * Class definition for user authentication
 * @implements AuthData
 */
export class AuthUser implements AuthData {
  constructor(
    public _token: string,
    public _expires: Date,
    public _username: string
  ) {}

  /**
   * Get token if it is not expired
   * @returns Token or null
   */
  get token(): string | null {
    if (!this._expires || new Date() > this._expires) {
      return null;
    }
    return this._token;
  }
}
