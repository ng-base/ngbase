import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DomObserverService {
  private observer?: MutationObserver;

  observeElement(
    targetNode: Node,
    config: MutationObserverInit = { childList: true, subtree: true },
  ): Observable<MutationRecord[]> {
    return new Observable<MutationRecord[]>(observer => {
      this.observer = new MutationObserver(mutations => {
        observer.next(mutations);
      });

      this.observer.observe(targetNode, config);

      return () => {
        this.observer?.disconnect();
      };
    });
  }

  isElementPresent(selector: string): boolean {
    return !!document.querySelector(selector);
  }
}
