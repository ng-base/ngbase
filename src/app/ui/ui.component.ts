import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { Button } from '@meeui/button';
import { NavComponent } from '../nav-header.component';
import { Separator } from '@meeui/separator';
import { Card } from '@meeui/card';
import { Checkbox } from '@meeui/checkbox';
import { DialogClose, dialogPortal } from '@meeui/dialog';
import { AddComponent } from '../add.component';
import { Heading } from '@meeui/typography';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Switch } from '@meeui/switch';
import { AccordionGroup, AccordionItem } from '@meeui/accordion';
import { Tab, TabGroup } from '@meeui/tab';
import { Progress } from '@meeui/progress';
import { Resizable, ResizableGroup } from '@meeui/resizable';
import { Slider } from '@meeui/slider';
import { sonnerPortal } from '@meeui/sonner';
import { Toggle } from '@meeui/toggle';
import { ToggleGroup, ToggleItem } from '@meeui/toggle-group';
import { JsonPipe } from '@angular/common';
import { sheetPortal } from '@meeui/sheet';
import { Tooltip } from '@meeui/tooltip';
import { PopoverTrigger, popoverPortal } from '@meeui/popover';
import { drawerPortal } from '@meeui/drawer';
import { AppService } from '../app.service';
import { HoverCard } from '@meeui/hover-card';
import { ColorPicker, ColorPicker2 } from '@meeui/color-picker';
import { Input } from '@meeui/input';
import { Select, SelectInput, SelectOption } from '@meeui/select';
import { Menu, MenuTrigger, ContextMenu } from '@meeui/menu';
import { List } from '@meeui/list';
import { Radio, RadioGroup } from '@meeui/radio';
import { Autocomplete } from '@meeui/autocomplete';
import { DatePickerComponent, DatepickerTrigger } from '@meeui/datepicker';

@Component({
  standalone: true,
  selector: 'mee-ui',
  templateUrl: 'ui.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AppService],
  imports: [
    FormsModule,
    RouterOutlet,
    ReactiveFormsModule,
    JsonPipe,
    NavComponent,
    List,
    Button,
    Separator,
    Card,
    Checkbox,
    Heading,
    Switch,
    AccordionGroup,
    AccordionItem,
    Tab,
    TabGroup,
    Progress,
    Resizable,
    ResizableGroup,
    Slider,
    Toggle,
    ToggleGroup,
    ToggleItem,
    Tooltip,
    PopoverTrigger,
    DialogClose,
    HoverCard,
    ColorPicker,
    Input,
    Select,
    SelectOption,
    SelectInput,
    MenuTrigger,
    Menu,
    Radio,
    RadioGroup,
    Autocomplete,
    ColorPicker2,
    DatePickerComponent,
    DatepickerTrigger,
    ContextMenu,
  ],
})
export class UiComponent {
  title = 'mee-ui';
  checkBox = false;
  switch = false;
  dialogPortal = dialogPortal();
  sonner = sonnerPortal();
  sheetPortal = sheetPortal();
  popoverPortal = popoverPortal();
  drawerPortal = drawerPortal();
  dialogStatus = true;
  count = 0;
  percentage = 40;
  slider = 50;
  toggle = false;
  toggleGroup = ['A'];
  inputValue = 'Input';
  selectValue = 'Option 1';
  radioValue = '1';
  search = new FormControl('');
  searchChange = toSignal(this.search.valueChanges);
  options = Array.from({ length: 50 }, (_, i) => `Option ${i + 1}`);
  optionsFilter = computed(() => {
    const search = (this.searchChange() || '').toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(search),
    );
  });
  primaryColor = '#3b82f6';
  backgroundColor = '#f3f4f6';
  foregroundColor = '#111827';

  inc() {
    this.count++;
  }

  open() {
    this.dialogPortal.open(AddComponent, {
      width: '80vw',
      title: 'Add',
    });
  }

  openSheet() {
    this.sheetPortal.open(AddComponent, {
      width: '25rem',
      title: 'Add',
    });
  }

  openPopover(event: MouseEvent) {
    this.popoverPortal.open(
      AddComponent,
      { target: event.target as HTMLElement },
      { width: '25rem', title: 'Add', backdrop: false },
    );
  }

  openDrawer() {
    this.drawerPortal.open(AddComponent, {
      width: '80vw',
      title: 'Add',
      backdropColor: false,
    });
  }

  addMessage() {
    this.sonner.add(
      'Event has been created',
      'Sunday, December 03, 2023 at 9:00 AM',
    );
  }

  clearMessage() {
    this.sonner.closeAll();
  }
}
