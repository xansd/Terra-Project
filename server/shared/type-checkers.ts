export function isNil(value: unknown): value is undefined | null {
  return value === undefined || value === null;
}

export function isInteger(value: unknown): value is number {
  return Number.isInteger(value);
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isBoolean(value: unknown): value is boolean {
  return (
    value === true ||
    value === false ||
    value === "true" ||
    value === "false" ||
    value === 1 ||
    value === 0
  );
}

export function isEmpty<T>(value: string | T[]): boolean {
  return value.length === 0;
}

export function isValueInEnum<Enum>(
  value: unknown,
  enumerator: Record<string, unknown>
): value is Enum {
  for (const key in enumerator) {
    if (enumerator[key] === value) {
      return true;
    }
  }
  return false;
}
