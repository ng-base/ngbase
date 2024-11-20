import { Component, OnDestroy, signal } from '@angular/core';
import { render, RenderResult } from '@meeui/ui/test';
import { Tab, TabHeader, TabLazy } from './tab';
import { Tabs } from './tab-group';

describe('Tabs Component', () => {
  let component: TestHostComponent;
  let view: RenderResult<TestHostComponent>;
  let tabsComponent: Tabs;

  @Component({
    selector: 'app-lazy',
    template: '',
  })
  class LazyComponent implements OnDestroy {
    id? = Date.now();

    ngOnDestroy() {
      this.id = undefined;
    }
  }

  @Component({
    imports: [Tabs, Tab, TabHeader, TabLazy, LazyComponent],
    template: `
      <mee-tabs [(selectedIndex)]="tabIndex">
        <mee-tab>
          <p *meeTabHeader>Custom Tab 1</p>
          Content 1
        </mee-tab>
        @for (tab of tabs(); track tab.id) {
          <mee-tab [label]="tab.name" [disabled]="tab.disabled">
            <p>Custom {{ tab.content }}</p>
          </mee-tab>
        }
        <mee-tab mode="lazy">
          <app-lazy *meeTabLazy></app-lazy>
        </mee-tab>
      </mee-tabs>
    `,
  })
  class TestHostComponent {
    tabIndex = signal(0);
    tabs = signal([
      { id: 0, name: 'Tab 1', content: 'Content 1' },
      { id: 1, name: 'Tab 2', content: 'Content 2' },
      { id: 2, name: 'Tab 3', content: 'Content 3' },
      { id: 3, name: 'Tab 4', content: 'Content 4' },
      { id: 4, name: 'Tab with long name 5', disabled: true, content: 'Content 5' },
      { id: 5, name: 'Tab 6', content: 'Content 6' },
    ]);

    addTab() {
      this.tabs.update(tabs => [
        ...tabs,
        {
          id: tabs.length,
          name: `Tab with long name ${tabs.length}`,
          content: `Content ${tabs.length}`,
        },
      ]);
    }

    deleteTab(id: number) {
      this.tabs.update(tabs => tabs.filter(tab => tab.id !== id));
    }
  }

  beforeEach(async () => {
    view = await render(TestHostComponent);
    component = view.host;
    view.detectChanges();
    tabsComponent = view.viewChild(Tabs);
  });

  const tabs = () => view.$All('button[role="tab"]');
  const activeTab = () => view.$('button[aria-selected="true"]');

  function clickTab(index: number) {
    tabs()[index].click();
    view.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set first tab as active by default', () => {
    const tab = activeTab();
    expect(tab?.textContent?.trim()).toBe('Custom Tab 1');
  });

  it('should change active tab when clicked', () => {
    clickTab(1);

    const tab = activeTab();
    expect(tab?.textContent?.trim()).toBe('Tab 1');
  });

  it('should display correct content for active tab', () => {
    view.detectChanges();
    const content = view.$('mee-tab:not(.hidden)');
    expect(content?.textContent?.trim()).toBe('Content 1');

    clickTab(1);

    const newContent = view.$('mee-tab:not(.hidden)');
    expect(newContent?.textContent?.trim()).toBe('Custom Content 1');
  });

  it('should show custom tab header content', () => {
    const tab = activeTab();
    component.tabIndex.set(0);
    view.detectChanges();

    expect(tab?.textContent?.trim()).toBe('Custom Tab 1');
  });

  it('should emit selectedTabChange event when tab changes', () => {
    jest.spyOn(tabsComponent.selectedTabChange, 'emit');

    clickTab(2);

    expect(tabsComponent.selectedTabChange.emit).toHaveBeenCalledTimes(1);
  });

  it('should maintain the active tab when new tabs are added', () => {
    clickTab(1);
    component.addTab();
    view.detectChanges();

    expect(tabs().length).toBe(9);
    const tab = activeTab();
    expect(tab?.textContent?.trim()).toBe('Tab 1');
  });

  it('should maintain the active tab when other tab is removed', () => {
    clickTab(1);
    component.deleteTab(1);
    view.detectChanges();

    const tab = activeTab();
    expect(tab?.textContent?.trim()).toBe('Tab 1');

    clickTab(2);
    component.deleteTab(0);
    view.detectChanges();

    expect(tabsComponent.selectedIndex()).toBe(1);
    view.detectChanges();
    const newTab = activeTab();
    expect(newTab?.textContent?.trim()).toBe('Tab 3');
  });

  it('should maintain the current tab index when previous tab is removed', () => {
    jest.spyOn(tabsComponent.selectedTabChange, 'emit');
    clickTab(3);
    component.deleteTab(0);
    view.detectChanges();

    expect(tabsComponent.selectedIndex()).toBe(2);
    view.detectChanges();
    const tab = activeTab();
    expect(tab?.textContent?.trim()).toBe('Tab 3');
    expect(tabsComponent.selectedTabChange.emit).toHaveBeenCalledTimes(2);
  });

  it('should move to the next tab when current tab is removed', () => {
    jest.spyOn(tabsComponent.selectedTabChange, 'emit');
    clickTab(1);
    component.deleteTab(0);
    view.detectChanges();

    expect(tabsComponent.selectedIndex()).toBe(1);
    view.detectChanges();
    const tab = activeTab();
    expect(tab?.textContent?.trim()).toBe('Tab 2');
    expect(tabsComponent.selectedTabChange.emit).toHaveBeenCalledTimes(1);
  });

  it('should handle the lazy mode', () => {
    clickTab(tabs().length - 1);
    const lazyComponent = view.viewChild(LazyComponent);
    expect(lazyComponent.id).toBeDefined();
    clickTab(0);
    expect(lazyComponent.id).toBeUndefined();
  });

  // Add more tests as needed
});
