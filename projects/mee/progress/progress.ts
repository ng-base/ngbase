import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbProgress, NgbProgressBar } from '@ngbase/adk/progress';

@Component({
  selector: 'mee-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: NgbProgress, inputs: ['value'] }],
  imports: [NgbProgressBar],
  template: `<div class="h-full bg-primary transition" ngbProgressBar></div>`,
  host: {
    class: 'block h-b2 my-1 bg-muted-background rounded-full',
  },
})
export class Progress {}
