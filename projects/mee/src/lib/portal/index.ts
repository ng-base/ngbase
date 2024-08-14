/*
 * Public API Surface of portal
 */

export * from './portal.service';
export * from './portal.component';
export {
  DialogRef,
  DialogOptions,
  DIALOG_INJ,
  createInj,
  BaseDialog,
  DialogPosition,
} from './dialog-ref';
export { tooltipPosition } from './utils';
export * from './dialog-close.directive';
export * from './portal-base.service';
