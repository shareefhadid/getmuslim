export const parseNumericParam = (value: unknown) =>
  value ? parseInt(value as string) : undefined; 