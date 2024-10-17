import { fakeAsync, tick } from '@angular/core/testing';
import { Sonner, SonnerMessage } from './sonner';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { render, RenderResult } from '../test';

describe('Sonner', () => {
  let component: Sonner;
  let view: RenderResult<Sonner>;

  beforeEach(async () => {
    view = await render(Sonner, [provideNoopAnimations()]);
    component = view.host;
    view.detectChanges();
  });

  function getLi() {
    return [...view.$$('li')];
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display any messages initially', () => {
    const messageElements = getLi();
    expect(messageElements.length).toBe(0);
  });

  it('should add a message and display it', () => {
    component.addMessage('Test', 'default', { description: 'Hello', timeout: 0 });
    view.detectChanges();

    const messageElements = getLi();
    expect(messageElements.length).toBe(1);
    expect(messageElements[0].textContent).toContain('Test');
    expect(messageElements[0].textContent).toContain('Hello');
  });

  it('should remove a message after the specified timeout', fakeAsync(() => {
    component.addMessage('Hello', 'default', { timeout: 1000 });
    view.detectChanges();

    expect(getLi().length).toBe(1);

    tick(1000);
    view.detectChanges();

    expect(getLi().length).toBe(0);
  }));

  it('should not remove a message with timeout 0', fakeAsync(() => {
    component.addMessage('Hello', 'default', { timeout: 0 });
    view.detectChanges();

    expect(getLi().length).toBe(1);

    tick(5000);
    view.detectChanges();

    expect(getLi().length).toBe(1);
  }));

  it('should clear all messages', () => {
    component.addMessage('Hello1', 'default', { timeout: 0 });
    component.addMessage('Hello2', 'default', { timeout: 0 });
    view.detectChanges();

    expect(getLi().length).toBe(2);

    component.clear();
    view.detectChanges();

    expect(getLi().length).toBe(0);
  });

  it('should display only the first 3 messages', () => {
    for (let i = 0; i < 5; i++) {
      component.addMessage(`Hello${i}`, 'default', { timeout: 0 });
    }
    view.detectChanges();

    const messageElements = getLi();
    expect(messageElements.length).toBe(5);

    const visibleMessages = messageElements.filter(el => el.style.visibility === 'visible');
    expect(visibleMessages.length).toBe(3);
  });

  it('should position messages correctly', () => {
    for (let i = 0; i < 3; i++) {
      component.addMessage(`Hello${i}`, 'default', { timeout: 0 });
    }
    view.detectChanges();

    const messageElements = getLi();
    expect(messageElements[0].style.bottom).toBe('0px');
    expect(messageElements[1].style.bottom).toBe('16px');
    expect(messageElements[2].style.bottom).toBe('32px');
  });

  // TODO: Fix this test, it's failing because of the animations
  // it('should scale messages correctly', () => {
  //   for (let i = 0; i < 3; i++) {
  //     component.addMessage({ name: `Test${i}`, message: `Hello${i}`, timeout: 0 });
  //   }
  //   fixture.detectChanges();

  //   const messageElements = queryAllDebug('li', fixture);
  //   expect(messageElements[0].styles['transform']).toContain('');
  //   expect(messageElements[1].styles['transform']).toContain('scale(0.92)');
  //   expect(messageElements[2].styles['transform']).toContain('scale(0.84)');
  // });
});
