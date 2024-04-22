/*
 * Public API Surface of portal
 */

export * from './lib/portal.service';
export * from './lib/portal.component';
export {
  DialogRef,
  DialogOptions,
  DIALOG_INJ,
  createInj,
  BaseDialogComponent,
  DialogPosition,
} from './lib/dialog-ref';
export { tooltipPosition } from './lib/utils';
export * from './lib/dialog-close.directive';
export * from './lib/container.component';
export * from './lib/portal-base.service';
