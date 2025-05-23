import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { Autofocus } from '@ngbase/adk/a11y';
import { DialogRef } from '@ngbase/adk/portal';
import { Button } from '@meeui/ui/button';
import { DialogClose, dialogPortal } from '@meeui/ui/dialog';
import { FormField, MeeInput } from '@meeui/ui/form-field';
import { Option, Select } from '@meeui/ui/select';
import { AddService } from './add.service';
import { AppService } from './app.service';

@Component({
  selector: 'app-add',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogClose, Select, Option, MeeInput, Autofocus, FormField],
  providers: [AddService],
  template: `
    <mee-form-field>
      <input meeInput ngbAutofocus />
    </mee-form-field>
    <mee-form-field>
      <mee-select>
        <mee-option value="1">1</mee-option>
        <mee-option value="2">2</mee-option>
        <mee-option value="3">3</mee-option>
      </mee-select>
    </mee-form-field>
    <p class="text-muted-foreground">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime velit eveniet animi odio
      laboriosam ad ea nulla sunt dolorem iure quod dolores nesciunt, delectus consequatur a
      cupiditate sit aliquam fugit quam, enim soluta repellendus facilis distinctio. Voluptates
      voluptate laboriosam laudantium, ducimus unde beatae nesciunt vel sed dicta aut corporis
      adipisci porro nisi nulla, pariatur iste? Beatae mollitia voluptate optio amet quia et
      perspiciatis, ut laudantium explicabo laborum, similique cumque velit obcaecati doloremque
      alias impedit voluptas eaque accusamus dolor sunt rerum maiores numquam pariatur. Aliquid
      cumque commodi quos, id cupiditate eveniet odio inventore reiciendis nisi autem aperiam
      voluptatibus illo dolorem voluptas iusto reprehenderit voluptates debitis, ad beatae nulla
      amet illum ut quisquam? Saepe, voluptas obcaecati, ab, quam dignissimos quidem perspiciatis in
      tempora asperiores magni possimus iure rerum pariatur illo quas. Delectus odit sint nihil, at
      id omnis doloremque temporibus dolor, hic soluta inventore earum laudantium numquam cum
      quisquam? Sed iste asperiores facere odit enim. Dicta dolorum atque impedit assumenda ipsa
      reprehenderit cum earum unde nostrum aliquid quos saepe blanditiis est, possimus, odio rem
      explicabo laboriosam quam accusamus aperiam, architecto cupiditate corporis officia id! Illum
      dolorum hic quidem amet quia perferendis asperiores rerum ea, cum, excepturi nostrum ut
      molestiae soluta facere nam.
    </p>
    <div class="mt-4 flex gap-4">
      <button meeButton (click)="open()">Inner dialog</button>
      <button meeButton meeDialogClose>Close</button>
      <button meeButton (click)="closeAll()">Close all</button>
    </div>
  `,
  styles: `
    :host {
      display: block;
      overflow: auto;
    }
  `,
})
export class AddComponent implements OnDestroy {
  dialogRef = inject(DialogRef);
  dialogPortal = dialogPortal();
  appService = inject(AppService);
  addService = inject(AddService);

  open() {
    this.dialogPortal.open(AddComponent, {
      width: '500px',
      title: 'Add',
    });
  }

  closeAll() {
    this.dialogRef.closeAll();
  }

  ngOnDestroy(): void {
    console.log('AddComponent destroyed');
  }
}
