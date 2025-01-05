export const logError = (context: string, error: unknown) => {
  if (import.meta.dev) {
    console.error(`[${context}] Error:`, JSON.stringify(error, null, 2));
  }
}; 