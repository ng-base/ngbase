export interface PopoverUtilConfig {
  offset?: number;
  sideOffset?: number;
  smoothScroll?: boolean;
  position?: Position | OverlayPosition;
  client?: { x: number; y: number; w: number; h: number } | null;
  target: HTMLElement;
  el?: HTMLElement;
}

export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export type OverlayPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'rs'
  | 're'
  | 'ls'
  | 'le'
  | 'tl'
  | 'tr'
  | 'bl'
  | 'br';

// Main position enum with all supported positions
export enum Position {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
  TopLeft = 'tl',
  TopRight = 'tr',
  BottomLeft = 'bl',
  BottomRight = 'br',
  RightStart = 'rs',
  RightEnd = 're',
  LeftStart = 'ls',
  LeftEnd = 'le',
}

export interface PositionResult {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  position: Position;
  maxHeight?: number;
  maxWidth?: number;
}

// Position metadata - defines each position in terms of main axis, alignment, and coordinates calculation
interface PositionMeta {
  main: 'vertical' | 'horizontal';
  placement: 'before' | 'after';
  align: 'start' | 'center' | 'end';
  oppositePosition: Position;
  fallbacks: Position[];
  getCoords: (targetRect: Rect, elementRect: Rect, offset: number) => { top: number; left: number };
}

// Position metadata definitions
const POSITION_META: Record<Position, PositionMeta> = {
  [Position.Top]: {
    main: 'vertical',
    placement: 'before',
    align: 'center',
    oppositePosition: Position.Bottom,
    fallbacks: [Position.Bottom],
    getCoords: (target, element, offset) => ({
      top: target.top - element.height - offset,
      left: target.left + (target.width - element.width) / 2,
    }),
  },
  [Position.Bottom]: {
    main: 'vertical',
    placement: 'after',
    align: 'center',
    oppositePosition: Position.Top,
    fallbacks: [Position.Top, Position.Right, Position.Left],
    getCoords: (target, element, offset) => ({
      top: target.top + target.height + offset,
      left: target.left + (target.width - element.width) / 2,
    }),
  },
  [Position.Left]: {
    main: 'horizontal',
    placement: 'before',
    align: 'center',
    oppositePosition: Position.Right,
    fallbacks: [Position.Right, Position.Top, Position.Bottom],
    getCoords: (target, element, offset) => ({
      top: target.top + (target.height - element.height) / 2,
      left: target.left - element.width - offset,
    }),
  },
  [Position.Right]: {
    main: 'horizontal',
    placement: 'after',
    align: 'center',
    oppositePosition: Position.Left,
    fallbacks: [Position.Left, Position.Top, Position.Bottom],
    getCoords: (target, element, offset) => ({
      top: target.top + (target.height - element.height) / 2,
      left: target.left + target.width + offset,
    }),
  },
  [Position.TopLeft]: {
    main: 'vertical',
    placement: 'before',
    align: 'start',
    oppositePosition: Position.BottomLeft,
    fallbacks: [Position.BottomLeft, Position.TopRight, Position.BottomRight],
    getCoords: (target, element, offset) => ({
      top: target.top - element.height - offset,
      left: target.left,
    }),
  },
  [Position.TopRight]: {
    main: 'vertical',
    placement: 'before',
    align: 'end',
    oppositePosition: Position.BottomRight,
    fallbacks: [Position.BottomRight, Position.TopLeft, Position.BottomLeft],
    getCoords: (target, element, offset) => ({
      top: target.top - element.height - offset,
      left: target.left + target.width - element.width,
    }),
  },
  [Position.BottomLeft]: {
    main: 'vertical',
    placement: 'after',
    align: 'start',
    oppositePosition: Position.BottomRight,
    fallbacks: [Position.BottomRight, Position.TopLeft, Position.TopRight],
    getCoords: (target, element, offset) => ({
      top: target.top + target.height + offset,
      left: target.left,
    }),
  },
  [Position.BottomRight]: {
    main: 'vertical',
    placement: 'after',
    align: 'end',
    oppositePosition: Position.BottomLeft,
    fallbacks: [Position.BottomLeft, Position.TopRight, Position.TopLeft],
    getCoords: (target, element, offset) => ({
      top: target.top + target.height + offset,
      left: target.left + target.width - element.width,
    }),
  },
  [Position.RightStart]: {
    main: 'horizontal',
    placement: 'after',
    align: 'start',
    oppositePosition: Position.RightEnd,
    fallbacks: [Position.RightEnd, Position.LeftStart, Position.LeftEnd],
    getCoords: (target, element, offset) => ({
      top: target.top,
      left: target.left + target.width + offset,
    }),
  },
  [Position.RightEnd]: {
    main: 'horizontal',
    placement: 'after',
    align: 'end',
    oppositePosition: Position.LeftEnd,
    fallbacks: [Position.LeftEnd, Position.RightStart, Position.LeftStart],
    getCoords: (target, element, offset) => ({
      top: target.top + target.height - element.height,
      left: target.left + target.width + offset,
    }),
  },
  [Position.LeftStart]: {
    main: 'horizontal',
    placement: 'before',
    align: 'start',
    oppositePosition: Position.LeftEnd,
    fallbacks: [Position.LeftEnd, Position.RightStart, Position.RightEnd],
    getCoords: (target, element, offset) => ({
      top: target.top,
      left: target.left - element.width - offset,
    }),
  },
  [Position.LeftEnd]: {
    main: 'horizontal',
    placement: 'before',
    align: 'end',
    oppositePosition: Position.RightEnd,
    fallbacks: [Position.RightEnd, Position.LeftStart, Position.RightStart],
    getCoords: (target, element, offset) => ({
      top: target.top + target.height - element.height,
      left: target.left - element.width - offset,
    }),
  },
};

export class PopoverPositioner {
  private offset: number;
  private sideOffset: number;
  private elementRect!: Rect;

  constructor(
    private config: PopoverUtilConfig,
    private windowDimensions: { width: number; height: number },
    private scrollWidth: number = 0,
  ) {
    this.offset = this.config.offset || 5;
    this.sideOffset = this.config.sideOffset || 0;
  }

  public calculatePosition(): PositionResult {
    const targetRect = this.getTargetRect();
    this.elementRect = this.getElementRect();

    // Get initial position or use bottom as default
    const initialPosition = (this.config.position as Position) || Position.Bottom;

    // Find best position
    const bestPosition = this.findBestPosition(initialPosition, targetRect);

    // Generate and finalize coordinates
    const coords = POSITION_META[bestPosition].getCoords(targetRect, this.elementRect, this.offset);
    return this.finalizePosition(coords, bestPosition, targetRect);
  }

  private getTargetRect(): Rect {
    if (this.config.client) {
      const { x, y, w, h } = this.config.client;
      return { top: y, left: x, width: w, height: h };
    }
    return this.config.target.getBoundingClientRect();
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

  private findBestPosition(initialPosition: Position, targetRect: Rect): Position {
    // If the initial position works, use it
    if (!this.positionOverflows(initialPosition, targetRect)) {
      return initialPosition;
    }

    // Get available space in each direction
    const space = this.getAvailableSpace(targetRect);

    // Special handling for simple cases (e.g., choosing between top and bottom based on space)
    const meta = POSITION_META[initialPosition];

    // 1. Try the opposite position on the same axis (e.g., bottom for top)
    const opposite = meta.oppositePosition;
    if (!this.positionOverflows(opposite, targetRect)) {
      return opposite;
    }

    // 2. For vertical positions, prefer the side with more space
    if (meta.main === 'vertical') {
      const preferredVertical = space.top > space.bottom ? Position.Top : Position.Bottom;
      if (!this.positionOverflows(preferredVertical, targetRect)) {
        return preferredVertical;
      }
    }

    // 3. For horizontal positions, prefer the side with more space
    if (meta.main === 'horizontal') {
      const preferredHorizontal = space.left > space.right ? Position.Left : Position.Right;
      if (!this.positionOverflows(preferredHorizontal, targetRect)) {
        return preferredHorizontal;
      }
    }

    // 4. Try fallbacks in order
    for (const fallback of meta.fallbacks) {
      if (!this.positionOverflows(fallback, targetRect)) {
        return fallback;
      }
    }

    // 5. If all positions have issues, find the one with the best fit
    return this.getPositionWithLeastOverflow(initialPosition, targetRect);
  }

  private getAvailableSpace(targetRect: Rect): {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } {
    return {
      top: targetRect.top,
      right: this.windowDimensions.width - (targetRect.left + targetRect.width),
      bottom: this.windowDimensions.height - (targetRect.top + targetRect.height),
      left: targetRect.left,
    };
  }

  private positionOverflows(position: Position, targetRect: Rect): boolean {
    const meta = POSITION_META[position];
    const element = this.elementRect;
    const coords = meta.getCoords(targetRect, element, this.offset);
    const { width: windowWidth, height: windowHeight } = this.windowDimensions;

    // Check boundaries
    return (
      coords.left < 0 ||
      coords.left + element.width > windowWidth ||
      coords.top < 0 ||
      coords.top + element.height > windowHeight
    );
  }

  private getOverflowAmount(position: Position, targetRect: Rect): number {
    const meta = POSITION_META[position];
    const element = this.elementRect;
    const coords = meta.getCoords(targetRect, element, this.offset);
    const { width: windowWidth, height: windowHeight } = this.windowDimensions;

    let amount = 0;

    // Calculate overflow for each edge
    if (coords.left < 0) amount += Math.abs(coords.left);
    if (coords.left + element.width > windowWidth)
      amount += coords.left + element.width - windowWidth;
    if (coords.top < 0) amount += Math.abs(coords.top);
    if (coords.top + element.height > windowHeight)
      amount += coords.top + element.height - windowHeight;

    return amount;
  }

  private getPositionWithLeastOverflow(initialPosition: Position, targetRect: Rect): Position {
    const positionsToCheck = [initialPosition, ...POSITION_META[initialPosition].fallbacks];

    let bestPosition = initialPosition;
    let leastOverflow = this.getOverflowAmount(initialPosition, targetRect);

    for (const position of positionsToCheck) {
      const overflow = this.getOverflowAmount(position, targetRect);
      if (overflow < leastOverflow) {
        leastOverflow = overflow;
        bestPosition = position;
      }
    }

    return bestPosition;
  }

  private finalizePosition(
    coords: { top: number; left: number },
    position: Position,
    targetRect: Rect,
  ): PositionResult {
    const { top, left } = coords;
    const element = this.elementRect;
    const { width: windowWidth, height: windowHeight } = this.windowDimensions;
    const meta = POSITION_META[position];

    // Calculate max dimensions
    let maxHeight: number | undefined;
    let maxWidth: number | undefined;

    // Set maxHeight if needed
    if (top - this.sideOffset < 0) {
      maxHeight = element.height + top - this.sideOffset;
    } else if (top + element.height + this.sideOffset > windowHeight) {
      maxHeight = element.height - (top + element.height + this.sideOffset - windowHeight);
    }

    // Set maxWidth if needed
    if (left + element.width + this.sideOffset > windowWidth) {
      maxWidth = windowWidth - left - this.sideOffset;
    }

    // Add sideOffset to maxHeight and maxWidth because the sideOffset is used for the maxHeight and maxWidth
    const h = maxHeight ? maxHeight + this.sideOffset : element.height;
    const w = maxWidth ? maxWidth + this.sideOffset : element.width;

    // Calculate adjusted coordinates
    let adjustedTop: number | undefined = Math.max(0, Math.min(top, windowHeight - h));
    let adjustedLeft = Math.max(0, Math.min(left, windowWidth - w));

    // Calculate bottom and right (for RTL support)
    let bottom: number | undefined;
    let right: number | undefined;

    // Set bottom if appropriate
    if (meta.main === 'vertical' && meta.placement === 'before') {
      bottom = windowHeight - (adjustedTop + h);
      adjustedTop = undefined;
    }

    // Set right if appropriate
    if (adjustedLeft + w > windowWidth) {
      adjustedLeft = 0;
      right = 0;
    } else if (
      meta.align === 'end' ||
      (meta.main === 'horizontal' && meta.placement === 'before')
    ) {
      right = windowWidth - (adjustedLeft + w) - this.scrollWidth;
    }

    return {
      top: adjustedTop,
      left: right !== undefined ? undefined : adjustedLeft,
      bottom,
      right,
      position,
      maxHeight: maxHeight && maxHeight > 0 ? maxHeight : undefined,
      maxWidth: maxWidth && maxWidth > 0 ? maxWidth : undefined,
    };
  }
}

// Main function to use the class
export function tooltipPosition(
  config: PopoverUtilConfig,
  windowDimensions = { width: window.innerWidth, height: window.innerHeight },
  scrollWidth = window.innerWidth - document.documentElement.clientWidth,
): PositionResult {
  const positioner = new PopoverPositioner(config, windowDimensions, scrollWidth);
  return positioner.calculatePosition();
}
