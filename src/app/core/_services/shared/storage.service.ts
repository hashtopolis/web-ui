import { dateFormat } from '../../../core/_constants/settings.config';
import { environment } from '../../../../environments/environment';
import { Injectable } from "@angular/core";

import { GlobalService } from 'src/app/core/_services/main.service';
import { SERV } from '../../../core/_services/main.config';
import { IStorage } from '../../_models/config-ui.model';

@Injectable({
  providedIn: 'root'
})
export class UIConfigService {

  defaultSettings = false;

  constructor(
    private gs: GlobalService,
  ) {}

  private maxResults = environment.config.prodApiMaxResults;

  cachevar= [
    // {name:'timefmt'},
    {name:'hashcatBrainEnable'},
    {name:'hashlistAlias'},
    {name:'blacklistChars'},
    {name:'chunktime'},
    {name:'agentStatLimit'},
    {name:'agentStatTension'},
    {name:'agentTempThreshold1'},
    {name:'agentTempThreshold2'},
    {name:'agentUtilThreshold1'},
    {name:'agentUtilThreshold2'},
    {name:'statustimer'},
    {name:'agenttimeout'},
    {name:'maxSessionLength'}
  ];

  cexprity: number = 72*60*60; // Hours*minutes*Seconds Default: 72 hours

  public checkStorage() {
    const defaults =  JSON.parse(localStorage.getItem('uis'));
    if (defaults) {  //Change to !defaults
        this.checkExpiry();
        return this.defaultSettings;
    } else if (!defaults) {
        this.storeDefault();
        this.defaultSettings = true;
    }
    return ''
  }

  public checkExpiry(){
    const timestamp =  this.getUIsettings('_timestamp').value || 0;
    const expires =  this.getUIsettings('_expiresin').value || 0;
    if((Date.now() - timestamp) < expires){
      this.storeDefault();
    }
  }

  public storeDefault(){
    const params = {'maxResults': this.maxResults}
    this.gs.getAll(SERV.CONFIGS,params).subscribe((result)=>{

      const post_data = [];

      this.cachevar.forEach((data) => {
        const name = data.name;
        let value = result.values.find(obj => obj.item === data.name).value;
        value = {name:name, value: value}
        post_data.push(value);
      });
      const timeinfo = [{name: '_timestamp', value: Date.now()},{name: '_expiresin', value: this.cexprity}];

      localStorage.setItem('uis', JSON.stringify([].concat(post_data,timeinfo)));
    });
  }

  public onUpdatingCheck(name: any){
    if(this.cachevar.some(e => e.name === name)){
      this.storeDefault();
    }
  }



  public getUIsettings(name?: string){
    const uiconfig = JSON.parse(localStorage.getItem('uis'));
    if (!uiconfig) {
      return null;
    }
    return uiconfig.find(o => o.name === name);
  }

}







