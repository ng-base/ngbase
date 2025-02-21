import { render, RenderResult } from '@ngbase/adk/test';
import { NgbMenu } from './menu';
import { Component } from '@angular/core';
import { NgbList } from '@ngbase/adk/list';
import { NgbMenuTrigger } from './menu-trigger';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

@Component({
  imports: [NgbMenuTrigger, NgbMenu, NgbList],
  template: `
    <button class="menu-1" [ngbMenuTrigger]="menu1">New Team</button>
    <div #menu1="ngbMenu" ngbMenu>
      <div class="menu-1-list" ngbList>Menu List1 1</div>
      <div class="menu-1-list-menu-2" [ngbMenuTrigger]="menu2">New Team</div>
    </div>
    <div #menu2="ngbMenu" ngbMenu>
      <div class="menu-2-list" ngbList>Menu List2 1</div>
      <div class="menu-2-list-menu-3" [ngbMenuTrigger]="menu3">New Team</div>
    </div>
    <div #menu3="ngbMenu" ngbMenu>
      <div class="menu-3-list" ngbList>Menu List3 1</div>
    </div>
  `,
})
class TestComponent {}

describe('MenuComponent', () => {
  let component: TestComponent;
  let view: RenderResult<TestComponent>;

  beforeEach(async () => {
    view = await render(TestComponent, [provideNoopAnimations()]);
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open menu', () => {
    const menu1 = new MenuTest(view, '.menu-1');
    menu1.openMenu();
    expect(menu1.isOpen()).toBeTruthy();
  });

  it('should open nested menu', () => {
    const menu1 = new MenuTest(view, '.menu-1');
    menu1.openMenu();
    const menu2 = new MenuTest(view, '.menu-1-list-menu-2', menu1);
    menu2.openMenu();
    expect(menu2.isOpen()).toBeTruthy();
    expect(menu1.isOpen()).toBeTruthy();
  });

  it('should close menu', async () => {
    const menu1 = new MenuTest(view, '.menu-1');
    menu1.openMenu();
    await menu1.closeMenu();
    expect(menu1.isOpen()).toBeFalsy();
  });

  it('should close child menu when parent menu is closed', async () => {
    const menu1 = new MenuTest(view, '.menu-1');
    menu1.openMenu();
    const menu2 = new MenuTest(view, '.menu-1-list-menu-2', menu1);
    menu2.openMenu();
    await menu1.closeMenu();
    expect(menu2.isOpen()).toBeFalsy();
    expect(menu1.isOpen()).toBeFalsy();
  });

  it('should close parent menu when child menu item is clicked', async () => {
    const menu1 = new MenuTest(view, '.menu-1');
    menu1.openMenu();
    const menu2 = new MenuTest(view, '.menu-1-list-menu-2', menu1);
    menu2.openMenu();
    menu2.menuItem('.menu-2-list').click();
    await view.whenStable();
    expect(menu1.isOpen()).toBeFalsy();
  });

  it('should close menu when menu item is clicked', async () => {
    const menu1 = new MenuTest(view, '.menu-1');
    menu1.openMenu();
    menu1.menuItem('.menu-1-list').click();
    await view.whenStable();
    expect(menu1.isOpen()).toBeFalsy();
  });

  it('should close all menus when menu item is clicked', async () => {
    const menu1 = new MenuTest(view, '.menu-1');
    menu1.openMenu();
    const menu2 = new MenuTest(view, '.menu-1-list-menu-2', menu1);
    menu2.openMenu(true);
    const menu3 = new MenuTest(view, '.menu-2-list-menu-3', menu2);
    menu3.openMenu(true);
    menu3.menuItem('.menu-3-list').click();
    await view.whenStable();
    expect(menu1.isOpen()).toBeFalsy();
    expect(menu2.isOpen()).toBeFalsy();
    expect(menu3.isOpen()).toBeFalsy();
  });

  it('should close all the menus when clicking backdrop', async () => {
    const menu1 = new MenuTest(view, '.menu-1');
    menu1.openMenu();
    const menu2 = new MenuTest(view, '.menu-1-list-menu-2', menu1);
    menu2.openMenu(true);
    const menu3 = new MenuTest(view, '.menu-2-list-menu-3', menu2);
    menu3.openMenu(true);
    view.queryRoot('.popover-backdrop').click();
    await view.whenStable();
    expect(menu1.isOpen()).toBeFalsy();
    expect(menu2.isOpen()).toBeFalsy();
    expect(menu3.isOpen()).toBeFalsy();
  });

  describe('Accessibility', () => {
    it('should open menu when pressing enter', () => {
      const menu1 = new MenuTest(view, '.menu-1');
      menu1.openMenu();
      expect(menu1.isOpen()).toBeTruthy();
    });
  });
});

class MenuTest {
  constructor(
    private view: RenderResult<TestComponent>,
    private menuTriggerId: string,
    private parent?: MenuTest | undefined,
  ) {}

  menuItem(id: string) {
    return this.view.queryRoot(id);
  }

  openMenu(mouseEnter = false) {
    const button = this.view.queryRoot(this.menuTriggerId);
    if (mouseEnter) {
      button.mouseEnter();
    } else {
      button.click();
    }
    this.view.detectChanges();
  }

  get triggerId() {
    const menuIds = this.menuTriggerId.split('list-');
    const menuId = (menuIds[1] || menuIds[0]).replace(/^\./, '');
    return menuId;
  }

  async closeMenu() {
    this.view.queryRoot(`.${this.triggerId}-list`).click();
    await this.view.whenStable();
  }

  isOpen() {
    return this.view.queryRoot(`.${this.triggerId}-list`);
  }
}
