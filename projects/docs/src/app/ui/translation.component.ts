import { Component, computed, signal } from '@angular/core';
import { injectTranslate, Translate, translate } from '@meeui/adk/translate';
import { RangePipe } from '@meeui/adk/utils';
import { Button } from '@meeui/ui/button';
import { ToggleGroup, ToggleItem } from '@meeui/ui/toggle-group';

@Component({
  selector: 'app-translation',
  imports: [Button, ToggleGroup, ToggleItem, RangePipe, Translate],
  template: `
    <button meeButton (click)="toggle()">Toggle</button>
    @if (lang()) {
      @for (i of 10 | range; track i) {
        <div>vvv: {{ ('name' | t)() }}</div>
      }
      <div>{{ t('name', { value: num() }) }}</div>
      <h4>Change Language: {{ translateService.currentLang() }}</h4>
      <h4>Status: {{ translateService.status() }}</h4>
      <button meeButton (click)="($event)">test</button>
      <button meeButton (click)="toggleParam()">Change Param</button>
      <mee-toggle-group multiple="false" (valueChange)="changeLang($event)">
        <button meeToggleItem value="en">English</button>
        <button meeToggleItem value="ar">Arabic</button>
        <button meeToggleItem value="fr">French</button>
      </mee-toggle-group>

      <button meeButton (click)="num.set(num() + 1)">Change Num</button>
    }
  `,
})
export default class TranslationComponent {
  readonly lang = signal(false);
  readonly t = translate();
  readonly param = signal({ value: 123 });
  readonly translateService = injectTranslate();
  readonly num = signal(1);

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
