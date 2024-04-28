import { Injectable, signal } from '@angular/core';

@Injectable()
export class AccordionService {
  active = signal('');

  constructor() {}
}
