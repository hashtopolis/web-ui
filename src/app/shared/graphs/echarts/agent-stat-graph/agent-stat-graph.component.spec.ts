import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentStatGraphComponent } from './agent-stat-graph.component';

describe('AgentStatGraphComponent', () => {
  let component: AgentStatGraphComponent;
  let fixture: ComponentFixture<AgentStatGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentStatGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentStatGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
