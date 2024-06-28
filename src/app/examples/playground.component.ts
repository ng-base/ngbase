import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Sidenav, SidenavContent, SidenavHeader } from '@meeui/sidenav';
import { Card } from '@meeui/card';
import { Select, SelectInput, Option, OptionGroup } from '@meeui/select';
import { Button } from '@meeui/button';
import { Heading } from '@meeui/typography';
import { Growable, Input } from '@meeui/input';
import { Menu, MenuTrigger } from '@meeui/menu';
import { List } from '@meeui/list';
import { ToggleGroup } from '@meeui/toggle-group';
import { Slider } from '@meeui/slider';
import { FormsModule } from '@angular/forms';
import { Separator } from '@meeui/separator';
import { Selectable, SelectableItem } from '@meeui/selectable';
import { provideIcons } from '@ng-icons/core';
import { lucideBookText, lucideDownload } from '@ng-icons/lucide';
import { Icons } from '@meeui/icon';
import { Key } from '@meeui/keys';

@Component({
  standalone: true,
  selector: 'app-playground',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    Sidenav,
    SidenavHeader,
    SidenavContent,
    Card,
    SelectInput,
    Select,
    Option,
    OptionGroup,
    Button,
    Heading,
    Input,
    Growable,
    Menu,
    MenuTrigger,
    List,
    ToggleGroup,
    Slider,
    Separator,
    Selectable,
    SelectableItem,
    Icons,
    Key,
  ],
  viewProviders: [provideIcons({ lucideBookText, lucideDownload })],
  template: `
    <mee-card class="!p-0">
      <div class="flex items-center gap-2 p-b4">
        <h4 meeHeader="sm" class="flex-1">Playground</h4>
        <mee-select class="w-72" placeholder="Load a preset">
          <input meeSelectInput placeholder="Select preset" [(ngModel)]="searchPreset" />
          @for (item of filteredPresets(); track item) {
            <mee-option [value]="item">{{ item }}</mee-option>
          }
        </mee-select>
        <button meeButton variant="secondary">Save</button>
        <button meeButton variant="secondary">View Code</button>
        <button meeButton variant="secondary">Share</button>
        <button meeButton variant="secondary" [meeMenuTrigger]="menuDots">...</button>
      </div>
      <mee-separator />
      <mee-menu #menuDots>
        <button meeOption>Content filter preferences</button>
        <mee-separator class="my-b" />
        <button meeOption>Delete preset</button>
      </mee-menu>
      <div class="flex p-b4">
        <textarea
          meeInput
          growable
          [(ngModel)]="prompt"
          class="min-h-[500px] flex-1"
          placeholder="Write a tagline for an ice cream shop"
        ></textarea>
        <div class="flex w-52 flex-col gap-7 pl-b4">
          <div class="flex flex-col gap-b2">
            <h4 class="mb-1 font-medium">Mode</h4>
            <!-- <mee-toggle-group>
              <button meeToggleItem><-</button>
              <button meeToggleItem>-></button>
            </mee-toggle-group> -->
            <mee-selectable>
              <mee-selectable-item [value]="0">
                <mee-icon name="lucideBookText" class="py-1" />
              </mee-selectable-item>
              <mee-selectable-item [value]="1">
                <mee-icon name="lucideDownload" class="py-1" />
              </mee-selectable-item>
              <mee-selectable-item [value]="2">
                <mee-icon name="lucideBookText" class="py-1" />
              </mee-selectable-item>
            </mee-selectable>
          </div>

          <div class="flex flex-col gap-b2">
            <h4 meeHeader class="mb-1">Model</h4>
            <mee-select class="w-full" placeholder="Select model" [(ngModel)]="model">
              <input meeSelectInput placeholder="Select model" [(ngModel)]="searchModel" />
              @for (item of filteredModels(); track item.name) {
                <mee-option-group [label]="item.name">
                  @for (option of item.list; track option) {
                    <mee-option [value]="option">{{ option }}</mee-option>
                  }
                </mee-option-group>
              }
            </mee-select>
          </div>

          <div class="flex flex-col gap-b2">
            <h4 meeHeader class="mb-1">Temperature - {{ temperature() }}</h4>
            <mee-slider [max]="1" [step]="0.1" [performance]="false" [(ngModel)]="temperature" />
          </div>

          <div class="flex flex-col gap-b2">
            <h4 meeHeader class="mb-1">Max Length - {{ maxLength() }}</h4>
            <mee-slider [max]="4000" [performance]="false" [(ngModel)]="maxLength" />
          </div>

          <div class="flex flex-col gap-b2">
            <h4 meeHeader class="mb-1">Top P - {{ topP() }}</h4>
            <mee-slider [max]="1" [step]="0.1" [performance]="false" [(ngModel)]="topP" />
          </div>
        </div>
      </div>
      <div class="flex gap-b2 px-b4 pb-b4">
        <button meeButton>Submit</button>
        <button meeButton variant="secondary">X</button>
      </div>
    </mee-card>
  `,
})
export class PlaygroundComponent {
  searchPreset = signal('');
  filteredPresets = computed(() => {
    const search = this.searchPreset()?.toLowerCase() || '';
    return search
      ? this.presets.filter((option) => option.toLowerCase().includes(search))
      : this.presets;
  });
  private presets = [
    'Grammatical Standard English',
    'Summarize for a 2nd grader',
    'Text to command',
    'Q&A',
    'English to other languages',
    'Parse unstructured data',
    'Classification',
    'Natural language to Python',
    'Explain code',
    'Chat',
  ];

  searchModel = signal('');
  filteredModels = computed(() => {
    const search = this.searchModel()?.toLowerCase() || '';
    return search
      ? this.models.reduce(
          (acc, model) => {
            const list = model.list.filter((option) => option.toLowerCase().includes(search));
            return list.length ? acc.concat({ ...model, list }) : acc;
          },
          [] as { name: string; list: string[] }[],
        )
      : this.models;
  });

  private models = [
    {
      name: 'GPT-3',
      list: ['text-davinci-003', 'text-curie-001', 'text-babbage-001', 'text-ada-001'],
    },
    { name: 'Codex', list: ['code-davinci-002', 'code-cushman-001'] },
  ];
  model = signal('text-davinci-003');
  prompt = signal('');
  temperature = signal(0.5);
  maxLength = signal(256);
  topP = signal(0.9);
}
