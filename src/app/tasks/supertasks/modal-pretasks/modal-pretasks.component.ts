import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { GlobalService } from 'src/app/core/_services/main.service';
import { SERV } from '../../../core/_services/main.config';

@Component({
  selector: 'app-modal-st-pretasks',
  templateUrl: './modal-pretasks.component.html'
})
export class ModalPretasksComponent implements OnInit {

  title: any;
  faTrash=faTrash;
  supertaskid: any;
  pretasks: any;
  prep: any;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  createForm: FormGroup;

  constructor(
    public modal: NgbActiveModal,
    private gs: GlobalService,
    private router: Router,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {

    this.pretasks = this.prep;
    this.dtTrigger.next(null);

    this.dtOptions = {
      dom: 'Bfrtip',
      scrollX: true,
      pageLength: 25,
      lengthMenu: [
          [10, 25, 50, 100, 250, -1],
          [10, 25, 50, 100, 250, 'All']
      ],
      destroy: true,
      buttons:[]
    };

    this.createForm = this.fb.group({
      KeysAndValues: this.fb.array([]),
    });
    for (let i = 0; i < this.pretasks.length; i++) {
      this.KeysAndValues.push(
        this.fb.group({
          pretaskId: new FormControl(this.pretasks[i].pretaskId),
          oldpriority: new FormControl(this.pretasks[i].priority),
          priority: new FormControl('' || this.pretasks[i].priority),
          delete: new FormControl('' || false),
        })
      );
    }

  }

  redirectPretask(id){
    this.router.navigate(['/tasks/preconfigured-tasks/', id,'edit']);
    this.modal.close();
  }

  ngAfterViewInit(){
    this.dtTrigger.next(null);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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

  get KeysAndValues() {
    return this.createForm.get('KeysAndValues') as FormArray;
  }

  onSubmit(){
    let prepval = this.createForm.value;
    for (let i = 0; i < prepval.KeysAndValues.length; i++) {
      if(prepval.KeysAndValues[i].delete){
        const filter = this.pretasks.filter(u => u.pretaskId !== prepval.KeysAndValues[i].pretaskId);
        const payload = [];
        for(let i=0; i < filter.length; i++){
          payload.push(filter[i].pretaskId);
        }
        this.gs.update(SERV.SUPER_TASKS,this.supertaskid,{'pretasks': payload}).subscribe();
      }
      if(prepval.KeysAndValues[i].oldpriority !== prepval.KeysAndValues[i].priority){
        console.log(prepval.KeysAndValues[i])
        this.gs.update(SERV.PRETASKS,prepval.KeysAndValues[i].pretaskId,{'priority': prepval.KeysAndValues[i].priority}).subscribe();
      }
      this.modal.close()
      setTimeout(() => {
        window.location.reload();
      },500);
    }
  }


}
