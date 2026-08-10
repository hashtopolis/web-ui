import { zAccessGroupListResponse } from '@generated/api/zod';
import { Observable } from 'rxjs';
import { z } from 'zod';

import { Injectable, inject } from '@angular/core';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

import { ResponseWrapper } from '@models/response.model';

import { RelationshipType, SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { ConfigTooltipsLevel, TooltipService } from '@services/shared/tooltip.service';

import { fileFormat } from '@src/app/core/_constants/files.config';
import { ACCESS_GROUP_FIELD_MAPPING, FieldMapping } from '@src/app/core/_constants/select.config';
import { Option, proxytype, serverlog } from '@src/app/core/_constants/settings.config';
import { urlValidator } from '@src/app/core/_validators/url.validator';
import { SelectOption } from '@src/app/shared/utils/forms';

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
  /**
   * In edit mode, build the page title as `${titlePrefix} ${formValues[titleField]}`.
   * `titleField` may list several fields (e.g. `['filename', 'version']`), whose
   * values are joined with spaces — yielding titles like "Agent Binary foo.bin 1.0".
   */
  titlePrefix?: string;
  titleField?: string | string[];
}

/**
 * Render kinds supported by the dynamic form. Single source of truth for the
 * `MetadataFormField.type` discriminator — any new render kind should be added
 * here so every metadata array stays type-checked at compile time.
 */
export const FieldType = {
  Text: 'text',
  Password: 'password',
  Email: 'email',
  Url: 'url',
  Number: 'number',
  Textarea: 'textarea',
  Checkbox: 'checkbox',
  Select: 'select',
  AsyncSelect: 'asyncSelect',
  Hidden: 'hidden'
} as const;

export type FieldType = (typeof FieldType)[keyof typeof FieldType];

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
 * - selectEndpoint$: Function returning an observable for fetching select options
 * - fieldMapping: Object with the dropdown options mapping, e.g., { id: '_id', name: 'groupName' }
 * - requiredasterisk: Indicates if the field is required (shows asterisk)
 * - tooltip: Tooltip information as string or more complex type
 * - validators: Validation rules
 * - isTitle: If true, will use only the label field as a title
 */
export interface MetadataFormField {
  name?: string;
  label?: string;
  type?: FieldType;
  placeholder?: string;
  selectOptions?: Option[];
  selectOptions$?: SelectOption<number>[];
  selectEndpoint$?: () => Observable<ResponseWrapper>;
  selectSchema?: z.ZodTypeAny;
  fieldMapping?: FieldMapping;
  requiredasterisk?: boolean;
  tooltip?: string | boolean;
  validators?: ValidatorFn[] | boolean;
  isTitle?: boolean;
  fullWidth?: boolean;
  replacevalue?: string;
  disabled?: boolean;
  defaultValue?: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  private tooltip: ConfigTooltipsLevel;
  private gs = inject(GlobalService);

  constructor(private tooltipService: TooltipService) {
    this.tooltip = this.tooltipService.getConfigTooltips();
  }

  // // // // // // // //
  // AUTH SECTION      //
  // // // // // // // //

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

  editwordlistInfo = [
    {
      title: 'Edit Wordlist File',
      titlePrefix: 'Wordlist',
      titleField: 'filename',
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
      titlePrefix: 'Rule',
      titleField: 'filename',
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
      titlePrefix: 'Other File',
      titleField: 'filename',
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

  //This variable defines the fields and properties required when editing a wordlist, rule or other file.
  editfile: MetadataFormField[] = [
    { name: 'id', label: 'ID', type: 'number', disabled: true },
    {
      name: 'fileType',
      label: 'File Type',
      type: 'select',
      selectOptions: fileFormat
    },
    {
      name: 'filename',
      label: 'Name',
      type: 'text',
      requiredasterisk: true,
      fullWidth: true,
      validators: [Validators.required]
    },
    {
      name: 'accessGroupId',
      label: 'Access group',
      type: 'asyncSelect',
      requiredasterisk: true,
      fullWidth: true,
      selectEndpoint$: () => this.gs.getRelationships(SERV.USERS, this.gs.userId!, RelationshipType.ACCESSGROUPS),
      selectSchema: zAccessGroupListResponse,
      selectOptions$: [],
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
      titlePrefix: 'Agent Binary',
      titleField: ['filename', 'version'],
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
  agentbinary: MetadataFormField[] = [
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
      titleField: ['binaryName', 'version'],
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
  newcrackerversion: MetadataFormField[] = [
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
  editcrackerversion: MetadataFormField[] = [
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
      fullWidth: true,
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
      titlePrefix: 'Hashtype',
      titleField: 'description',
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
  newhashtype: MetadataFormField[] = [
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
  edithashtype: MetadataFormField[] = [
    {
      name: 'id',
      label: 'Hashtype',
      type: 'number',
      requiredasterisk: true,
      fullWidth: true,
      tooltip: 'ie. Hashcat -m',
      validators: [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1), this.numberValidator],
      disabled: true
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      requiredasterisk: true,
      fullWidth: true,
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

  serveragent: MetadataFormField[] = [
    { label: 'Activity / Registration', isTitle: true },
    {
      name: 'agenttimeout',
      label: 'Inactivity Timeout Delay',
      type: 'number',
      tooltip: false
    },
    {
      name: 'chunktimeout',
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
      label: 'Hide Agent IP Information',
      type: 'checkbox',
      tooltip: false
    },
    {
      name: 'voucherDeletion',
      label: 'Allow multiple usage of Voucher for Agent Registration',
      type: 'checkbox',
      tooltip: false
    },
    {
      name: 'allowDeregister',
      label: 'Allow Clients to Deregister Themselves Automatically from the Server',
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
        { label: 'Straight lines', value: 0 },
        { label: 'Bezier curves', value: 1 }
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

  servertaskchunk: MetadataFormField[] = [
    { label: 'Benchmark / Chunk', isTitle: true },
    {
      name: 'benchtime',
      label: 'Time in Seconds an Agent Should Benchmark a Task',
      type: 'number',
      tooltip: false
    },
    {
      name: 'chunktime',
      label: 'Targeted chunk duration',
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
      label: 'Use speed benchmarking estimation',
      type: 'checkbox',
      tooltip: false
    },
    {
      name: 'disableTrimming',
      label: 'Disable chunk trimming and redo whole chunk on error',
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
      label: 'Automatic Assignment of Tasks with Priority 0',
      type: 'checkbox',
      tooltip: false
    },
    {
      name: 'showTaskPerformance',
      label: 'Display Cracks per Minute for Active Tasks',
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

  serverhch: MetadataFormField[] = [
    { label: 'Import/Display of Hashlist', isTitle: true },
    {
      name: 'maxHashlistSize',
      label: 'Maximum Lines in Hashlist',
      type: 'number',
      tooltip: false
    },
    {
      name: 'pagingSize',
      label: 'Hashes size Page in Hash View',
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

  servernotif: MetadataFormField[] = [
    { label: 'Sender Settings', isTitle: true },
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

  servergs: MetadataFormField[] = [
    {
      name: 'hashcatBrainEnable',
      label: 'Enable Hashcat Brain',
      type: 'checkbox',
      tooltip: false,
      fullWidth: true
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
    },
    {
      name: 'hideImportMasks',
      label: 'Hide Preconfigured Tasks Created by Mask Importer',
      type: 'checkbox',
      tooltip: false,
      fullWidth: true
    }
  ];

  // //
  // Health Check
  // //

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
  newglobalpermissionsgp: MetadataFormField[] = [
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

  accessgroups: MetadataFormField[] = [
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

  getFormMetadata(formName: string): MetadataFormField[] {
    if (formName === 'editwordlist' || formName === 'editrule' || formName === 'editother') {
      return this.editfile;
    } else if (formName === 'newagentbinary' || formName === 'editagentbinary') {
      return this.agentbinary;
    } else if (formName === 'newcrackerversion') {
      return this.newcrackerversion;
    } else if (formName === 'editcrackerversion') {
      return this.editcrackerversion;
    } else if (formName === 'newhashtype') {
      return this.newhashtype;
    } else if (formName === 'edithashtype') {
      return this.edithashtype;
    } else if (formName === 'newglobalpermissionsgp') {
      return this.newglobalpermissionsgp;
    } else if (formName === 'newaccessgroups') {
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
    if (formName === 'editwordlistInfo') {
      return this.editwordlistInfo;
    } else if (formName === 'editruleInfo') {
      return this.editruleInfo;
    } else if (formName === 'editotherInfo') {
      return this.editotherInfo;
    } else if (formName === 'newagentbinaryInfo') {
      return this.newagentbinaryInfo;
    } else if (formName === 'editagentbinaryInfo') {
      return this.editagentbinaryInfo;
    } else if (formName === 'newcrackerversionInfo') {
      return this.newcrackerversionInfo;
    } else if (formName === 'editcrackerversionInfo') {
      return this.editcrackerversionInfo;
    } else if (formName === 'newhashtypeInfo') {
      return this.newhashtypeInfo;
    } else if (formName === 'edithashtypeInfo') {
      return this.edithashtypeInfo;
    } else if (formName === 'newglobalpermissionsgpInfo') {
      return this.newglobalpermissionsgpInfo;
    } else if (formName === 'newaccessgroupsInfo') {
      return this.newaccessgroupsInfo;
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
    } else {
      return [];
    }
  }

  // Custom validator to convert the input value to a number
  numberValidator(control: AbstractControl) {
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
