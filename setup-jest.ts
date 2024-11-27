import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';

setupZonelessTestEnv();

globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

let scrollIntoViewMock = jest.fn();
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

globalThis.DOMRect = class {
  static fromRect: () => {
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 0;
    height: 0;
    x: 0;
    y: 0;
    toJSON: () => '{}';
  };
} as any;
