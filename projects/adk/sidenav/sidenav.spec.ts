import { Component, signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { render, RenderResult } from '@ngbase/adk/test';
import { NgbSidenav, NgbSidenavOverlay } from './sidenav';
import { NgbSidenavHeader, slideAnimation } from './sidenav-header';
import { SidenavType } from './sidenav.service';

@Component({
  imports: [NgbSidenav, NgbSidenavHeader, NgbSidenavOverlay],
  template: `<div ngbSidenav #sidenav="ngbSidenav" [(show)]="show" [mode]="mode()">
    @if (sidenav.showOverlay()) {
      <div ngbSidenavOverlay></div>
    }
    <div ngbSidenavHeader id="header"></div>
    <div id="content">content</div>
  </div>`,
  animations: [slideAnimation('500ms ease-in-out')],
})
class TestComponent {
  readonly show = signal(false);
  readonly mode = signal<SidenavType>('side');
}

describe('sidenav', () => {
  let view: RenderResult<TestComponent>;
  let component: TestComponent;
  let sidenav: NgbSidenav;
  let header: NgbSidenavHeader;

  beforeEach(async () => {
    view = await render(TestComponent, [provideNoopAnimations()]);
    component = view.host;
    await view.whenStable();
    sidenav = view.viewChild(NgbSidenav);
    header = view.viewChild(NgbSidenavHeader);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide the header', async () => {
    component.show.set(false);
    view.detectChanges();
    expect(sidenav.sidenavService.status()).toBe(0);
    expect(header.el.nativeElement.style.visibility).toBe('hidden');
  });

  it('should show the header', async () => {
    component.show.set(true);
    await view.whenStable();
    view.detectChanges();
    expect(sidenav.sidenavService.status()).toBe(1);
    expect(header.el.nativeElement.style.visibility).toBe('visible');
  });

  it('should toggle', async () => {
    expect(sidenav.show()).toBe(false);
    sidenav.toggle();
    await view.whenStable();
    expect(sidenav.sidenavService.status()).toBe(1);
    expect(component.show()).toBe(true);
  });

  it('should toggle over mode', async () => {
    component.mode.set('over');
    component.show.set(true);
    await view.whenStable();
    view.detectChanges();
    expect(view.$('.sidenav-overlay')).toBeTruthy();

    component.show.set(false);
    await view.whenStable();
    view.detectChanges();
    expect(view.$('.sidenav-overlay')).toBeFalsy();
  });
});
