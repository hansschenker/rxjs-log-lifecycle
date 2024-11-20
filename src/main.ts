
import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { log, TapCallback } from './logOperator';

// Example RxJS Pipeline using the Custom Log Operator
// -----------
const source$ = interval(1000).pipe(
  take(5),
  log('IntervalObservable', TapCallback.Subscribe, '#e74c3c'),
  map((value) => value * 10),
  log('MappedObservable', TapCallback.Next, '#8e44ad'),
  log('FinalObservable', TapCallback.All, '#2ecc71')
);

source$.subscribe({
  next: (value) => console.log('Pipeline Output:', value),
  complete: () => console.log('Pipeline complete')
});

// Mermaid Dataflow Diagram for the Pipeline
// -----------------------------------------------------------
// ```mermaid
// graph TD;
//   A[Start - IntervalObservable] -->|take(5)| B[IntervalObservable]
//   B -->|map(value => value * 10)| C[MappedObservable]
//   C --> D[FinalObservable]
//   D --> E[Pipeline Output]
//   B -->|log: Subscribe| F[Log - IntervalObservable]
//   C -->|log: Next| G[Log - MappedObservable]
//   D -->|log: All| H[Log - FinalObservable]
// ```





// 5. Styling (Optional)
// -----------------------------------------------------------
// Add CSS to style the HTML elements or debug output if needed.
// src/styles/style.css
/* Optional styling for custom debugging outputs */

// 6. Run the Project
// -----------------------------------------------------------
// Start the development server using Vite:
// npm run dev

// Now you can explore the RxJS `log` operator in your browser console.
