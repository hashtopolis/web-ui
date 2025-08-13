import { Observable, of } from 'rxjs';

import { Injectable } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';

import { SERV } from '@services/main.config';
import { ConfigTooltipsLevel, TooltipService } from '@services/shared/tooltip.service';

import { fileFormat } from '@src/app/core/_constants/files.config';
import { ACCESS_GROUP_FIELD_MAPPING, FieldMapping } from '@src/app/core/_constants/select.config';
import { Option, Setting, dateFormats, proxytype, serverlog } from '@src/app/core/_constants/settings.config';
import { urlValidator } from '@src/app/core/_validators/url.validator';

/**
 * Metadata information for the form page.
 *
 * Properties:
 * - title: Title for the form page
 * - customform: Whether the form is custom or standard
 * - subtitle: Whether the form has a subtitle
 * - submitok: Message displayed upon successful submission
 * - submitokredirect: Redirect URL upon successful submission
 * - deltitle: Title for deletion confirmation dialog
 * - delsubmitok: Message displayed upon successful deletion
 * - delsubmitokredirect: Redirect URL upon successful deletion
 * - delsubmitcancel: Message displayed when deletion is canceled
 */
export interface InfoMetadataForm {
  title: string;
  customform?: boolean;
  subtitle?: boolean;
  submitok?: string;
  submitokredirect?: string;
  deltitle?: string;
  delsubmitok?: string;
  delsubmitokredirect?: string;
  delsubmitcancel?: string;
}

/**
 * Metadata for each field in the form.
 *
 * Properties:
 * - name: API name to be mapped with the formControl
 * - label: Label name to be displayed
 * - type: Type of the form field; e.g., select, text, checkbox
 * - placeholder: Placeholder text for the input
 * - selectOptions: Select options if the type is 'select'
 * - selectOptions$: Select options observable if type is 'select' and used with selectEndpoint$
 * - selectEndpoint$: API endpoint route, usually a constant like SERV
 * - fieldMapping: Object with the dropdown options mapping, e.g., { id: '_id', name: 'groupName' }
 * - requiredasterisk: Indicates if the field is required (shows asterisk)
 * - tooltip: Tooltip information as string or more complex type
 * - validators: Validation rules
 * - isTitle: If true, will use only the label field as a title
 */
export interface MetadataFormField {
  name?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  selectOptions?: (Setting | Option)[];
  selectOptions$?: Observable<{ label: string; value: number }[]>;
  selectEndpoint$?: SERV;
  fieldMapping?: Record<string, string> | FieldMapping;
  requiredasterisk?: boolean;
  tooltip?: string | boolean;
  validators?: ValidatorFn[] | boolean;
  isTitle?: boolean;
  replacevalue?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  private tooltip: ConfigTooltipsLevel;

  constructor(private tooltipService: TooltipService) {
    this.tooltip = this.tooltipService.getConfigTooltips();
  }

  // // // // // // // //
  // AUTH SECTION      //
  // // // // // // // //

  // //
  // Forgot Password
  // //
  authforgotInfo = [
    {
      title: 'Forgot Password',
      customform: false,
      subtitle: false,
      submitok: 'Requesting..',
      submitokredirect: '/auth'
    }
  ];

  authforgot = [
    {
      name: 'User Name',
      label: 'User Name',
      type: 'text',
      validators: [Validators.required]
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      validators: [Validators.required]
    }
  ];

  // // // // // // // //
  // ACCOUNT SECTION   //
  // // // // // // // //

  // //
  // Notifications
  // //

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
    {
      title: 'New Supertask',
      customform: false,
      subtitle: false,
      submitok: 'New SuperTask created!',
      submitokredirect: 'tasks/supertasks'
    }
  ];

  supertask = [
    {
      name: 'supertaskName',
      label: 'Name',
      type: 'text',
      requiredasterisk: true,
      tooltip: false,
      validators: [Validators.required]
    },
    {
      name: 'pretasks',
      label: 'Select or search tasks assigned to this supertask:',
      type: 'select',
      selectOptions: [],
      requiredasterisk: true,
      tooltip: false,
      validators: [Validators.required]
    }
  ];

  // // // // // // // //
  // FILES SECTION    //
  // // // // // // // //

  // //
  // Files
  // //

  // This variable stores information about the edit wordlist file page.
  // Edit wordlist file page
  editwordlistInfo = [
    {
      title: 'Edit Wordlist File',
      customform: false,
      subtitle: false,
      submitok: 'Saved!',
      submitokredirect: '/files/wordlist',
      deltitle: 'Wordlist File',
      delsubmitok: 'Wordlist deleted successfully!',
      delsubmitokredirect: '/files/wordlist',
      delsubmitcancel: 'Wordlist deletion cancelled',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmIcon: 'warning'
    }
  ];

  // Edit rule file page
  editruleInfo = [
    {
      title: 'Edit Rule File',
      customform: false,
      subtitle: false,
      submitok: 'Saved!',
      submitokredirect: '/files/rules',
      deltitle: 'Rule File',
      delsubmitok: 'Rule deleted successfully!',
      delsubmitokredirect: '/files/rules',
      delsubmitcancel: 'Rule deletion cancelled',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmIcon: 'warning'
    }
  ];

  // Edit other file page
  editotherInfo = [
    {
      title: 'Edit Other File',
      customform: false,
      subtitle: false,
      submitok: 'Saved!',
      submitokredirect: '/files/other',
      deltitle: 'Other File',
      delsubmitok: 'File deleted successfully!',
      delsubmitokredirect: '/files/other',
      delsubmitcancel: 'File deletion cancelled',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmIcon: 'warning'
    }
  ];

  //This variable defines the fields and properties required when editing a wonrdlist, rule or other file.
  editfile = [
    { name: 'id', label: 'ID', type: 'number', disabled: true },
    { name: 'filename', label: 'Name', type: 'text' },
    {
      name: 'fileType',
      label: 'File Type',
      type: 'select',
      selectOptions: fileFormat
    },
    {
      name: 'accessGroupId',
      label: 'Access group',
      type: 'selectd',
      requiredasterisk: true,
      selectEndpoint$: SERV.ACCESS_GROUPS,
      selectOptions$: of([]),
      fieldMapping: ACCESS_GROUP_FIELD_MAPPING
    },
    { name: 'isSecret', label: 'Secret', type: 'checkbox' }
  ];

  // // // // // // // //
  // CONFIG SECTION    //
  // // // // // // // //

  // //
  // New Cracker
  // //

  // This variable stores information about the new cracker page.
  newcrackerInfo = [
    {
      title: 'New Cracker Type',
      customform: false,
      subtitle: false,
      submitok: 'New Cracker created!',
      submitokredirect: '/config/engine/crackers'
    }
  ];

  //This variable defines the fields and properties required when creating a new cracker.
  newcracker = [
    {
      name: 'typeName',
      label: 'Type',
      type: 'select',
      selectOptions: [
        { label: 'Hashcat', value: 'hashcat' },
        { label: 'Generic Cracker', value: 'generic' }
      ],
      requiredasterisk: true,
      tooltip: false,
      validators: [Validators.required]
    },
    {
      name: 'isChunkingAvailable',
      label: 'Chunking Available',
      type: 'select',
      selectOptions: [
        { label: 'Yes', value: true },
        { label: 'No', value: false }
      ],
      requiredasterisk: true,
      tooltip: false,
      validators: [Validators.required]
    }
  ];

  // //
  // Agent Binary
  // //

  // This variable stores information about the New Agent Binary page.
  newagentbinaryInfo = [
    {
      title: 'New Agent Binary',
      customform: false,
      subtitle: false,
      submitok: 'New Agent Binary created!',
      submitokredirect: 'config/engine/agent-binaries'
    }
  ];

  // This variable stores information about the Edit Agent Binary page.
  editagentbinaryInfo = [
    {
      title: 'Edit Agent Binary',
      customform: false,
      subtitle: false,
      submitok: 'Agent Binary saved!',
      submitokredirect: 'config/engine/agent-binaries',
      deltitle: 'Agent Binaries',
      delsubmitok: 'Deleted Agent Binary',
      delsubmitokredirect: 'config/engine/agent-binaries',
      delsubmitcancel: 'Agent Binary is safe!'
    }
  ];

  //This variable defines the fields and properties required when creating/editing an Agent Binary.
  agentbinary = [
    {
      name: 'binaryType',
      label: 'Binary Type',
      type: 'text',
      requiredasterisk: true,
      tooltip: false,
      validators: [Validators.required]
    },
    {
      name: 'operatingSystems',
      label: 'Operating Systems',
      type: 'text',
      requiredasterisk: true,
      tooltip: false,
      validators: [Validators.required]
    },
    {
      name: 'filename',
      label: 'Filename',
      type: 'text',
      requiredasterisk: true,
      tooltip: 'Placed in bin folder',
      validators: [Validators.required]
    },
    {
      name: 'version',
      label: 'Version',
      type: 'text',
      requiredasterisk: true,
      tooltip: false,
      validators: [Validators.required]
    },
    {
      name: 'updateTrack',
      label: 'Update Track',
      type: 'select',
      selectOptions: [
        { label: 'Release', value: 'release' },
        { label: 'Stable', value: 'stable' }
      ],
      requiredasterisk: true,
      tooltip: false,
      validators: [Validators.required]
    }
  ];

  // //
  // Cracker Version
  // //

  // This variable stores information about the New Cracker Version page.
  newcrackerversionInfo = [
    {
      title: 'New Binary Version',
      customform: true,
      subtitle: false,
      submitok: 'New Version created!',
      submitokredirect: '/config/engine/crackers'
    }
  ];

  // This variable stores information about the Edit Cracker Version page.
  editcrackerversionInfo = [
    {
      title: 'Edit Binary Version',
      customform: false,
      subtitle: false,
      submitok: 'Cracker saved!',
      submitokredirect: '/config/engine/crackers',
      deltitle: 'Crackers',
      delsubmitok: 'Deleted cracker',
      delsubmitokredirect: 'config/engine/crackers',
      delsubmitcancel: 'Cracker is safe!'
    }
  ];

  //This variable defines the fields and properties required when creating a cracker Version.
  newcrackerversion = [
    {
      name: 'binaryName',
      label: 'Binary Base Name',
      type: 'text',
      requiredasterisk: true,
      tooltip: 'Which needs to be called on the client without os-dependent extension',
      validators: [Validators.required]
    },
    {
      name: 'version',
      label: 'Binary Version',
      type: 'text',
      requiredasterisk: true,
      tooltip: false,
      validators: [Validators.required]
    },
    {
      name: 'downloadUrl',
      label: 'Download URL',
      type: 'url',
      requiredasterisk: true,
      tooltip: 'Link where the client can download a 7zip with the binary, e.g. https://example.com/cracker-1.0.0.7z',
      validators: [Validators.required, urlValidator()]
    },
    {
      name: 'crackerBinaryTypeId',
      label: 'crackerBinaryTypeId',
      type: 'hidden',
      replacevalue: 'editedIndex',
      requiredasterisk: true,
      tooltip: false,
      validators: false
    }
  ];

  //This variable defines the fields and properties required when editing a cracker Version.
  editcrackerversion = [
    {
      name: 'binaryName',
      label: 'Binary Base Name',
      type: 'text',
      requiredasterisk: true,
      tooltip: 'Which needs to be called on the client without os-dependent extension',
      validators: [Validators.required]
    },
    {
      name: 'version',
      label: 'Binary Version',
      type: 'text',
      requiredasterisk: true,
      tooltip: false,
      validators: [Validators.required]
    },
    {
      name: 'downloadUrl',
      label: 'Download URL',
      type: 'url',
      requiredasterisk: true,
      tooltip: 'Link where the client can download a 7zip with the binary, e.g. https://example.com/cracker-1.0.0.7z',
      validators: [Validators.required, urlValidator()]
    }
  ];

  // //
  // Preprocessor
  // //

  // This variable stores information about the New Preprocessor page.
  newpreprocessorInfo = [
    {
      title: 'New Preprocessor',
      customform: false,
      subtitle: false,
      submitok: 'New Preprocessor created!',
      submitokredirect: 'config/engine/preprocessors'
    }
  ];

  // This variable stores information about the Edit Preprocessor page.
  editpreprocessorInfo = [
    {
      title: 'Edit Preprocessor',
      customform: false,
      subtitle: false,
      submitok: 'Preprocessor saved!',
      submitokredirect: 'config/engine/preprocessors',
      deltitle: 'Preprocessors',
      delsubmitok: 'Deleted Preprocessor',
      delsubmitokredirect: 'config/engine/preprocessors',
      delsubmitcancel: 'Preprocessor is safe!'
    }
  ];

  //This variable defines the fields and properties required when creating/editing a Hashtype.
  preprocessor = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      requiredasterisk: true,
      tooltip: false,
      validators: [Validators.required]
    },
    {
      name: 'binaryName',
      label: 'Binary Basename',
      type: 'text',
      requiredasterisk: true,
      tooltip: false,
      validators: [Validators.required]
    },
    {
      name: 'url',
      label: 'Download URL',
      type: 'url',
      requiredasterisk: true,
      tooltip:
        'Link where the client can download a 7zip with the preprocessor, e.g. https://example.com/preprocessor-1.0.0.7z',
      validators: [Validators.required, urlValidator()]
    },
    { label: 'Commands (set to empty if not available)', isTitle: true },
    {
      name: 'keyspaceCommand',
      label: 'Keyspace Command',
      type: 'text',
      requiredasterisk: false,
      tooltip: false,
      validators: false,
      defaultValue: '--keyspace'
    },
    {
      name: 'skipCommand',
      label: 'Skip Command',
      type: 'text',
      requiredasterisk: false,
      tooltip: false,
      validators: false,
      defaultValue: '--skip'
    },
    {
      name: 'limitCommand',
      label: 'Limit Command',
      type: 'text',
      requiredasterisk: false,
      tooltip: false,
      validators: false,
      defaultValue: '--limit'
    }
  ];

  // //
  // Hashtypes
  // //

  // This variable stores information about the New Hashtypes page.
  newhashtypeInfo = [
    {
      title: 'Create Hashtype',
      customform: false,
      subtitle: false,
      submitok: 'New Hashtype created!',
      submitokredirect: '/config/hashtypes'
    }
  ];

  // This variable stores information about the Editing Hashtypes page.
  edithashtypeInfo = [
    {
      title: 'Edit Hashtype',
      customform: false,
      subtitle: false,
      submitok: 'Hashtype saved!',
      submitokredirect: '/config/hashtypes',
      deltitle: 'Hashtypes',
      delsubmitok: 'Deleted Hashtype',
      delsubmitokredirect: '/config/hashtypes',
      delsubmitcancel: 'Hashtype is safe!'
    }
  ];

  //This variable defines the fields and properties required when creating a new Hashtype.
  newhashtype = [
    {
      name: 'hashTypeId',
      label: 'Hashtype',
      type: 'number',
      requiredasterisk: true,
      tooltip: 'ie. Hashcat -m',
      validators: [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1), this.numberValidator]
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      requiredasterisk: true,
      tooltip: false,
      validators: [Validators.required, Validators.minLength(1)]
    },
    {
      name: 'isSalted',
      label: 'Salted',
      type: 'checkbox',
      requiredasterisk: false,
      tooltip: 'Only if there is a separate salt value',
      validators: false,
      defaultValue: false
    },
    {
      name: 'isSlowHash',
      label: 'Slow Hash',
      type: 'checkbox',
      requiredasterisk: false,
      tooltip: false,
      validators: false,
      defaultValue: false
    }
  ];

  //This variable is similar to newhashtype but is used for editing an existing Hashtype. As difference include disable form variable.
  edithashtype = [
    {
      name: 'hashTypeId',
      label: 'Hashtype',
      type: 'number',
      requiredasterisk: true,
      tooltip: 'ie. Hashcat -m',
      validators: [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1), this.numberValidator],
      disabled: true
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      requiredasterisk: true,
      tooltip: false,
      validators: [Validators.required, Validators.minLength(1)]
    },
    {
      name: 'isSalted',
      label: 'Salted',
      type: 'checkbox',
      requiredasterisk: false,
      tooltip: 'Only if there is a separate salt value',
      validators: false,
      defaultValue: false
    },
    {
      name: 'isSlowHash',
      label: 'Slow Hash',
      type: 'checkbox',
      requiredasterisk: false,
      tooltip: false,
      validators: false,
      defaultValue: true
    }
  ];

  // //
  // Server Settings
  // //

  serveragentInfo = [
    {
      title: 'Agent Settings',
      customform: false,
      subtitle: false,
      submitok: 'Saved!',
      submitokredirect: '/config/agent'
    }
  ];

  serveragent = [
    { label: 'Activity / Registration', isTitle: true },
    {
      name: 'agenttimeout',
      label: 'Inactivity Timeout Delay',
      type: 'number',
      tooltip: false
    },
    {
      name: 'benchtime',
      label: 'Inactivity Timeout for Issued Chunks',
      type: 'number',
      tooltip: false
    },
    {
      name: 'statustimer',
      label: 'Task Reporting Frequency',
      type: 'number',
      tooltip: false
    },
    {
      name: 'agentDataLifetime',
      label: 'Retention Period for Utilisation and Temperature Data',
      type: 'number',
      tooltip: false
    },
    {
      name: 'hideIpInfo',
      label: 'Agent IP Information Privacy',
      type: 'checkbox',
      tooltip: false
    },
    {
      name: 'voucherDeletion',
      label: 'Register Multiple Agents Using Voucher(s)',
      type: 'checkbox',
      tooltip: false
    },
    { label: 'Graphical Feedback', isTitle: true },
    {
      name: 'agentStatLimit',
      label: 'Maximum Data Points for Agent (GPU) Graphs',
      type: 'number',
      tooltip: false
    },
    {
      name: 'agentStatTension',
      label: 'Straight Lines or bezier curves for Agent Data Graphs',
      type: 'select',
      selectOptions: [
        { label: 'Straight lines', value: '0' },
        { label: 'Bezier curves', value: '1' }
      ],
      tooltip: false
    },
    {
      name: 'agentTempThreshold1',
      label: 'Orange Status Threshold for Agent Temperature',
      type: 'number',
      tooltip: false
    },
    {
      name: 'agentTempThreshold2',
      label: 'Red Status Threshold for Agent Temperature',
      type: 'number',
      tooltip: false
    },
    {
      name: 'agentUtilThreshold1',
      label: 'Orange Status Threshold for Agent Utilisation',
      type: 'number',
      tooltip: false
    },
    {
      name: 'agentUtilThreshold2',
      label: 'Red Status Threshold for Agent Utilisation',
      type: 'number',
      tooltip: false
    }
  ];

  servertaskchunkInfo = [
    {
      title: 'Task/Chunk Settings',
      customform: false,
      subtitle: false,
      submitok: 'Saved!',
      submitokredirect: '/config/task-chunk'
    }
  ];

  servertaskchunk = [
    { label: 'Benchmark / Chunk', isTitle: true },
    {
      name: 'chunktime',
      label: 'Expected Chunk Duration',
      type: 'number',
      tooltip: false
    },
    {
      name: 'disptolerance',
      label: 'Authorized Expansion Percentage for Final Chunk in a Task',
      type: 'number',
      tooltip: false
    },
    {
      name: 'defaultBenchmark',
      label: 'Default Speed Benchmark Process',
      type: 'checkbox',
      tooltip: false
    },
    {
      name: 'disableTrimming',
      label: 'Disable Chunk Trimming and Revert to Full Chunk Processing',
      type: 'checkbox',
      tooltip: false
    },
    { label: 'Command Line & Misc.', isTitle: true },
    {
      name: 'hashlistAlias',
      label: 'Hashlist Placeholder in Command Line',
      type: 'text',
      tooltip: false
    },
    {
      name: 'blacklistChars',
      label: 'Forbidden Characters in Attack Command Input',
      type: 'text',
      tooltip: false
    },
    {
      name: 'priority0Start',
      label: 'Automatic Assignment of Tasks with Priority 0 (Needed, Check File)',
      type: 'checkbox',
      tooltip: false
    },
    {
      name: 'showTaskPerformance',
      label: 'Display Cracks per Minute for Active Tasks',
      type: 'checkbox',
      tooltip: false
    },
    { label: 'Rule splitting', isTitle: true },
    {
      name: 'ruleSplitSmallTasks',
      label: 'Rule Splitting for Tasks: Always Create Small Tasks',
      type: 'checkbox',
      tooltip: false
    },
    {
      name: 'ruleSplitAlways',
      label: 'Rule Splitting with Benchmark Constraint: Allow Subtasks with a Single Rule',
      type: 'checkbox',
      tooltip: false
    },
    {
      name: 'ruleSplitDisable',
      label: 'Disable Automatic Task Splitting for Large Rule Files',
      type: 'checkbox',
      tooltip: false
    }
  ];

  serverhchInfo = [
    {
      title: 'Hashes/Cracks/Hashlist Settings',
      customform: false,
      subtitle: false,
      submitok: 'Saved!',
      submitokredirect: '/config/hch'
    }
  ];

  serverhch = [
    { label: 'Import/Display of Hashlist', isTitle: true },
    {
      name: 'maxHashlistSize',
      label: 'Maximum Lines in Hashlist',
      type: 'number',
      tooltip: false
    },
    {
      name: 'pagingSize',
      label: 'Hashes size Page in Hash Vieww',
      type: 'number',
      tooltip: false
    },
    {
      name: 'hashesPerPage',
      label: 'Hashes per Page in Hash View',
      type: 'number',
      tooltip: false
    },
    {
      name: 'fieldseparator',
      label: 'Separator Character for Hash and Plain (or Salt)',
      type: 'text',
      tooltip: false
    },
    {
      name: 'hashlistImportCheck',
      label: 'Check for Previous Cracks in Other Hashlists at Hashlist Creation',
      type: 'checkbox',
      tooltip: false
    },
    { label: 'Database Parameters', isTitle: true },
    {
      name: 'batchSize',
      label: 'SQL Query Batch Size for Hashlist Transmission to Agents',
      type: 'number',
      tooltip: false
    },
    {
      name: 'plainTextMaxLength',
      label: 'Maximum Length of Plain Text',
      type: 'number',
      tooltip: false
    },
    {
      name: 'hashMaxLength',
      label: 'Maximum length of a Hash',
      type: 'number',
      tooltip: 'Change Duration Dependent on Database Size'
    }
  ];

  servernotifInfo = [
    {
      title: 'Notification Settings',
      customform: false,
      subtitle: false,
      submitok: 'Saved!',
      submitokredirect: '/config/notifications'
    }
  ];

  // hashMaxLength it should be this validator type
  //   <span *ngIf="hchForm.controls['hashMaxLength']?.touched">
  //   <fa-icon  style="color:red" [icon]="faExclamationTriangle"></fa-icon> Such change may take a long time depending on the database size
  // </span>

  servernotif = [
    {
      name: 'emailSender',
      label: 'Notification Sender Email',
      type: 'text',
      tooltip: false
    },
    {
      name: 'emailSenderName',
      label: "Sender's Display Name",
      type: 'text',
      tooltip: false
    },
    {
      name: 'telegramBotToken',
      label: 'Telegram Bot Token for Notifications',
      type: 'text',
      tooltip: false
    },
    {
      name: 'notificationsProxyEnable',
      label: 'Enable Notification Proxy',
      type: 'checkbox',
      tooltip: false
    },
    { label: 'Proxy Settings', isTitle: true },
    {
      name: 'notificationsProxyServer',
      label: 'Notification Server URL',
      type: 'text',
      placeholder: 'http...',
      tooltip: false
    },
    {
      name: 'notificationsProxyPort',
      label: 'Notification Proxy Port',
      type: 'number',
      tooltip: false
    },
    {
      name: 'notificationsProxyType',
      label: 'Notification Proxy Type',
      type: 'select',
      selectOptions: proxytype,
      tooltip: false
    }
  ];

  //Evretyhing inside Enable using proxy
  // <div *ngIf="notifForm.get('notificationsProxyEnable').value == '1'">
  servergsInfo = [
    {
      title: 'General Settings',
      customform: false,
      subtitle: false,
      submitok: 'Saved!',
      submitokredirect: '/config/general-settings'
    }
  ];

  servergs = [
    {
      name: 'hashcatBrainEnable',
      label: 'Enable Hashcat Brain',
      type: 'checkbox',
      tooltip: false
    },
    {
      name: 'hashcatBrainHost',
      label: 'Host for Hashcat Brain (Accessible by Agents)',
      type: 'text',
      placeholder: 'URL',
      tooltip: false
    },
    {
      name: 'hashcatBrainPort',
      label: 'Port for Hashcat Brain',
      type: 'number',
      placeholder: 'I.e. 8080',
      tooltip: false
    },
    {
      name: 'hashcatBrainPass',
      label: 'Password for Accessing Hashcat Brain Server',
      type: 'password',
      tooltip: false
    },
    {
      name: 'hcErrorIgnore',
      label: 'Ignore Error Messages Containing the Following String from Crackers',
      type: 'textarea',
      tooltip: false
    },
    {
      name: 'numLogEntries',
      label: 'Number of Retained Log Entries',
      type: 'number',
      tooltip: false
    },
    {
      name: 'timefmt',
      label: 'Time Format Configuration',
      type: 'text',
      tooltip: false
    },
    {
      name: 'maxSessionLength',
      label: 'Maximum User Session Duration (in hours)',
      type: 'text',
      tooltip: false
    },
    {
      name: 'baseHost',
      label: 'Base Hostname/Port/Protocol Override',
      type: 'text',
      tooltip: false
    },
    {
      name: 'contactEmail',
      label: 'Admin Email Address for Webpage Footer Display',
      type: 'text',
      tooltip: false
    },
    {
      name: 'serverLogLevel',
      label: 'Server Level Logging to File',
      type: 'select',
      selectOptions: serverlog,
      tooltip: false
    }
  ];

  // //
  // Health Check
  // //

  // This variable holds information about the fields required when creating a new health check.
  newhealthcheck = [
    {
      name: 'attack',
      label: 'Attack',
      type: 'select',
      requiredasterisk: true,
      selectOptions: [{ value: 0, label: 'Brute-Force' }],
      validators: [Validators.required]
    },
    {
      name: 'hashtypeId',
      label: 'Hashtype',
      type: 'select',
      requiredasterisk: true,
      selectOptions: [
        { value: 0, label: 'MD5' },
        { value: 3200, label: 'BCRYPT' }
      ],
      validators: [Validators.required]
    },
    {
      name: 'crackerBinaryType',
      label: 'Binary',
      type: 'selectd',
      requiredasterisk: true,
      selectEndpoint$: SERV.ACCESS_PERMISSIONS_GROUPS,
      selectOptions$: of([]),
      fieldMapping: { id: 'crackerBinaryTypeId', name: 'typeName' },
      validators: [Validators.required]
    },
    {
      name: 'crackerBinaryId',
      label: 'Binary Version',
      type: 'selectd',
      requiredasterisk: true,
      selectEndpoint$: SERV.ACCESS_PERMISSIONS_GROUPS,
      selectOptions$: of([]),
      fieldMapping: { id: 'crackerBinaryId', name: 'version' },
      validators: [Validators.required]
    }
  ];

  // // // // // // // //
  // USER SECTION      //
  // // // // // // // //

  // //
  // USERS
  // //

  // This variable stores information about the user page.
  newuserInfo = [
    {
      title: 'New User',
      customform: false,
      subtitle: false,
      submitok: 'New User created!',
      submitokredirect: 'users/all-users'
    }
  ];

  //This variable holds information about the fields required when creating a new user.
  newuser = [
    {
      name: 'name',
      label: 'User Name',
      type: 'text',
      requiredasterisk: true,
      validators: [Validators.required]
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      requiredasterisk: true,
      validators: [Validators.required, Validators.email]
    },
    {
      name: 'globalPermissionGroupId',
      label: 'Global Permission Group',
      type: 'selectd',
      requiredasterisk: true,
      selectEndpoint$: SERV.ACCESS_PERMISSIONS_GROUPS,
      selectOptions$: of([]),
      fieldMapping: { id: 'id', name: 'name' },
      validators: [Validators.required]
    }
  ];

  // //
  // New Global Permission Group
  // //

  // This variable stores information about the global permission group page.
  newglobalpermissionsgpInfo = [
    {
      title: 'New Global Permission Group',
      customform: false,
      subtitle: false,
      submitok: 'New Global Permission Group created!',
      submitokredirect: '/users/global-permissions-groups'
    }
  ];

  //This variable holds information about the fields required when creating a new global permission group.
  newglobalpermissionsgp = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      requiredasterisk: true,
      tooltip: false,
      validators: [Validators.required]
    }
  ];

  // //
  // Access Groups
  // //

  // This variable stores information about the access group page.
  newaccessgroupsInfo = [
    {
      title: 'New Access Group',
      subtitle: false,
      submitok: 'New Access Group created!',
      submitokredirect: '/users/access-groups'
    }
  ];

  // This variable contains information related to editing an access group.
  editaccessgroupsInfo = [
    {
      title: 'Edit Access Group',
      subtitle: false,
      submitok: 'Access Group saved!',
      submitokredirect: '/users/access-groups',
      deltitle: 'Agent Groups',
      delsubmitok: 'Deleted Access Group',
      delsubmitokredirect: '/users/access-groups',
      delsubmitcancel: 'Agent Group is safe!'
    }
  ];

  // This variable contains information about the fields required when creating or editing an access group.
  accessgroups = [
    {
      name: 'groupName',
      label: 'Name',
      type: 'text',
      requiredasterisk: true,
      tooltip: false,
      validators: [Validators.required]
    }
  ];

  // // // // // // // // //
  // UI SETTINGS SECTION  //
  // // // // // // // // //

  uisettingsInfo = [{ title: 'UI Settings', subtitle: false }];

  uisettings = [
    {
      name: 'localtimefmt',
      label: 'Set the time format',
      type: 'select',
      selectOptions: dateFormats
    },
    {
      name: 'autorefresh',
      label: 'Dashboard Refresh Interval (seconds)',
      type: 'text',
      tooltip: 'Manage refresh interval in the show tasks view'
    },
    {
      name: 'tooltip',
      label: 'Manage Global level of tooltip details',
      type: 'select',
      selectOptions: [
        { label: 'Concise', value: 0 },
        { label: 'Detailed', value: 1 },
        { label: 'Very Detailed', value: 2 }
      ]
    }
  ];

  /**
   * Retrieves form metadata based on the provided form name.
   * @param formName - The name of the form for which metadata is requested.
   * @returns An array of form metadata.editnotifInfo
   */
  getFormMetadata(formName: string): MetadataFormField[] {
    if (formName === 'authforgot') {
      return this.authforgot;
    } else if (formName === 'editwordlist' || formName === 'editrule' || formName === 'editother') {
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
    } else if (formName === 'newhashtype') {
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
    } else {
      return [];
    }
  }

  /**
   * Retrieves info metadata based on the provided form name.
   * @param formName - The name of the info metadata for which information is requested.
   * @returns An array of info metadata.
   */
  getInfoMetadata(formName: string): InfoMetadataForm[] {
    if (formName === 'authforgotInfo') {
      return this.authforgotInfo;
    } else if (formName === 'editwordlistInfo') {
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
    } else {
      return [];
    }
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
