import { Component } from '@angular/core';
import { render, RenderResult } from '@ngbase/adk/test';
import { NgbNavigationMenu } from './navigation-menu';
import { NgbMenu } from './menu';
import { NgbMenuTrigger } from './menu-trigger';

@Component({
  imports: [NgbNavigationMenu, NgbMenu, NgbMenuTrigger],
  template: `<main ngbNavigationMenu>
      <button ngbMenuTrigger>Menu 1</button>
      <button [ngbMenuTrigger]="ngbMenu1">Menu 2</button>
    </main>
    <div ngbMenu #ngbMenu1="ngbMenu">
      <div>Option 1</div>
      <div>Option 2</div>
    </div>
    <div ngbMenu #ngbMenu2="ngbMenu">
      <div>Option 3</div>
      <div>Option 4</div>
    </div>`,
})
class TestComponent {}

describe('NavigationMenu', () => {
  let view: RenderResult<TestComponent>;
  let navMenu: NgbNavigationMenu;

  beforeEach(async () => {
    view = await render(TestComponent);
    navMenu = view.viewChild(NgbNavigationMenu);
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });

  it('should open menu 1 when clicking on menu 1', () => {
    const menu1 = view.$All('button');
    menu1[0].click();
    expect(menu1).toBeTruthy();
  });
});
