import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Sonner, SonnerMessage } from './sonner.component';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('Sonner', () => {
  let component: Sonner;
  let fixture: ComponentFixture<Sonner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sonner],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(Sonner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display any messages initially', () => {
    const messageElements = fixture.debugElement.queryAll(By.css('li'));
    expect(messageElements.length).toBe(0);
  });

  it('should add a message and display it', () => {
    const message: SonnerMessage = { name: 'Test', message: 'Hello', timeout: 0 };
    component.addMessage(message);
    fixture.detectChanges();

    const messageElements = fixture.debugElement.queryAll(By.css('li'));
    expect(messageElements.length).toBe(1);
    expect(messageElements[0].nativeElement.textContent).toContain('Test');
    expect(messageElements[0].nativeElement.textContent).toContain('Hello');
  });

  it('should remove a message after the specified timeout', fakeAsync(() => {
    const message: SonnerMessage = { name: 'Test', message: 'Hello', timeout: 1000 };
    component.addMessage(message);
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(1);

    tick(1000);
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(0);
  }));

  it('should not remove a message with timeout 0', fakeAsync(() => {
    const message: SonnerMessage = { name: 'Test', message: 'Hello', timeout: 0 };
    component.addMessage(message);
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(1);

    tick(5000);
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(1);
  }));

  it('should clear all messages', () => {
    component.addMessage({ name: 'Test1', message: 'Hello1', timeout: 0 });
    component.addMessage({ name: 'Test2', message: 'Hello2', timeout: 0 });
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(2);

    component.clear();
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(0);
  });

  it('should display only the first 3 messages', () => {
    for (let i = 0; i < 5; i++) {
      component.addMessage({ name: `Test${i}`, message: `Hello${i}`, timeout: 0 });
    }
    fixture.detectChanges();

    const messageElements = fixture.debugElement.queryAll(By.css('li'));
    expect(messageElements.length).toBe(5);

    const visibleMessages = messageElements.filter(el => el.styles['visibility'] === 'visible');
    expect(visibleMessages.length).toBe(3);
  });

  it('should position messages correctly', () => {
    for (let i = 0; i < 3; i++) {
      component.addMessage({ name: `Test${i}`, message: `Hello${i}`, timeout: 0 });
    }
    fixture.detectChanges();

    const messageElements = fixture.debugElement.queryAll(By.css('li'));
    expect(messageElements[0].styles['bottom']).toBe('0px');
    expect(messageElements[1].styles['bottom']).toBe('16px');
    expect(messageElements[2].styles['bottom']).toBe('32px');
  });

  // TODO: Fix this test, it's failing because of the animations
  // it('should scale messages correctly', () => {
  //   for (let i = 0; i < 3; i++) {
  //     component.addMessage({ name: `Test${i}`, message: `Hello${i}`, timeout: 0 });
  //   }
  //   fixture.detectChanges();

  //   const messageElements = fixture.debugElement.queryAll(By.css('li'));
  //   expect(messageElements[0].styles['transform']).toContain('');
  //   expect(messageElements[1].styles['transform']).toContain('scale(0.92)');
  //   expect(messageElements[2].styles['transform']).toContain('scale(0.84)');
  // });
});
