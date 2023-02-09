import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHashlistComponent } from './new-hashlist.component';

describe('NewHashlistComponent', () => {
  let component: NewHashlistComponent;
  let fixture: ComponentFixture<NewHashlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewHashlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewHashlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
