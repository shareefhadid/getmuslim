export const parseFloatParam = (value: unknown) =>
  value ? parseFloat(value as string) : undefined; 