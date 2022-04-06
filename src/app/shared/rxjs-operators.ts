import { OperatorFunction } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export function isNotNullOrUndefined<T>(value: T | undefined | null): value is T {
  return value !== null && value !== undefined;
}

/**
 * Filter out null and undefined values from the source in a type-safe way. Equivalent to `filter((value) => !!value)`
 * but using a type guard to allow Typescript to infer that subsequent emissions have a value.
 * @deprecated use assertNonNullish() instead
 */
export function nonNullOrUndefined<T>(): OperatorFunction<T | null | undefined, T> {
  return (source$) => source$.pipe(filter(isNotNullOrUndefined));
}

export function assertNonNullish<T>(): OperatorFunction<T | null | undefined, T> {
  return (source$) =>
    source$.pipe(
      map((value) => {
        if (!isNotNullOrUndefined(value)) {
          throw new Error('Expected non-nullish value');
        }
        return value;
      })
    );
}
