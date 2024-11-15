import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KtdGridLayout, KtdGridModule } from '@katoid/angular-grid-layout';
import { Button } from '@meeui/ui/button';
import { Card } from '@meeui/ui/card';
import { AutoHeight, Input } from '@meeui/ui/input';
import { Spinner } from '@meeui/ui/spinner';
import {
  BodyRow,
  BodyRowDef,
  Cell,
  CellDef,
  Head,
  HeadDef,
  HeadRow,
  HeadRowDef,
  Row,
  Table,
} from '@meeui/ui/table';
import { ThemeService } from '@meeui/ui/theme';
import { Heading } from '@meeui/ui/typography';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';

interface Health {
  id: number;
  name: string;
  status: string;
  comment: string;
}

@Component({
  selector: 'mee-landing-page',
  imports: [
    Input,
    Card,
    AutoHeight,
    FormsModule,
    ReactiveFormsModule,
    Button,
    Spinner,
    KtdGridModule,
    Heading,
    Table,
    HeadRow,
    HeadRowDef,
    BodyRow,
    BodyRowDef,
    Cell,
    CellDef,
    Head,
    HeadDef,
    Row,
    NgxEchartsDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="m-b2">
      <ktd-grid
        [cols]="cols"
        [rowHeight]="rowHeight"
        [layout]="layout"
        (layoutUpdated)="onLayoutUpdated($event)"
        [gap]="8"
      >
        @for (item of layout; track item.id) {
          <ktd-grid-item [id]="item.id" [resizable]="false" [draggable]="false">
            <mee-card class="h-full">
              <!-- Your grid item content goes here -->
              <!-- Optional Custom placeholder template -->
              @switch (item.id) {
                @case ('0') {
                  <h4 meeHeader class="pb-b4">Health</h4>
                  <table meeTable [data]="healthList()" [trackBy]="trackByFn" class="overflow-auto">
                    @for (column of columns(); track column) {
                      <ng-container [meeRow]="column">
                        <th class="whitespace-nowrap" meeHead *meeHeadDef>
                          {{ column }}
                        </th>
                        <td class="whitespace-nowrap" meeCell *meeCellDef="let element">
                          {{ element[column] }}
                        </td>
                      </ng-container>
                    }
                    <!-- <tr meeHeadRow *meeHeadRowDef></tr> -->
                    <tr meeBodyRow *meeBodyRowDef></tr>
                  </table>
                }
                @case ('1') {
                  <div
                    echarts
                    [options]="chartOption1()"
                    (chartClick)="onChartEvent($event)"
                    class="demo-chart h-full"
                  ></div>
                }
                @case ('2') {
                  <div
                    echarts
                    [options]="chartOption2()"
                    (chartClick)="onChartEvent($event)"
                    class="demo-chart h-full"
                  ></div>
                }
                @case ('3') {
                  <div
                    echarts
                    [options]="chartOption3()"
                    (chartClick)="onChartEvent($event)"
                    class="demo-chart h-full"
                  ></div>
                }
              }
            </mee-card>
            <ng-template ktdGridItemPlaceholder>
              <!-- Custom placeholder content goes here -->
            </ng-template>
          </ktd-grid-item>
        }
      </ktd-grid>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  theme = inject(ThemeService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  cols: number = 24;
  rowHeight: number = 100;
  layout: KtdGridLayout = [
    { id: '0', x: 0, y: 0, w: 11, h: 6 },
    { id: '1', x: 11, y: 0, w: 7, h: 3 },
    { id: '2', x: 11, y: 3, w: 13, h: 3 },
    { id: '3', x: 18, y: 0, w: 6, h: 3 },
  ];

  chartOption1 = computed(() => {
    const mode = this.theme.mode();
    return this.chartOption('Water Issue', mode === 'dark');
  });
  chartOption2 = computed(() => {
    const mode = this.theme.mode();
    return this.chartOption('Gas Issue', mode === 'dark');
  });
  chartOption3 = computed(() => {
    const mode = this.theme.mode();
    return this.chartOption('Power Issue', mode === 'dark');
  });

  healthList = signal([
    { id: 1, name: 'John Doe', status: 'Healthy', comment: 'No Comment' },
    { id: 2, name: 'Jane Doe', status: 'Unhealthy', comment: 'No Comment' },
    { id: 3, name: 'John Smith', status: 'Healthy', comment: 'No Comment' },
    { id: 4, name: 'Jane Smith', status: 'Unhealthy', comment: 'No Comment' },
    { id: 5, name: 'John Doe', status: 'Healthy', comment: 'No Comment' },
    { id: 6, name: 'Jane Doe', status: 'Unhealthy', comment: 'No Comment' },
    { id: 7, name: 'John Smith', status: 'Healthy', comment: 'No Comment' },
    { id: 8, name: 'Jane Smith', status: 'Unhealthy', comment: 'No Comment' },
  ]);

  columns = signal(['id', 'name', 'status', 'comment']);

  constructor() {}

  ngOnInit() {}

  trackByFn(index: number, item: Health) {
    return item.id;
  }

  onLayoutUpdated(layout: KtdGridLayout) {
    console.log(layout);
  }

  chartOption(title: string, darkMode = false): EChartsOption {
    return {
      title: {
        text: title,
        subtext: 'Test Data',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'bottom',
      },
      darkMode: darkMode,
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }

  onChartEvent(ev: any) {
    console.log(ev);
    this.router.navigate(['summary'], { relativeTo: this.route.parent });
  }
}
