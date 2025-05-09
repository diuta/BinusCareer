export function removeEmptyStringAndArray(obj: Object) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, v]) =>
        v != null &&
        (!(Array.isArray(v) || typeof v === 'string') || v.length > 0)
    )
  );
}
