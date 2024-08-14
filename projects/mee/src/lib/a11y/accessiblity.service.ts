import { Injectable, signal } from '@angular/core';
import { AccessibleItem } from './accessiblity-item.directive';
import { AccessibleGroup } from './accessiblity-group.directive';

@Injectable({ providedIn: 'root' })
export class AccessiblityService {
  elements = signal(new Map<string, AccessibleItem[]>());
  groups = signal(new Map<string, AccessibleGroup>());

  register(key: string, element: AccessibleItem) {
    this.elements.update(x => {
      const elements = x.get(key) || [];
      return new Map([...x, [key, [...elements, element]]]);
    });
  }

  unregister(key: string, element: AccessibleItem) {
    this.elements.update(x => {
      const elements = x.get(key) || [];
      return new Map([...x, [key, elements.filter(el => el !== element)]]);
    });
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
}
