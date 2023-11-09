import { dateFormats, serverlog, proxytype } from '../../core/_constants/settings.config';
import { ACTIONARRAY, NOTIFARRAY } from '../../core/_constants/notifications.config';
import { fileFormat } from '../../core/_constants/files.config';
import { TooltipService } from '../../core/_services/shared/tooltip.service';
import { environment } from 'src/environments/environment';
import { FormControl, Validators } from '@angular/forms';
import { SERV } from '../../core/_services/main.config';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './main.service';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  tooltip:any;

  constructor(
    private tooltipService: TooltipService,
    private gs: GlobalService
    ) {
      this.tooltip = this.tooltipService.getConfigTooltips();
     }

  private maxResults = environment.config.prodApiMaxResults;

  // ToDo in validators, go to the database and add max lenght
  //checboxes issues when value is false,

  // //
  // Metadata Structure
  // //

  // Info Metadata, it contains information about the page such as title, subtitles, and notifications configuration.
  infoMetadataForm = {
    title: "Title for the form page",
    customform: false,
    subtitle: false,
    submitok: "Message displayed upon successful submission",
    submitokredirect: "Redirect URL upon successful submission",
    deltitle: "Title for deletion confirmation",
    delsubmitok: "Message displayed upon successful deletion",
    delsubmitokredirect: "Redirect URL upon successful deletion",
    delsubmitcancel: "Message displayed when deletion is canceled",
  };

  // Metadata form, it contains information about each field.
  metadataFormField = [
    {
      name: "API name to be map with the formControl",
      label: "Label name to be displayed",
      type: "Type of the form field; (e.g., select, text, checkbox)",
      placeholder: "Type option text, then add placeholder",
      selectOptions: "Select options if the type is 'select'",
      selectOptions$: "Select options if the type is 'selectd', used with selectEndpoint",
      selectEndpoint$: "API endpoint route, use SERV",
      fieldMapping: "Object with the dropdown options to be mapped, that is id and name. ie. id: _id, name:groupName",
      requiredasterisk: "Indicates if the field is required",
      tooltip: "Tooltip information as string or using ",
      validators: "Validation rules",
      isTitle: "boolean, if its true will use only the label field"
    },
  ];

  // Examples
  // Create title between fields. use  { label: 'More settings', isTitle: true }

  // // // // // // // //
  // ACCOUNT SECTION   //
  // // // // // // // //

  // //
  // Notifications
  // //

  // This variable stores information about the edit notification page.
  newnotifInfo = [
    { title: 'New Notification', customform: false, subtitle: false, submitok: 'New Notification created!', submitokredirect: '/account/notifications'},
  ];

  // This variable stores information about the edit notification page.
  editnotifInfo = [
    { title: 'Edit Notification', customform: false, subtitle: false, submitok: 'Saved!', submitokredirect: '/account/notifications'},
  ];

  //This variable defines the fields and properties required when creating a cracker Version.
  newnotif = [
    { name: 'action', type: 'seltextect', selectOptions: ACTIONARRAY },
    { name: 'actionFilter', label: 'Value', type: 'text'},
    { name: 'notification', label: 'Notification', type: 'select', selectOptions: NOTIFARRAY},
    { name: 'receiver', label: 'Receiver', type: 'text'},
    { name: 'isActive', label: 'Receiver', type: 'checkbox',defaultValue: true},
  ];

  //This variable defines the fields and properties required when editing a notification.
  editnotif = [
    { name: 'action', type: 'text', disabled: true},
    { name: 'notification', label: 'Notification', type: 'text', disabled: true},
    { name: 'receiver', label: 'Receiver', type: 'text', disabled: true},
    { name: 'isActive', label: 'Receiver', type: 'checkbox', validators: [Validators.required]},
  ];


  // // // // // // // //
  // TASKS SECTION     //
  // // // // // // // //

  // //
  // Pretask
  // //


  // //
  // Supertask
  // //

  supertaskInfo = [
    { title: 'New Supertask', customform: false, subtitle: false, submitok: 'New SuperTask created!', submitokredirect: 'tasks/supertasks'},
  ];

  supertask = [
    { name: 'supertaskName', label: 'Name', type: 'text', requiredasterisk: true, tooltip: false, validators: [Validators.required] },
    { name: 'pretasks', label: 'Select or search tasks assigned to this supertask:', type: 'select', selectOptions: [], requiredasterisk: true, tooltip: false, validators: [Validators.required]},
  ];

  // // // // // // // //
  // FILES SECTION    //
  // // // // // // // //

  // //
  // Files
  // //

  // This variable stores information about the edit wordlist file page.
  editwordlistInfo = [
    { title: 'Edit Wordlist File', customform: false, subtitle: false, submitok: 'Saved!', submitokredirect: '/files/wordlist'},
  ];

  // This variable stores information about the edit rule file page.
  editruleInfo = [
    { title: 'Edit Rule File', customform: false, subtitle: false, submitok: 'Saved!', submitokredirect: '/files/rules'},
  ];

  // This variable stores information about the edit other file page.
  editotherInfo = [
    { title: 'Edit Other File', customform: false, subtitle: false, submitok: 'Saved!', submitokredirect: '/files/other'},
  ];

  //This variable defines the fields and properties required when editing a wonrdlist, rule or other file.
  editfile = [
    {name: 'fileId', label: 'ID', type: 'number', disabled: true},
    {name: 'filename', label: 'Name', type: 'text'},
    {name: 'fileType', label: 'File Type', type: 'select', selectOptions: fileFormat},
    {name: 'accessGroupId', label: 'Access group', type: 'selectd', requiredasterisk: true, selectEndpoint$: SERV.ACCESS_GROUPS, selectOptions$: [], fieldMapping: {id: '_id', name: 'groupName' }},
    {name: 'isSecret', label: 'Secret', type: 'checkbox'}
  ];

  // // // // // // // //
  // CONFIG SECTION    //
  // // // // // // // //

  // //
  // New Cracker
  // //

  // This variable stores information about the new cracker page.
  newcrackerInfo = [
    { title: 'New Cracker Type', customform: false, subtitle: false, submitok: 'New Cracker created!', submitokredirect: '/config/engine/crackers'},
  ];

  //This variable defines the fields and properties required when creating a new cracker.
  newcracker = [
    { name: 'typeName', label: 'Type',  type: 'select', selectOptions: [{ label: 'Hashcat', value: 'hashcat' },{ label: 'Generic Cracker', value: 'generic' }], requiredasterisk: true, tooltip: false, validators: [Validators.required] },
    { name: 'isChunkingAvailable', label: 'Chunking Available',  type: 'select', selectOptions: [{ label: 'Yes', value: true },{ label: 'No', value: false }], requiredasterisk: true, tooltip: false, validators: [Validators.required] }
  ];

  // //
  // Agent Binary
  // //

  // This variable stores information about the New Agent Binary page.
  newagentbinaryInfo = [
    { title: 'New Agent Binary', customform: false, subtitle: false, submitok: 'New Agent Binary created!', submitokredirect: 'config/engine/agent-binaries'},
  ];

  // This variable stores information about the Edit Agent Binary page.
  editagentbinaryInfo = [
    { title: 'Edit Agent Binary', customform: false, subtitle: false, submitok: 'Agent Binary saved!', submitokredirect: 'config/engine/agent-binaries', deltitle: 'Agent Binaries', delsubmitok: 'Deleted Agent Binary', delsubmitokredirect: 'config/engine/agent-binaries', delsubmitcancel:'Agent Binary is safe!'},
  ];

  //This variable defines the fields and properties required when creating/editing an Agent Binary.
  agentbinary = [
    { name: 'type', label: 'Type',  type: 'text', requiredasterisk: true, tooltip: false, validators: [Validators.required] },
    { name: 'operatingSystems', label: 'Operating Systems',  type: 'text', requiredasterisk: true, tooltip: false, validators: [Validators.required] },
    { name: 'filename', label: 'Filename',  type: 'text', requiredasterisk: true, tooltip: 'Placed in bin folder', validators: [Validators.required] },
    { name: 'version', label: 'Version',  type: 'text', requiredasterisk: true, tooltip: false, validators: [Validators.required] },
    { name: 'updateTrack', label: 'Update Track',  type: 'select', selectOptions: [{ label: 'Release', value: 'release' },{ label: 'Stable', value: 'stable' }], requiredasterisk: true, tooltip: false, validators: [Validators.required] }
  ];

  // //
  // Cracker Version
  // //

  // This variable stores information about the New Cracker Version page.
  newcrackerversionInfo = [
    { title: 'New Binary Version', customform: true, subtitle: false, submitok: 'New Version created!', submitokredirect: '/config/engine/crackers'},
  ];

  // This variable stores information about the Edit Cracker Version page.
  editcrackerversionInfo = [
    { title: 'Edit Binary Version', customform: false, subtitle: false, submitok: 'Cracker saved!', submitokredirect: '/config/engine/crackers', deltitle: 'Crackers', delsubmitok: 'Deleted cracker', delsubmitokredirect: 'config/engine/crackers', delsubmitcancel:'Cracker is safe!'},
  ];

  //This variable defines the fields and properties required when creating a cracker Version.
  newcrackerversion = [
    { name: 'binaryName', label: 'Binary Base Name',  type: 'text', requiredasterisk: true, tooltip: 'Which needs to be called on the client without os-dependent extension', validators: [Validators.required] },
    { name: 'version', label: 'Binary Version',  type: 'text', requiredasterisk: true, tooltip: false, validators: [Validators.required] },
    { name: 'downloadUrl', label: 'Download URL',  type: 'text', requiredasterisk: true, tooltip: 'Link where the client can download a 7zip with the binary', validators: [Validators.required] },
    { name: 'crackerBinaryTypeId', label: 'crackerBinaryTypeId', type: 'hidden', replacevalue: 'editedIndex',requiredasterisk: true, tooltip: false, validators: false },
  ];

  //This variable defines the fields and properties required when editing a cracker Version.
  editcrackerversion = [
    { name: 'binaryName', label: 'Binary Base Name',  type: 'text', requiredasterisk: true, tooltip: 'Which needs to be called on the client without os-dependent extension', validators: [Validators.required] },
    { name: 'version', label: 'Binary Version',  type: 'text', requiredasterisk: true, tooltip: false, validators: [Validators.required] },
    { name: 'downloadUrl', label: 'Download URL',  type: 'text', requiredasterisk: true, tooltip: 'Link where the client can download a 7zip with the binary', validators: [Validators.required] },
  ];

  // //
  // Preprocessor
  // //

  // This variable stores information about the New Preprocessor page.
  newpreprocessorInfo = [
    { title: 'New Preprocessor', customform: false, subtitle: false, submitok: 'New Preprocessor created!', submitokredirect: 'config/engine/preprocessors'},
  ];

  // This variable stores information about the Edit Preprocessor page.
  editpreprocessorInfo = [
    { title: 'Edit Preprocessor', customform: false, subtitle: false, submitok: 'Preprocessor saved!', submitokredirect: 'config/engine/preprocessors', deltitle: 'Preprocessors', delsubmitok: 'Deleted Preprocessor', delsubmitokredirect: 'config/engine/preprocessors', delsubmitcancel:'Preprocessor is safe!'},
  ];

  //This variable defines the fields and properties required when creating/editing a Hashtype.
  preprocessor = [
    { name: 'name', label: 'Name', type: 'text', requiredasterisk: true, tooltip: false, validators: [Validators.required] },
    { name: 'binaryName', label: 'Binary Basename', type: 'text', requiredasterisk: true, tooltip: false, validators: [Validators.required] },
    { name: 'url', label: 'Download URL', type: 'text', requiredasterisk: true, tooltip: false, validators: [Validators.required] },
    { label: 'Commands (set to empty if not available)',isTitle: true},
    { name: 'keyspaceCommand',label: 'Keyspace Command',type: 'text',requiredasterisk: false,tooltip: false,validators: false,defaultValue: '--keyspace',},
    { name: 'skipCommand',label: 'Skip Command',type: 'text',requiredasterisk: false,tooltip: false,validators: false,defaultValue: '--skip'},
    { name: 'limitCommand', label: 'Limit Command', type: 'text', requiredasterisk: false, tooltip: false, validators: false, defaultValue: '--limit'},
  ];

  // //
  // Hashtypes
  // //

  // This variable stores information about the New Hashtypes page.
  newhashtypeInfo = [
    { title: 'Create Hashtype', customform: false, subtitle: false, submitok: 'New Hashtype created!', submitokredirect: '/config/hashtypes'},
  ];

  // This variable stores information about the Editing Hashtypes page.
  edithashtypeInfo = [
    { title: 'Edit Hashtype', customform: false, subtitle: false, submitok: 'Hashtype saved!', submitokredirect: '/config/hashtypes', deltitle: 'Hashtypes', delsubmitok: 'Deleted Hashtype', delsubmitokredirect: '/config/hashtypes', delsubmitcancel:'Hashtype is safe!'},
  ];

  //This variable defines the fields and properties required when creating a new Hashtype.
  newhashtype = [
    { name: 'hashTypeId', label: 'Hashtype', type: 'number', requiredasterisk: true, tooltip: 'ie. Hashcat -m', validators: [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(1), this.numberValidator]},
    { name: 'description', label: 'Description', type: 'text', requiredasterisk: true, tooltip: false, validators:  [Validators.required, Validators.minLength(1)] },
    { name: 'isSalted', label: 'Salted', type: 'checkbox', requiredasterisk: false, tooltip: 'Only if there is a separate salt value', validators: false, defaultValue: false },
    { name: 'isSlowHash', label: 'Slow Hash', type: 'checkbox', requiredasterisk: false, tooltip: false, validators: false, defaultValue: false },
  ];

  //This variable is similar to newhashtype but is used for editing an existing Hashtype. As difference include disable form variable.
  edithashtype = [
    { name: 'hashTypeId', label: 'Hashtype', type: 'number', requiredasterisk: true, tooltip: 'ie. Hashcat -m', validators: [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(1), this.numberValidator], disabled: true},
    { name: 'description', label: 'Description', type: 'text', requiredasterisk: true, tooltip: false, validators:  [Validators.required, Validators.minLength(1)] },
    { name: 'isSalted', label: 'Salted', type: 'checkbox', requiredasterisk: false, tooltip: 'Only if there is a separate salt value', validators: false, defaultValue: false },
    { name: 'isSlowHash', label: 'Slow Hash', type: 'checkbox', requiredasterisk: false, tooltip: false, validators: false, defaultValue: true },
  ];

  // //
  // Server
  // //

  serveragentInfo = [
    { title: 'Agent Settings', customform: false, subtitle: false, submitok: 'Saved!', submitokredirect: '/config/agent'},
  ];

  serveragent = [
    { label: 'Activity / Registration', isTitle: true },
    { name: "agenttimeout", label: "Delay before considering an agent as inactive(or timed out)", type: "number", tooltip: false },
    { name: "benchtime", label: "Delay before considering an issued chunk as inactive", type: "number", tooltip: false },
    { name: "statustimer", label: "Frequency of the agent reporting about a task to the server", type: "number", tooltip: false },
    { name: "agentDataLifetime", label: "Time during which util and temperature data are retained on the server", type: "number", tooltip: false },
    { name: "hideIpInfo", label: "Hide agents IP information", type: "checkbox", tooltip: false },
    { name: "voucherDeletion", label: "Voucher(s) can be used to register multiple agents", type: "checkbox", tooltip: false },
    { label: 'Graphical Feedback', isTitle: true },
    { name: "agentStatLimit", label: "Maximum number of data points in agent (gpu) graphs", type: "number", tooltip: false },
    { name: "agentStatTension", label: "Draw straight lines in agent data graph instead of bezier curves", type: "select", selectOptions: [
        { label: "Straight lines", value: "0" },
        { label: "Bezier curves", value: "1" }
      ], tooltip: false
    },
    { name: "agentTempThreshold1", label: "Temperature threshold above which an agent is displayed in orange in the status page", type: "number", tooltip: false },
    { name: "agentTempThreshold2", label: "Temperature threshold above which an agent is displayed in red in the status page", type: "number", tooltip: false },
    { name: "agentUtilThreshold1", label: "Util threshold below which an agent is displayed in orange in the status page", type: "number", tooltip: false },
    { name: "agentUtilThreshold2", label: "Util threshold below which an agent is displayed in red in the status page", type: "number", tooltip: false }
  ];

  servertaskchunkInfo = [
    { title: 'Task/Chunk Settings', customform: false, subtitle: false, submitok: 'Saved!', submitokredirect: '/config/task-chunk'},
  ];

  servertaskchunk = [
    { label: 'Benchmark / Chunk', isTitle: true },
    { name: "chunktime", label: "Expected duration of a chunk", type: "number", tooltip: "tctip.chunktime" },
    { name: "disptolerance", label: "Authorised expansion in percentage of the final chunk of a task", type: "number", tooltip: false },
    { name: "defaultBenchmark", label: "Speed benchmark as default benchmark process", type: "checkbox", tooltip: false },
    { name: "disableTrimming", label: "Disable trimming of chunks and redo the whole chunk", type: "checkbox", tooltip: false },
    { label: 'Command Line & Misc.', isTitle: true },
    { name: "hashlistAlias", label: "Placeholder string for the hashlist in the command line during task creation", type: "text", tooltip: false },
    { name: "blacklistChars", label: "Forbidden characters in the attack command input", type: "text", tooltip: "tctip.blacklistChars" },
    { name: "priority0Start", label: "Also automatically assign tasks with priority 0 (Needed, check file)", type: "checkbox", tooltip: false },
    { name: "showTaskPerformance", label: "Show cracks/minute for active tasks", type: "checkbox", tooltip: false },
    { label: 'Rule splitting', isTitle: true },
    { name: "ruleSplitSmallTasks", label: "When rule splitting is applied for tasks, always make them a small task", type: "checkbox", tooltip: false },
    { name: "ruleSplitAlways", label: "Even do rule splitting when there are not enough rules but just the benchmark is too high. Can result in subtasks with just one rule", type: "checkbox", tooltip: false },
    { name: "ruleSplitDisable", label: "Disable automatic task splitting with large rule files", type: "checkbox", tooltip: false },
  ];

  serverhchInfo = [
    { title: 'Hashes/Cracks/Hashlist Settings', customform: false, subtitle: false, submitok: 'Saved!', submitokredirect: '/config/hch'},
  ];

  serverhch = [
    { label: 'Import/Display of Hashlist', isTitle: true },
    { name: "maxHashlistSize", label: "Maximum number of lines in a hashlist", type: "number", tooltip: false },
    { name: "pagingSize", label: "Number of hashes shown per page in the Hash View", type: "number", tooltip: false },
    { name: "hashesPerPage", label: "Number of hashes per page on hashes view", type: "number", tooltip: false },
    { name: "fieldseparator", label: "The separator character used to separate hash and plain (or salt)", type: "text", tooltip: false },
    { name: "hashlistImportCheck", label: "Check if hashes have been previously cracked (in other hashlists) at hashlist creation time", type: "checkbox", tooltip:false },
    { label: 'Database Parameters', isTitle: true },
    { name: "batchSize", label: "Batch size of SQL query when hashlist is sent to the agent", type: "number", tooltip: false },
    { name: "plainTextMaxLength", label: "Maximum length of plain text", type: "number", tooltip: false },
    { name: "hashMaxLength", label: "Maximum length of a hash", type: "number", tooltip: 'Such change may take a long time depending on the database size' }
  ];

  servernotifInfo = [
    { title: 'Notification Settings', customform: false, subtitle: false, submitok: 'Saved!', submitokredirect: '/config/notifications'},
  ];

  // hashMaxLength it should be this validator type
//   <span *ngIf="hchForm.controls['hashMaxLength']?.touched">
//   <fa-icon  style="color:red" [icon]="faExclamationTriangle"></fa-icon> Such change may take a long time depending on the database size
// </span>

  servernotif = [
    { name: "emailSender", label: "Email address sending the notification emails", type: "text", tooltip: false },
    { name: "emailSenderName", label: "Sender's name on emails sent from Hashtopolis", type: "text", tooltip: false },
    { name: "telegramBotToken", label: "Telegram bot token used to send telegram notifications", type: "text", tooltip: false },
    { name: "notificationsProxyEnable", label: "Enable using a proxy for sending notifications", type: "checkbox", tooltip: false },
    { label: 'Proxy Settings', isTitle: true },
    { name: "notificationsProxyServer", label: "Server URL of the proxy to use for notification", type: "text", placeholder:"http...", tooltip: false },
    { name: "notificationsProxyPort", label: "Set the port for the notifications proxy", type: "number", tooltip: false },
    { name: "notificationsProxyType", label: "Proxy type to use for notifications", type: "select", selectOptions: proxytype, tooltip: false }
  ];

  //Evretyhing inside Enable using proxy
  // <div *ngIf="notifForm.get('notificationsProxyEnable').value == '1'">
  servergsInfo = [
    { title: 'General Settings', customform: false, subtitle: false, submitok: 'Saved!', submitokredirect: '/config/general-settings'},
  ];

  servergs = [
    { name: "hashcatBrainEnable", label: "Enable Hashcat Brain", type: "checkbox", tooltip: false },
    { name: "hashcatBrainHost", label: "Host to be used for hashcat brain (must be reachable by agents)", type: "text", placeholder: "URL", tooltip: false },
    { name: "hashcatBrainPort", label: "Port for hashcat brain", type: "number", placeholder: "I.e. 8080", tooltip: false },
    { name: "hashcatBrainPass", label: "Password to be used to access hashcat brain server", type: "password", tooltip: false },
    { name: "hcErrorIgnore", label: "Ignore error messages from crackers containing the string below", type: "textarea", tooltip: false },
    { name: "numLogEntries", label: "Number of log entries to be retained", type: "number", tooltip: false },
    { name: "timefmt", label: "Set the time format", type: "text", tooltip: false },
    { name: "maxSessionLength", label: "Max session length users can configure (in hours)", type: "text", tooltip: false },
    { name: "baseHost", label: "Base hostname/port/protocol to use. Only fill this in to override the auto-determined value", type: "text", tooltip: false },
    { name: "contactEmail", label: "Admin email address displayed on the webpage footer (hidden if empty)", type: "text", tooltip: false },
    { name: "serverLogLevel", label: "Server level to be logged on the server to file", type: "select", selectOptions: serverlog, tooltip: false },
 ];

   // //
  // Health Check
  // //

  // This variable holds information about the fields required when creating a new health check.
  newhealthcheck = [
    { name: 'attack', label: 'Attack', type: 'select',requiredasterisk: true, selectOptions: [{ value: 0, label: 'Brute-Force' }], validators: [Validators.required] },
    { name: 'hashtypeId', label: 'Hashtype', type: 'select',requiredasterisk: true, selectOptions: [{ value: 0, label: 'MD5' },{ value: 3200, label: 'BCRYPT' }], validators: [Validators.required] },
    { name: 'crackerBinaryType', label: 'Binary', type: 'selectd', requiredasterisk: true, selectEndpoint$: SERV.ACCESS_PERMISSIONS_GROUPS, selectOptions$: [], fieldMapping: { id: 'crackerBinaryTypeId', name: 'typeName' },validators: [Validators.required]},
    { name: 'crackerBinaryId', label: 'Binary Version', type: 'selectd', requiredasterisk: true, selectEndpoint$: SERV.ACCESS_PERMISSIONS_GROUPS, selectOptions$: [], fieldMapping: { id: 'crackerBinaryId', name: 'version' },validators: [Validators.required]},
  ];

  // // // // // // // //
  // USER SECTION      //
  // // // // // // // //

  // //
  // USERS
  // //

  // This variable stores information about the user page.
  newuserInfo = [
    { title: 'New User', customform: false, subtitle: false, submitok: 'New User created!', submitokredirect: 'users/all-users'},
  ];

  // This variable edit information about the user page.
  editInfo = [
    { title: 'Edit User', customform: false, subtitle: false, submitok: 'Saved!', submitokredirect: 'users/all-users'},
  ];

  //This variable holds information about the fields required when creating a new user.
  newuser = [
    { name: 'name', label: 'User Name', type: 'text', requiredasterisk: true, validators: [Validators.required] },
    { name: 'email', label: 'Email', type: 'email', requiredasterisk: true, validators: [Validators.required, Validators.email] },
    { name: 'globalPermissionGroupId', label: 'Global Permission Group', type: 'selectd', requiredasterisk: true, selectEndpoint$: SERV.ACCESS_PERMISSIONS_GROUPS, selectOptions$: [], fieldMapping: {id: 'id', name: 'name' }, validators: [Validators.required] },
  ];

  //This variable is similar to newuser but is used for editing an existing user.
  edituser = [
    { name: 'id', label: 'User ID', type: 'number', disabled: true },
    { name: 'name', label: 'User Name', type: 'text', disabled: true},
    { name: 'email', label: 'Email', type: 'email',  disabled: true},
    { name: 'registered', label: 'Creation date', type: 'date',  disabled: true},
    { name: 'lastLogin', label: 'Last login', type: 'date',  disabled: true},
    { label: 'Update Settings',isTitle: true},
    { label: 'Member of access groups', type: 'date',  disabled: true},
    { name: 'globalPermissionGroupId', label: 'Global Permission Group', type: 'selectd', requiredasterisk: true, selectEndpoint$: SERV.ACCESS_PERMISSIONS_GROUPS, selectOptions$: [],fieldMapping: {id: 'id', name: 'name' }, validators: [Validators.required] },
    { name: 'password', type: 'password' },
    { name: 'isValid', label: 'Valid', type: 'checkbox', requiredasterisk: false, tooltip: false, validators: false, defaultValue: false },
  ];

  // //
  // New Global Permission Group
  // //

 // This variable stores information about the global permission group page.
  newglobalpermissionsgpInfo = [
    { title: 'New Global Permission Group', customform: false, subtitle: false, submitok: 'New Global Permission Group created!', submitokredirect: '/users/global-permissions-groups'},
  ];

  //This variable holds information about the fields required when creating a new global permission group.
  newglobalpermissionsgp = [
    { name: 'name', label: 'Name', type: 'text', requiredasterisk: true, tooltip: false, validators: [Validators.required] }
  ];

  // //
  // Access Groups
  // //

  // This variable stores information about the access group page.
  newaccessgroupsInfo = [
    { title: 'New Access Group', subtitle: false, submitok: 'New Access Group created!', submitokredirect: '/users/access-groups'},
  ];

  // This variable contains information related to editing an access group.
  editaccessgroupsInfo = [
    { title: 'Edit Access Group', subtitle: false, submitok: 'Access Group saved!', submitokredirect: '/users/access-groups', deltitle: 'Agent Groups', delsubmitok: 'Deleted Access Group', delsubmitokredirect: '/users/access-groups', delsubmitcancel:'Agent Group is safe!'},
  ];

  // This variable contains information about the fields required when creating or editing an access group.
  accessgroups = [
    { name: 'groupName', label: 'Name', type: 'text', requiredasterisk: true, tooltip: false, validators: [Validators.required] }
  ];

  // // // // // // // // //
  // UI SETTINGS SECTION  //
  // // // // // // // // //

  uisettingsInfo = [
    { title: 'UI Settings', subtitle: false},
  ];

  uisettings = [
    { name: "localtimefmt", label: "Set the time format", type: "select", selectOptions: dateFormats },
    { name: "autorefresh", label: "Dashboard Refresh Interval (seconds)", type: "text", tooltip: "Manage refresh interval in the show tasks view" },
    { name: "tooltip", label: "Manage Global level of tooltip details", type: "select", selectOptions: [
      { label: "Concise", value: 0 },
      { label: "Detailed", value: 1 },
      { label: "Very Detailed", value: 2 }
    ]},
  ];

  /**
   * Retrieves form metadata based on the provided form name.
   * @param formName - The name of the form for which metadata is requested.
   * @returns An array of form metadata.editnotifInfo
   */
  getFormMetadata(formName: string): any[] {
    if (formName === 'editwordlist' || formName === 'editrule' || formName === 'editother') {
      return this.editfile;
    } else if (formName === 'uisettings') {
      return this.uisettings;
    } else if (formName === 'newcracker') {
      return this.newcracker;
    } else if (formName === 'newagentbinary' || formName === 'editagentbinary') {
      return this.agentbinary;
    } else if (formName === 'newcrackerversion') {
      return this.newcrackerversion;
    } else if (formName === 'editcrackerversion') {
      return this.editcrackerversion;
    } else if (formName === 'newpreprocessor' || formName === 'editpreprocessor') {
      return this.preprocessor;
    } else if (formName === 'newhashtype' ) {
      return this.newhashtype;
    } else if (formName === 'edithashtype') {
      return this.edithashtype;
    } else if (formName === 'newglobalpermissionsgp') {
      return this.newglobalpermissionsgp;
    } else if (formName === 'newaccessgroups' || formName === 'editaccessgroups') {
      return this.accessgroups;
    } else if (formName === 'serveragent') {
      return this.serveragent;
    } else if (formName === 'servertaskchunk') {
      return this.servertaskchunk;
    } else if (formName === 'serverhch') {
      return this.serverhch;
    } else if (formName === 'servernotif') {
      return this.servernotif;
    } else if (formName === 'servergs') {
      return this.servergs;
    } else if (formName === 'newuser') {
      return this.newuser;
    } else if (formName === 'editnotif') {
      return this.editnotif;
    } else {
      return [];
    }
  }

  /**
   * Retrieves info metadata based on the provided form name.
   * @param formName - The name of the info metadata for which information is requested.
   * @returns An array of info metadata.
   */
  getInfoMetadata(formName: string): any[] {
    if (formName === 'editwordlistInfo') {
      return this.editwordlistInfo;
    } else if (formName === 'editruleInfo') {
      return this.editruleInfo;
    } else if (formName === 'editotherInfo') {
      return this.editotherInfo;
    } else if (formName === 'uisettingsInfo') {
      return this.uisettingsInfo;
    } else if (formName === 'newcrackerInfo') {
      return this.newcrackerInfo;
    } else if (formName === 'newagentbinaryInfo') {
      return this.newagentbinaryInfo;
    } else if (formName === 'editagentbinaryInfo') {
      return this.editagentbinaryInfo;
    } else if (formName === 'newcrackerversionInfo') {
      return this.newcrackerversionInfo;
    } else if (formName === 'editcrackerversionInfo') {
      return this.editcrackerversionInfo;
    } else if (formName === 'newpreprocessorInfo') {
      return this.newpreprocessorInfo;
    } else if (formName === 'editpreprocessorInfo') {
      return this.editpreprocessorInfo;
    } else if (formName === 'newhashtypeInfo') {
      return this.newhashtypeInfo;
    } else if (formName === 'edithashtypeInfo') {
      return this.edithashtypeInfo;
    } else if (formName === 'newglobalpermissionsgpInfo') {
      return this.newglobalpermissionsgpInfo;
    } else if (formName === 'newaccessgroupsInfo') {
      return this.newaccessgroupsInfo;
    } else if (formName === 'editaccessgroupsInfo') {
      return this.editaccessgroupsInfo;
    } else if (formName === 'serveragentInfo') {
      return this.serveragentInfo;
    } else if (formName === 'servertaskchunkInfo') {
      return this.servertaskchunkInfo;
    } else if (formName === 'serverhchInfo') {
      return this.serverhchInfo;
    } else if (formName === 'servernotifInfo') {
      return this.servernotifInfo;
    } else if (formName === 'servergsInfo') {
      return this.servergsInfo;
    } else if (formName === 'newuserInfo') {
      return this.newuserInfo;
    } else if (formName === 'editnotifInfo') {
      return this.editnotifInfo;
    } else {
      return [];
    }
  }

  /**
   * Fetches select options for a form control from an API endpoint.
   *
   * @param apiEndpoint - The API endpoint to retrieve select options from.
   * @returns An observable that emits an array of select options.
   */
  fetchOptions(apiEndpoint: string): Observable<any[]> {
    return this.gs.getAll(apiEndpoint).pipe(
      map((data: any) => {
        // Adjust this based on your API response structure
        return data.options.map((option: any) => ({
          label: option.label,
          value: option.value,
        }));
      }),
    );
  }

  // Custom validator to convert the input value to a number
  numberValidator(control: FormControl) {
    const value = control.value;
    if (value === null || value === undefined) {
      return null;
    }
    const parsedValue = Number(value);
    if (isNaN(parsedValue)) {
      return { invalidNumber: true };
    }
    return null;
  }


}


