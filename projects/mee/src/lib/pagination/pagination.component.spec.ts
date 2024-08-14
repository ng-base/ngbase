import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pagination } from './pagination.component';

describe('Pagination', () => {
  let component: Pagination;
  let fixture: ComponentFixture<Pagination>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Pagination],
    }).compileComponents();

    fixture = TestBed.createComponent(Pagination);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('total', 100);
    fixture.componentRef.setInput('size', 10);
    fixture.componentRef.setInput('active', 1);
    fixture.detectChanges();
  });

  it('should create proper items based on size', () => {
    expect(component.items()).toEqual([1, 2, 3, 4, 5]);
    fixture.componentRef.setInput('size', 20);
    fixture.detectChanges();
    expect(component.items()).toEqual([1, 2, 3, 4, 5]);
    fixture.componentRef.setInput('size', 50);
    fixture.detectChanges();
    expect(component.items()).toEqual([1, 2]);
  });

  it('should have prev and next', () => {
    expect(component.prev()).toBeFalsy();
    expect(component.next()).toBeTruthy();
    fixture.componentRef.setInput('active', 5);
    fixture.detectChanges();
    expect(component.prev()).toBeTruthy();
    expect(component.next()).toBeTruthy();
    fixture.componentRef.setInput('active', 45);
    fixture.detectChanges();
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
