import { Injectable, signal } from '@angular/core';
import { documentListener } from '@meeui/adk/utils';
import { AccessibleGroup } from './accessibility-group';

@Injectable({ providedIn: 'root' })
export class AccessibilityService {
  readonly groups = signal(new Map<string, AccessibleGroup>());
  private activeGroupOrder: string[] = [];
  usingMouse = false;

  constructor() {
    documentListener('keydown', () => (this.usingMouse = false), { capture: true });
    documentListener('mousedown', () => (this.usingMouse = true), { capture: true });
    documentListener('mousemove', () => (this.usingMouse = true), { capture: true });
  }

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
