import { render, RenderResult } from '@meeui/adk/test';
import { MeePagination, MeePaginationBtn } from './pagination';
import { Component, signal } from '@angular/core';

@Component({
  imports: [MeePagination, MeePaginationBtn],
  template: `<div meePagination [total]="total()" [size]="size()" [active]="active()"></div>`,
})
class TestComponent {
  readonly total = signal<number>(100);
  readonly size = signal<number>(10);
  readonly active = signal<number>(1);
}

describe('Pagination', () => {
  let component: MeePagination;
  let view: RenderResult<TestComponent>;

  beforeEach(async () => {
    view = await render(TestComponent);
    component = view.viewChild(MeePagination);
    view.detectChanges();
  });

  it('should create proper items based on size', () => {
    expect(component.snaps()).toEqual([1, 2, 3, 4, 5]);
    view.host.size.set(20);
    view.detectChanges();
    expect(component.snaps()).toEqual([1, 2, 3, 4, 5]);
    view.host.size.set(50);
    view.detectChanges();
    expect(component.snaps()).toEqual([1, 2]);
  });

  it('should have prev and next', () => {
    expect(component.prev()).toBeFalsy();
    expect(component.next()).toBeTruthy();
    view.host.active.set(5);
    view.detectChanges();
    expect(component.prev()).toBeTruthy();
    expect(component.next()).toBeTruthy();
    view.host.active.set(45);
    view.detectChanges();
    expect(component.prev()).toBeTruthy();
    expect(component.next()).toBeFalsy();
  });

  it('should go to page', () => {
    jest.spyOn(component.valueChanged, 'emit');
    component.goto(3);
    expect(component.active()).toBe(3);
    expect(component.valueChanged.emit).toHaveBeenCalledWith(3);

    component.goto(11);
    expect(component.active()).toBe(10);
    expect(component.valueChanged.emit).toHaveBeenCalledWith(10);

    component.goto(0);
    expect(component.active()).toBe(1);
    expect(component.valueChanged.emit).toHaveBeenCalledWith(1);
  });

  it('should jump to page', () => {
    jest.spyOn(component, 'goto');
    component.jump(3);
    expect(component.goto).toHaveBeenCalledWith(4);

    component.jump(-2);
    expect(component.goto).toHaveBeenCalledWith(2);
  });

  it('should change size', () => {
    jest.spyOn(component.valueChanged, 'emit');
    component.sizeChanged(50);
    expect(component.size()).toBe(50);
    expect(component.active()).toBe(1);
    expect(component.valueChanged.emit).toHaveBeenCalledWith(1);
  });
});
