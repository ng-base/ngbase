import { Injectable, signal } from '@angular/core';
import { AccessibleItem } from './accessiblity-item.directive';
import { AccessibleGroup } from './accessiblity-group.directive';

@Injectable({ providedIn: 'root' })
export class AccessiblityService {
  readonly elements = signal(new Map<string, AccessibleItem[]>());
  readonly groups = signal(new Map<string, AccessibleGroup>());
  private activeGroupOrder: string[] = [];

  register(key: string, element: AccessibleItem) {
    this.elements.update(x => {
      const elements = x.get(key) || [];
      return new Map([...x, [key, [...elements, element]]]);
    });
    // console.log('register', key);
  }

  setActiveGroup(id: string) {
    this.activeGroupOrder.push(id);
  }

  removeActiveGroup(id: string) {
    this.activeGroupOrder = this.activeGroupOrder.filter(g => g !== id);
    // console.log('removeGroup', id, this.activeGroupOrder);
  }

  isActive(key: string) {
    return this.activeGroupOrder[this.activeGroupOrder.length - 1] === key;
  }

  getPreviousGroup() {
    const id = this.activeGroupOrder[this.activeGroupOrder.length - 2];
    return this.groups().get(id);
  }

  unregister(key: string, element: AccessibleItem) {
    this.elements.update(x => {
      const elements = x.get(key) || [];
      return new Map([...x, [key, elements.filter(el => el !== element)]]);
    });
    // console.log('unregister', key);
  }

  items(key: string) {
    const els = this.elements();
    return els.get(key) || [];
  }

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
