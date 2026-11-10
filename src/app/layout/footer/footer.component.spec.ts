import { of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';

import { FooterComponent } from '@src/app/layout/footer/footer.component';

interface GitVersion {
  shortSHA: string;
  SHA: string;
  branch: string;
  lastCommitTime: string;
  lastCommitMessage: string;
  lastCommitNumber: string;
}

const mockGitInfo: GitVersion = {
  shortSHA: 'a1b2c3d',
  SHA: 'a1b2c3d4e5f678901234567890abcdef12345678',
  branch: 'feature/example-branch',
  lastCommitTime: '2026-11-04T14:30:00Z',
  lastCommitMessage: 'feat: add example functionality',
  lastCommitNumber: '42'
};

@Component({ selector: 'mat-card', template: '<ng-content></ng-content>', standalone: false })
class StubMatCardComponent {}

@Component({ selector: 'mat-card-content', template: '<ng-content></ng-content>', standalone: false })
class StubMatCardContentComponent {}

@Component({ selector: 'mat-icon', template: '<ng-content></ng-content>', standalone: false })
class StubMatIconComponent {}

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let get: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    get = vi.fn().mockName('HttpClient.get').mockReturnValue(of(mockGitInfo));

    await TestBed.configureTestingModule({
      declarations: [FooterComponent, StubMatCardComponent, StubMatCardContentComponent, StubMatIconComponent],
      imports: [MatTooltipModule],
      providers: [{ provide: HttpClient, useValue: { get } }]
    }).compileComponents();
  });

  it('renders the component', () => {
    fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();

    expect(get).toHaveBeenCalledWith('/assets/git-version.json');

    const span = fixture.debugElement.query(By.directive(StubMatCardContentComponent)).query(By.css('span'));
    const tooltip = span.injector.get(MatTooltip);

    expect((span.nativeElement as HTMLElement).textContent).toContain(mockGitInfo.shortSHA);
    expect(tooltip.message).toBe(mockGitInfo.lastCommitTime);

    const footer = fixture.nativeElement as HTMLElement;
    const links = Array.from(footer.querySelectorAll('a'));
    expect(footer.textContent).toContain(fixture.componentInstance.footerConfig.copyright);
    expect(links.map((link) => link.textContent?.trim())).toEqual([
      fixture.componentInstance.footerConfig.footer_link_one.name,
      fixture.componentInstance.footerConfig.footer_link_two.name,
      fixture.componentInstance.footerConfig.footer_link_three.name
    ]);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      fixture.componentInstance.footerConfig.footer_link_one.link,
      fixture.componentInstance.footerConfig.footer_link_two.link,
      fixture.componentInstance.footerConfig.footer_link_three.link
    ]);
  });
});
