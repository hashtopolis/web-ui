import { faTrash, faDownload, faInfoCircle, faCopy } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from './../../../environments/environment';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject } from 'rxjs';


import { AgentBinService } from 'src/app/core/_services/config/agentbinary.service';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { VoucherService } from '../../core/_services/agents/voucher.service';
import { CrackerService } from '../../core/_services/config/cracker.service';
import { UsersService } from 'src/app/core/_services/users/users.service';

@Component({
  selector: 'app-new-agent',
  templateUrl: './new-agent.component.html'
})
export class NewAgentComponent implements OnInit, OnDestroy {
  // Loader
  isLoading = false;
  // Form attributtes
  faInfoCircle=faInfoCircle;
  faDownload=faDownload;
  faTrash=faTrash;
  faCopy=faCopy;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  uidateformat:any;

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  createForm: FormGroup
  binaries: any = [];
  // public binaries: {agentBinaryId: number, type: string, version: string, operatingSystems: string, filename: string, updateTrack: string, updateAvailable: string}[] = [];
  vouchers: any = [];

  randomstring:any

  constructor(
    private agentBinService: AgentBinService,
    private voucherService: VoucherService,
    private uiService: UIConfigService,
    private users: UsersService
  ) { }

  private maxResults = environment.config.prodApiMaxResults;

  pathURL = location.protocol + '//' + location.hostname + ':' + environment.config.prodApiPort;
  public agentURL = this.pathURL + environment.config.agentURL;
  public agentdownloadURL = this.pathURL + environment.config.agentdownloadURL;

  ngOnInit(): void {

    // URL paths
    this.setAccessPermissions();

    // Generate Voucher
    this.randomstring = Math.random().toString(36).slice(-8);

    this.createForm = new FormGroup({
      'voucher': new FormControl(''),
    });

    let params = {'maxResults': this.maxResults}

    this.voucherService.getVouchers(params).subscribe((vouchers: any) => {
      this.vouchers = vouchers.values;
    });

    this.agentBinService.getAgentBins().subscribe((bin: any) => {
      this.binaries = bin.values;
      this.dtTrigger.next(void 0);
    });

    this.uidateformat = this.uiService.getUIsettings('timefmt').value;

    this.dtOptions = {
      dom: 'Bfrtip',
      pageLength: 10,
      stateSave: true,
      select: true,
    };

  }

  // Set permissions
  manageAgentAccess: any;
  createAgentAccess: any;

  setAccessPermissions(){
    this.users.getUser(this.users.userId,{'expand':'globalPermissionGroup'}).subscribe((perm: any) => {
        this.manageAgentAccess = perm.globalPermissionGroup.permissions.manageAgentAccess;
        this.createAgentAccess = perm.globalPermissionGroup.permissions.createAgentAccess;
    });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      setTimeout(() => {
        this.dtTrigger['new'].next();
      });
    });
  }

  onDelete(id: number){
    if(this.manageAgentAccess || typeof this.manageAgentAccess == 'undefined'){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, it can not be recovered!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#4B5563',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.voucherService.deleteVoucher(id).subscribe(() => {
          Swal.fire(
            "Voucher has been deleted!",
            {
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.ngOnInit();
          this.rerender();  // rerender datatables
        });
      } else {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'No worries, your Voucher is safe!',
          'error'
        )
      }
    });
    }else{
      Swal.fire({
        title: "ACTION DENIED",
        text: "Please contact your Administrator.",
        icon: "error",
        showConfirmButton: false,
        timer: 2000
      })
    }
  }

  onSubmit(){
    console.log(this.createAgentAccess)
    if(this.createAgentAccess || typeof this.createAgentAccess == 'undefined'){
    if (this.createForm.valid) {

      this.isLoading = true;

      this.voucherService.createVoucher(this.createForm.value).subscribe((hasht: any) => {
        const response = hasht;
        console.log(response);
        this.isLoading = false;
          Swal.fire({
            title: "Good job!",
            text: "New Voucher created!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.ngOnInit();
          this.rerender();  // rerender datatables
        },
        errorMessage => {
          // check error status code is 500, if so, do some action
          Swal.fire({
            title: "Error!",
            text: "Voucher was not created, please try again!",
            icon: "warning",
            showConfirmButton: true
          });
        }
      );
    }
    }else{
      Swal.fire({
        title: "ACTION DENIED",
        text: "Please contact your Administrator.",
        icon: "error",
        showConfirmButton: false,
        timer: 2000
      })
    }
  }

}
