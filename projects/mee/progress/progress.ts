import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeProgress, MeeProgressBar } from '@meeui/adk/progress';

@Component({
  selector: 'mee-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: MeeProgress, inputs: ['value'] }],
  imports: [MeeProgressBar],
  template: `<div class="h-full bg-primary transition" meeProgressBar></div>`,
  host: {
    class: 'block h-b2 my-1 bg-muted-background rounded-full',
  },
})
export class Progress {}
