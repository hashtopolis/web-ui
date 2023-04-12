import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HashesComponent } from './hashes.component';

describe('HashesComponent', () => {
  let component: HashesComponent;
  let fixture: ComponentFixture<HashesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HashesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HashesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
