import { Directive } from '@angular/core';
import { NgbList, NgbListActionGroup, provideList } from '@ngbase/adk/list';
import { ɵFocusStyle as FocusStyle } from '@meeui/ui/checkbox';

@Directive({
  selector: '[meeListStyle]',
  host: {
    class:
      'flex items-center gap-2 py-2 px-2 hover:bg-accent cursor-pointer rounded-md text-left data-[focus="true"]:bg-accent',
  },
})
export class ListStyle {}

@Directive({
  selector: '[meeList]',
  hostDirectives: [ListStyle, FocusStyle],
  providers: [provideList(List)],
  host: {
    role: 'list',
    '[class]': 'disabled() ? "pointer-events-none cursor-not-allowed opacity-50" : ""',
  },
})
export class List extends NgbList {}

@Directive({
  selector: '[meeActionGroup]',
  hostDirectives: [NgbListActionGroup],
})
export class ListActionGroup {}
