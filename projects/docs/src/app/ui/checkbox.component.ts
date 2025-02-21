import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Checkbox } from '@meeui/ui/checkbox';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-checkbox',
  imports: [Heading, Checkbox, FormsModule, DocCode],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="checkboxPage">Checkbox</h4>
    <app-doc-code [tsCode]="tsCode" [adkCode]="adkCode">
      <div>
        <mee-checkbox class="w-full" [(ngModel)]="checkBox" [indeterminate]="indeterminate()">
          Check the UI
        </mee-checkbox>
        <mee-checkbox [(ngModel)]="indeterminate" />
      </div>
      <mee-checkbox class="w-full">Check the UI</mee-checkbox>
      <mee-checkbox class="w-full" [checked]="true" [disabled]="true">Check the UI</mee-checkbox>
    </app-doc-code>
  `,
})
export default class CheckboxComponent {
  checkBox = false;
  indeterminate = signal(false);

  tsCode = `
  import { Component } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { Checkbox } from '@meeui/ui/checkbox';

  @Component({
    selector: 'app-root',
    template: \`<mee-checkbox [(ngModel)]="checkBox">Check the UI</mee-checkbox>\`,
    imports: [Checkbox, FormsModule],
  })
  export class AppComponent {
    checkBox = false;
  }
  `;

  adkCode = `
  import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { FocusStyle } from './focus-style.directive';
  import { CheckboxButton, MeeCheckbox } from '@ngbase/adk/checkbox';

  @Component({
    selector: 'mee-checkbox',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [
      {
        directive: MeeCheckbox,
        inputs: ['disabled', 'checked', 'indeterminate'],
        outputs: ['checkedChange', 'change'],
      },
    ],
    imports: [FormsModule, FocusStyle, CheckboxButton],
    template: \`
      <button
        meeFocusStyle
        meeCheckboxButton
        class="custom-checkbox relative flex h-b4 w-b4 flex-none items-center justify-center rounded border border-primary transition-colors"
        [class]="checkbox.disabled() ? '!border-muted bg-muted' : path() ? 'bg-primary' : ''"
      >
        @if (path(); as d) {
          <svg class="h-full w-full text-foreground" viewBox="0 0 24 24" aria-hidden="true">
            <path [attr.d]="d" stroke="currentColor" stroke-width="2" fill="none" />
          </svg>
        }
      </button>
      <ng-content />
    \`,
    host: {
      class: 'inline-flex items-center gap-b2 py-1 disabled:opacity-60 disabled:cursor-not-allowed',
    },
  })
  export class Checkbox {
    readonly checkbox = inject(MeeCheckbox);

    readonly path = computed(() =>
      this.checkbox.indeterminate()
        ? 'M6 12L18 12'
        : this.checkbox.checked()
          ? 'M20 6L9 17L4 12'
          : '',
    );
  }
    
`;
}
