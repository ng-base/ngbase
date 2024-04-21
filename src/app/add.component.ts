import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button } from '@meeui/button';
import {
  DialogClose,
  DialogTitle,
  dialogPortal,
  DialogRef,
} from '@meeui/dialog';
import { AppService } from './app.service';
import { AddService } from './add.service';

@Component({
  selector: 'app-add',
  template: `
    <p class="text-muted">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime velit
      eveniet animi odio laboriosam ad ea nulla sunt dolorem iure quod dolores
      nesciunt, delectus consequatur a cupiditate sit aliquam fugit quam, enim
      soluta repellendus facilis distinctio. Voluptates voluptate laboriosam
      laudantium, ducimus unde beatae nesciunt vel sed dicta aut corporis
      adipisci porro nisi nulla, pariatur iste? Beatae mollitia voluptate optio
      amet quia et perspiciatis, ut laudantium explicabo laborum, similique
      cumque velit obcaecati doloremque alias impedit voluptas eaque accusamus
      dolor sunt rerum maiores numquam pariatur. Aliquid cumque commodi quos, id
      cupiditate eveniet odio inventore reiciendis nisi autem aperiam
      voluptatibus illo dolorem voluptas iusto reprehenderit voluptates debitis,
      ad beatae nulla amet illum ut quisquam? Saepe, voluptas obcaecati, ab,
      quam dignissimos quidem perspiciatis in tempora asperiores magni possimus
      iure rerum pariatur illo quas. Delectus odit sint nihil, at id omnis
      doloremque temporibus dolor, hic soluta inventore earum laudantium numquam
      cum quisquam? Sed iste asperiores facere odit enim. Dicta dolorum atque
      impedit assumenda ipsa reprehenderit cum earum unde nostrum aliquid quos
      saepe blanditiis est, possimus, odio rem explicabo laboriosam quam
      accusamus aperiam, architecto cupiditate corporis officia id! Illum
      dolorum hic quidem amet quia perferendis asperiores rerum ea, cum,
      excepturi nostrum ut molestiae soluta facere nam.
    </p>
    <div class="mt-4 flex gap-4">
      <button meeButton (click)="open()">Inner dialog</button>
      <button meeButton meeDialogClose>Close</button>
      <button meeButton (click)="closeAll()">Close all</button>
    </div>
  `,
  standalone: true,
  providers: [AddService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogClose, DialogTitle],
  styles: `
    :host {
      display: block;
      overflow: auto;
    }
  `,
})
export class AddComponent {
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
}
