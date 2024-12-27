import { Directive } from '@angular/core';
import { MeeList, MeeListActionGroup, provideList } from '@meeui/adk/list';

@Directive({
  selector: '[meeListStyle]',
  host: {
    class:
      'flex items-center gap-b2 py-b2 px-b2 hover:bg-muted-background cursor-pointer rounded-md text-left data-[focus="true"]:bg-muted-background',
  },
})
export class ListStyle {}

@Directive({
  selector: '[meeList]',
  hostDirectives: [ListStyle],
  providers: [provideList(List)],
  host: {
    role: 'list',
    '[class]': 'disabled() ? "pointer-events-none cursor-not-allowed opacity-50" : ""',
  },
})
export class List extends MeeList {}

@Directive({
  selector: '[meeActionGroup]',
  hostDirectives: [MeeListActionGroup],
})
export class ListActionGroup {}
