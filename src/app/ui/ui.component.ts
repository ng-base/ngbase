import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { alertPortal } from '@meeui/alert';
import { Autocomplete } from '@meeui/autocomplete';
import { Avatar } from '@meeui/avatar';
import { Breadcrumbs, Breadcrumb } from '@meeui/breadcrumb';
import { Button } from '@meeui/button';
import { Card } from '@meeui/card';
import { Checkbox } from '@meeui/checkbox';
import { ColorPicker, ColorPickerContainer } from '@meeui/color-picker';
import { DatePicker, DatepickerTrigger } from '@meeui/datepicker';
import { DialogClose, dialogPortal } from '@meeui/dialog';
import { drawerPortal } from '@meeui/drawer';
import { HoverCard } from '@meeui/hover-card';
import { Icons } from '@meeui/icon';
import { Input } from '@meeui/input';
import { List } from '@meeui/list';
import { Menu, MenuTrigger } from '@meeui/menu';
import { Pagination } from '@meeui/pagination';
import { PopoverTrigger, popoverPortal } from '@meeui/popover';
import { Progress } from '@meeui/progress';
import { Radio, RadioGroup } from '@meeui/radio';
import { ScrollArea } from '@meeui/scroll-area';
import { Select, SelectInput, Option } from '@meeui/select';
import { Separator } from '@meeui/separator';
import { sheetPortal } from '@meeui/sheet';
import { Slider } from '@meeui/slider';
import { sonnerPortal } from '@meeui/sonner';
import { Spinner } from '@meeui/spinner';
import { Switch } from '@meeui/switch';
import { Toggle } from '@meeui/toggle';
import { ToggleGroup, ToggleItem } from '@meeui/toggle-group';
import { Tooltip } from '@meeui/tooltip';
import { Heading } from '@meeui/typography';
import { RangePipe } from '@meeui/utils';
import { timer } from 'rxjs';
import { AddComponent } from '../add.component';
import { AppService } from '../app.service';
import { AccordionComponent } from './accordion.component';
import { ContextMenuComponent } from './context-menu.component';
import { NavComponent } from './nav-header.component';
import { ResizableComponent } from './resizable.component';
import { TabsComponent } from './tabs.component';
import { OtpComponent } from './otp.component';
import { ProgressComponent } from './progress.component';
import { SpinnerComponent } from './spinner.component';
import { ButtonsComponent } from './buttons.component';
import { AvatarComponent } from './avatar.component';
import { MenuComponent } from './menu.component';
import { PopoverComponent } from './popover.component';
import { HoverCardComponent } from './hover-card.component';
import { SonnerComponent } from './sonner.component';
import { CalendarComponent } from './calendar.component';
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
import { ColorPickerComponent } from './color-picker.component';
import { ToggleGroupComponent } from './toggle-group.component';
import { ToggleComponent } from './toggle.component';
import { AlertDialogComponent } from './alert-dialog.component';
import { DialogComponent } from './dialog.component';
import { SheetComponent } from './sheet.component';
import { DrawerComponent } from './drawer.component';
import { SwitchComponent } from './switch.component';
import { InputComponent } from './input.component';
import { MentionComponent } from './mention.component';
import { Tour, TourStep } from '@meeui/tour';
import { Sidenav, SidenavContent, SidenavHeader } from '@meeui/sidenav';

@Component({
  standalone: true,
  selector: 'mee-ui',
  templateUrl: 'ui.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    RouterOutlet,
    ReactiveFormsModule,
    NavComponent,
    Separator,
    Card,
    Heading,
    Icons,
    ScrollArea,
    AccordionComponent,
    ResizableComponent,
    ContextMenuComponent,
    TabsComponent,
    OtpComponent,
    ProgressComponent,
    SpinnerComponent,
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
    Tour,
    Sidenav,
    SidenavHeader,
    SidenavContent,
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
