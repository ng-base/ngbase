import { Component, computed, signal } from '@angular/core';
import { injectTranslate, Translate, translate } from '@ngbase/adk/translate';
import { RangePipe } from '@ngbase/adk/utils';
import { Button } from '@meeui/ui/button';
import { ToggleGroup, ToggleItem } from '@meeui/ui/toggle-group';
import { DocCode } from './code.component';
import { Heading } from '@meeui/ui/typography';

@Component({
  selector: 'app-translation',
  imports: [DocCode, Heading, Button, ToggleGroup, ToggleItem, RangePipe, Translate],
  template: `
    <h4 meeHeader="sm" class="mb-5">Translation</h4>
    <app-doc-code [tsCode]="tsCode">
      <button meeButton (click)="toggle()">Toggle</button>
      @if (lang()) {
        @for (i of 10 | range; track i) {
          <div>vvv: {{ ('name' | t: param())() }}</div>
        }
        <div>{{ t('name', param()) }}</div>
        <h4>Change Language: {{ translateService.currentLang() }}</h4>
        <h4>Status: {{ translateService.status() }}</h4>
        <button meeButton (click)="($event)">test</button>
        <button meeButton (click)="toggleParam()">Change Param</button>
        <mee-toggle-group multiple="false" (valueChange)="changeLang($event)">
          <button meeToggleItem value="en">English</button>
          <button meeToggleItem value="ar">Arabic</button>
          <button meeToggleItem value="fr">French</button>
        </mee-toggle-group>
      }
    </app-doc-code>
  `,
})
export default class TranslationComponent {
  readonly lang = signal(true);
  readonly t = translate();
  readonly param = signal({ value: 123 });
  readonly translateService = injectTranslate();
  // readonly num = signal(1);

  tsCode = `
  import { Translate } from '@ngbase/adk/translate';

  @Component({
    selector: 'app-root',
    imports: [Translate],
    template: \`
      <div>{{ ('name'|t)() }}</div>
      <div>{{ ('name'|t: param)() }}</div>
    \`,
  })
  class AppComponent {
    params = { value: 123 };
  }
  `;

  constructor() {
    // console.log(this.translateService.translate('name', { value: 123 }));
  }

  toggle() {
    this.lang.set(!this.lang());
  }

  changeLang(lang: string) {
    this.translateService.use(lang);
  }

  toggleParam() {
    this.param.update(p => ({ value: p.value + 1 }));
  }
}
