/**
 * Converts an object to a FormData instance for API submissions.
 *
 * @param {Record<string, any>} data - The data to convert
 * @returns {FormData} The resulting FormData
 */
export function toFormData<T extends Record<string, any>>(data: T): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(key, item);
      });
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return formData;
}
