/**
 * An identity function that allows the validation of endpoint strings through
 * the defined generic value
 *
 * @param endpoint endpoint string to validate
 */
export const validateEndpoint: <T extends string>(endpoint: T) => string = (
  endpoint
) => endpoint;
