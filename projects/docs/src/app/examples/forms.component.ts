import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Autocomplete, AutocompleteInput } from '@meeui/ui/autocomplete';
import { Button } from '@meeui/ui/button';
import { Card } from '@meeui/ui/card';
import { Checkbox } from '@meeui/ui/checkbox';
import { Chip } from '@meeui/ui/chip';
import { FormField, Input, Label } from '@meeui/ui/input';
import { Option, Select, SelectInput } from '@meeui/ui/select';
import { Heading } from '@meeui/ui/typography';

export function selectFilter<T>(value: (value: T) => string, initialItems: T[] = []) {
  const search = signal('');
  const items = signal<T[]>(initialItems);

  const filteredItems = computed(() => {
    const text = search().toLowerCase();
    return items().filter(skill => value(skill).toLowerCase().includes(text));
  });

  return {
    search,
    items,
    filteredItems,
  };
}

@Component({
  selector: 'app-forms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    Card,
    Input,
    Select,
    SelectInput,
    Option,
    Heading,
    Autocomplete,
    Button,
    AutocompleteInput,
    Checkbox,
    Chip,
    Label,
    FormField,
  ],
  template: `
    <mee-card class="flex w-[28rem] flex-col gap-b2">
      <h4 meeHeader="sm" class="mb-b4">Let’s get you hired!</h4>
      <div class="flex gap-b4">
        <div meeFormField>
          <label meeLabel> First Name*</label>
          <input meeInput placeholder="First Name" />
        </div>
        <div meeFormField>
          <label meeLabel> Last Name* </label>
          <input meeInput placeholder="Last Name" />
        </div>
      </div>
      <div meeFormField>
        <label meeLabel> Email ID </label>
        <input meeInput id="emailId" placeholder="Email id" />
      </div>
      <div meeFormField>
        <label meeLabel class="w-full"> Location </label>
        <mee-select placeholder="Location" [multiple]="true" [(ngModel)]="location">
          <input meeSelectInput placeholder="Search location" [(ngModel)]="locationList.search" />
          @for (loc of locationList.filteredItems(); track loc) {
            <mee-option [value]="loc">{{ loc }}</mee-option>
          }
        </mee-select>
      </div>
      <div meeFormField>
        <label meeLabel> Contact Number </label>
        <input meeInput id="contactNumber" placeholder="Contact number" />
      </div>
      <div meeFormField>
        <label meeLabel> Year of Experience </label>
        <div class="flex gap-b4">
          <input meeInput id="experience" placeholder="Years" />
          <input meeInput id="experience" placeholder="Months" />
        </div>
      </div>
      <div meeFormField>
        <label meeLabel> My Technical Skills </label>
        <mee-autocomplete placeholder="My Technical Skills" [multiple]="true" [(ngModel)]="skills">
          <input
            [(ngModel)]="skillList.search"
            meeAutocompleteInput
            id="skills"
            placeholder="Angular, NodeJs"
          />
          @for (value of skills(); track value) {
            <mee-chip>{{ value }}</mee-chip>
          }
          @for (skill of skillList.filteredItems(); track skill) {
            <mee-option [value]="skill">{{ skill }}</mee-option>
          }
        </mee-autocomplete>
      </div>
      <div class="mb-b4 flex flex-col">
        <mee-checkbox>Subscribe to our newsletter</mee-checkbox>
        <mee-checkbox>Accept terms and conditions</mee-checkbox>
      </div>
      <div class="flex flex-col gap-b4 text-center">
        <button meeButton>Find Dream Jobs</button>
        <p>Already have an account? <a>Login here</a></p>
        <p>
          By submitting, you acknowledge that you have read and agreed to our Terms of Service and
          Privacy Policy.
        </p>
      </div>
    </mee-card>
  `,
})
export default class FormsComponent {
  skills = signal<string[]>([]);
  skillList = selectFilter<(typeof SKILLS)[0]>(value => value, SKILLS);

  location = signal<string>('');
  locationList = selectFilter<string>(value => value, LOCATIONS);
}

const LOCATIONS = ['Bangalore', 'Chennai', 'Delhi', 'Hyderabad', 'Mumbai', 'Pune'];

const SKILLS = [
  'AI/ML',
  'Android Java',
  'Angular',
  'AngularJS',
  'Appium',
  'AWS',
  'Azure',
  'Blockchain',
  'C++',
  'CI/ CD pipelines',
  'CircleCI',
  'CodeIgniter',
  'C Sharp',
  'Cucumber',
  'Cypress',
  'D3.JS',
  'Data Science',
  'DevOps',
  'Django',
  'Docker',
  'Drupal',
  'Electron',
  'Elixir',
  'Erlang',
  'Ethereum',
  'ExpressJS',
  'Firebase',
  'Flask',
  'Flutter',
  'GoLang',
  'Google Cloud',
  'Graphic Design',
  'GraphQL',
  'Hadoop',
  'HBase',
  'Hibernate',
  'Interaction Design',
  'Ionic',
  'J2EE',
  'Java',
  'Javascript',
  'Jenkins',
  'Jest',
  'Kafka',
  'Kotlin',
  'Kubernetes',
  'Laravel',
  'Magento',
  'MeteorJS',
  'Mobile UI',
  'Mobile UX',
  'MongoDB',
  'Motion Graphic',
  'MySQL',
  'NestJS',
  '.NET',
  'NextJS',
  'NodeJS',
  'NuxtJS',
  'Objective C',
  'OpenCart',
  'Phoenix',
  'PHP',
  'Playwright',
  'PostgreSQL',
  'Power BI',
  'Product Design',
  'Product Strategy',
  'Pytest',
  'Python',
  'R',
  'RabbitMQ',
  'Ranorex Studio',
  'ReactJS',
  'React Native',
  'Redis',
  'Redux',
  'Robot Framework',
  'RSpec',
  'Ruby on Rails',
  'Rust',
  'Salesforce',
  'Scala',
  'Selenium',
  'Serverless',
  'Shopify',
  'Solidity',
  'Spark',
  'Spring',
  'Struts',
  'Swift',
  'Symfony',
  'Tableau',
  'Terraform',
  'Typescript',
  'Unity 3D',
  'User Research',
  'Visual Design',
  'VueJS',
  'Web App UI',
  'Web App UX',
  'WebGL',
  'Woocommerce',
  'Wordpress',
  'Xamarin',
  'Yii',
];
