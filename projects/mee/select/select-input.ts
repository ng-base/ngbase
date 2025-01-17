import { Directive } from '@angular/core';
import { MeeSelectInput, MeeSelectTrigger } from '@meeui/adk/select';
import { InputStyle } from '@meeui/ui/form-field';

@Directive({
  selector: '[meeSelectInput]',
  hostDirectives: [
    { directive: MeeSelectInput, inputs: ['placeholder', 'options', 'filterFn'] },
    InputStyle,
  ],
  host: {
    class: 'w-full !m-0 mb-b !ring-0 !border-0 !border-b rounded-none px-b3 z-10',
  },
})
export class SelectInput<T> {}

@Directive({
  selector: '[meeSelectTrigger]',
  hostDirectives: [MeeSelectTrigger],
})
export class SelectTrigger {}
