import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocCode, getCode } from '../code.component';
import { Heading } from '@meeui/ui/typography';

@Component({
  selector: 'app-test',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocCode, Heading],
  template: ` <h4 meeHeader="sm" class="mb-5">Test</h4>
    <app-doc-code
      [tsCode]="tsCode()"
      [adkCode]="adkCode"
      [referencesCode]="referencesCode()"
      hidePreview
    />`,
})
export default class TestComponent {
  tsCode = getCode('/test/test-usage.ts');
  adkCode = '';
  referencesCode = getCode('/test/test-adk.ts');
}
