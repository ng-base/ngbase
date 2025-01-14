import { Component, signal, TemplateRef } from '@angular/core';
import { render, RenderResult } from '@meeui/adk/test';
import { Tab, TabHeader } from './tab';

describe('Tab Component', () => {
  let tab: Tab;
  let component: TestHostComponent;
  let view: RenderResult<TestHostComponent>;

  @Component({
    imports: [Tab, TabHeader],
    template: `<mee-tab [label]="label()" [disabled]="disabled()" [mode]="mode()">
      Tab Content
    </mee-tab>`,
  })
  class TestHostComponent {
    label = signal<string | undefined>(undefined);
    disabled = signal(false);
    mode = signal('');
  }

  beforeEach(async () => {
    view = await render(TestHostComponent);
    component = view.host;
    tab = view.viewChild(Tab);
    view.detectChanges();
  });

  it('should create', () => {
    expect(tab).toBeTruthy();
  });

  it('should set custom label', () => {
    component.label.set('Custom Tab');
    view.detectChanges();
    expect(tab.label()).toBe('Custom Tab');
  });

  it('should not be active by default', () => {
    expect(tab.active()).toBeFalsy();
  });

  it('should not be disabled by default', () => {
    expect(tab.disabled()).toBeFalsy();
  });

  it('should set disabled state', () => {
    component.disabled.set(true);
    view.detectChanges();
    expect(tab.disabled()).toBeTruthy();
  });

  it('should have default mode undefined', () => {
    expect(tab.mode()).not.toBe('hidden');
  });

  it('should set mode', () => {
    component.mode.set('hidden');
    view.detectChanges();
    expect(tab.mode()).toBe('hidden');
  });

  it('should have correct activeMode when active', () => {
    tab.active.set(true);
    expect(tab.activeMode()).toBeTruthy();
  });

  it('should have correct activeMode when inactive', () => {
    tab.active.set(false);
    expect(tab.activeMode()).toBeFalsy();
  });

  it('should keep activeMode true once activated for hidden mode', () => {
    component.mode.set('hidden');
    tab.active.set(true);
    view.detectChanges();
    expect(tab.activeMode()).toBeTruthy();

    tab.active.set(false);
    view.detectChanges();
    expect(tab.activeMode()).toBeTruthy();
  });

  it('should render content when active', () => {
    tab.active.set(true);
    view.detectChanges();
    expect(tab.activeMode()).toBeTruthy();
    const tabEl = view.$('mee-tab');
    expect(tabEl.textContent).not.toBe('');
  });

  it('should not render content when inactive', () => {
    tab.active.set(false);
    view.detectChanges();
    const tabEl = view.$('mee-tab');
    expect(tabEl.textContent).toBe('');
  });

  it('should have correct host classes when active', () => {
    tab.active.set(true);
    view.detectChanges();
    const tabEl = view.$('mee-tab');
    expect(tabEl.hasClass('flex-1', 'h-full', 'pt-b4')).toBeTruthy();
  });

  it('should have correct host classes when inactive', () => {
    tab.active.set(false);
    view.detectChanges();
    const tabEl = view.$('mee-tab');
    expect(tabEl.hasClass('hidden')).toBeTruthy();
  });
});

describe('with custom header', () => {
  @Component({
    imports: [Tab, TabHeader],
    template: `
      <mee-tab>
        <ng-template meeTabHeader>
          <span>Custom Header</span>
        </ng-template>
        Tab Content
      </mee-tab>
    `,
  })
  class TestHostComponent {}

  let hostView: RenderResult<TestHostComponent>;

  beforeEach(async () => {
    hostView = await render(TestHostComponent);
    hostView.detectChanges();
  });

  it('should have custom header', () => {
    const tabComponent = hostView.viewChild(Tab);
    expect(tabComponent.header()).toBeInstanceOf(TemplateRef);
  });
});
