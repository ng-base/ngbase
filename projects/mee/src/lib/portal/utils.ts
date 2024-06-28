// create a function which accepts target element and host element.
// we need to calculate the position of the tooltip based on the target element.
// we need to check whether the tooltip is overflowing the viewport on top or bottom
// if so, we need to adjust the top position
// if the tooltip is overflowing the viewport on left or right
// we need to adjust the left position
// we need to prioritize the position of the tooltip based on the priority
// we need to update the values directly instead of signal to avoid too many CD checks

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

interface ConfigObj {
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
}

export function tooltipPosition(config: OverlayConfig): {
  top: number;
  left: number;
  bottom: number;
  right?: number;
  position: DialogPosition;
} {
  const { target, el, position: priority = 'bottom', offset = 5, client: clientXY = null } = config;
  // eslint-disable-next-line prefer-const
  let position: DialogPosition = priority;
  let { top, left, width, height } = target.getBoundingClientRect();
  if (clientXY) {
    top = clientXY.y;
    left = clientXY.x;
    width = clientXY.w;
    height = clientXY.h;
  }
  const { clientWidth: elWidth, clientHeight: elHeight } = el!;

  // we need to check whether the height of the target element is greater than the height then we need to adjust the height
  if (height > window.innerHeight) {
    height = window.innerHeight - top;
  }

  return tooltipPositionInternal({
    top,
    left,
    width,
    height,
    elWidth,
    elHeight,
    offset,
    priority,
    position,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  });
}

export function tooltipPositionInternal(data: ConfigObj): {
  top: number;
  bottom: number;
  left: number;
  right?: number;
  position: DialogPosition;
} {
  // console.log(structuredClone(data));
  // eslint-disable-next-line prefer-const
  let { elHeight, position, windowHeight, windowWidth, offset, elWidth } = data;

  position = positionSwapBasedOnOverflow(data);

  // if the tooltip is overflowing the viewport, we need to swap the position
  // if the tooltip is still overflowing the viewport, we need to swap the position again

  // let topPos = top;
  // let leftPos = left;
  // // let bottomPos = 0;
  // // let rightPos = 0;

  // if (position.includes('top')) {
  //   topPos = top - elHeight - offset;
  //   leftPos = left + (width - elWidth) / 2;
  // } else if (position.includes('bottom')) {
  //   topPos = top + height + offset;
  //   leftPos = left + (width - elWidth) / 2;
  // } else if (position.includes('left')) {
  //   leftPos = left - elWidth - offset;
  // } else if (position.includes('right')) {
  //   leftPos = left + width + offset;
  // } else if (position.includes('tl')) {
  //   topPos = top - elHeight - offset;
  //   leftPos = left;
  // } else if (position.includes('tr')) {
  //   topPos = top - elHeight - offset;
  //   leftPos = left - (elWidth - width);
  // } else if (position.includes('bl')) {
  //   topPos = top + height + offset;
  //   leftPos = left;
  // } else if (position.includes('br')) {
  //   topPos = top + height + offset;
  //   leftPos = left - (elWidth - width);
  // } else {
  //   topPos = top - elHeight - offset;
  // }

  let { top: topPos, left: leftPos } = getTooltipCoordinates(position, data);
  let rightPos: number | undefined;

  if (topPos <= 0) {
    topPos = offset;
  } else if (topPos + elHeight > windowHeight) {
    topPos = windowHeight - elHeight - offset;
  } else if (leftPos < 0) {
    leftPos = 0;
  } else if (leftPos + elWidth > windowWidth) {
    rightPos = 0;
    leftPos = 0;
  }

  // eslint-disable-next-line prefer-const
  let bottomPos = position.startsWith('t') ? windowHeight - (topPos + elHeight) : 0;

  return {
    top: topPos,
    bottom: bottomPos,
    left: leftPos,
    position,
    right: rightPos,
  };
}

function getTooltipCoordinates(
  position: DialogPosition,
  data: ConfigObj,
): { top: number; left: number } {
  const { top, left, width, height, elWidth, elHeight, offset } = data;
  switch (position) {
    case 'top':
      return {
        top: top - elHeight - offset,
        left: left + (width - elWidth) / 2,
      };
    case 'bottom':
      return { top: top + height + offset, left: left + (width - elWidth) / 2 };
    case 'left':
      return { top, left: left - elWidth - offset };
    case 'right':
      return { top, left: left + width + offset };
    case 'tl':
      return { top: top - elHeight - offset, left };
    case 'tr':
      return { top: top - elHeight - offset, left: left - (elWidth - width) };
    case 'bl':
      return { top: top + height + offset, left };
    case 'br':
      return { top: top + height + offset, left: left - (elWidth - width) };
    default:
      return {
        top: top - elHeight - offset,
        left: left + (width - elWidth) / 2,
      };
  }
}

// function to check the overflow sides for target and element
export function checkOverflow(data: ConfigObj) {
  const isTop = data.top - data.elHeight < 0;
  const isBottom = data.top + data.height + data.elHeight > data.windowHeight;
  const isLeft = data.left - data.elWidth < 0;
  const isRight = data.left + data.width + data.elWidth > data.windowWidth;

  return { top: isTop, bottom: isBottom, left: isLeft, right: isRight };
}

// position swap based on the overflow and priority
function positionSwapBasedOnOverflow(data: ConfigObj): DialogPosition {
  const {
    bottom: bottomOverflow,
    left: leftOverflow,
    right: rightOverflow,
    top: topOverflow,
  } = checkOverflow(data);
  const { priority } = data;

  let position = priority;
  if (topOverflow) {
    if (position.includes('top')) {
      position = positionSwap[position];
    }
  }
  if (bottomOverflow) {
    if (position.includes('bottom')) {
      position = positionSwap[position];
    } else if (position.includes('bl')) {
      position = rightOverflow ? 'tr' : 'tl';
    }
  }
  if (leftOverflow) {
    if (position.includes('left')) {
      position = positionSwap[position];
    }
  }
  if (rightOverflow) {
    if (position.includes('right')) {
      position = !leftOverflow
        ? 'left'
        : bottomOverflow && !leftOverflow
          ? positionSwap[position]
          : leftOverflow && bottomOverflow
            ? 'top'
            : 'br';
    } else if (position.includes('bl')) {
      position = bottomOverflow ? 'tr' : 'br';
    }
  }

  // console.log(position);

  return position;
}
