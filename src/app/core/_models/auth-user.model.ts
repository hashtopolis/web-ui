export interface UserData {
  _expires: Date
  _token: string
  _username: string
}

export class User {
  constructor(
    private _token: string,
    private _expires: Date,
    private _username: string
  ) { }

  get token() {
    if (!this._expires || new Date() > this._expires) {
      return null
    }
    return this._token
  }
}
