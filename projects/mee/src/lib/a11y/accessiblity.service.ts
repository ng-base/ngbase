import { inject, Injectable, signal } from '@angular/core';
import { AccessibleItem } from './accessiblity-item.directive';
import { AccessibleGroup } from './accessiblity-group.directive';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AccessiblityService {
  private readonly document = inject(DOCUMENT);
  // readonly elements = signal(new Map<string, AccessibleItem[]>());
  readonly groups = signal(new Map<string, AccessibleGroup>());
  private activeGroupOrder: string[] = [];
  usingMouse = false;

  constructor() {
    this.document.addEventListener(
      'keydown',
      () => {
        this.usingMouse = false;
      },
      { capture: true },
    );

    this.document.addEventListener(
      'mousedown',
      () => {
        this.usingMouse = true;
      },
      { capture: true },
    );

    this.document.addEventListener(
      'mousemove',
      () => {
        this.usingMouse = true;
      },
      { capture: true },
    );
  }

  // register(key: string, element: AccessibleItem) {
  //   this.elements.update(x => {
  //     const elements = x.get(key) || [];
  //     return new Map([...x, [key, [...elements, element]]]);
  //   });
  // }

  setActiveGroup(id: string) {
    // remove id from activeGroupOrder
    const index = this.activeGroupOrder.indexOf(id);
    if (index !== -1) {
      this.activeGroupOrder.splice(index, 1);
    }
    this.activeGroupOrder.push(id);
  }

  removeActiveGroup(id: string) {
    this.activeGroupOrder = this.activeGroupOrder.filter(g => g !== id);
  }

  isActive(key: string) {
    return this.activeGroupOrder[this.activeGroupOrder.length - 1] === key;
  }

  getPreviousGroup() {
    const id = this.activeGroupOrder[this.activeGroupOrder.length - 2];
    return this.groups().get(id);
  }

  // unregister(key: string, element: AccessibleItem) {
  //   this.elements.update(x => {
  //     const elements = x.get(key) || [];
  //     return new Map([...x, [key, elements.filter(el => el !== element)]]);
  //   });
  // }

  // items(key: string) {
  //   const els = this.elements();
  //   return els.get(key) || [];
  // }

  getGroup(key: string) {
    return this.groups().get(key);
  }

  addGroup(key: string, group: AccessibleGroup) {
    this.groups.update(x => new Map([...x, [key, group]]));
  }

  removeGroup(key: string) {
    this.groups.update(x => {
      x.delete(key);
      return new Map(x);
    });
    this.removeActiveGroup(key);
  }
}
