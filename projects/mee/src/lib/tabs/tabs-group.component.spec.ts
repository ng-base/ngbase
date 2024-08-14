import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { Tabs } from './tabs-group.component';
import { Tab, TabHeader } from './tabs.component';
import { By } from '@angular/platform-browser';

describe('Tabs Component', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let tabsComponent: Tabs;

  @Component({
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
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [Tabs, Tab, TabHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tabsComponent = fixture.debugElement.query(By.directive(Tabs)).componentInstance;
  });

  const tabs = () => fixture.nativeElement.querySelectorAll('button[role="tab"]');
  const activeTab = () => fixture.nativeElement.querySelector('button[aria-selected="true"]');

  function clickTab(index: number) {
    tabs()[index].click();
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set first tab as active by default', () => {
    const tab = activeTab();
    expect(tab.textContent.trim()).toBe('Custom Tab 1');
  });

  it('should change active tab when clicked', () => {
    clickTab(1);

    const tab = activeTab();
    expect(tab.textContent.trim()).toBe('Tab 1');
  });

  it('should display correct content for active tab', () => {
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('mee-tab:not(.hidden)');
    expect(content.textContent.trim()).toBe('Content 1');

    clickTab(1);

    const newContent = fixture.nativeElement.querySelector('mee-tab:not(.hidden)');
    expect(newContent.textContent.trim()).toBe('Custom Content 1');
  });

  it('should show custom tab header content', () => {
    const tab = activeTab();
    component.tabIndex.set(0);
    fixture.detectChanges();

    expect(tab.textContent.trim()).toBe('Custom Tab 1');
  });

  it('should emit selectedTabChange event when tab changes', () => {
    jest.spyOn(tabsComponent.selectedTabChange, 'emit');

    clickTab(2);

    expect(tabsComponent.selectedTabChange.emit).toHaveBeenCalledWith(2);
  });

  it('should maintain the active tab when new tabs are added', () => {
    clickTab(1);
    component.addTab();
    fixture.detectChanges();

    expect(tabs().length).toBe(8);
    const tab = activeTab();
    expect(tab.textContent.trim()).toBe('Tab 1');
  });

  it('should maintain the active tab when other tab is removed', () => {
    clickTab(1);
    component.deleteTab(1);
    fixture.detectChanges();

    const tab = activeTab();
    expect(tab.textContent.trim()).toBe('Tab 1');

    clickTab(2);
    component.deleteTab(0);
    fixture.detectChanges();

    expect(tabsComponent.selectedIndex()).toBe(1);
    fixture.detectChanges();
    const newTab = activeTab();
    expect(newTab.textContent.trim()).toBe('Tab 3');
  });

  it('should maintain the current tab index when previous tab is removed', () => {
    jest.spyOn(tabsComponent.selectedTabChange, 'emit');
    clickTab(3);
    component.deleteTab(0);
    fixture.detectChanges();

    expect(tabsComponent.selectedIndex()).toBe(2);
    fixture.detectChanges();
    const tab = activeTab();
    expect(tab.textContent.trim()).toBe('Tab 3');
    expect(tabsComponent.selectedTabChange.emit).toHaveBeenCalledWith(2);
  });

  it('should move to the next tab when current tab is removed', () => {
    jest.spyOn(tabsComponent.selectedTabChange, 'emit');
    clickTab(1);
    component.deleteTab(0);
    fixture.detectChanges();

    expect(tabsComponent.selectedIndex()).toBe(1);
    fixture.detectChanges();
    const tab = activeTab();
    expect(tab.textContent.trim()).toBe('Tab 2');
    expect(tabsComponent.selectedTabChange.emit).toHaveBeenCalledWith(1);
  });

  // Add more tests as needed
});
