import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal, TemplateRef, ViewChild } from '@angular/core';
import { Tab, TabHeader } from './tabs.component';
import { By } from '@angular/platform-browser';

describe('Tab Component', () => {
  let tab: Tab;
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  @Component({
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
    await TestBed.configureTestingModule({
      imports: [Tab, TabHeader],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tab = fixture.debugElement.query(By.directive(Tab)).componentInstance;
  });

  it('should create', () => {
    expect(tab).toBeTruthy();
  });

  it('should set custom label', () => {
    component.label.set('Custom Tab');
    fixture.detectChanges();
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
    fixture.detectChanges();
    expect(tab.disabled()).toBeTruthy();
  });

  it('should have default mode undefined', () => {
    expect(tab.mode()).not.toBe('hidden');
  });

  it('should set mode', () => {
    component.mode.set('hidden');
    fixture.detectChanges();
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
    fixture.detectChanges();
    expect(tab.activeMode()).toBeTruthy();

    tab.active.set(false);
    fixture.detectChanges();
    expect(tab.activeMode()).toBeTruthy();
  });

  it('should render content when active', () => {
    tab.active.set(true);
    fixture.detectChanges();
    expect(tab.activeMode()).toBeTruthy();
    const tabEl = fixture.nativeElement.querySelector('mee-tab');
    expect(tabEl.textContent).not.toBe('');
  });

  it('should not render content when inactive', () => {
    tab.active.set(false);
    fixture.detectChanges();
    const tabEl = fixture.nativeElement.querySelector('mee-tab');
    expect(tabEl.textContent).toBe('');
  });

  it('should have correct host classes when active', () => {
    tab.active.set(true);
    fixture.detectChanges();
    const tabEl = fixture.nativeElement.querySelector('mee-tab');
    expect(tabEl.classList.contains('flex-1')).toBeTruthy();
    expect(tabEl.classList.contains('h-full')).toBeTruthy();
    expect(tabEl.classList.contains('pt-b4')).toBeTruthy();
  });

  it('should have correct host classes when inactive', () => {
    tab.active.set(false);
    fixture.detectChanges();
    const tabEl = fixture.nativeElement.querySelector('mee-tab');
    expect(tabEl.classList.contains('hidden')).toBeTruthy();
  });
});

describe('with custom header', () => {
  @Component({
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

  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [Tab, TabHeader],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('should have custom header', () => {
    const tabComponent = hostFixture.debugElement.query(By.directive(Tab)).componentInstance;
    expect(tabComponent.header()).toBeInstanceOf(TemplateRef);
  });
});
