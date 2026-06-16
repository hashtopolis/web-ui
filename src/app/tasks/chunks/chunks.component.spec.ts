import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoTitleService } from '@services/shared/autotitle.service';

import { ChunksComponent } from '@src/app/tasks/chunks/chunks.component';

describe('ChunksComponent', () => {
  let component: ChunksComponent;
  let fixture: ComponentFixture<ChunksComponent>;
  let mockTitleService: jasmine.SpyObj<AutoTitleService>;

  beforeEach(async () => {
    mockTitleService = jasmine.createSpyObj('AutoTitleService', ['set']);

    await TestBed.configureTestingModule({
      declarations: [ChunksComponent],
      providers: [{ provide: AutoTitleService, useValue: mockTitleService }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ChunksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call titleService.set with ["Show Chunks"]', () => {
    expect(mockTitleService.set).toHaveBeenCalledWith(['Show Chunks']);
  });
});
