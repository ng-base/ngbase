import { Routes } from '@angular/router';
import { BaseComponent } from './base.component';
import { PopoverDemoComponent } from './popover-demo.component';

export const UI_ROUTES: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      { path: 'accordion', loadComponent: () => import('./accordion.component') },
      { path: 'table', loadComponent: () => import('./table.component') },
      { path: 'spinner', loadComponent: () => import('./spinner.component') },
      { path: 'otp', loadComponent: () => import('./otp.component') },
      { path: 'tabs', loadComponent: () => import('./tabs.component') },
      { path: 'resizable', loadComponent: () => import('./resizable.component') },
      { path: 'context-menu', loadComponent: () => import('./context-menu.component') },
      { path: 'buttons', loadComponent: () => import('./buttons.component') },
      { path: 'progress', loadComponent: () => import('./progress.component') },
      { path: 'avatar', loadComponent: () => import('./avatar.component') },
      { path: 'menu', loadComponent: () => import('./menu.component') },
      { path: 'popover', loadComponent: () => import('./popover.component') },
      { path: 'hover-card', loadComponent: () => import('./hover-card.component') },
      { path: 'sonner', loadComponent: () => import('./sonner.component') },
      { path: 'datepicker', loadComponent: () => import('./datepicker.component') },
      { path: 'autocomplete', loadComponent: () => import('./autocomplete.component') },
      { path: 'select', loadComponent: () => import('./select.component') },
      { path: 'slider', loadComponent: () => import('./slider.component') },
      { path: 'tooltip', loadComponent: () => import('./tooltip.component') },
      { path: 'radio', loadComponent: () => import('./radio.component') },
      { path: 'breadcrumbs', loadComponent: () => import('./breadcrumb.component') },
      { path: 'checkbox', loadComponent: () => import('./checkbox.component') },
      { path: 'pagination', loadComponent: () => import('./pagination.component') },
      { path: 'typography', loadComponent: () => import('./typography.component') },
      { path: 'toggle', loadComponent: () => import('./toggle.component') },
      { path: 'toggle-group', loadComponent: () => import('./toggle-group.component') },
      { path: 'alert-dialog', loadComponent: () => import('./alert-dialog.component') },
      { path: 'scroll-area', loadComponent: () => import('./scroll-area.component') },
      { path: 'color-picker', loadComponent: () => import('./color-picker.component') },
      { path: 'calendar', loadComponent: () => import('./calendar.component') },
      { path: 'dialog', loadComponent: () => import('./dialog.component') },
      { path: 'drawer', loadComponent: () => import('./drawer.component') },
      { path: 'input', loadComponent: () => import('./input.component') },
      { path: 'switch', loadComponent: () => import('./switch.component') },
      { path: 'mention', loadComponent: () => import('./mention.component') },
      { path: 'tour', loadComponent: () => import('./tour.component') },
      { path: 'navigation-menu', loadComponent: () => import('./navigation-menu.component') },
      { path: 'sidenav', loadComponent: () => import('./sidenav.component') },
      { path: 'carousel', loadComponent: () => import('./carousel.component') },
      { path: 'badge', loadComponent: () => import('./badge.component') },
      { path: 'chip', loadComponent: () => import('./chip.component') },
      { path: 'tree', loadComponent: () => import('./tree.component') },
      { path: 'stepper', loadComponent: () => import('./stepper.component') },
      { path: 'picasa', loadComponent: () => import('./picasa.component') },
      { path: 'sheet', loadComponent: () => import('./sheet.component') },
      { path: 'forms', loadComponent: () => import('./forms.component') },
      { path: 'list', loadComponent: () => import('./list.component') },
      { path: 'selectable', loadComponent: () => import('./selectable.component') },
      { path: 'drag', loadComponent: () => import('./drag.component') },
      { path: 'card', loadComponent: () => import('./card.component') },
      { path: 'mask', loadComponent: () => import('./mask.component') },
      { path: 'skeleton', loadComponent: () => import('./skeleton.component') },
      { path: 'shortcuts', loadComponent: () => import('./shortcuts.component') },
      { path: 'command', loadComponent: () => import('./command.component') },
      { path: 'directionality', loadComponent: () => import('./directionality.component') },
      { path: 'inline-edit', loadComponent: () => import('./inline-edit.component') },
      { path: 'virtualizer', loadComponent: () => import('./virtualizer.component') },
      { path: 'translation', loadComponent: () => import('./translation.component') },
      { path: 'jwt', loadComponent: () => import('./jwt.component') },
      { path: 'examples', loadChildren: () => import('../examples/example.routes') },
      { path: 'origin', loadChildren: () => import('../origin/origin.routes') },
      { path: '', redirectTo: 'accordion', pathMatch: 'full' },
    ],
  },
  {
    path: 'popover-demo',
    component: PopoverDemoComponent,
  },
];
