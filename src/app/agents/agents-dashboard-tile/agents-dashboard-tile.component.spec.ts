import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentsDashboardTileComponent } from './agents-dashboard-tile.component';

describe('AgentsDashboardTileComponent', () => {
  let component: AgentsDashboardTileComponent;
  let fixture: ComponentFixture<AgentsDashboardTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentsDashboardTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentsDashboardTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
