import { Injectable } from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import {
  distinctUntilKeyChanged,
  filter,
  finalize,
  map,
  share,
  tap,
} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class Keys {
  private keyup$ = fromEvent<KeyboardEvent>(document, 'keyup');
  private keydown$ = fromEvent<KeyboardEvent>(document, 'keydown');
  private keypress$ = merge(this.keyup$, this.keydown$).pipe(
    tap((ev) => {
      if (ev.type === 'keyup') {
        this.keys.delete(ev.key);
      } else {
        this.keys.add(ev.key);
      }
      this.lastEvent = ev;
    }),
    finalize(() => {
      // we have to clear the keys when there is no subscriber
      // because keyup is not considered on last unsubscribe
      this.keys.clear();
    }),
    share(),
  );

  lastEvent?: KeyboardEvent;

  private keys = new Set<string>();

  event(keyCombination: string) {
    keyCombination = [
      ['ctrl', 'Control'],
      ['esc', 'Escape'],
    ].reduce((a, [b, B]) => a.replace(b, B), keyCombination);
    const keys = keyCombination.split('+');
    let isFirstTrueValue = false;

    return this.keypress$.pipe(
      map<KeyboardEvent, [boolean, KeyboardEvent]>((evnt) => {
        // make sure key combination and number of keys should be same
        const isLengthSame = this.keys.size === keys.length;
        // check all the keys are matching
        const isAllKeysSame = [...this.keys].every((k) => keys.includes(k));
        const active = isLengthSame && isAllKeysSame;

        isFirstTrueValue = isFirstTrueValue || active;
        return [active, evnt];
      }),
      filter(() => isFirstTrueValue), //skipValues until positive value comes
      distinctUntilKeyChanged(0), // avoid duplicate values emitting
    );
  }

  isKey(key: string) {
    return this.keys.has(key);
  }
}
