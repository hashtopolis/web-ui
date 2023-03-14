import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAgentBinariesComponent } from './new-agent-binaries.component';

describe('NewAgentBinariesComponent', () => {
  let component: NewAgentBinariesComponent;
  let fixture: ComponentFixture<NewAgentBinariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAgentBinariesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAgentBinariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
