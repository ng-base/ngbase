import { ComponentRef, inject, Injectable, Type } from '@angular/core';
import { basePortal, DialogRef } from '@meeui/adk/portal';
import { MeeSonner, SonnerData, SonnerType } from './sonner';

@Injectable({ providedIn: 'root' })
export class SonnerService {
  private NAME = 'sonner';
  private base = basePortal(this.NAME, MeeSonner);
  private sonner: { parent: ComponentRef<MeeSonner>; diaRef: DialogRef<MeeSonner> } | undefined;

  updateSonner(component: Type<MeeSonner> = MeeSonner) {
    this.base.updateBaseComponent(component);
  }

  addMessage(message: string, type: SonnerType, data?: SonnerData) {
    if (!this.sonner) {
      const { parent, diaRef } = this.base.open();
      this.sonner = { parent, diaRef };
    }
    this.sonner.parent.instance.addMessage(message, type, data);
  }

  closeAll() {
    this.sonner?.parent.instance.clear();
  }
}

export function meeSonnerPortal(component?: Type<MeeSonner>) {
  const sonnerService = inject(SonnerService);

  sonnerService.updateSonner(component);

  function closeAll() {
    sonnerService.closeAll();
  }

  function message(message: string, data?: SonnerData) {
    sonnerService.addMessage(message, 'default', data);
  }

  function success(message: string, data?: SonnerData) {
    sonnerService.addMessage(message, 'success', data);
  }

  function error(message: string, data?: SonnerData) {
    sonnerService.addMessage(message, 'error', data);
  }

  function warning(message: string, data?: SonnerData) {
    sonnerService.addMessage(message, 'warning', data);
  }

  function info(message: string, data?: SonnerData) {
    sonnerService.addMessage(message, 'info', data);
  }

  return { message, success, error, warning, info, closeAll };
}
