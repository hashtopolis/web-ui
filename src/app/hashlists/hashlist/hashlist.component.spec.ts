import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HashlistComponent } from './hashlist.component';

describe('HashlistComponent', () => {
  let component: HashlistComponent;
  let fixture: ComponentFixture<HashlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HashlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HashlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
