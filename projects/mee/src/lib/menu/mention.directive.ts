import { Directive, ElementRef, inject, input, output } from '@angular/core';
import { popoverPortal } from '../popover';
import { Menu } from './menu.component';
import { DialogOptions } from '../dialog';

@Directive({
  standalone: true,
  selector: '[meeMentionTrigger]',
  host: {
    '(input)': 'open()',
  },
})
export class MentionTrigger {
  meeMentionTrigger = input.required<Menu>();
  options = input<{ focus?: 'el'; width?: 'full' }>();
  key = input.required<string>();
  search = output<string>();
  el = inject<ElementRef<HTMLTextAreaElement>>(ElementRef);
  private popover = popoverPortal();
  private close?: VoidFunction;

  open() {
    // open the menu in a position where the cursor is at '@' character
    const { selectionStart } = this.el.nativeElement;
    // check the word before the cursor which should starts with the key character
    const word = this.getCurrentWord();
    if (word.length <= 0 || word[0] !== this.key()) {
      this.close?.();
      this.close = undefined;
      return;
    }

    this.search.emit(word.substring(1));

    if (this.close) {
      return;
    }

    let client = null;

    if (!this.options()?.focus) {
      client = this.getPositionAt(selectionStart);
      // console.log('x', x, 'y', y, 'w', w, 'h', h);
    }

    // open the menu at the cursor position
    const menu = this.meeMentionTrigger();
    const diaOptions: DialogOptions = { maxHeight: '400px' };
    if (this.options()?.width === 'full') {
      diaOptions.width = 'target';
    }
    const { diaRef } = this.popover.open(
      menu.container()!,
      { target: this.el.nativeElement, position: 'bl', client },
      diaOptions,
    );
    menu.diaRef = diaRef;
    menu.opened();
    this.close = menu.close;
  }

  private getCurrentWord() {
    const textarea = this.el.nativeElement;
    // Get the current cursor position in the textarea
    const cursorPosition = textarea.selectionStart;

    // Get the text up to the cursor position
    const textUpToCursor = textarea.value.substring(0, cursorPosition);

    // Find the start of the current word
    const wordStart = textUpToCursor.lastIndexOf(' ') + 1;

    // Get the text after the cursor position up to the end of the textarea
    const textAfterCursor = textarea.value.substring(cursorPosition);

    // Find the end of the current word
    const wordEnd = textAfterCursor.indexOf(' ');
    const currentWord = textarea.value.substring(
      wordStart,
      cursorPosition + (wordEnd > -1 ? wordEnd : textAfterCursor.length),
    );

    return currentWord;
  }

  private getPositionAt(index: number): {
    x: number;
    y: number;
    h: number;
    w: number;
  } {
    const textarea = this.el.nativeElement;
    const text = textarea.value.substring(0, index);
    const mirror = document.createElement('div');
    const cursor = document.createElement('span');
    const style = window.getComputedStyle(textarea);
    const textareaRect = textarea.getBoundingClientRect();

    // Setup the mirror div to accurately reflect the textarea's position and styles
    mirror.style.position = 'fixed';
    mirror.style.top = `${textareaRect.top}px`; // Position at the same vertical position
    mirror.style.left = `${textareaRect.left}px`; // Position at the same horizontal position
    mirror.style.visibility = 'hidden';
    mirror.style.whiteSpace = 'pre-wrap';
    mirror.style.wordWrap = 'break-word';
    mirror.style.fontFamily = style.fontFamily;
    mirror.style.fontSize = style.fontSize;
    mirror.style.lineHeight = style.lineHeight;
    mirror.style.padding = style.padding;
    mirror.style.border = style.border;
    mirror.style.width = `${textarea.offsetWidth}px`; // Ensure width matches
    mirror.style.height = `${textarea.offsetHeight}px`; // Mat

    // Append mirror to the body to measure
    document.body.appendChild(mirror);
    mirror.textContent = text.substring(0, index - 1);
    cursor.textContent = '|';
    mirror.appendChild(cursor);

    const rect = cursor.getBoundingClientRect();

    document.body.removeChild(mirror);

    // Return the position relative to the viewport
    return {
      x: rect.left,
      y: rect.top,
      h: rect.height,
      w: rect.width,
    };
  }
}
