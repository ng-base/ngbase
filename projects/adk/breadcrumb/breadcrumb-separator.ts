import { Directive } from '@angular/core';
import { injectDirectionality } from '@meeui/adk/bidi';

@Directive({
  selector: '[meeBreadcrumbSeparatorAria]',
  host: {
    tabindex: '-1',
    'aria-hidden': 'true',
    role: 'presentation',
    '[style.transform]': 'dir.isRtl() ? "rotate(180deg)" : ""',
  },
})
export class MeeBreadcrumbSeparatorAria {
  readonly dir = injectDirectionality();
}

@Directive({
  selector: '[meeBreadcrumbsSeparator]',
})
export class MeeBreadcrumbSeparator {}
