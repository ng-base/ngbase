import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Card } from '@meeui/ui/card';
import { TourStep } from '@meeui/ui/tour';
import { timer } from 'rxjs';
import AccordionComponent from './accordion.component';
import AlertDialogComponent from './alert-dialog.component';
import AutocompleteComponent from './autocomplete.component';
import AvatarComponent from './avatar.component';
import BreadcrumbComponent from './breadcrumb.component';
import ButtonsComponent from './buttons.component';
import CalendarComponent from './calendar.component';
import CheckboxComponent from './checkbox.component';
import ColorPickerComponent from './color-picker.component';
import ContextMenuComponent from './context-menu.component';
import DatepickerComponent from './datepicker.component';
import DialogComponent from './dialog.component';
import DrawerComponent from './drawer.component';
import HoverCardComponent from './hover-card.component';
import InputComponent from './input.component';
import MentionComponent from './mention.component';
import MenuComponent from './menu.component';
import OtpComponent from './otp.component';
import PaginationComponent from './pagination.component';
import PopoverComponent from './popover.component';
import ProgressComponent from './progress.component';
import RadioComponent from './radio.component';
import ResizableComponent from './resizable.component';
import SelectComponent from './select.component';
import SheetComponent from './sheet.component';
import SliderComponent from './slider.component';
import SonnerComponent from './sonner.component';
import SwitchComponent from './switch.component';
import TabsComponent from './tabs.component';
import ToggleGroupComponent from './toggle-group.component';
import ToggleComponent from './toggle.component';
import TooltipComponent from './tooltip.component';
import TypographyComponent from './typography.component';

@Component({
  selector: 'mee-ui',
  templateUrl: 'ui.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Card,
    AccordionComponent,
    ResizableComponent,
    ContextMenuComponent,
    TabsComponent,
    OtpComponent,
    ProgressComponent,
    ButtonsComponent,
    AvatarComponent,
    MenuComponent,
    PopoverComponent,
    HoverCardComponent,
    SonnerComponent,
    CalendarComponent,
    DatepickerComponent,
    AutocompleteComponent,
    SelectComponent,
    SliderComponent,
    TooltipComponent,
    RadioComponent,
    BreadcrumbComponent,
    CheckboxComponent,
    PaginationComponent,
    TypographyComponent,
    ColorPickerComponent,
    ToggleGroupComponent,
    ToggleComponent,
    AlertDialogComponent,
    DialogComponent,
    SheetComponent,
    DrawerComponent,
    SwitchComponent,
    InputComponent,
    MentionComponent,
    TourStep,
  ],
})
export class UiComponent {
  title = 'mee-ui';
  checkBox = false;
  switch = false;
  dialogStatus = true;
  count = 0;
  percentage = 40;
  slider = 50;
  toggle = false;
  inputValue = 'Input';
  selectValue = 'Option 1';
  radioValue = '1';
  search = new FormControl('');
  show = input(false);
  searchChange = toSignal(this.search.valueChanges);
  options = Array.from({ length: 50 }, (_, i) => `Option ${i + 1}`);
  optionsFilter = computed(() => {
    const search = (this.searchChange() || '').toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(search));
  });
  primaryColor = '#3b82f6';
  backgroundColor = '#f3f4f6';
  foregroundColor = '#111827';
  randomNum = signal(2);
  otp = '';

  counter = toSignal(timer(0, 1000));

  displayedColumns = Array.from({ length: 10 }, (_, i) => `Title ${i + 1}`);

  constructor() {
    // this.changeNumber(5000);
  }

  changeNumber(timeout: number) {
    setTimeout(() => {
      this.randomNum.set(Math.floor(Math.random() * 10));
      this.changeNumber(timeout);
    }, timeout);
  }

  inc() {
    this.count++;
  }

  trackByFn(index: number, value: any) {
    return value;
  }
}
