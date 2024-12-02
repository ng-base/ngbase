import { Component, signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { render, RenderResult } from '@meeui/adk/test';
import { MeeSidenav } from './sidenav';
import { MeeSidenavHeader } from './sidenav-header';
import { ModeType, SidenavService } from './sidenav.service';

@Component({
  imports: [MeeSidenav, MeeSidenavHeader],
  template: `<div meeSidenav [(show)]="show" [mode]="mode()">
    <div meeSidenavHeader id="header"></div>
    <div id="content">content</div>
  </div>`,
})
class TestComponent {
  readonly show = signal(false);
  readonly mode = signal<ModeType>('side');
}

describe('sidenav', () => {
  let view: RenderResult<TestComponent>;
  let component: TestComponent;
  let sidenavService: SidenavService;
  let sidenav: MeeSidenav;
  let header: MeeSidenavHeader;

  beforeEach(async () => {
    view = await render(TestComponent, [provideNoopAnimations()]);
    component = view.host;
    await view.whenStable();
    sidenav = view.viewChild(MeeSidenav);
    header = view.viewChild(MeeSidenavHeader);
    sidenavService = view.viewChild(SidenavService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(sidenavService.show).toBeTruthy();
    expect(sidenavService.mode).toBeTruthy();
    expect(sidenavService.width).toBeTruthy();
  });

  it('should hide the header', async () => {
    component.show.set(false);
    view.detectChanges();
    expect(sidenavService.visibility()).toBe(0);
    expect(header.el.nativeElement.style.visibility).toBe('hidden');
  });

  it('should show the header', async () => {
    component.show.set(true);
    await view.whenStable();
    view.detectChanges();
    expect(sidenavService.visibility()).toBe(1);
    expect(header.el.nativeElement.style.visibility).toBe('visible');
  });

  it('should toggle', async () => {
    expect(sidenavService.show()).toBe(false);
    sidenav.toggle();
    await view.whenStable();
    expect(sidenavService.visibility()).toBe(1);
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
