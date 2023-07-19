import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAgentsComponent } from './show-agents.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ShowAgentsComponent', () => {
  let component: ShowAgentsComponent;
  let fixture: ComponentFixture<ShowAgentsComponent>;
  // Mocking up service
  let httpTestingController: HttpTestingController;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAgentsComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();

    httpTestingController = TestBed.get(HttpTestingController);

    fixture = TestBed.createComponent(ShowAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
