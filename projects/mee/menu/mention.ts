import { Directive } from '@angular/core';
import { NgbMentionTrigger } from '@ngbase/adk/menu';

@Directive({
  selector: '[meeMentionTrigger]',
  hostDirectives: [
    {
      directive: NgbMentionTrigger,
      inputs: ['ngbMentionTrigger: meeMentionTrigger', 'key', 'options'],
      outputs: ['search'],
    },
  ],
})
export class MentionTrigger {}
