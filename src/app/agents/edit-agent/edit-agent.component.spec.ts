import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { of, throwError } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { JChunk } from '@models/chunk.model';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AgentRoleService } from '@services/roles/agents/agent-role.service';
import { AlertService } from '@services/shared/alert.service';

import { EditAgentComponent } from '@src/app/agents/edit-agent/edit-agent.component';
import { AgentOS } from '@src/app/core/_constants/agentsc.config';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { ComponentsModule } from '@src/app/shared/components.module';
import { DirectivesModule } from '@src/app/shared/directives.module';
import { CoreFormsModule } from '@src/app/shared/forms.module';
import { InputModule } from '@src/app/shared/input/input.module';
import { PageTitleModule } from '@src/app/shared/page-headers/page-title.module';
import { PipesModule } from '@src/app/shared/pipes.module';
import { TableModule } from '@src/app/shared/table/table-actions.module';
import { mockResponse } from '@src/app/testing/mock-response';

// Mock components - only for components not included in imported modules
@Component({
  selector: 'app-agent-stats',
  template: '',
  standalone: false
})
export class MockAgentStatsComponent {
  @Input() agent: any;
}

@Component({
  selector: 'app-agent-environment',
  template: '',
  standalone: false
})
export class MockAgentEnvironmentComponent {
  @Input() agent: any;
}

@Component({
  selector: 'app-chunks-table',
  template: '',
  standalone: false
})
export class MockChunksTableComponent {
  @Input() chunks: any[];
}

@Component({
  selector: 'app-agent-stat-graph',
  template: '',
  standalone: false
})
export class MockAgentStatGraphComponent {
  @Input() statType: any;
  @Input() agentStats: any[];
}

@Component({
  selector: 'app-agent-error-table',
  template: '',
  standalone: false
})
export class MockAgentErrorTableComponent {
  @Input() agentId: number;
}

describe('EditAgentComponent', () => {
  let component: EditAgentComponent;
  let fixture: ComponentFixture<EditAgentComponent>;

  // Mocks
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let globalServiceSpy: jasmine.SpyObj<GlobalService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let agentRoleServiceSpy: jasmine.SpyObj<AgentRoleService>;

  const mockAgent = {
    id: 1,
    type: 'agent',
    attributes: {
      agentName: 'Test Agent',
      uid: 'uid-001',
      os: 0,
      devices: 'RTX3080',
      cmdPars: '--test',
      ignoreErrors: 0,
      isActive: true,
      isTrusted: false,
      token: 'token-001',
      lastAct: 'now',
      lastTime: 123456,
      lastIp: '127.0.0.1',
      userId: 1,
      cpuOnly: false,
      clientSignature: 'signature-001'
    }
  };

  const mockUser = {
    id: 1,
    type: 'user',
    attributes: {
      name: 'admin',
      email: 'admin@localhost',
      isValid: true,
      isComputedPassword: false,
      lastLoginDate: 1,
      registeredSince: 1,
      sessionLifetime: 3600,
      globalPermissionGroupId: 1,
      yubikey: '0',
      otp1: '',
      otp2: '',
      otp3: '',
      otp4: ''
    }
  };

  const mockTask = {
    id: 1,
    type: 'task',
    attributes: {
      taskName: 'Task 1',
      attackCmd: '',
      chunkTime: 1,
      statusTimer: 1,
      keyspace: 0,
      keyspaceProgress: 0,
      priority: 1,
      maxAgents: 0,
      color: null,
      isSmall: false,
      isCpuTask: false,
      useNewBench: false,
      skipKeyspace: 0,
      crackerBinaryId: 0,
      crackerBinaryTypeId: null,
      taskWrapperId: 0,
      isArchived: false,
      notes: '',
      staticChunks: 0,
      chunkSize: 0,
      forcePipe: false,
      preprocessorId: 0,
      preprocessorCommand: ''
    }
  };

  beforeEach(async () => {
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);
    globalServiceSpy = jasmine.createSpyObj('GlobalService', [
      'get',
      'getAll',
      'update',
      'create',
      'delete',
      'ghelper'
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    agentRoleServiceSpy = jasmine.createSpyObj('AgentRoleService', ['hasRole']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    });

    // Default role service behavior
    agentRoleServiceSpy.hasRole.and.returnValue(false);

    // Default service responses
    globalServiceSpy.get.and.returnValue(of(mockResponse({ data: mockAgent })));
    globalServiceSpy.getAll.and.returnValue(of(mockResponse({ data: [mockUser] })));
    globalServiceSpy.ghelper.and.returnValue(of(mockResponse({ data: [] })));
    globalServiceSpy.update.and.returnValue(of(mockResponse()));
    globalServiceSpy.create.and.returnValue(of(mockResponse()));

    await TestBed.configureTestingModule({
      declarations: [
        EditAgentComponent,
        MockAgentStatsComponent,
        MockAgentEnvironmentComponent,
        MockChunksTableComponent,
        MockAgentStatGraphComponent,
        MockAgentErrorTableComponent
      ],
      imports: [
        CommonModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
        MatStepperModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        PageTitleModule,
        ButtonsModule,
        PipesModule,
        InputModule,
        TableModule,
        ComponentsModule,
        CoreFormsModule,
        DirectivesModule
      ],
      providers: [
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: AgentRoleService, useValue: agentRoleServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditAgentComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms on component creation', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component.updateForm).toBeDefined();
    expect(component.updateAssignForm).toBeDefined();
  }));

  it('should load agent data on ngOnInit', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect((globalServiceSpy.get as jasmine.Spy).calls.argsFor(0)).toEqual([
      SERV.AGENTS,
      1,
      {
        include: ['agentStats', 'accessGroups']
      }
    ]);
    expect(component.showagent).toBeDefined();
  }));

  it('should populate form with agent data after loading', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    tick();

    expect(component.updateForm.controls.agentName.value).toBe('Test Agent');
    expect(component.updateForm.controls.isActive.value).toBe(true);
    expect(component.updateForm.controls.userId.value).toBe(1);
  }));

  it('should load users on ngOnInit', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    tick();

    expect(globalServiceSpy.getAll).toHaveBeenCalledWith(SERV.USERS);
    expect(component.selectUsers).toBeDefined();
  }));

  it('should load tasks when user has readAssignment role', fakeAsync(() => {
    // Create new fixture with updated role service
    agentRoleServiceSpy.hasRole.and.callFake((role: string) => role === 'readAssignment');
    globalServiceSpy.ghelper.and.returnValue(of(mockResponse({ data: [mockTask] })));
    globalServiceSpy.get.and.returnValue(of(mockResponse({ data: mockAgent })));

    fixture = TestBed.createComponent(EditAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();

    expect(globalServiceSpy.ghelper).toHaveBeenCalledWith(SERV.HELPER, 'getBestTasksAgent', { agent: 1 });
  }));

  it('should navigate to /not-found when agent ID is invalid', fakeAsync(() => {
    // Reconfigure ActivatedRoute with invalid ID
    (activatedRouteSpy.snapshot.paramMap.get as jasmine.Spy).and.returnValue(null);

    // Create new component with invalid ID
    fixture = TestBed.createComponent(EditAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/not-found']);
  }));

  it('should handle 404 error when loading agent fails', fakeAsync(() => {
    const error404 = { status: 404 };
    globalServiceSpy.get.and.returnValue(throwError(() => error404));

    fixture.detectChanges();
    tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/not-found']);
  }));

  it('should handle 403 error when loading agent fails', fakeAsync(() => {
    const error403 = { status: 403 };
    globalServiceSpy.get.and.returnValue(throwError(() => error403));

    fixture.detectChanges();
    tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/forbidden']);
  }));

  it('should submit form and update agent successfully', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.updateForm.patchValue({
      agentName: 'Updated Agent',
      isActive: false,
      userId: 2
    });

    component.onSubmit();
    tick();

    expect(globalServiceSpy.update).toHaveBeenCalledWith(
      SERV.AGENTS,
      1,
      jasmine.objectContaining({
        agentName: 'Updated Agent',
        isActive: false,
        userId: 2
      })
    );
    expect(alertServiceSpy.showSuccessMessage).toHaveBeenCalledWith('Agent saved');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['agents/show-agents']);
  }));

  it('should show error message when form submission fails', fakeAsync(() => {
    globalServiceSpy.update.and.returnValue(throwError(() => new Error('Update failed')));
    fixture.detectChanges();
    tick();

    component.updateForm.patchValue({
      agentName: 'Test',
      isActive: true,
      userId: null,
      cpuOnly: null,
      cmdPars: '',
      ignoreErrors: null,
      isTrusted: false
    });

    component.onSubmit();
    tick();

    expect(alertServiceSpy.showErrorMessage).toHaveBeenCalledWith('Error updating agent');
  }));

  it('should update assignment when task is changed', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.updateAssignForm.patchValue({ taskId: 5 });
    component.onUpdateAssign(5);
    tick();

    expect(globalServiceSpy.create).toHaveBeenCalledWith(SERV.AGENT_ASSIGN, {
      taskId: 5,
      agentId: 1
    });
  }));

  it('should delete assignment when task is set to null', fakeAsync(() => {
    component.assignId = 10;
    fixture.detectChanges();
    tick();

    component.onUpdateAssign(null);
    tick();

    expect(globalServiceSpy.delete).toHaveBeenCalledWith(SERV.AGENT_ASSIGN, 10);
  }));

  it('should calculate time spent from chunks', () => {
    const mockChunks = [
      {
        id: 1,
        taskId: 1,
        skip: 0,
        length: 100,
        agentId: 1,
        dispatchTime: 100,
        solveTime: 200,
        checkpoint: 0,
        progress: 0,
        state: 0 as any,
        cracked: 0,
        speed: 0
      },
      {
        id: 2,
        taskId: 1,
        skip: 100,
        length: 100,
        agentId: 1,
        dispatchTime: 200,
        solveTime: 350,
        checkpoint: 0,
        progress: 0,
        state: 0 as any,
        cracked: 0,
        speed: 0
      },
      {
        id: 3,
        taskId: 1,
        skip: 200,
        length: 100,
        agentId: 1,
        dispatchTime: 300,
        solveTime: 400,
        checkpoint: 0,
        progress: 0,
        state: 0 as any,
        cracked: 0,
        speed: 0
      }
    ] as JChunk[];

    component.timeCalc(mockChunks);

    // Formula: max(solveTime, dispatchTime) - dispatchTime for each chunk
    // Chunk 1: max(200, 100) - 100 = 100
    // Chunk 2: max(350, 200) - 200 = 150
    // Chunk 3: max(400, 300) - 300 = 100
    // Total: 350
    expect(component.timespent).toBe(350);
  });

  it('should render devices with count', () => {
    const result = component.renderDevices('RTX3080\nRTX3080\nRTX2060\nRTX3080');

    expect(result).toContain('3 x RTX3080');
    expect(result).toContain('1 x RTX2060');
  });

  it('should return correct OS label for Linux', () => {
    expect(component.getOsLabel(AgentOS.LINUX)).toBe('Linux');
  });

  it('should return correct OS label for Windows', () => {
    expect(component.getOsLabel(AgentOS.WINDOWS)).toBe('Windows');
  });

  it('should return correct OS label for MacOS', () => {
    expect(component.getOsLabel(AgentOS.MACOS)).toBe('MacOS');
  });

  it('should return Unknown for invalid OS', () => {
    expect(component.getOsLabel('INVALID' as unknown as AgentOS)).toBe('Unknown');
  });

  it('should return correct OS message', () => {
    expect(component.getOsMessage(AgentOS.LINUX)).toBe('Linux');
    expect(component.getOsMessage(AgentOS.WINDOWS)).toBe('Windows');
  });

  it('should return correct FontAwesome icon for Linux', () => {
    const result = component.getOsFaIcon(AgentOS.LINUX);
    expect(result).toBeTruthy();
  });

  it('should return correct FontAwesome icon for Windows', () => {
    const result = component.getOsFaIcon(AgentOS.WINDOWS);
    expect(result).toBeTruthy();
  });

  it('should return correct FontAwesome icon for MacOS', () => {
    const result = component.getOsFaIcon(AgentOS.MACOS);
    expect(result).toBeTruthy();
  });

  it('should return null icon for invalid OS', () => {
    expect(component.getOsFaIcon('INVALID' as unknown as AgentOS)).toBeNull();
  });

  it('should unsubscribe on ngOnDestroy', () => {
    fixture.detectChanges();

    const unsubscribeSpy = spyOn(component['unsubscribeService'], 'unsubscribeAll');
    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
