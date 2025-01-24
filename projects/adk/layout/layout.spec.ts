import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { breakpointObserver } from './layout';

@Component({ template: '' })
class TestComponent {
  readonly breakpoints = breakpointObserver();
}

function setupTestBreakpoint() {
  const createMockMediaQuery = () => ({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  });

  const _mediaQueryList = createMockMediaQuery();
  const _matchMedia = jest.fn().mockReturnValue(_mediaQueryList);
  window.matchMedia = _matchMedia;

  return {
    reset: () => {
      Object.assign(_mediaQueryList, createMockMediaQuery());
      Object.assign(_matchMedia, jest.fn().mockReturnValue(_mediaQueryList));
      window.matchMedia = _matchMedia;
    },
    get mediaQueryList() {
      return _mediaQueryList;
    },
    get matchMedia() {
      return _matchMedia;
    },
  };
}

describe('breakpointObserver', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let { reset, mediaQueryList, matchMedia } = setupTestBreakpoint();
  beforeEach(() => {
    reset();

    // Mock DestroyRef
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.breakpoints.observe({ sm: '(min-width: 640px)' });
    expect(component).toBeDefined();
  });

  it('should create breakpoint observer', () => {
    expect(component.breakpoints.observe).toBeDefined();
    expect(component.breakpoints.matches).toBeDefined();
  });

  it('should observe breakpoints and return initial state', () => {
    mediaQueryList.matches = true;
    const { state } = component.breakpoints.observe({ sm: '(min-width: 640px)' });

    expect(state()).toEqual({ sm: true });
    expect(matchMedia).toHaveBeenCalledWith('(min-width: 640px)');
    expect(mediaQueryList.addEventListener).toHaveBeenCalled();
  });

  it('should update state when media query changes', () => {
    const { state } = component.breakpoints.observe({ sm: '(min-width: 640px)' });

    // Get the listener callback
    const [[, listener]] = mediaQueryList.addEventListener.mock.calls;

    // Simulate media query change
    listener({ matches: true });
    expect(state()).toEqual({ sm: true });

    listener({ matches: false });
    expect(state()).toEqual({ sm: false });
  });

  it('should clean up listeners when unobserving', () => {
    const { unobserve } = component.breakpoints.observe({ sm: '(min-width: 640px)' });

    unobserve();
    expect(mediaQueryList.removeEventListener).toHaveBeenCalled();
  });

  it('should clean up all listeners on destroy', () => {
    component.breakpoints.observe({ sm: '(min-width: 640px)' });
    component.breakpoints.observe({ md: '(min-width: 768px)' });

    fixture.destroy();

    expect(mediaQueryList.removeEventListener).toHaveBeenCalledTimes(2);
  });

  it('should reuse existing media query listeners', () => {
    const query = '(min-width: 640px)';

    component.breakpoints.observe({ sm1: query });
    component.breakpoints.observe({ sm2: query });

    expect(matchMedia).toHaveBeenCalledTimes(1);
    expect(mediaQueryList.addEventListener).toHaveBeenCalledTimes(1);
  });

  it('should handle matches function', () => {
    mediaQueryList.matches = true;

    expect(component.breakpoints.matches('(min-width: 640px)')).toBe(true);
    expect(matchMedia).toHaveBeenCalledWith('(min-width: 640px)');
  });
});
