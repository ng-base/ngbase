import { RenderResult, render } from '@ngbase/adk/test';
import { NgbPopoverArrow, providePopoverArrowTracker } from './popover-arrow.ng';

const createMockElement = (rect: Partial<DOMRect>): HTMLElement =>
  ({
    getBoundingClientRect: () => rect as DOMRect,
  }) as unknown as HTMLElement;

const arrowResult = (deg: string, left: string, top: string) => {
  return {
    '--action-angle': deg,
    '--action-left': left,
    '--action-top': top,
  };
};

describe('PopoverArrowTracker', () => {
  let view: RenderResult<NgbPopoverArrow>;

  beforeEach(async () => {
    view = await render(NgbPopoverArrow, [providePopoverArrowTracker()]);
  });

  it('should create an instance', () => {
    expect(view.host).toBeTruthy();
  });

  it('should return proper if position is right', () => {
    const el = createMockElement({ width: 150, height: 30, top: 20 });
    const target = createMockElement({ width: 150, height: 50, top: 10 });

    const value = view.host['updateAnchorPosition']('right', target, el);
    expect(value).toEqual(arrowResult('90deg', '-4px', 'calc(50% - 4px)'));
  });

  it('should return proper position for left', () => {
    const el = createMockElement({ width: 150, height: 30, top: 20 });
    const target = createMockElement({ width: 150, height: 50, top: 10 });

    const value = view.host['updateAnchorPosition']('left', target, el);
    expect(value).toEqual(arrowResult('270deg', 'calc(100% + 4px)', 'calc(50% - 4px)'));
  });

  it('should return proper position for bottom', () => {
    const el = createMockElement({ width: 150, height: 30, top: 20 });
    const target = createMockElement({ width: 150, height: 50, top: 10 });

    const value = view.host['updateAnchorPosition']('bottom', target, el);
    expect(value).toEqual(arrowResult('180deg', 'calc(100% - 75px)', '-0.5rem'));
  });

  it('should return proper position for top', () => {
    const el = createMockElement({ width: 150, height: 30, top: 20 });
    const target = createMockElement({ width: 150, height: 50, top: 10 });

    const value = view.host['updateAnchorPosition']('top', target, el);
    expect(value).toEqual(arrowResult('0deg', '50%', '100%'));
  });
});
