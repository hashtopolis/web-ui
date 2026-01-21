import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerActionsComponent } from '@src/app/config/server-actions/server-actions.component';

describe('ServerActionsComponent', () => {
  let component: ServerActionsComponent;
  let fixture: ComponentFixture<ServerActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerActionsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ServerActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
