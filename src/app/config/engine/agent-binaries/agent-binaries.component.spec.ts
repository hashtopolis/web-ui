import { ComponentFixture, TestBed, tick, fakeAsync, flush } from '@angular/core/testing';
import { AgentBinariesComponent } from './agent-binaries.component';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GlobalService } from 'src/app/core/_services/main.service';
import { Observable, of } from 'rxjs';
import { SERV } from '../../../core/_services/main.config';
import { AgentBinary } from 'src/app/core/_models/agent-binary';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from 'src/app/shared/components.module';
import { PipesModule } from 'src/app/shared/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ResponseWrapper } from 'src/app/core/_models/response-wrapper';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('AgentBinariesComponent', () => {
  let component: AgentBinariesComponent;
  let fixture: ComponentFixture<AgentBinariesComponent>;

  // Sample agent binaries data
  const agentBinaries: AgentBinary[] = [
    {
      agentBinaryId: 1,
      type: 'test-type-1',
      version: '1.0.0',
      operatingSystems: 'Linux',
      filename: 'agent-binary-1.bin',
      updateTrack: 'stable',
      updateAvailable: ''
    },
    {
      agentBinaryId: 2,
      type: 'test-type-2',
      version: '1.0.0',
      operatingSystems: 'Linux',
      filename: 'agent-binary-2.bin',
      updateTrack: 'stable',
      updateAvailable: ''
    },
    {
      agentBinaryId: 3,
      type: 'test-type-3',
      version: '1.0.0',
      operatingSystems: 'Linux',
      filename: 'agent-binary-3.bin',
      updateTrack: 'stable',
      updateAvailable: ''
    },
  ];
  // response object

  // Mock GlobalService with required methods
  const mockService: Partial<GlobalService> = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    getAll(_methodUrl: string, params: any): Observable<ResponseWrapper<AgentBinary>> {
      if (_methodUrl === SERV.AGENT_BINARY) {
        return of({
          startAt: 0,
          maxResults: agentBinaries.length,
          total: agentBinaries.length,
          isLast: true,
          values: agentBinaries
        });
      }
      return of({} as ResponseWrapper<AgentBinary>);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete(_methodUrl: string, id: number): Observable<any> {
      if (_methodUrl === SERV.AGENT_BINARY) {
        const index = agentBinaries.findIndex((ab) => ab.agentBinaryId === id);
        if (index !== -1) {
          agentBinaries.splice(index, 1);
        }
        return of({});
      }
      return of({});
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientModule,
        FontAwesomeModule,
        DataTablesModule,
        ComponentsModule,
        PipesModule,
        RouterModule,
        NgbModule,
        RouterTestingModule,
        FormsModule,
      ],
      declarations: [
        AgentBinariesComponent
      ],
      providers: [
        {
          provide: GlobalService,
          useValue: mockService,
        },
        AutoTitleService,
        Swal,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentBinariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  // --- Test Methods ---


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch agent binaries on initialization', () => {
    expect(component.binaries).toEqual(agentBinaries);
  });

  it('should render the table with agent binaries', () => {
    const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(agentBinaries.length);
  });
  it('should handle agent binary deletion', fakeAsync(() => {
    const deleteSpy = spyOn(mockService, 'delete').and.callThrough();
    const swalFireSpy = spyOn(Swal, 'fire').and.callFake(() => {
      return Promise.resolve({ isConfirmed: true });
    });

    const binaryToDelete = agentBinaries[0];
    component.onDelete(binaryToDelete.agentBinaryId, binaryToDelete.type);

    // Trigger the confirmation and flush any asynchronous tasks
    Swal.clickConfirm();
    flush();

    expect(deleteSpy).toHaveBeenCalledWith(SERV.AGENT_BINARY, binaryToDelete.agentBinaryId);
    expect(swalFireSpy).toHaveBeenCalled();
    expect(component.binaries).not.toContain(binaryToDelete);
  }));

  it('should handle agent binary deletion cancellation', fakeAsync(() => {
    const deleteSpy = spyOn(mockService, 'delete').and.callThrough();
    const swalFireSpy = spyOn(Swal, 'fire').and.callFake(() => {
      return Promise.resolve({ isConfirmed: false });
    });

    const binaryToDelete = agentBinaries[0];
    component.onDelete(binaryToDelete.agentBinaryId, binaryToDelete.type);

    // Trigger the cancellation and flush any asynchronous tasks
    Swal.clickCancel();
    flush();

    expect(deleteSpy).not.toHaveBeenCalled();
    expect(swalFireSpy).toHaveBeenCalled();
    expect(component.binaries).toContain(binaryToDelete);
  }));
});
