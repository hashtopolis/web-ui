import { faServer, faTasks, faDatabase, faFileArchive, faCogs, faUserGroup,faPowerOff, faSun, faMoon, faUserCircle, faInbox, faQuestionCircle, faBell, faEye, faExchange, faArrowsH } from '@fortawesome/free-solid-svg-icons';
import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { environment } from './../../../environments/environment';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { AuthService } from '../../core/_services/access/auth.service';
import { ThemeService } from 'src/app/core/_services/shared/theme.service';
import { NotificationsBellService } from '../../core/_services/shared/notifbell.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
  headerConfig = environment.config.header;

  isAuthentificated = false;
  isMobile = false;
  private userSub: Subscription;
  public dropdown: NgbDropdown;
  storedToggletheme:string = localStorage.getItem('toggledarkmode');
  storedWidthScreentheme:string = localStorage.getItem('screenmode') || 'true';

  // Icons User Menu
  faFileArchive=faFileArchive;
  faUserGroup=faUserGroup;
  faDatabase=faDatabase;
  faServer=faServer;
  faTasks=faTasks;
  faCogs=faCogs;
  // SubMenu User
  faQuestionCircle=faQuestionCircle;
  faUserCircle=faUserCircle;
  faPowerOff=faPowerOff;
  faExchange=faExchange;
  faArrowsH=faArrowsH;
  faInbox=faInbox;
  faMoon=faMoon;
  faBell=faBell;
  faSun=faSun;
  faEye=faEye;

  public notifbell: {title: string, description: string, datetime: string}[] = [];

  constructor(
    private notificationbService: NotificationsBellService,
    private authService: AuthService,
    private theme: ThemeService,
    private ren: Renderer2,
    ) { }

  collapsed = true;
  public toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  public currentTheme(): string {
    return this.theme.current;
  }

  public getUser(){
    const userData: { _username: string} = JSON.parse(localStorage.getItem('userData'));
    return userData._username;
  }

  ngOnInit(): void {
    this.userSub = this.authService.user
        .subscribe(user => {
          this.isAuthentificated = !!user;
    });

    // this.notificationbService.getNoficationsBell().subscribe((nb: any) => {
    //   this.notifbell = nb;
    // });

  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onLogOut(){
    this.authService.logOut();
  }

  switchMode(){
    if(this.storedToggletheme === 'dark'){
      localStorage.setItem('toggledarkmode','light')
      this.storedToggletheme = localStorage.getItem('toggledarkmode');
    }else{
      localStorage.setItem('toggledarkmode','dark')
      this.storedToggletheme = localStorage.getItem('toggledarkmode');
    }
  }

  switchScreen(){
    if(this.storedWidthScreentheme === 'true'){
      localStorage.setItem('screenmode','false')
      this.storedWidthScreentheme = localStorage.getItem('screenmode');
    }else{
      localStorage.setItem('screenmode','true')
      this.storedWidthScreentheme = localStorage.getItem('screenmode');
    }
    location.reload();
  }


  onMouseEnter(drop:NgbDropdown){
    drop.open()
  }

  onMouseLeave(drop:NgbDropdown){
    drop.close()
  }

}




