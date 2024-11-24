import { ComponentRef, inject, Injectable } from '@angular/core';
import { basePortal, DialogRef } from '@meeui/adk/portal';
import { Sonner, SonnerData, SonnerType } from './sonner';

@Injectable({ providedIn: 'root' })
export class SonnerService {
  private NAME = 'sonner';
  private base = basePortal(this.NAME, Sonner);
  private sonner: { parent: ComponentRef<Sonner>; diaRef: DialogRef<Sonner> } | undefined;

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

export function sonnerPortal() {
  const sonnerService = inject(SonnerService);

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
