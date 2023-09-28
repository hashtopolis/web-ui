import { faHomeAlt, faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { environment } from './../../../environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { serverlog, proxytype } from '../../core/_constants/settings.config';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { TooltipService } from '../../core/_services/shared/tooltip.service';
import { CookieService } from '../../core/_services/shared/cookies.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html'
})
@PageTitle(['Settings'])
export class ServerComponent implements OnInit {

  faHome=faHomeAlt;
  faInfoCircle=faInfoCircle;
  faExclamationTriangle=faExclamationTriangle;

  whichView: string;

  constructor(
    private tooltipService: TooltipService,
    private cookieService: CookieService,
    private uicService: UIConfigService,
    private route:ActivatedRoute,
    private gs: GlobalService,
    private store: Store<{configList: {}}>
  ) { }

  private maxResults = environment.config.prodApiMaxResults;

  public config: {configId: number, configSectionId: number, item: string, value: number}[] = [];

  agentForm: FormGroup;
  tcForm: FormGroup;
  hchForm: FormGroup;
  notifForm: FormGroup;
  gsForm: FormGroup;
  taskcookieForm: FormGroup;
  cookieForm: FormGroup;
  serverlog = serverlog;
  proxytype = proxytype;

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
    this.getTooltipLevel()
    const params = {'maxResults': this.maxResults}
    this.gs.getAll(SERV.CONFIGS,params).subscribe((result)=>{
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
    });
  }

  modelAgentActivity = [
    {
      type: "number",
      formcontrol: "agenttimeout",
      label: "Delay before considering an agent as inactive(or timed out)",
    },
    {
      type: "number",
      formcontrol: "benchtime",
      label: "Delay before considering an issued chunk as inactive",
    },
    {
      type: "number",
      formcontrol: "statustimer",
      label: "Frequency of the agent reporting about a task to the server",
    },
    {
      type: "number",
      formcontrol: "agentDataLifetime",
      label: "Time during which util and temperature data are retained on the server",
    },
    {
      type: "checkbox",
      formcontrol: "hideIpInfo",
      label: "Hide agents IP information",
    },
    {
      type: "checkbox",
      formcontrol: "voucherDeletion",
      label: "Voucher(s) can be used to register multiple agents",
    }
  ];


  // sectiontwo: [
  //   {
  //     type: "number",
  //     formcontrol: "agentStatLimit",
  //     label: "Maximum number of data points in agent (gpu) graphs",
  //   },
  //   {
  //     type: "number",
  //     formcontrol: "agentStatTension",
  //     label: "Draw straigth lines in agent data graph instead of bezier curves",
  //   },
  // ]

  private initTCForm() {
    const params = {'maxResults': this.maxResults}
    this.gs.getAll(SERV.CONFIGS,params).subscribe((result)=>{
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
    });
  }

  private initHCHForm() {
    const params = {'maxResults': this.maxResults}
    this.gs.getAll(SERV.CONFIGS,params).subscribe((result)=>{
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
    });
  }

  private initNotifForm() {
    const params = {'maxResults': this.maxResults}
    this.gs.getAll(SERV.CONFIGS,params).subscribe((result)=>{
      this.notifForm = new FormGroup({
        'emailSender': new FormControl(result.values.find(obj => obj.item === 'emailSender').value),
        'emailSenderName': new FormControl(result.values.find(obj => obj.item === 'emailSenderName').value),
        'telegramBotToken': new FormControl(result.values.find(obj => obj.item === 'telegramBotToken').value),
        'notificationsProxyEnable': new FormControl(result.values.find(obj => obj.item === 'notificationsProxyEnable').value === '0' ? false: true),
        'notificationsProxyServer': new FormControl(result.values.find(obj => obj.item === 'notificationsProxyServer').value),
        'notificationsProxyPort': new FormControl(result.values.find(obj => obj.item === 'notificationsProxyPort').value),
        'notificationsProxyType': new FormControl(result.values.find(obj => obj.item === 'notificationsProxyType').value),
      });
    });
  }

  private initGSForm() {
    const params = {'maxResults': this.maxResults};
    this.gs.getAll(SERV.CONFIGS,params).subscribe((result)=>{
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
    });
  }

  // Auto Save Settings

  searchTxt = '';
  timeout = null;

  autoSave(key: string, value: any, sw?: boolean, collap?: boolean){
    clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
      const params = {'filter=item': key};
      this.gs.getAll(SERV.CONFIGS,params).subscribe((result)=>{
        const indexUpdate = result.values.find(obj => obj.item === key).configId;
        const valueUpdate = result.values.find(obj => obj.item === key).value;
        const arr = {'item': key, 'value':  this.checkSwitch(value, valueUpdate, sw)};
          this.gs.update(SERV.CONFIGS,indexUpdate, arr).subscribe((result)=>{
            this.uicService.onUpdatingCheck(key);
            if(collap !== true){
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
      backdrop: false,
      icon: 'success',
      title: 'Saved',
      showConfirmButton: false,
      timer: 1500
    })
  }

}
