import { Subscription } from 'rxjs';
import { VouchersTableComponent } from 'src/app/core/_components/tables/vouchers-table/vouchers-table.component';
import { GlobalService } from 'src/app/core/_services/main.service';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { ConfigService } from 'src/app/core/_services/shared/config.service';

import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { SERV } from '@services/main.config';
import { AlertService } from '@services/shared/alert.service';

import { VoucherForm } from '@src/app/agents/new-agent/new-agent.form';
import { JConfig } from '@src/app/core/_models/configs.model';
import { FilterType } from '@src/app/core/_models/request-params.model';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { environment } from '@src/environments/environment';

@Component({
  selector: 'app-new-agent',
  templateUrl: './new-agent.component.html',
  standalone: false
})
export class NewAgentComponent implements OnInit, OnDestroy {
  form: FormGroup<VoucherForm>;
  agentURL: string;
  newVoucherSubscription: Subscription;
  allowMultiVoucher = false;

  @ViewChild('table') table: VouchersTableComponent;

  constructor(
    private titleService: AutoTitleService,
    private clipboard: Clipboard,
    private alertService: AlertService,
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
    this.loadVoucherDeletionSetting();
    this.updateVoucher();
  }

  private loadVoucherDeletionSetting(): void {
    const params = new RequestParamBuilder()
      .addFilter({ field: 'item', operator: FilterType.EQUAL, value: 'voucherDeletion' })
      .create();

    this.gs.getAll(SERV.CONFIGS, params).subscribe({
      next: (response) => {
        try {
          const configs = new JsonAPISerializer().deserialize<JConfig[]>({
            data: response?.data,
            included: response?.included
          });
          const setting = configs?.find((config) => config.item === 'voucherDeletion');
          const rawValue = setting?.value ?? '';
          const normalized = String(rawValue).toLowerCase();
          this.allowMultiVoucher = normalized === '1' || normalized === 'true';
        } catch (error) {
          console.error('Error parsing voucherDeletion setting', error);
          this.allowMultiVoucher = false;
        }
      },
      error: () => {
        this.allowMultiVoucher = false;
      }
    });
  }

  updateVoucher(): void {
    this.form.setValue({ voucher: this.generateVoucher() });
  }

  generateVoucher(): string {
    return Math.random().toString(36).slice(-8);
  }

  copyAgentURL(): void {
    this.clipboard.copy(this.agentURL);
    this.alertService.showSuccessMessage('The agent register URL is copied to the clipboard');
  }

  isValid(): boolean {
    return this.form.valid && this.form.get('voucher').value !== '';
  }

  onSubmit() {
    if (this.form.valid) {
      this.newVoucherSubscription = this.gs.create(SERV.VOUCHER, this.form.value).subscribe(() => {
        this.updateVoucher();
        this.alertService.showSuccessMessage('New voucher successfully created!');
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
