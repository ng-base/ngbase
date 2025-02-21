import { Component, OnDestroy, signal } from '@angular/core';
import { render, RenderResult } from '@ngbase/adk/test';
import { NgbTab, NgbTabHeader, NgbTabLazy } from './tab';
import { NgbTabs } from './tab-group';

describe('Tabs Component', () => {
  let component: TestHostComponent;
  let view: RenderResult<TestHostComponent>;
  let tabsComponent: NgbTabs;

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
    imports: [NgbTabs, NgbTab, NgbTabHeader, NgbTabLazy, LazyComponent],
    template: `
      <ngb-tabs [(selectedIndex)]="tabIndex">
        <ngb-tab>
          <p *ngbTabHeader>Custom Tab 1</p>
          Content 1
        </ngb-tab>
        <ngb-tab mode="lazy">
          <app-lazy *ngbTabLazy></app-lazy>
        </ngb-tab>
        @for (tab of tabs(); track tab.id) {
          <ngb-tab [label]="tab.name" [disabled]="tab.disabled">
            <p>Custom {{ tab.content }}</p>
          </ngb-tab>
        }
      </ngb-tabs>
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
    tabsComponent = view.viewChild(NgbTabs);
  });

  const tabs = () => view.$All('button[role="tab"]');
  const activeTab = () => view.$('button[aria-selected="true"]');

  function clickTab(index: number) {
    const buttons = tabs();
    buttons[index].click();
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
    clickTab(2);

    const tab = activeTab();
    expect(tab?.textContent?.trim()).toBe('Tab 1');
  });

  it('should display correct content for active tab', () => {
    view.detectChanges();
    const content = view.$('ngb-tab:not([aria-hidden="true"])');
    expect(content?.textContent?.trim()).toBe('Content 1');

    clickTab(2);

    const newContent = view.$('ngb-tab:not([aria-hidden="true"])');
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
    clickTab(2);
    component.addTab();
    view.detectChanges();

    expect(tabs().length).toBe(9);
    const tab = activeTab();
    expect(tab?.textContent?.trim()).toBe('Tab 1');
  });

  it('should maintain the active tab when other tab is removed', () => {
    clickTab(2);
    component.deleteTab(2);
    view.detectChanges();

    const tab = activeTab();
    expect(tab?.textContent?.trim()).toBe('Tab 1');

    clickTab(3);
    component.deleteTab(0);
    view.detectChanges();

    expect(tabsComponent.selectedIndex()).toBe(2);
    view.detectChanges();
    const newTab = activeTab();
    expect(newTab?.textContent?.trim()).toBe('Tab 2');
  });

  it('should maintain the current tab index when previous tab is removed', () => {
    jest.spyOn(tabsComponent.selectedTabChange, 'emit');
    clickTab(4);
    component.deleteTab(0);
    view.detectChanges();

    expect(tabsComponent.selectedIndex()).toBe(3);
    view.detectChanges();
    const tab = activeTab();
    expect(tab?.textContent?.trim()).toBe('Tab 3');
    expect(tabsComponent.selectedTabChange.emit).toHaveBeenCalledTimes(2);
  });

  it('should move to the next tab when current tab is removed', () => {
    jest.spyOn(tabsComponent.selectedTabChange, 'emit');
    clickTab(2);
    component.deleteTab(0);
    view.detectChanges();

    expect(tabsComponent.selectedIndex()).toBe(2);
    view.detectChanges();
    const tab = activeTab();
    expect(tab?.textContent?.trim()).toBe('Tab 2');
    expect(tabsComponent.selectedTabChange.emit).toHaveBeenCalledTimes(1);
  });

  it('should move to the previous tab when current tab is removed and it is the last tab', () => {
    clickTab(7);
    component.deleteTab(5);
    view.detectChanges();

    expect(tabsComponent.selectedIndex()).toBe(6);
    view.detectChanges();
    const tab = activeTab();
    expect(tab?.textContent?.trim()).toBe('Tab with long name 5');
  });

  it('should handle the lazy mode', () => {
    clickTab(1);
    const lazyComponent = view.viewChild(LazyComponent);
    expect(lazyComponent.id).toBeDefined();
    clickTab(0);
    expect(lazyComponent.id).toBeUndefined();
  });

  // Add more tests as needed
});
