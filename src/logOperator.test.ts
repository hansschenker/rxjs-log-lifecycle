// src/logOperator.test.ts
// -----------------------------------------------------------
import { Observable, of } from 'rxjs';
import { log, TapCallback } from './logOperator';

// Mock console methods to capture their output
let consoleOutput: string[] = [];
const mockedLog = (output: string) => consoleOutput.push(output);

beforeEach(() => {
  consoleOutput = [];
  console.log = mockedLog;
  console.error = mockedLog;
  console.group = mockedLog;
  console.groupCollapsed = mockedLog;
  console.groupEnd = jest.fn();
  console.warn = mockedLog;
});

describe('Custom Log Operator', () => {
  it('should log subscription, emissions, and completion correctly', () => {
    const source$ = of(1, 2, 3).pipe(
      log('TestObservable', TapCallback.All, '#FF5733')
    );

    source$.subscribe({
      next: () => {},
      complete: () => {}
    });

    expect(consoleOutput).toContain(expect.stringContaining('TestObservable [SUBSCRIBE]'));
    expect(consoleOutput).toContain(expect.stringContaining('TestObservable [NEXT]'));
    expect(consoleOutput).toContain(expect.stringContaining('TestObservable [COMPLETE]'));
    expect(consoleOutput).toContain(expect.stringContaining('Active subscriptions: 0'));
  });

  it('should log errors when observable emits an error', () => {
    const source$ = new Observable((subscriber) => {
      subscriber.error(new Error('Test Error'));
    }).pipe(
      log('ErrorObservable', TapCallback.All, '#FF0000')
    );

    source$.subscribe({
      error: () => {}
    });

    expect(consoleOutput).toContain(expect.stringContaining('ErrorObservable [ERROR]'));
    expect(consoleOutput).toContain(expect.stringContaining('Test Error'));
  });
});
