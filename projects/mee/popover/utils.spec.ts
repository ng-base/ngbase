import { PopoverOptions } from './popover.service';
import { PopoverPositioner, Position, PositionResult, Rect } from './utils';

const createMockElement = (rect: Partial<DOMRect>): HTMLElement =>
  ({
    getBoundingClientRect: () => rect as DOMRect,
    clientWidth: rect.width || 0,
    clientHeight: rect.height || 0,
  }) as unknown as HTMLElement;

describe('utils', () => {
  const mockWindowDimensions = { width: 1292, height: 944 };
  const mockScrollWidth = 0;

  it('should return proper dimensions', () => {
    const values = [
      [
        'bl',
        { top: 489, left: 257, width: 111.28125, height: 38 },
        { width: 153, height: 225 },
        { top: 531, bottom: undefined, left: 257, right: undefined, position: 'bl' },
      ],
      [
        'right',
        { top: 608, left: 262, width: 136.625, height: 36 },
        { width: 869, height: 264 },
        { top: 608, bottom: undefined, left: 402.625, right: undefined, position: 'right' },
      ],
    ];

    for (const [position, target, el, expected] of values) {
      const config: PopoverOptions = {
        offset: 4,
        position: position as Position,
        target: createMockElement(target as any),
        el: createMockElement(el as any),
      };
      const positioner = new PopoverPositioner(config, mockWindowDimensions, mockScrollWidth);
      const output = positioner.calculatePosition();
      expect(output).toEqual(expected);
    }
    // const target = createMockElement({ top: 489, left: 257, width: 111.28125, height: 38 });
    // const el = createMockElement({ width: 153, height: 225 });
    // const config: OverlayConfig = { offset: 4, position: 'bl', target, el };
    // const positioner = new PopoverPositioner(config, mockWindowDimensions, mockScrollWidth);
    // const output = positioner.calculatePosition();

    // expect(output).toEqual({
    //   top: 531,
    //   bottom: undefined,
    //   left: 257,
    //   right: undefined,
    //   position: 'bl',
    // });
  });

  it('should return proper dimensions if the width is overflowing the right', () => {
    const target = createMockElement({ top: 489, left: 1139.71875, width: 111.28125, height: 38 });
    const el = createMockElement({ width: 153, height: 225 });
    const config: PopoverOptions = { offset: 4, position: 'bl', target, el };
    const positioner = new PopoverPositioner(config, mockWindowDimensions, mockScrollWidth);
    const output = positioner.calculatePosition();

    expect(output).toEqual({
      top: 531,
      bottom: undefined,
      left: 0,
      right: 41,
      position: 'br',
    });
  });

  describe('checkOverflow', () => {
    let positioner: PopoverPositioner;

    beforeEach(() => {
      const target = createMockElement({ top: 489, left: 257, width: 111.28125, height: 38 });
      const el = createMockElement({ width: 153, height: 225 });
      const config: PopoverOptions = { offset: 4, position: 'bl', target, el };
      positioner = new PopoverPositioner(config, mockWindowDimensions, mockScrollWidth);
    });

    it('should return false if there is no overflow', () => {
      const values: [PositionResult, Rect, any][] = [
        [
          { top: 531, left: 257, position: Position.BottomLeft },
          { top: 0, left: 0, width: 153, height: 225 },
          { top: false, left: false, right: false, bottom: false, any: false },
        ],
        [
          { top: 531, left: 1200, position: Position.BottomLeft },
          { top: 0, left: 0, width: 153, height: 225 },
          { top: false, left: false, right: true, bottom: false, any: true },
        ],
        // [
        //   { top: 531, left: 580, position: Position.Right },
        //   { top: 0, left: 0, width: 780, height: 225 },
        //   { top: false, left: true, right: true, bottom: false, any: true },
        // ],
        [
          { top: 608, left: 411.296875, position: Position.Right },
          { top: 0, left: 0, width: 898, height: 264 },
          { top: false, bottom: false, left: true, right: true, any: true },
        ],
      ];

      for (const [result, rect, expected] of values) {
        const output = positioner['checkOverflow'](result, rect);
        expect(output).toEqual(expected);
      }
    });
  });

  // it('should calculate tooltip position', () => {
  //   const testCases: { input: ConfigObj; expectedOutput: any }[] = [
  //     {
  //       input: {
  //         top: 192,
  //         left: 429,
  //         width: 1,
  //         height: 1,
  //         elWidth: 174.2109375,
  //         elHeight: 274.15625,
  //         offset: 0,
  //         priority: 'bl',
  //         position: 'bl',
  //         windowWidth: 1192,
  //         windowHeight: 507,
  //         scrollWidth: 0,
  //       },
  //       expectedOutput: {
  //         top: 193,
  //         bottom: 0,
  //         left: 429,
  //         position: 'bottom',
  //       },
  //     },
  //     {
  //       input: {
  //         top: 345,
  //         left: 433,
  //         width: 1,
  //         height: 1,
  //         elWidth: 174.2109375,
  //         elHeight: 274.15625,
  //         offset: 0,
  //         priority: 'bl',
  //         position: 'bl',
  //         windowWidth: 1192,
  //         windowHeight: 507,
  //         scrollWidth: 0,
  //       },
  //       expectedOutput: {
  //         top: 70.84375,
  //         bottom: 162,
  //         left: 433,
  //         position: 'tl',
  //       },
  //     },
  //     {
  //       input: {
  //         top: 120.15625,
  //         left: 1046.0625,
  //         width: 120.9375,
  //         height: 40,
  //         elWidth: 174.2109375,
  //         elHeight: 274.15625,
  //         offset: 5,
  //         priority: 'bl',
  //         position: 'bl',
  //         windowWidth: 1192,
  //         windowHeight: 507,
  //         scrollWidth: 0,
  //       },
  //       expectedOutput: {
  //         top: 165.15625,
  //         bottom: 0,
  //         left: 992.7890625,
  //         position: 'bottom',
  //         scrollWidth: 0,
  //       },
  //     },
  //     {
  //       input: {
  //         top: 65,
  //         left: 0,
  //         width: 224,
  //         height: 442,
  //         elWidth: 400,
  //         elHeight: 146,
  //         offset: 5,
  //         priority: 'right',
  //         position: 'right',
  //         windowWidth: 1192,
  //         windowHeight: 507,
  //         scrollWidth: 0,
  //       },
  //       expectedOutput: {
  //         top: 512,
  //         bottom: 0,
  //         left: 0,
  //         position: 'bottom',
  //       },
  //     },
  //   ];

  //   for (const testCase of testCases) {
  //     const output = tooltipPositionInternal(testCase.input);
  //     expect(output).toEqual(testCase.expectedOutput);
  //   }
  // });

  // it('should check overflow', () => {
  //   // top left corner
  //   let output = checkOverflow({
  //     top: 0,
  //     left: 0,
  //     width: 160,
  //     height: 160,
  //     elWidth: 234,
  //     elHeight: 194,
  //     offset: 0,
  //     windowWidth: 1192,
  //     windowHeight: 507,
  //     position: 'bl',
  //     priority: 'bl',
  //   });
  //   expect(output).toEqual({
  //     top: true,
  //     left: true,
  //     right: false,
  //     bottom: false,
  //   });

  //   // top right corner
  //   output = checkOverflow({
  //     top: 0,
  //     left: 1032,
  //     width: 160,
  //     height: 160,
  //     elWidth: 234,
  //     elHeight: 194,
  //     offset: 0,
  //     windowWidth: 1192,
  //     windowHeight: 507,
  //     position: 'bl',
  //     priority: 'bl',
  //   });
  //   expect(output).toEqual({
  //     top: true,
  //     left: false,
  //     right: true,
  //     bottom: false,
  //   });

  //   // // bottom right corner
  //   output = checkOverflow({
  //     top: 347,
  //     left: 1032,
  //     width: 160,
  //     height: 160,
  //     elWidth: 234,
  //     elHeight: 194,
  //     offset: 0,
  //     windowWidth: 1192,
  //     windowHeight: 507,
  //     position: 'bl',
  //     priority: 'bl',
  //   });
  //   expect(output).toEqual({
  //     top: false,
  //     left: false,
  //     right: true,
  //     bottom: true,
  //   });

  //   // // bottom left corner
  //   output = checkOverflow({
  //     top: 347,
  //     left: 0,
  //     width: 160,
  //     height: 160,
  //     elWidth: 234,
  //     elHeight: 194,
  //     offset: 0,
  //     windowWidth: 1192,
  //     windowHeight: 507,
  //     position: 'bl',
  //     priority: 'bl',
  //   });
  //   expect(output).toEqual({
  //     top: false,
  //     left: true,
  //     right: false,
  //     bottom: true,
  //   });

  //   // // others
  //   output = checkOverflow({
  //     top: 40,
  //     left: 0,
  //     width: 160,
  //     height: 467,
  //     elWidth: 234,
  //     elHeight: 194,
  //     offset: 0,
  //     windowWidth: 1192,
  //     windowHeight: 507,
  //     position: 'bl',
  //     priority: 'bl',
  //   });
  //   expect(output).toEqual({
  //     top: true,
  //     left: true,
  //     right: false,
  //     bottom: true,
  //   });
  // });
});
