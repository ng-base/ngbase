import { Component } from '@angular/core';
import { render, RenderResult } from '@meeui/adk/test';
import { MeeNavigationMenu } from './navigation-menu';
import { MeeMenu } from './menu';
import { MeeMenuTrigger } from './menu-trigger';

@Component({
  imports: [MeeNavigationMenu, MeeMenu, MeeMenuTrigger],
  template: `<main meeNavigationMenu>
      <button meeMenuTrigger>Menu 1</button>
      <button [meeMenuTrigger]="meeMenu1">Menu 2</button>
    </main>
    <div meeMenu #meeMenu1="meeMenu">
      <div>Option 1</div>
      <div>Option 2</div>
    </div>
    <div meeMenu #meeMenu2="meeMenu">
      <div>Option 3</div>
      <div>Option 4</div>
    </div>`,
})
class TestComponent {}

describe('NavigationMenu', () => {
  let view: RenderResult<TestComponent>;
  let navMenu: MeeNavigationMenu;

  beforeEach(async () => {
    view = await render(TestComponent);
    navMenu = view.viewChild(MeeNavigationMenu);
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
