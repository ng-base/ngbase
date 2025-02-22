import { Directive } from '@angular/core';
import { NgbSelectInput, NgbSelectTrigger } from '@ngbase/adk/select';
import { InputStyle } from '@meeui/ui/form-field';

@Directive({
  selector: '[meeSelectInput]',
  hostDirectives: [
    { directive: NgbSelectInput, inputs: ['placeholder', 'options', 'filterFn'] },
    InputStyle,
  ],
  host: {
    class: 'w-full !m-0 mb-1 !ring-0 !border-0 !border-b rounded-none px-3 z-10',
  },
})
export class SelectInput<T> {}

@Directive({
  selector: '[meeSelectTrigger]',
  hostDirectives: [NgbSelectTrigger],
})
export class SelectTrigger {}
