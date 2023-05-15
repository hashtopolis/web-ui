import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  defaultSettings = false;

  constructor() {}

  public checkDefault(defaults: boolean, e: any, COOKIE: string, VALUE: string, EXPIRE_DAYS: number) {
    if (defaults === true) {
        return this.defaultSettings;
    } else if (defaults === false) {
        this.setCookie(COOKIE, VALUE, EXPIRE_DAYS);
        this.defaultSettings = true;
        e.preventDefault();
    }
    return ''
  }

  public checkDefaultCookies(){
    var def_autorefresh:any = {active:false, value: '10'};
    const defCookies = [{name: 'tooltip', value: '0', expiry: 365},{name: 'autorefresh', value:  JSON.stringify(def_autorefresh), expiry: 365}];
    let defCookiesLen = defCookies.length;
    for (let i  = 0; i < defCookiesLen; i += 1) {
      var name = defCookies[i].name;
      var value = defCookies[i].value;
      var expiry = defCookies[i].expiry;
      let checkTooltip_exist = this.getCookie(name) ? true: false;
      this.checkDefault(checkTooltip_exist,false,name,value,expiry);
    }
  }

  public getCookie(name: string) {
    const ca: Array<string> = decodeURIComponent(document.cookie).split(';');
    const caLen: number = ca.length;
    const cookieName = `${name}=`;
    let c: string;

    for (let i  = 0; i < caLen; i += 1) {
        c = ca[i].replace(/^\s+/g, '');
        if (c.indexOf(cookieName) === 0) {
            return c.substring(cookieName.length, c.length);
        }
    }
    return '';
  }

  public setCookie(name: string, value: string, expireDays: number, path: string = '') {
    const d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    const cpath = path ? `; path=${path}` : '';
    document.cookie = `${name}=${value}; ${expires}${cpath}; SameSite=Lax`;
  }

  public deleteCookie(name) {
    this.setCookie(name, '', -1);
  }


}


