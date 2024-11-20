//
// src/logOperator.ts
// -----------------------------------------------------------
import { Observable, defer, tap } from "rxjs";
import { pickTextColor, getLogStyle } from "./colorUtils";

export enum TapCallback {
  All,
  Next,
  Complete,
  Error,
  Subscribe,
  Unsubscribe,
  Finalize,
  None,
}

let activeSubscriptions = 0;

export function log(
  label = "CUSTOM-LOG",
  callbacks: TapCallback = TapCallback.Next,
  bgColor = "#0000FF",
  collapseGroup = true,
  //   verbose = false,
  onError?: (err: any) => void
) {
  const defaultStyle = {
    bgColor,
    color: pickTextColor(bgColor, "#FFFFFF", "#000000"),
    fontSize: "10px",
    fontWeight: "bold",
    padding: "3px",
    borderRadius: "2px",
  };

  const { color: tColor } = defaultStyle;
  const style = getLogStyle(defaultStyle.bgColor, tColor);

  return function <T>(source: Observable<T>): Observable<T> {
    return defer(() => {
      if (
        callbacks === TapCallback.Subscribe ||
        callbacks === TapCallback.All
      ) {
        activeSubscriptions++;
        console.log(
          `%c${label} [SUBSCRIBE] - Active subscriptions: ${activeSubscriptions}`,
          style
        );
      }

      return new Observable<T>((subscriber) => {
        const subscription = source.subscribe(subscriber);

        subscription.add(() => {
          if (
            callbacks === TapCallback.Unsubscribe ||
            callbacks === TapCallback.All
          ) {
            activeSubscriptions--;
            console.log(
              `%c${label} [UNSUBSCRIBE] - Active subscriptions: ${activeSubscriptions}`,
              style
            );
            if (activeSubscriptions > 10) {
              console.warn(
                `⚠️ WARNING: High number of active subscriptions (${activeSubscriptions}) detected in ${label}. Possible memory leak.`
              );
            }
          }
        });

        return subscription;
      }).pipe(
        tap({
          next: (value: T) => {
            if (
              callbacks === TapCallback.Next ||
              callbacks === TapCallback.All
            ) {
              if (collapseGroup) {
                console.groupCollapsed(`%c${label} [NEXT]`, style);
              } else {
                console.group(`%c${label} [NEXT]`, style);
              }
              console.log(value);
              console.groupEnd();
            }
          },
          complete: () => {
            if (
              callbacks === TapCallback.Complete ||
              callbacks === TapCallback.All
            ) {
              console.log(`%c${label} [COMPLETE]`, style);
            }
          },
          error: (err: any) => {
            if (
              callbacks === TapCallback.Error ||
              callbacks === TapCallback.All
            ) {
              console.error(`%c${label} [ERROR]`, style, err.message);
              onError && onError(err);
            }
          },
        })
      );
    });
  };
}
