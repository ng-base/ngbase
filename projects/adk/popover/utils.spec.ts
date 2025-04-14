import { OverlayPosition, PopoverPositioner, Position, PositionResult, Rect } from './utils';

export const createMockElement = (rect: Partial<DOMRect>): HTMLElement =>
  ({
    getBoundingClientRect: () => rect as DOMRect,
    clientWidth: rect.width || 0,
    clientHeight: rect.height || 0,
  }) as unknown as HTMLElement;

const resultDimensions = (rect: Partial<PositionResult>): PositionResult => ({
  top: undefined,
  left: undefined,
  position: Position.Right,
  bottom: undefined,
  right: undefined,
  maxWidth: undefined,
  maxHeight: undefined,
  ...rect,
});

describe('utils', () => {
  const mockWindowDimensions = { width: 1292, height: 944 };
  const mockScrollWidth = 0;
  const values: [OverlayPosition, HTMLElement, HTMLElement, PositionResult][] = [
    [
      Position.BottomLeft,
      createMockElement({ top: 489, left: 257, width: 111.28125, height: 38 }),
      createMockElement({ width: 153, height: 225 }),
      resultDimensions({ top: 531, left: 257, position: Position.BottomLeft }),
    ],
    [
      Position.Right,
      createMockElement({ top: 608, left: 262, width: 136.625, height: 36 }),
      createMockElement({ width: 869, height: 264 }),
      resultDimensions({ top: 494, left: 402.625, position: Position.Right }),
    ],
  ];

  it('should return proper dimensions for below scenarios', () => {
    for (const [position, target, el, expected] of values) {
      const positioner = new PopoverPositioner(
        { offset: 4, position, target, el },
        mockWindowDimensions,
        mockScrollWidth,
      );
      const output = positioner.calculatePosition();
      expect(output).toEqual(expected);
    }
  });

  it('should return proper dimensions if the width is overflowing the right', () => {
    const target = createMockElement({ top: 489, left: 1139.71875, width: 111.28125, height: 38 });
    const el = createMockElement({ width: 153, height: 225 });
    const positioner = new PopoverPositioner(
      { offset: 4, position: Position.BottomLeft, target, el },
      mockWindowDimensions,
      mockScrollWidth,
    );
    const output = positioner.calculatePosition();

    expect(output).toEqual(
      resultDimensions({ top: 531, right: 41, position: Position.BottomRight }),
    );
  });

  it('should return proper dimensions and position for left target and right position', () => {
    const target = createMockElement({ top: 10, left: 10, width: 100, height: 20 });
    const el = createMockElement({ width: 150, height: 14 });
    const positioner = new PopoverPositioner(
      { offset: 10, position: Position.Right, target, el },
      { width: 1000, height: 1000 },
    );
    const output = positioner.calculatePosition();

    expect(output).toEqual(resultDimensions({ top: 13, left: 120, position: Position.Right }));
  });

  it('should return proper dimensions and position for right target and right position', () => {
    const target = createMockElement({ top: 10, left: 890, width: 100, height: 20 });
    const el = createMockElement({ width: 150, height: 14 });
    const positioner = new PopoverPositioner(
      { offset: 10, position: Position.Right, target, el },
      { width: 1000, height: 1000 },
    );
    const output = positioner.calculatePosition();

    expect(output).toEqual(resultDimensions({ top: 13, right: 120, position: Position.Left }));
  });

  it('should handle max height on overflow', () => {
    const target = createMockElement({ top: 500, left: 300, width: 100, height: 100 });
    const el = createMockElement({ width: 150, height: 600 });
    const positioner = new PopoverPositioner(
      { offset: 10, position: Position.BottomLeft, target, el },
      { width: 1000, height: 1000 },
    );
    const output = positioner.calculatePosition();

    expect(output).toEqual(
      resultDimensions({ bottom: 510, left: 300, maxHeight: 490, position: Position.TopLeft }),
    );
  });

  it('should handle the sideOffset for maxHeight and maxWidth', () => {
    const target = createMockElement({ top: 500, left: 300, width: 100, height: 100 });
    const el = createMockElement({ width: 150, height: 600 });
    const positioner = new PopoverPositioner(
      { offset: 10, position: Position.BottomLeft, target, el, sideOffset: 10 },
      { width: 1000, height: 1000 },
    );
    const output = positioner.calculatePosition();

    expect(output).toEqual(
      resultDimensions({ bottom: 510, left: 300, maxHeight: 480, position: Position.TopLeft }),
    );
  });

  it('should handle the sideOffset properly', () => {
    const target = createMockElement({ top: 880, left: 300, width: 100, height: 10 });
    const el = createMockElement({ width: 100, height: 100 });
    const positioner = new PopoverPositioner(
      { offset: 10, position: Position.BottomLeft, target, el, sideOffset: 16 },
      { width: 1000, height: 1000 },
    );
    const output = positioner.calculatePosition();

    expect(output).toEqual(
      resultDimensions({ bottom: 130, left: 300, position: Position.TopLeft }),
    );
  });
});
