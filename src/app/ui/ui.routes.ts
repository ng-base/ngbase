import { Route, Routes } from '@angular/router';
import { BaseComponent } from './base.component';
import { AccordionComponent } from './accordion.component';
import { TableComponent } from './table.component';
import { SpinnerComponent } from './spinner.component';
import { OtpComponent } from './otp.component';
import { TabsComponent } from './tabs.component';
import { ResizableComponent } from './resizable.component';
import { ContextMenuComponent } from './context-menu.component';
import { ButtonsComponent } from './buttons.component';
import { ProgressComponent } from './progress.component';
import { AvatarComponent } from './avatar.component';
import { MenuComponent } from './menu.component';
import { PopoverComponent } from './popover.component';
import { HoverCardComponent } from './hover-card.component';
import { SonnerComponent } from './sonner.component';
import { DatepickerComponent } from './datepicker.component';
import { AutocompleteComponent } from './autocomplete.component';
import { SelectComponent } from './select.component';
import { SliderComponent } from './slider.component';
import { TooltipComponent } from './tooltip.component';
import { RadioComponent } from './radio.component';
import { BreadcrumbComponent } from './breadcrumb.component';
import { CheckboxComponent } from './checkbox.component';
import { PaginationComponent } from './pagination.component';
import { TypographyComponent } from './typography.component';
import { ToggleComponent } from './toggle.component';
import { ToggleGroupComponent } from './toggle-group.component';
import { AlertDialogComponent } from './alert-dialog.component';
import { ScrollAreaComponent } from './scroll-area.component';
import { ColorPickerComponent } from './color-picker.component';
import { CalendarComponent } from './calendar.component';
import { DialogComponent } from './dialog.component';
import { DrawerComponent } from './drawer.component';
import { InputComponent } from './input.component';
import { SwitchComponent } from './switch.component';
import { MentionComponent } from './mention.component';
import { TourComponent } from './tour.component';
import { PopoverDemoComponent } from './popover-demo.component';
import { NavigationMenuComponent } from './navigation-menu.component';
import { SidenavComponent } from './sidenav.component';
import { CarouselComponent } from './carousel.component';
import { BadgeComponent } from './badge.component';
import { ChipComponent } from './chip.component';
import { TreeComponent } from './tree.component';
import { StepperComponent } from './stepper.component';
import { PicasaComponent } from './picasa.component';
import { SheetComponent } from './sheet.component';
import { FormsComponent } from './forms.component';

export const UI_ROUTES: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      { path: 'accordion', component: AccordionComponent },
      { path: 'table', component: TableComponent },
      { path: 'spinner', component: SpinnerComponent },
      { path: 'otp', component: OtpComponent },
      { path: 'tabs', component: TabsComponent },
      { path: 'resizable', component: ResizableComponent },
      { path: 'context-menu', component: ContextMenuComponent },
      { path: 'buttons', component: ButtonsComponent },
      { path: 'progress', component: ProgressComponent },
      { path: 'avatar', component: AvatarComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'popover', component: PopoverComponent },
      { path: 'hover-card', component: HoverCardComponent },
      { path: 'sonner', component: SonnerComponent },
      { path: 'datepicker', component: DatepickerComponent },
      { path: 'autocomplete', component: AutocompleteComponent },
      { path: 'select', component: SelectComponent },
      { path: 'slider', component: SliderComponent },
      { path: 'tooltip', component: TooltipComponent },
      { path: 'radio', component: RadioComponent },
      { path: 'breadcrumbs', component: BreadcrumbComponent },
      { path: 'checkbox', component: CheckboxComponent },
      { path: 'pagination', component: PaginationComponent },
      { path: 'typography', component: TypographyComponent },
      { path: 'toggle', component: ToggleComponent },
      { path: 'toggle-group', component: ToggleGroupComponent },
      { path: 'alert-dialog', component: AlertDialogComponent },
      { path: 'scroll-area', component: ScrollAreaComponent },
      { path: 'color-picker', component: ColorPickerComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'dialog', component: DialogComponent },
      { path: 'drawer', component: DrawerComponent },
      { path: 'input', component: InputComponent },
      { path: 'switch', component: SwitchComponent },
      { path: 'mention', component: MentionComponent },
      { path: 'tour', component: TourComponent },
      { path: 'navigation-menu', component: NavigationMenuComponent },
      { path: 'sidenav', component: SidenavComponent },
      { path: 'carousel', component: CarouselComponent },
      { path: 'badge', component: BadgeComponent },
      { path: 'chip', component: ChipComponent },
      { path: 'tree', component: TreeComponent },
      { path: 'stepper', component: StepperComponent },
      { path: 'picasa', component: PicasaComponent },
      { path: 'sheet', component: SheetComponent },
      { path: 'forms', component: FormsComponent },
      { path: '', redirectTo: 'accordion', pathMatch: 'full' },
    ],
  },
  {
    path: 'popover-demo',
    component: PopoverDemoComponent,
  },
];
