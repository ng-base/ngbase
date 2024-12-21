import { Component, OnInit } from '@angular/core';
import { Button } from '@meeui/ui/button';
import { Heading } from '@meeui/ui/typography';

@Component({
  selector: 'app-buttons',
  imports: [Button, Heading],
  template: `
    <h4 meeHeader class="mb-5" id="buttonPage">Button</h4>

    <button meeButton class="mr-2">Primary</button>
    <button meeButton="secondary" class="mr-2">Outline</button>
    <button meeButton="outline" class="mr-2">Outline</button>
    <button meeButton="ghost" class="mr-2">Outline</button>

    <h4 class="mt-5">Disabled Button</h4>
    <button meeButton disabled class="mr-2">Primary</button>
    <button meeButton="secondary" disabled class="mr-2">Outline</button>
    <button meeButton="outline" disabled class="mr-2">Outline</button>
    <button meeButton="ghost" disabled class="mr-2">Outline</button>

    <h4 class="mt-5">Small Button</h4>
    <button meeButton class="small mr-2">Primary</button>
    <button meeButton="secondary" class="small mr-2">Outline</button>
    <button meeButton="outline" class="small mr-2">Outline</button>
    <button meeButton="ghost" class="small mr-2">Outline</button>
  `,
})
export default class ButtonsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
