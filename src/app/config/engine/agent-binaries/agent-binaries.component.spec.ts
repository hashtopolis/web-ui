import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentBinariesComponent } from './agent-binaries.component';

describe('AgentBinariesComponent', () => {
  let component: AgentBinariesComponent;
  let fixture: ComponentFixture<AgentBinariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentBinariesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentBinariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
