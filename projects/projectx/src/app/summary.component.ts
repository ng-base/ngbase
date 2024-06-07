import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { Card } from '@meeui/card';
import { Input } from '@meeui/input';
import { Heading } from '@meeui/typography';
import { Button } from '@meeui/button';
import { Spinner } from '@meeui/spinner';

@Component({
  standalone: true,
  selector: 'app-summary',
  imports: [Card, Input, Heading, Button, Spinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mee-card>
      <h4 meeHeader>
        No of People:
        <span meeHeader="sm">1346</span>
      </h4>

      <h4 meeHeader class="mt-b4">Summary</h4>
      <div class="flex flex-col gap-4">
        <p>
          In the picturesque valleys of Sikkim, a crisis unfolds as a small
          community faces a daunting challenge: the water supply has ceased for
          two days. Families, young and old, grapple with the distress of having
          no water to meet their daily needs, turning a serene life into a
          struggle for survival.
        </p>

        <p>
          Amid this turmoil, a glimmer of hope emerges through an innovative
          app, a testament to the proactive vision of the Chief Minister. This
          AI powered digital platform, designed to bridge the gap between the
          government and its citizens, becomes a beacon of relief. The
          residents, driven by desperation, turn to the app to voice their
          plight. They send urgent messages, each one a plea for assistance.
        </p>

        <p>
          On the other side, the Chief Minister, equipped with the admin
          dashboard of the app, receives real-time updates on the crisis. With a
          firm resolve to address the grievances of the populace, the CM acts
          swiftly. Help is mobilized, and soon, water tanks are dispatched to
          the affected area.
        </p>

        <p>
          As the water tanks roll into the community, a wave of relief washes
          over the residents. Their troubles are alleviated, and gratitude fills
          their hearts. They gather, smiling and thankful, their faith in their
          leaders restored by the prompt and effective response.
        </p>

        <p>
          The scene closes with the Chief Minister, a smile of satisfaction
          playing on their lips, standing beside the glowing emblems of the
          Sikkim Connect AI system, and the logos of the Government of Sikkim
          and the Sikkim Krantikari Morcha. This moment encapsulates a perfect
          blend of technology and governance, a model of how proactive
          leadership and innovative solutions can transform challenges into
          victories, reconnecting the community not just to water, but to hope
          and trust in their government.
        </p>
      </div>

      <div class="text-right">
        <button
          meeButton
          class="mt-b4"
          (click)="assignToDepartment()"
          [disabled]="loading()"
        >
          @if (loading()) {
            <mee-spinner class="mr-b4 w-b4"></mee-spinner>
          }
          {{ loading() ? 'Assigning department...' : 'Assign to a department' }}
        </button>
      </div>
    </mee-card>
    <mee-card class="min-w-60">
      <h4>Status: <span meeHeader class="text-primary">Active</span></h4>
      <h4 class="mt-b4">
        Category: <span meeHeader class="text-primary">Health</span>
      </h4>
    </mee-card>
  `,
  host: {
    class: 'flex gap-b4 m-b4',
  },
})
export class SummaryComponent implements OnInit {
  loading = signal(false);
  constructor() {}

  ngOnInit() {}

  assignToDepartment() {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
    }, 2000);
  }
}
