import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsDashboardComponent } from './agents-dashboard.component';

describe('AgentsDashboardComponent', () => {
  let component: AgentsDashboardComponent;
  let fixture: ComponentFixture<AgentsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentsDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
