import { Directive } from '@angular/core';
import { MeeMentionTrigger } from '@meeui/adk/menu';

@Directive({
  selector: '[meeMentionTrigger]',
  hostDirectives: [
    {
      directive: MeeMentionTrigger,
      inputs: ['meeMentionTrigger', 'key', 'options'],
      outputs: ['search'],
    },
  ],
})
export class MentionTrigger {}
