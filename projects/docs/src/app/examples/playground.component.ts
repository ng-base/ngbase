import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '@meeui/ui/button';
import { Card } from '@meeui/ui/card';
import { Icon } from '@meeui/ui/icon';
import { FormField, Input } from '@meeui/ui/form-field';
import { AutoHeight } from '@ngbase/adk/form-field';
import { Menu, MenuTrigger } from '@meeui/ui/menu';
import { Option, OptionGroup, Select, SelectInput } from '@meeui/ui/select';
import { Selectable, SelectableItem } from '@meeui/ui/selectable';
import { Separator } from '@meeui/ui/separator';
import { Slider } from '@meeui/ui/slider';
import { Heading } from '@meeui/ui/typography';
import { provideIcons } from '@ng-icons/core';
import { lucideBookText, lucideDownload } from '@ng-icons/lucide';

@Component({
  selector: 'app-playground',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    Card,
    FormField,
    SelectInput,
    Select,
    Option,
    OptionGroup,
    Button,
    Heading,
    Input,
    AutoHeight,
    Menu,
    MenuTrigger,
    Slider,
    Separator,
    Selectable,
    SelectableItem,
    Icon,
  ],
  viewProviders: [provideIcons({ lucideBookText, lucideDownload })],
  template: `
    <mee-card class="!p-0">
      <div class="flex items-center gap-2 p-4">
        <h4 meeHeader="sm" class="flex-1">Playground</h4>
        <mee-form-field>
          <mee-select class="w-72" placeholder="Load a preset">
            <input meeSelectInput placeholder="Select preset" [(ngModel)]="searchPreset" />
            @for (item of filteredPresets(); track item) {
              <mee-option [value]="item">{{ item }}</mee-option>
            }
          </mee-select>
        </mee-form-field>
        <button meeButton="secondary">Save</button>
        <button meeButton="secondary">View Code</button>
        <button meeButton="secondary">Share</button>
        <button meeButton="secondary" [meeMenuTrigger]="menuDots">...</button>
      </div>
      <mee-separator />
      <mee-menu #menuDots>
        <button meeOption>Content filter preferences</button>
        <mee-separator class="my-1" />
        <button meeOption>Delete preset</button>
      </mee-menu>
      <div class="flex p-4">
        <mee-form-field class="flex-1">
          <textarea
            meeInput
            ngbAutoHeight
            [(ngModel)]="prompt"
            class="min-h-[500px] flex-1"
            placeholder="Write a tagline for an ice cream shop"
          ></textarea>
        </mee-form-field>
        <div class="flex w-52 flex-col gap-7 pl-4">
          <div class="flex flex-col gap-2">
            <h4 class="mb-1 font-medium">Mode</h4>
            <!-- <mee-toggle-group>
              <button meeToggleItem><-</button>
              <button meeToggleItem>-></button>
            </mee-toggle-group> -->
            <mee-selectable [activeIndex]="0">
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

          <div class="flex flex-col gap-2">
            <h4 meeHeader class="mb-1">Model</h4>
            <mee-form-field>
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
            </mee-form-field>
          </div>

          <div class="flex flex-col gap-2">
            <h4 meeHeader class="mb-1">Temperature - {{ temperature() }}</h4>
            <mee-slider [max]="1" [step]="0.1" [(ngModel)]="temperature" />
          </div>

          <div class="flex flex-col gap-2">
            <h4 meeHeader class="mb-1">Max Length - {{ maxLength() }}</h4>
            <mee-slider [max]="4000" [(ngModel)]="maxLength" />
          </div>

          <div class="flex flex-col gap-2">
            <h4 meeHeader class="mb-1">Top P - {{ topP() }}</h4>
            <mee-slider [max]="1" [step]="0.1" [(ngModel)]="topP" />
          </div>
        </div>
      </div>
      <div class="flex gap-2 px-4 pb-4">
        <button meeButton>Submit</button>
        <button meeButton="secondary">X</button>
      </div>
    </mee-card>
  `,
})
export default class PlaygroundComponent {
  searchPreset = signal('');
  filteredPresets = computed(() => {
    const search = this.searchPreset()?.toLowerCase() || '';
    return search
      ? this.presets.filter(option => option.toLowerCase().includes(search))
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
            const list = model.list.filter(option => option.toLowerCase().includes(search));
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
