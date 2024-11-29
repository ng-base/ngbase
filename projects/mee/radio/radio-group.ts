import { Component } from '@angular/core';
import { MeeRadioGroup } from '@meeui/adk/radio';

@Component({
  selector: 'mee-radio-group',
  hostDirectives: [{ directive: MeeRadioGroup, inputs: ['value'], outputs: ['valueChange'] }],
  template: `<ng-content />`,
  host: {
    class: 'flex gap-b2',
  },
})
export class RadioGroup {}
