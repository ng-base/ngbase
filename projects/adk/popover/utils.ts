import { PopoverOptions, PopoverPosition } from './popover.service';

// const positionSwap: Record<PopoverPosition, PopoverPosition> = {
//   top: 'bottom',
//   bottom: 'top',
//   left: 'right',
//   right: 'left',
//   tl: 'bl',
//   tr: 'br',
//   bl: 'tl',
//   br: 'tr',
// };

export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export enum Position {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
  TopLeft = 'tl',
  TopRight = 'tr',
  BottomLeft = 'bl',
  BottomRight = 'br',
}
export interface ConfigObj {
  top: number;
  left: number;
  width: number;
  height: number;
  elWidth: number;
  elHeight: number;
  offset: number;
  priority: PopoverPosition;
  position: PopoverPosition;
  windowWidth: number;
  windowHeight: number;
  scrollWidth: number;
}

export interface OverflowData {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
  leftSide: boolean;
  rightSide: boolean;
  any: boolean;
  preferredHorizontal: 'left' | 'right' | undefined;
  preferredVertical: 'top' | 'bottom' | undefined;
  overflowAmount: {
    top: number;
    bottom: number;
    left: number;
    right: number;
    leftSide: number;
    rightSide: number;
  };
}
// Enums and Interfaces

export interface PositionResult {
  top: number;
  left: number;
  bottom?: number;
  right?: number;
  position: Position;
  maxHeight?: number;
  maxWidth?: number;
}

export class PopoverPositioner {
  private overflow!: OverflowData;
  private elRect!: Rect;
  private offset = this.config.offset || 5;

  constructor(
    private config: PopoverOptions,
    private windowDimensions: { width: number; height: number },
    private scrollWidth: number = 0,
  ) {}

  public calculatePosition(): PositionResult {
    const targetRect = this.getTargetRect();
    const elRect = this.getElementRect();
    this.elRect = elRect;
    const initialPosition = this.getInitialPosition(
      targetRect,
      elRect,
      (this.config.position as Position) || Position.Bottom,
    );
    const adjustedPosition = this.adjustForOverflow(initialPosition, targetRect, elRect);
    return this.finalizePosition(adjustedPosition, elRect, targetRect);
  }

  private getTargetRect(): Rect {
    if (this.config.client) {
      const { x, y, w, h } = this.config.client;
      return { top: y, left: x, width: w, height: h };
    }
    const { top, left, width, height } = this.config.target.getBoundingClientRect();
    // return { top, left, width, height: Math.min(height, this.windowDimensions.height - top) };
    return { top, left, width, height };
  }

  private getElementRect(): Rect {
    const el = this.config.el!;
    return {
      top: 0,
      left: 0,
      width: el.clientWidth,
      height: el.clientHeight,
    };
  }

  private getInitialPosition(targetRect: Rect, elRect: Rect, position: Position): PositionResult {
    const coords = this.getCoordinatesForPosition(position, targetRect, elRect, this.offset);
    // coords.left = Math.max(0, coords.left);
    // coords.top = Math.max(0, coords.top);
    return { ...coords, position };
  }

  private getCoordinatesForPosition(
    position: Position,
    targetRect: Rect,
    elRect: Rect,
    offset: number,
  ): { top: number; left: number } {
    switch (position) {
      case Position.Top:
        return {
          top: targetRect.top - elRect.height - offset,
          left: targetRect.left + (targetRect.width - elRect.width) / 2,
        };
      case Position.Bottom:
        return {
          top: targetRect.top + targetRect.height + offset,
          left: targetRect.left + (targetRect.width - elRect.width) / 2,
        };
      case Position.Left:
        return { top: targetRect.top, left: targetRect.left - elRect.width - offset };
      case Position.Right:
        return { top: targetRect.top, left: targetRect.left + targetRect.width + offset };
      case Position.TopLeft:
        return { top: targetRect.top - elRect.height - offset, left: targetRect.left };
      case Position.TopRight:
        return {
          top: targetRect.top - elRect.height - offset,
          left: targetRect.left - (elRect.width - targetRect.width),
        };
      case Position.BottomLeft:
        return { top: targetRect.top + targetRect.height + offset, left: targetRect.left };
      case Position.BottomRight:
        return {
          top: targetRect.top + targetRect.height + offset,
          left: targetRect.left - (elRect.width - targetRect.width),
        };
    }
  }

  private adjustForOverflow(
    position: PositionResult,
    targetRect: Rect,
    elRect: Rect,
  ): PositionResult {
    const overflow = this.checkOverflow(position, elRect, targetRect);
    this.overflow = overflow;
    if (overflow.any) {
      const newPosition = this.getAlternativePosition(position.position, overflow);
      return this.getInitialPosition(targetRect, elRect, newPosition);
    }
    return position;
  }

  private checkOverflow(position: PositionResult, elRect: Rect, targetRect: Rect): OverflowData {
    // Calculate available space on all sides
    // const topSpace = position.top;
    // const bottomSpace = this.windowDimensions.height - position.top;
    // const leftSpace = position.left;
    // const rightSpace = this.windowDimensions.width - position.left;
    // Calculate overflow amounts (negative means no overflow)
    const topOverflow = -(targetRect.top - elRect.height);
    const bottomOverflow =
      targetRect.top + targetRect.height + elRect.height - this.windowDimensions.height;
    // const leftOverflow = -(position.left - (elRect.width - targetRect.width));
    // this is for bottom left and top left -->
    const leftOverflow = -(targetRect.left - elRect.width);
    const leftSideOverflow = -(targetRect.left - elRect.width);
    // this is for bottom right and top right <--
    const rightOverflow =
      targetRect.left + targetRect.width + elRect.width - this.windowDimensions.width;
    const rightSideOverflow = -(targetRect.left + targetRect.width - elRect.width);

    const isTop = topOverflow > 0;
    const isBottom = bottomOverflow > 0;
    const isLeft = leftOverflow > 0;
    const isRight = rightOverflow > 0;
    const isLeftSide = leftSideOverflow > 0;
    const isRightSide = rightSideOverflow > 0;

    let preferredHorizontal: 'left' | 'right' | undefined;
    let preferredVertical: 'top' | 'bottom' | undefined;
    // If both left and right overflow, determine which side has more space
    if (isLeft || isRight) {
      preferredHorizontal = leftOverflow > rightOverflow ? 'right' : 'left';
    } else if (isLeftSide || isRightSide) {
      preferredHorizontal = leftSideOverflow > rightSideOverflow ? 'right' : 'left';
    }

    // If both top and bottom overflow, determine which side has more space
    if (isTop || isBottom) {
      preferredVertical = topOverflow > bottomOverflow ? 'bottom' : 'top';
    }
    return {
      top: isTop,
      bottom: isBottom,
      left: isLeft,
      right: isRight,
      leftSide: isLeftSide,
      rightSide: isRightSide,
      any: isTop || isBottom || isLeft || isRight || isLeftSide || isRightSide,
      preferredHorizontal,
      preferredVertical,
      overflowAmount: {
        top: topOverflow,
        bottom: bottomOverflow,
        left: leftOverflow,
        right: rightOverflow,
        leftSide: leftSideOverflow,
        rightSide: rightSideOverflow,
      },
    };
  }

  getAlternativePosition(position: Position, overflow: OverflowData): Position {
    // if (overflow.top) {
    //   if (position === Position.Top) {
    //     return Position.Bottom;
    //   }
    // }
    // if (
    //   (overflow.preferredVertical === 'top' || !overflow.bottom) &&
    //   (overflow.preferredHorizontal === 'left' || !overflow.right)
    // ) {
    //   return Position.BottomRight;
    // }
    // if (
    //   (overflow.preferredVertical === 'top' || !overflow.bottom) &&
    //   (overflow.preferredHorizontal === 'right' || !overflow.left)
    // ) {
    //   return Position.BottomLeft;
    // }
    // if (
    //   (overflow.preferredVertical === 'bottom' || !overflow.top) &&
    //   (overflow.preferredHorizontal === 'left' || !overflow.right)
    // ) {
    //   return Position.TopRight;
    // }
    // if (
    //   (overflow.preferredVertical === 'bottom' || !overflow.top) &&
    //   (overflow.preferredHorizontal === 'right' || !overflow.left)
    // ) {
    //   return Position.TopLeft;
    // }
    // if (overflow.bottom) {
    //   if (position.includes('bottom')) {
    //     return positionSwap[position] as Position;
    //   } else if (position.includes('bl') && overflow.preferredVertical === 'top') {
    //     return overflow.right && overflow.preferredHorizontal !== 'right'
    //       ? Position.TopRight
    //       : Position.TopLeft;
    //   } else if (position.includes('bl') && overflow.preferredVertical === 'bottom') {
    //     return overflow.right && overflow.preferredHorizontal !== 'right'
    //       ? Position.BottomRight
    //       : Position.BottomLeft;
    //   }
    // }
    // if (overflow.left) {
    //   if (position === Position.Left) {
    //     return Position.Right;
    //   }
    //   if (overflow.preferredHorizontal === 'left' || !overflow.right) {
    //     return overflow.bottom ? Position.TopLeft : Position.BottomLeft;
    //   }
    //   if (overflow.preferredHorizontal === 'right') {
    //     return overflow.bottom ? Position.TopRight : Position.BottomRight;
    //   }
    // }
    // if (overflow.right) {
    //   if (position.includes('right')) {
    //     return !overflow.left
    //       ? Position.Left
    //       : overflow.bottom && !overflow.left
    //         ? (positionSwap[position] as Position)
    //         : overflow.left && overflow.bottom
    //           ? Position.Top
    //           : Position.BottomRight;
    //   } else if (position.includes('bl')) {
    //     return overflow.bottom ? Position.TopRight : Position.BottomRight;
    //   }
    // }
    // return position;
    if (!overflow.any) {
      return position;
    }

    // Simple mapping for opposite positions
    const opposites = {
      [Position.Top]: Position.Bottom,
      [Position.Bottom]: Position.Top,
      [Position.Left]: Position.Right,
      [Position.Right]: Position.Left,
      [Position.TopLeft]: Position.BottomRight,
      [Position.TopRight]: Position.BottomLeft,
      [Position.BottomLeft]: Position.TopRight,
      [Position.BottomRight]: Position.TopLeft,
    };

    // For cardinal positions (Top, Bottom, Left, Right)
    if ([Position.Top, Position.Bottom].includes(position)) {
      return (overflow.preferredVertical as any) || opposites[position];
    }

    if ([Position.Left, Position.Right].includes(position)) {
      return (overflow.preferredHorizontal as any) || opposites[position];
    }

    // For corner positions
    const isTop = position.includes('t');
    const isLeft = position.includes('l');

    const vertical = overflow.preferredVertical === 'top' ? 't' : 'b';
    const horizontal = overflow.preferredHorizontal === 'left' ? 'r' : 'l';

    // If current position overflows, use the preferred directions
    if (
      (isTop && overflow.top) ||
      (!isTop && overflow.bottom) ||
      (isLeft && overflow.left) ||
      (!isLeft && overflow.right) ||
      (horizontal === 'r' && overflow.right) ||
      (horizontal === 'l' && overflow.left)
    ) {
      switch (vertical + horizontal) {
        case 'tl':
          return Position.TopLeft;
        case 'tr':
          return Position.TopRight;
        case 'bl':
          return Position.BottomLeft;
        case 'br':
          return Position.BottomRight;
        default:
          return opposites[position];
      }
    }

    return position;
  }

  private finalizePosition(
    position: PositionResult,
    elRect: Rect,
    targetRect: Rect,
  ): PositionResult {
    const { top, left } = position;
    const bottom = position.position.startsWith('t')
      ? this.windowDimensions.height - (top + elRect.height)
      : undefined;
    // this is required if tooltip is going outside of the screen horizontally
    // this has to be done only if the position is top or bottom
    let right: number | undefined;
    right =
      left + elRect.width > this.windowDimensions.width
        ? 0
        : position.position.endsWith('r') || position.position === Position.Left
          ? this.windowDimensions.width - (left + elRect.width) - this.scrollWidth
          : undefined;

    let overallOffset = this.getOverallOffset(position);
    let maxHeight: number | undefined;
    if (
      position.position.startsWith('t') &&
      this.overflow.overflowAmount.top > -overallOffset.vertical
    ) {
      maxHeight = this.elRect.height - this.overflow.overflowAmount.top - overallOffset.vertical;
    } else if (
      position.position.startsWith('b') &&
      this.overflow.overflowAmount.bottom > -overallOffset.vertical
    ) {
      maxHeight = this.elRect.height - this.overflow.overflowAmount.bottom - overallOffset.vertical;
    }

    let maxWidth: number | undefined;
    if (
      position.position.endsWith('l') &&
      this.overflow.overflowAmount.right > -overallOffset.horizontal
    ) {
      maxWidth = this.elRect.width - this.overflow.overflowAmount.right - overallOffset.horizontal;
    } else if (
      position.position.endsWith('r') &&
      this.overflow.overflowAmount.left > -overallOffset.horizontal
    ) {
      maxWidth = this.elRect.width - this.overflow.overflowAmount.left - overallOffset.horizontal;
    }
    let t = top;
    if (['right', 'left'].includes(position.position)) {
      t = top + (targetRect.height - elRect.height) / 2;
    }
    return {
      // top: Math.max(0, Math.min(top, this.windowDimensions.height - (maxHeight || elRect.height))),
      top: Math.max(0, t),
      bottom,
      left: right ? 0 : Math.max(overallOffset.horizontal, left),
      right: right ? Math.max(overallOffset.horizontal, right) : undefined,
      position: position.position,
      maxHeight,
      maxWidth,
    };
  }

  private getOverallOffset(position: PositionResult) {
    const overallOffset = this.config.sideOffset ?? 0;
    const isHorizontal = position.position === 'left' || position.position === 'right';
    return {
      horizontal: overallOffset + (isHorizontal ? this.offset : 0),
      vertical: overallOffset + (isHorizontal ? 0 : this.offset),
    };
  }
}

// Main function to use the class
export function tooltipPosition(
  config: PopoverOptions,
  windowDimensions = {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scrollWidth = window.innerWidth - document.documentElement.clientWidth,
): PositionResult {
  const positioner = new PopoverPositioner(config, windowDimensions, scrollWidth);
  return positioner.calculatePosition();
}

// export function tooltipPosition(config: OverlayConfig): {
//   top: number;
//   left: number;
//   bottom?: number;
//   right?: number;
//   position: DialogPosition;
// } {
//   const { target, el, position: priority = 'bottom', offset = 5, client: clientXY = null } = config;
//   let position: DialogPosition = priority;
//   let { top, left, width, height } = target.getBoundingClientRect();
//   if (clientXY) {
//     top = clientXY.y;
//     left = clientXY.x;
//     width = clientXY.w;
//     height = clientXY.h;
//   }
//   const { clientWidth: elWidth, clientHeight: elHeight } = el!;

//   // we need to check whether the height of the target element is greater than the height then we need to adjust the height
//   if (height > window.innerHeight) {
//     height = window.innerHeight - top;
//   }

//   return tooltipPositionInternal({
//     top,
//     left,
//     width,
//     height,
//     elWidth,
//     elHeight,
//     offset,
//     priority,
//     position,
//     windowWidth: window.innerWidth,
//     windowHeight: window.innerHeight,
//     scrollWidth: window.innerWidth - document.documentElement.clientWidth,
//   });
// }

// export function tooltipPositionInternal(data: ConfigObj): {
//   top: number;
//   bottom?: number;
//   left: number;
//   right?: number;
//   position: DialogPosition;
// } {
//   let { elHeight, position, windowHeight, windowWidth, offset, elWidth, scrollWidth } = data;

//   position = positionSwapBasedOnOverflow(data);

//   let { top: topPos, left: leftPos } = getTooltipCoordinates(position, data);

//   if (topPos <= 0) {
//     topPos = offset;
//   } else if (topPos + elHeight > windowHeight) {
//     topPos = windowHeight - elHeight - offset;
//   } else if (leftPos < 0) {
//     leftPos = 0;
//   }

//   const bottomPos = position.startsWith('t') ? windowHeight - (topPos + elHeight) : undefined;
//   const rightPos =
//     leftPos + elWidth > windowWidth
//       ? 0
//       : position.endsWith('r')
//         ? windowWidth - (leftPos + elWidth) - scrollWidth
//         : undefined;

//   return {
//     top: topPos,
//     bottom: bottomPos,
//     left: rightPos ? 0 : leftPos,
//     position,
//     right: rightPos,
//   };
// }

// function getTooltipCoordinates(
//   position: DialogPosition,
//   data: ConfigObj,
// ): { top: number; left: number } {
//   const { top, left, width, height, elWidth, elHeight, offset } = data;
//   switch (position) {
//     case 'top':
//       return {
//         top: top - elHeight - offset,
//         left: left + (width - elWidth) / 2,
//       };
//     case 'bottom':
//       return { top: top + height + offset, left: left + (width - elWidth) / 2 };
//     case 'left':
//       return { top, left: left - elWidth - offset };
//     case 'right':
//       return { top, left: left + width + offset };
//     case 'tl':
//       return { top: top - elHeight - offset, left };
//     case 'tr':
//       return { top: top - elHeight - offset, left: left - (elWidth - width) };
//     case 'bl':
//       return { top: top + height + offset, left };
//     case 'br':
//       return { top: top + height + offset, left: left - (elWidth - width) };
//     default:
//       return {
//         top: top - elHeight - offset,
//         left: left + (width - elWidth) / 2,
//       };
//   }
// }

// // function to check the overflow sides for target and element
// export function checkOverflow(data: ConfigObj) {
//   const isTop = data.top - data.elHeight < 0;
//   const isBottom = data.top + data.height + data.elHeight > data.windowHeight;
//   const isLeft = data.left - data.elWidth < 0;
//   const isRight = data.left + data.width + data.elWidth > data.windowWidth;

//   return { top: isTop, bottom: isBottom, left: isLeft, right: isRight };
// }

// // position swap based on the overflow and priority
// function positionSwapBasedOnOverflow(data: ConfigObj): DialogPosition {
//   const {
//     bottom: bottomOverflow,
//     left: leftOverflow,
//     right: rightOverflow,
//     top: topOverflow,
//   } = checkOverflow(data);
//   const { priority } = data;

//   let position = priority;
//   if (topOverflow) {
//     if (position.includes('top')) {
//       position = positionSwap[position];
//     }
//   }
//   if (bottomOverflow) {
//     if (position.includes('bottom')) {
//       position = positionSwap[position];
//     } else if (position.includes('bl')) {
//       position = rightOverflow ? 'tr' : 'tl';
//     }
//   }
//   if (leftOverflow) {
//     if (position.includes('left')) {
//       position = positionSwap[position];
//     }
//   }
//   if (rightOverflow) {
//     if (position.includes('right')) {
//       position = !leftOverflow
//         ? 'left'
//         : bottomOverflow && !leftOverflow
//           ? positionSwap[position]
//           : leftOverflow && bottomOverflow
//             ? 'top'
//             : 'br';
//     } else if (position.includes('bl')) {
//       position = bottomOverflow ? 'tr' : 'br';
//     }
//   }
//   return position;
// }
