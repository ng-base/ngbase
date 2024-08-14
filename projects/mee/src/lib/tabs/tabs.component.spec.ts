import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tab, TabHeader } from './tabs.component';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [TabHeader, Tab],
  template: `<mee-tab>
    <ng-template meeTabHeader>
      <span>Tab 1</span>
    </ng-template>
    <div>Content 1</div>
  </mee-tab> `,
})
class TestTab {}

describe('TabComponent', () => {
  let component: TestTab;
  let fixture: ComponentFixture<TestTab>;
  let tab: Tab;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestTab],
    }).compileComponents();

    fixture = TestBed.createComponent(TestTab);
    component = fixture.componentInstance;
    // tab = TestBed.inject(Tab);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
