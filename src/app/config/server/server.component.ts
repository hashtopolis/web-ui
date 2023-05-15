import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params } from '@angular/router';
import { environment } from './../../../environments/environment';
import { faHomeAlt, faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { ConfigService } from '../../core/_services/config/config.service';
import { CookieService } from '../../core/_services/shared/cookies.service';
import { TooltipService } from '../../core/_services/shared/tooltip.service';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { dateFormat, serverlog, proxytype } from '../../core/_constants/settings.config';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html'
})
export class ServerComponent implements OnInit {

  faHome=faHomeAlt;
  faInfoCircle=faInfoCircle;
  faExclamationTriangle=faExclamationTriangle;
  isLoading = false;

  whichView: string;

  constructor(
    private configService: ConfigService,
    private cookieService: CookieService,
    private uicService: UIConfigService,
    private tooltipService: TooltipService,
    private route:ActivatedRoute,
    private store: Store<{configList: {}}>
  ) { }

  private maxResults = environment.config.prodApiMaxResults;

  // public config: {agenttimeout: number, benchtime: number, chunktime: number, chunktimeout: number, fieldseparator: string, hashlistAlias: string, statustime: number, timefmt: string, blacklistChars: string, numLogEntries: number, disptolerance: number, batchSize: number, yubikey_id: string,yubikey_key: string, yubikey_url: string, pagingSize: string, PlaintextMaxLength: number, hashMaxLength: number, emailSender: string, emailSenderName: string, baseHost: string, maxHashlistSize: number, hideImportMasks: number, telegramBotToken: string, contactEmail: string, voucherDeletion: number, hashesPerPage: number, hideIpInfo: number, defaultBenchmark: number, showTaskPerformance: number, ruleSplitSmallTasks: number, ruleSplitAlways: number,ruleSplitDisable: number, agentStatLimit: number, agentDataLifetime: number, agentStatTension: number, multicastEnable: number, multicastDevice: string, multicastTransferRateEnable: number, multicastTranserRate: number, disableTrimming: number, serverLogLevel: number, notificationsProxyEnable: number, notificationsProxyServer: string, notificationsProxyPort: number, notificationsProxyType: string, priority0Start: number, baseUrl: string, maxSessionLength: number,hashcatBrainEnable: number, hashcatBrainHost: string, hashcatBrainPort: number, hashcatBrainPass: string, hashlistImportCheck: number, allowDeregister: number, agentTempThreshold1: number, agentTempThreshold2: number, agentUtilThreshold1: number, agentUtilThreshold2: number, uApiSendTaskIsComplete: number, hcErrorIgnore: string}[] = [];

  public config: {configId: number, configSectionId: number, item: string, value: number}[] = [];

  agentForm: FormGroup;
  tcForm: FormGroup;
  hchForm: FormGroup;
  notifForm: FormGroup;
  gsForm: FormGroup;
  taskcookieForm: FormGroup
  cookieForm: FormGroup;

  serverlog = serverlog;
  proxytype = proxytype;
  dateFormat = dateFormat;

  // Tooltips
  atip: any =[]
  tctip: any =[]
  hchtip: any =[]
  notiftip: any =[]
  gstip: any =[]

  ngOnInit(): void {

    this.store.select('configList');

    this.route.data.subscribe(data => {
      switch (data['kind']) {

        case 'agent':
          this.whichView = 'agent';
          this.agentForm = new FormGroup({
            'agenttimeout': new FormControl(),
            'benchtime': new FormControl(),
            'statustimer': new FormControl(),
            'agentDataLifetime': new FormControl(),
            'hideIpInfo': new FormControl(),
            'voucherDeletion': new FormControl(),
            'agentStatLimit': new FormControl(),
            'agentStatTension': new FormControl(),
            'agentTempThreshold1': new FormControl(),
            'agentTempThreshold2': new FormControl(),
            'agentUtilThreshold1': new FormControl(),
            'agentUtilThreshold2': new FormControl(),
          });
          this.initAgentForm();
          this.atip = this.tooltipService.getConfigTooltips().agent;
        break;

        case 'task-chunk':
          this.whichView = 'task-chunk';
          this.tcForm = new FormGroup({
            'chunktime': new FormControl(),
            'disptolerance': new FormControl(),
            'defaultBenchmark': new FormControl(),
            'disableTrimming': new FormControl(),
            'hashlistAlias': new FormControl(),
            'blacklistChars': new FormControl(),
            'priority0Start': new FormControl(),
            'showTaskPerformance': new FormControl(),
            'ruleSplitSmallTasks': new FormControl(),
            'ruleSplitAlways': new FormControl(),
            'ruleSplitDisable': new FormControl()
          });
          this.taskcookieForm = new FormGroup({
            'autorefresh': new FormControl(),
          });
          this.tctip = this.tooltipService.getConfigTooltips().tc;
          this.initTCForm();
        break;

        case 'hch':
          this.whichView = 'hch';
          this.hchForm = new FormGroup({
            'maxHashlistSize': new FormControl(),
            'pagingSize': new FormControl(),
            'hashesPerPage': new FormControl(),
            'fieldseparator': new FormControl(),
            'hashlistImportCheck': new FormControl(),
            'batchSize': new FormControl(),
            'plainTextMaxLength': new FormControl(),
            'hashMaxLength': new FormControl(),
          });
          this.hchtip = this.tooltipService.getConfigTooltips().hch;
          this.initHCHForm();
        break;

        case 'notif':
          this.whichView = 'notif';
          this.notifForm = new FormGroup({
            'emailSender': new FormControl(),
            'emailSenderName': new FormControl(),
            'telegramBotToken': new FormControl(),
            'notificationsProxyEnable': new FormControl(),
            'notificationsProxyServer': new FormControl(),
            'notificationsProxyPort': new FormControl(),
            'notificationsProxyType': new FormControl(),
          });
          this.notiftip = this.tooltipService.getConfigTooltips().notif;
          this.initNotifForm();
        break;

        case 'gs':
          this.whichView = 'gs';
          this.gsForm = new FormGroup({
            'hashcatBrainEnable': new FormControl(),
            'hashcatBrainHost': new FormControl(),
            'hashcatBrainPort': new FormControl(),
            'hashcatBrainPass': new FormControl(),
            'hcErrorIgnore': new FormControl(),
            'numLogEntries': new FormControl(),
            'timefmt': new FormControl(),
            'maxSessionLength': new FormControl(),
            'baseHost': new FormControl(),
            'contactEmail': new FormControl(),
            'serverLogLevel': new FormControl(),
          });
          this.cookieForm = new FormGroup({
            'cookieTooltip': new FormControl(),
          });
          this.gstip = this.tooltipService.getConfigTooltips().gs;
          this.initGSForm();
        break;


      }

    });

  }

  private initAgentForm() {
    this.isLoading = true;
    this.getTooltipLevel()
    let params = {'maxResults': this.maxResults}
    this.configService.getAllconfig(params).subscribe((result)=>{
      this.agentForm = new FormGroup({
        'agenttimeout': new FormControl(result.values.find(obj => obj.item === 'agenttimeout').value),
        'benchtime': new FormControl(result.values.find(obj => obj.item === 'benchtime').value),
        'statustimer': new FormControl(result.values.find(obj => obj.item === 'statustimer').value),
        'agentDataLifetime': new FormControl(result.values.find(obj => obj.item === 'agentDataLifetime').value),
        'hideIpInfo': new FormControl(result.values.find(obj => obj.item === 'hideIpInfo').value === '0' ? false: true),
        'voucherDeletion': new FormControl((result.values.find(obj => obj.item === 'voucherDeletion').value) === '0' ? false: true),
        'agentStatLimit': new FormControl(result.values.find(obj => obj.item === 'agentStatLimit').value),
        'agentStatTension': new FormControl(Number(result.values.find(obj => obj.item === 'agentStatTension').value)),
        'agentTempThreshold1': new FormControl(result.values.find(obj => obj.item === 'agentTempThreshold1').value),
        'agentTempThreshold2': new FormControl(result.values.find(obj => obj.item === 'agentTempThreshold2').value),
        'agentUtilThreshold1': new FormControl(result.values.find(obj => obj.item === 'agentUtilThreshold1').value),
        'agentUtilThreshold2': new FormControl(result.values.find(obj => obj.item === 'agentUtilThreshold2').value),
      });
      this.isLoading = false;
    });
  }

  private initTCForm() {
    this.isLoading = true;
    let params = {'maxResults': this.maxResults}
    this.configService.getAllconfig(params).subscribe((result)=>{
      this.tcForm = new FormGroup({
        'chunktime': new FormControl(result.values.find(obj => obj.item === 'chunktime').value),
        'disptolerance': new FormControl(result.values.find(obj => obj.item === 'disptolerance').value),
        'defaultBenchmark': new FormControl(result.values.find(obj => obj.item === 'defaultBenchmark').value  === '0' ? false: true),
        'disableTrimming': new FormControl(result.values.find(obj => obj.item === 'disableTrimming').value  === '0' ? false: true),
        'hashlistAlias': new FormControl(result.values.find(obj => obj.item === 'hashlistAlias').value ),
        'blacklistChars': new FormControl(result.values.find(obj => obj.item === 'blacklistChars').value),
        'priority0Start': new FormControl(result.values.find(obj => obj.item === 'priority0Start').value === '0' ? false: true),
        'showTaskPerformance': new FormControl(result.values.find(obj => obj.item === 'showTaskPerformance').value  === '0' ? false: true),
        'ruleSplitSmallTasks': new FormControl(result.values.find(obj => obj.item === 'ruleSplitSmallTasks').value === '0' ? false: true),
        'ruleSplitAlways': new FormControl(result.values.find(obj => obj.item === 'ruleSplitAlways').value === '0' ? false: true),
        'ruleSplitDisable': new FormControl((result.values.find(obj => obj.item === 'ruleSplitDisable').value) === '0' ? false: true)
      });
      this.taskcookieForm = new FormGroup({
        'autorefresh': new FormControl(this.getAutorefresh()),
      });
      this.isLoading = false;
    });
  }

  private initHCHForm() {
    this.isLoading = true;
    let params = {'maxResults': this.maxResults}
    this.configService.getAllconfig(params).subscribe((result)=>{
      this.hchForm = new FormGroup({
        'maxHashlistSize': new FormControl(result.values.find(obj => obj.item === 'maxHashlistSize').value),
        'pagingSize': new FormControl(result.values.find(obj => obj.item === 'pagingSize').value),
        'hashesPerPage': new FormControl(result.values.find(obj => obj.item === 'hashesPerPage').value),
        'fieldseparator': new FormControl(result.values.find(obj => obj.item === 'fieldseparator').value),
        'hashlistImportCheck': new FormControl(result.values.find(obj => obj.item === 'hashlistImportCheck').value),
        'batchSize': new FormControl(result.values.find(obj => obj.item === 'batchSize').value),
        'plainTextMaxLength': new FormControl(result.values.find(obj => obj.item === 'plainTextMaxLength').value),
        'hashMaxLength': new FormControl(result.values.find(obj => obj.item === 'hashMaxLength').value),
      });
      this.isLoading = false;
    });
  }

  private initNotifForm() {
    this.isLoading = true;
    let params = {'maxResults': this.maxResults}
    this.configService.getAllconfig(params).subscribe((result)=>{
      this.notifForm = new FormGroup({
        'emailSender': new FormControl(result.values.find(obj => obj.item === 'emailSender').value),
        'emailSenderName': new FormControl(result.values.find(obj => obj.item === 'emailSenderName').value),
        'telegramBotToken': new FormControl(result.values.find(obj => obj.item === 'telegramBotToken').value),
        'notificationsProxyEnable': new FormControl(result.values.find(obj => obj.item === 'notificationsProxyEnable').value === '0' ? false: true),
        'notificationsProxyServer': new FormControl(result.values.find(obj => obj.item === 'notificationsProxyServer').value),
        'notificationsProxyPort': new FormControl(result.values.find(obj => obj.item === 'notificationsProxyPort').value),
        'notificationsProxyType': new FormControl(result.values.find(obj => obj.item === 'notificationsProxyType').value),
      });
      this.isLoading = false;
    });
  }

  private initGSForm() {
    this.isLoading = true;
    let params = {'maxResults': this.maxResults}
    this.configService.getAllconfig(params).subscribe((result)=>{
      this.gsForm = new FormGroup({
        'hashcatBrainEnable': new FormControl(result.values.find(obj => obj.item === 'hashcatBrainEnable').value === '0' ? false: true),
        'hashcatBrainHost': new FormControl(result.values.find(obj => obj.item === 'hashcatBrainHost').value),
        'hashcatBrainPort': new FormControl(result.values.find(obj => obj.item === 'hashcatBrainPort').value),
        'hashcatBrainPass': new FormControl(result.values.find(obj => obj.item === 'hashcatBrainPass').value),
        'hcErrorIgnore': new FormControl(result.values.find(obj => obj.item === 'hcErrorIgnore').value),
        'numLogEntries': new FormControl(result.values.find(obj => obj.item === 'numLogEntries').value),
        'timefmt': new FormControl(result.values.find(obj => obj.item === 'timefmt').value),
        'maxSessionLength': new FormControl(result.values.find(obj => obj.item === 'maxSessionLength').value),
        'baseHost': new FormControl(result.values.find(obj => obj.item === 'baseHost').value),
        'contactEmail': new FormControl(result.values.find(obj => obj.item === 'contactEmail').value),
        'serverLogLevel': new FormControl(result.values.find(obj => obj.item === 'serverLogLevel').value),
      });
      this.cookieForm = new FormGroup({
        'cookieTooltip': new FormControl(this.getTooltipLevel()),
      });
      this.isLoading = false;
    });
  }

  // Auto Save Settings

  searchTxt:string = '';
  timeout = null;

  autoSave(key: string, value: any, sw?: boolean, collap?: boolean){
    clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
      this.isLoading = true;
      let params = {'filter=item': key};
      this.configService.getAllconfig(params).subscribe((result)=>{
        let indexUpdate = result.values.find(obj => obj.item === key).configId;
        let valueUpdate = result.values.find(obj => obj.item === key).value;
        let arr = {'item': key, 'value':  this.checkSwitch(value, valueUpdate, sw)};
        this.configService.updateConfig(indexUpdate, arr).subscribe((result)=>{
          this.uicService.onUpdatingCheck(key);
          if(collap === true){
          this.isLoading = false;
          }else{
            this.savedAlert();
            this.ngOnInit();
          }
        });
      });
   }, 1500);
  }

  checkSwitch(value: any, ovalue: any, sw?: boolean){
    if(sw == true && ovalue === '1'){
      return '0';
    }if(sw == true && ovalue === '0') {
      return '1';
    }else {
      return value;
    }
  }

  getAutorefresh(){
    return JSON.parse(this.cookieService.getCookie('autorefresh')).value;
  }

  setAutorefresh(value: string){
      this.cookieService.setCookie('autorefresh', JSON.stringify({active:true, value: value}), 365);
      this.savedAlert();
      this.ngOnInit();
  }

  getTooltipLevel(){
    return this.cookieService.getCookie('tooltip');
  }

  setTooltipLevel(value: string){
    this.cookieService.setCookie('tooltip', value, 365);
    this.savedAlert();
    this.ngOnInit();
  }

  savedAlert(){
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Setting change has been saved',
      showConfirmButton: false,
      timer: 1500
    })
  }

}
