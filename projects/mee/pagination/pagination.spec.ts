import { render, RenderResult } from '@ngbase/adk/test';
import { Pagination } from './pagination';

describe('Pagination', () => {
  let component: Pagination;
  let view: RenderResult<Pagination>;

  beforeEach(async () => {
    view = await render(Pagination);
    component = view.host;
    view.setInput('total', 100);
    view.setInput('size', 10);
    view.setInput('active', 1);
    view.detectChanges();
  });

  it('should create proper items based on size', () => {
    expect(component.snaps()).toEqual([1, 2, 3, 4, 5]);
    view.setInput('size', 20);
    view.detectChanges();
    expect(component.snaps()).toEqual([1, 2, 3, 4, 5]);
    view.setInput('size', 50);
    view.detectChanges();
    expect(component.snaps()).toEqual([1, 2]);
  });

  it('should have prev and next', () => {
    expect(component.prev()).toBeFalsy();
    expect(component.next()).toBeTruthy();
    view.setInput('active', 5);
    view.detectChanges();
    expect(component.prev()).toBeTruthy();
    expect(component.next()).toBeTruthy();
    view.setInput('active', 45);
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
