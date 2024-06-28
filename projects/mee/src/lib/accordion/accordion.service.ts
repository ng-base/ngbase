import { Injectable, signal } from '@angular/core';

@Injectable()
export class AccordionService {
  activeId = signal('');

  constructor() {}
}
