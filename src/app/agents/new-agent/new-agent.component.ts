import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { ConfigService } from 'src/app/core/_services/shared/config.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SERV } from '../../core/_services/main.config';
import { Subscription } from 'rxjs';
import { VoucherForm } from './new-agent.form';
import { VouchersTableComponent } from 'src/app/core/_components/tables/vouchers-table/vouchers-table.component';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';

@Component({
    selector: 'app-new-agent',
    templateUrl: './new-agent.component.html',
    standalone: false
})
export class NewAgentComponent implements OnInit, OnDestroy {
  form: FormGroup<VoucherForm>;
  agentURL: string;
  newVoucherSubscription: Subscription;

  @ViewChild('table') table: VouchersTableComponent;

  constructor(
    private titleService: AutoTitleService,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
    private cs: ConfigService,
    private gs: GlobalService,
    private router: Router
  ) {
    this.titleService.set(['New Agent']);
    this.form = new FormGroup<VoucherForm>({
      voucher: new FormControl('', { nonNullable: true })
    });
  }

  ngOnDestroy(): void {
    if (this.newVoucherSubscription) {
      this.newVoucherSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    const path = this.cs.getEndpoint().replace('/api/v2', '');
    this.agentURL = path + '/api' + environment.config.agentURL;
    this.updateVoucher();
  }

  updateVoucher(): void {
    this.form.setValue({ voucher: this.generateVoucher() });
  }

  generateVoucher(): string {
    return Math.random().toString(36).slice(-8);
  }

  copyAgentURL(): void {
    this.clipboard.copy(this.agentURL);
    this.snackBar.open(
      'The agent register URL is copied to the clipboard',
      'Close'
    );
  }

  isValid(): boolean {
    return this.form.valid && this.form.get('voucher').value !== '';
  }

  onSubmit() {
    if (this.form.valid) {
      this.newVoucherSubscription = this.gs
        .create(SERV.VOUCHER, this.form.value)
        .subscribe(() => {
          this.updateVoucher();
          this.snackBar.open('New voucher successfully created!', 'Close');
          this.table.reload();
        });
    }
  }

  /**
   * Navigates to the agent overview
   **/
  done(): void {
    this.router.navigate(['/agents/show-agents']);
  }
}
