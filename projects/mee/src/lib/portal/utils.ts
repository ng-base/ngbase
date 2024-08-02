import { Signal } from '@angular/core';
import { DialogPosition } from './dialog-ref';

const positionSwap: Record<DialogPosition, DialogPosition> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
  tl: 'bl',
  tr: 'br',
  bl: 'tl',
  br: 'tr',
};

export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface OverlayConfig {
  target: HTMLElement;
  el?: HTMLElement;
  position?: DialogPosition;
  offset?: number;
  client?: { x: number; y: number; w: number; h: number } | null;
  className?: string;
  backdropClassName?: string;
  clipPath?: Signal<string>;
  anchor?: boolean;
  smoothScroll?: boolean;
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
  priority: DialogPosition;
  position: DialogPosition;
  windowWidth: number;
  windowHeight: number;
  scrollWidth: number;
}
// Enums and Interfaces

export interface PositionResult {
  top: number;
  left: number;
  bottom?: number;
  right?: number;
  position: Position;
}

export class PopoverPositioner {
  constructor(
    private config: OverlayConfig,
    private windowDimensions: { width: number; height: number },
    private scrollWidth: number,
  ) {}

  public calculatePosition(): PositionResult {
    const targetRect = this.getTargetRect();
    const elRect = this.getElementRect();
    const initialPosition = this.getInitialPosition(
      targetRect,
      elRect,
      (this.config.position as Position) || Position.Bottom,
    );
    const adjustedPosition = this.adjustForOverflow(initialPosition, targetRect, elRect);
    return this.finalizePosition(adjustedPosition, elRect);
  }

  private getTargetRect(): Rect {
    if (this.config.client) {
      const { x, y, w, h } = this.config.client;
      return { top: y, left: x, width: w, height: h };
    }
    const { top, left, width, height } = this.config.target.getBoundingClientRect();
    return { top, left, width, height: Math.min(height, this.windowDimensions.height - top) };
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
    const offset = this.config.offset || 5;
    const coords = this.getCoordinatesForPosition(position, targetRect, elRect, offset);
    coords.left = Math.max(0, coords.left);
    coords.top = Math.max(0, coords.top);
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
    const overflow = this.checkOverflow(position, elRect);
    if (overflow.any) {
      const newPosition = this.getAlternativePosition(position.position, overflow);
      return this.getInitialPosition(targetRect, elRect, newPosition);
    }
    return position;
  }

  private checkOverflow(
    position: PositionResult,
    elRect: Rect,
  ): { top: boolean; bottom: boolean; left: boolean; right: boolean; any: boolean } {
    const isTop = position.top < 0;
    const isBottom = position.top + elRect.height > this.windowDimensions.height;
    const isLeft = position.left - elRect.width < 0;
    const isRight = position.left + elRect.width > this.windowDimensions.width;
    return {
      top: isTop,
      bottom: isBottom,
      left: isLeft,
      right: isRight,
      any: isTop || isBottom || isLeft || isRight,
    };
  }

  getAlternativePosition(
    position: Position,
    overflow: { top: boolean; bottom: boolean; left: boolean; right: boolean },
  ): Position {
    if (overflow.top) {
      if (position === Position.Top) {
        return Position.Bottom;
      }
    }
    if (overflow.bottom) {
      if (position.includes('bottom')) {
        return positionSwap[position] as Position;
      } else if (position.includes('bl')) {
        return overflow.right ? Position.TopRight : Position.TopLeft;
      }
    }
    if (overflow.left) {
      if (position === Position.Left) {
        return Position.Right;
      }
    }
    if (overflow.right) {
      if (position.includes('right')) {
        return !overflow.left
          ? Position.Left
          : overflow.bottom && !overflow.left
            ? (positionSwap[position] as Position)
            : overflow.left && overflow.bottom
              ? Position.Top
              : Position.BottomRight;
      } else if (position.includes('bl')) {
        return overflow.bottom ? Position.TopRight : Position.BottomRight;
      }
    }
    return position;
  }

  private finalizePosition(position: PositionResult, elRect: Rect): PositionResult {
    const { top, left } = position;
    const bottom = position.position.startsWith('t')
      ? this.windowDimensions.height - (top + elRect.height)
      : undefined;
    const right =
      left + elRect.width > this.windowDimensions.width
        ? 0
        : position.position.endsWith('r')
          ? this.windowDimensions.width - (left + elRect.width) - this.scrollWidth
          : undefined;
    // const rightPos =
    //     leftPos + elWidth > windowWidth
    //       ? 0
    //       : position.endsWith('r')
    //         ? windowWidth - (leftPos + elWidth) - scrollWidth
    //         : undefined;
    return {
      top: Math.max(0, Math.min(top, this.windowDimensions.height - elRect.height)),
      bottom,
      left: right ? 0 : Math.max(0, left),
      right,
      position: position.position,
    };
  }
}

// Main function to use the class
export function tooltipPosition(
  config: OverlayConfig,
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
