import { Injectable } from '@angular/core';
import { DialogRef } from '../portal';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private currentRef: DialogRef<any> | null = null;

  close() {
    this.currentRef?.close();
    this.currentRef = null;
  }

  setCurrentRef(ref: DialogRef<any>) {
    this.close();
    this.currentRef = ref;
  }
}
