import { checkOverflow, tooltipPositionInternal } from './utils';

describe('utils', () => {
  it('should be defined', () => {
    let output = tooltipPositionInternal({
      top: 192,
      left: 429,
      width: 1,
      height: 1,
      elWidth: 174.2109375,
      elHeight: 274.15625,
      offset: 0,
      priority: 'bl',
      position: 'bl',
      windowWidth: 1192,
      windowHeight: 507,
    });
    expect(output).toEqual({
      top: 193,
      bottom: 0,
      left: 429,
      position: 'bottom',
    });

    output = tooltipPositionInternal({
      top: 345,
      left: 433,
      width: 1,
      height: 1,
      elWidth: 174.2109375,
      elHeight: 274.15625,
      offset: 0,
      priority: 'bl',
      position: 'bl',
      windowWidth: 1192,
      windowHeight: 507,
    });

    expect(output).toEqual({
      top: 70.84375,
      bottom: 162,
      left: 433,
      position: 'tl',
    });

    output = tooltipPositionInternal({
      top: 120.15625,
      left: 1046.0625,
      width: 120.9375,
      height: 40,
      elWidth: 174.2109375,
      elHeight: 274.15625,
      offset: 5,
      priority: 'bl',
      position: 'bl',
      windowWidth: 1192,
      windowHeight: 507,
    });

    expect(output).toEqual({
      top: 165.15625,
      bottom: 0,
      left: 992.7890625,
      position: 'bottom',
    });

    output = tooltipPositionInternal({
      top: 65,
      left: 0,
      width: 224,
      height: 442,
      elWidth: 400,
      elHeight: 146,
      offset: 5,
      priority: 'right',
      position: 'right',
      windowWidth: 1192,
      windowHeight: 507,
    });

    expect(output).toEqual({
      top: 512,
      bottom: 0,
      left: 0,
      position: 'bottom',
    });
  });

  it('should check overflow', () => {
    // top left corner
    let output = checkOverflow(0, 0, 160, 160, 234, 194, 1192, 507);
    expect(output).toEqual({
      top: true,
      left: true,
      right: false,
      bottom: false,
    });

    // top right corner
    output = checkOverflow(0, 1032, 160, 160, 234, 194, 1192, 507);
    expect(output).toEqual({
      top: true,
      left: false,
      right: true,
      bottom: false,
    });

    // bottom right corner
    output = checkOverflow(347, 1032, 160, 160, 234, 194, 1192, 507);
    expect(output).toEqual({
      top: false,
      left: false,
      right: true,
      bottom: true,
    });

    // bottom left corner
    output = checkOverflow(347, 0, 160, 160, 234, 194, 1192, 507);
    expect(output).toEqual({
      top: false,
      left: true,
      right: false,
      bottom: true,
    });

    // others
    output = checkOverflow(40, 0, 160, 467, 234, 194, 1192, 507);
    expect(output).toEqual({
      top: true,
      left: true,
      right: false,
      bottom: true,
    });
  });
});
