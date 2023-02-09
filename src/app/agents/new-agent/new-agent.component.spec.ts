import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAgentComponent } from './new-agent.component';

describe('NewAgentComponent', () => {
  let component: NewAgentComponent;
  let fixture: ComponentFixture<NewAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAgentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
