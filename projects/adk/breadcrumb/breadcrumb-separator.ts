import { Directive } from '@angular/core';
import { injectDirectionality } from '@ngbase/adk/bidi';

@Directive({
  selector: '[ngbBreadcrumbSeparatorAria]',
  host: {
    tabindex: '-1',
    'aria-hidden': 'true',
    role: 'presentation',
    '[style.transform]': 'dir.isRtl() ? "rotate(180deg)" : ""',
  },
})
export class NgbBreadcrumbSeparatorAria {
  readonly dir = injectDirectionality();
}

@Directive({
  selector: '[ngbBreadcrumbsSeparator]',
})
export class NgbBreadcrumbSeparator {}
