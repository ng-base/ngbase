import { ChangeDetectionStrategy, Component, signal, TemplateRef } from '@angular/core';
import { render, RenderResult } from '@ngbase/adk/test';
import { aliasTab, NgbTab, NgbTabHeader } from './tab';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'ngb-tab',
  exportAs: 'ngbTab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasTab(TestTab)],
  imports: [NgTemplateOutlet],
  template: `
    @if (lazyTemplate(); as template) {
      <ng-container *ngTemplateOutlet="template" />
    } @else if (activeMode()) {
      <ng-content />
    }
  `,
})
export class TestTab extends NgbTab {}

describe('Tab Component', () => {
  let tab: TestTab;
  let component: TestHostComponent;
  let view: RenderResult<TestHostComponent>;

  @Component({
    imports: [TestTab, NgbTabHeader],
    template: `<ngb-tab [label]="label()" [disabled]="disabled()" [mode]="mode()">
      Tab Content
    </ngb-tab>`,
  })
  class TestHostComponent {
    label = signal<string | undefined>(undefined);
    disabled = signal(false);
    mode = signal('');
  }

  beforeEach(async () => {
    view = await render(TestHostComponent);
    component = view.host;
    tab = view.viewChild(NgbTab);
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
    const tabEl = view.$('ngb-tab');
    expect(tabEl.textContent).not.toBe('');
  });

  it('should not render content when inactive', () => {
    tab.active.set(false);
    view.detectChanges();
    const tabEl = view.$('ngb-tab');
    expect(tabEl.textContent).toBe('');
  });

  it('should have correct host classes when active', () => {
    tab.active.set(true);
    view.detectChanges();
    const tabEl = view.$('ngb-tab');
    expect(tabEl.attr('aria-hidden')).toBe('false');
  });

  it('should have correct host classes when inactive', () => {
    tab.active.set(false);
    view.detectChanges();
    const tabEl = view.$('ngb-tab');
    expect(tabEl.attr('aria-hidden')).toBe('true');
  });
});

describe('with custom header', () => {
  @Component({
    imports: [NgbTab, NgbTabHeader],
    template: `
      <ngb-tab>
        <ng-template ngbTabHeader>
          <span>Custom Header</span>
        </ng-template>
        Tab Content
      </ngb-tab>
    `,
  })
  class TestHostComponent {}

  let hostView: RenderResult<TestHostComponent>;

  beforeEach(async () => {
    hostView = await render(TestHostComponent);
    hostView.detectChanges();
  });

  it('should have custom header', () => {
    const tabComponent = hostView.viewChild(NgbTab);
    expect(tabComponent.header()).toBeInstanceOf(TemplateRef);
  });
});
