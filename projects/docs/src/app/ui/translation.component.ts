import { Component, computed, signal } from '@angular/core';
import { Translate, translate, injectTranslate } from '@meeui/ui/adk';
import { Button } from '@meeui/ui/button';
import { ToggleGroup, ToggleItem } from '@meeui/ui/toggle-group';
import { RangePipe } from '@meeui/ui/utils';

@Component({
  selector: 'app-translation',
  imports: [Button, ToggleGroup, ToggleItem, RangePipe, Translate],
  template: `
    <button meeButton (click)="toggle()">Toggle</button>
    @if (lang()) {
      @for (i of 10 | range; track i) {
        <div>vvv: {{ ('name' | translate: param())() }}</div>
      }
      <!-- <div>{{ translate('name', { value: 'world' })() }}</div> -->
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
  `,
})
export class TranslationComponent {
  readonly lang = signal(false);
  readonly translate = translate();
  readonly param = signal({ value: 123 });
  readonly translateService = injectTranslate();
  readonly computed = computed;

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
