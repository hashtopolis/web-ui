import { Title } from "@angular/platform-browser";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AutoTitleService {

  constructor(private titleService: Title) {}

/**
 * Set Page Title
 * @param title - inject title and join in array
 * @returns Nav Location
**/
  appTitle = ' - Hashtopolis';

  set(title: string | string[]){

    if(Array.isArray(title)){
      title = title.join(' ');
    }

    title = title.concat(this.appTitle);

    this.titleService.setTitle(title);

  }

}

