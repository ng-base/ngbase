import { Component, OnInit, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { AutoHeight, Input } from '@meeui/input';
import { Card } from '@meeui/card';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Button } from '@meeui/button';
import { Spinner } from '@meeui/spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Heading } from '@meeui/typography';

@Component({
  standalone: true,
  selector: 'mee-landing-page',
  imports: [Input, Card, AutoHeight, Heading, FormsModule, ReactiveFormsModule, Button, Spinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mee-card class="m-4">
      <p class="mb-b4 text-center" meeHeader="md">Welcome to Sikkim AI</p>
      <form [formGroup]="form" class="mx-auto flex max-w-96 flex-col justify-center">
        <label for="name" class="mb-1">Name</label>
        <input meeInput formControlName="name" class="mb-4" placeholder="Enter your name" />
        <label for="phone" class="mb-1">Phone</label>
        <input meeInput formControlName="phone" class="mb-4" placeholder="Enter phone no" />
        <label for="address" class="mb-1">Address</label>
        <textarea
          meeInput
          formControlName="address"
          placeholder="Enter Address"
          class="mb-4 min-h-20"
        ></textarea>
        <label for="concern" class="mb-1">Concern</label>
        <textarea
          meeInput
          growable
          formControlName="concern"
          placeholder="Enter your concern here"
          class="mb-4 min-h-40"
        ></textarea>
        <button meeButton (click)="submit()" [disabled]="loading">
          @if (loading) {
            <mee-spinner class="mr-4 w-4" mode></mee-spinner>
          }
          {{ loading ? 'Sending the response...' : 'Submit' }}
        </button>
      </form>
    </mee-card>
  `,
})
export class LandingPageComponent implements OnInit {
  fb = inject(FormBuilder);
  form = this.fb.group({
    name: [''],
    phone: [''],
    address: [''],
    concern: [
      `In the picturesque valleys of Sikkim, a crisis unfolds as a small community faces a daunting challenge: the water supply has ceased for two days. Families, young and old, grapple with the distress of having no water to meet their daily needs, turning a serene life into a struggle for survival.

Thanks and Regards,
Sheik Althaf.`,
      // 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae odio autem nostrum ab soluta rem delectus repellat minus dolores ducimus!',
    ],
  });
  loading = false;
  router = inject(Router);
  route = inject(ActivatedRoute);

  constructor() {}

  ngOnInit() {}

  patchValue() {
    this.form
      .get('concern')!
      .patchValue(
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae odio autem nostrum ab soluta rem delectus repellat minus dolores ducimus!',
      );
  }

  submit() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['admin'], { relativeTo: this.route });
    }, 3000);
  }
}
