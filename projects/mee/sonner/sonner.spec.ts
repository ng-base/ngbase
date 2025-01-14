import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { render, RenderResult } from '@meeui/adk/test';
import { Sonner } from './sonner';

describe('Sonner', () => {
  let component: Sonner;
  let view: RenderResult<Sonner>;

  beforeEach(async () => {
    view = await render(Sonner, [provideNoopAnimations()]);
    component = view.host;
    view.detectChanges();
  });

  function getLi() {
    return view.$All('li');
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

  it('should remove a message after the specified timeout', async () => {
    component.addMessage('Hello', 'default', { timeout: 1 });
    view.detectChanges();

    expect(getLi().length).toBe(1);

    await view.sleep(1);
    await view.whenStable();

    expect(getLi().length).toBe(0);
  });

  it('should not remove a message with timeout 0', async () => {
    component.addMessage('Hello', 'default', { timeout: 0 });
    view.detectChanges();

    expect(getLi().length).toBe(1);

    await view.sleep(1);
    view.detectChanges();

    expect(getLi().length).toBe(1);
  });

  it('should clear all messages', async () => {
    component.addMessage('Hello1', 'default', { timeout: 0 });
    component.addMessage('Hello2', 'default', { timeout: 0 });
    view.detectChanges();

    expect(getLi().length).toBe(2);

    component.clear();
    await view.whenStable();

    expect(getLi().length).toBe(0);
  });

  it('should display only the first 3 messages', () => {
    for (let i = 0; i < 5; i++) {
      component.addMessage(`Hello${i}`, 'default', { timeout: 0 });
    }
    view.detectChanges();

    const messageElements = getLi();
    expect(messageElements.length).toBe(5);

    const visibleMessages = messageElements.filter(eh => eh.el.style.visibility === 'visible');
    expect(visibleMessages.length).toBe(3);
  });

  it('should position messages correctly', () => {
    for (let i = 0; i < 3; i++) {
      component.addMessage(`Hello${i}`, 'default', { timeout: 0 });
    }
    view.detectChanges();

    const messageElements = getLi();
    expect(messageElements[0].el.style.bottom).toBe('0px');
    expect(messageElements[1].el.style.bottom).toBe('16px');
    expect(messageElements[2].el.style.bottom).toBe('32px');
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
