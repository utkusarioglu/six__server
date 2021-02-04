/**
 * Error messages for Model abstract class
 */
export const ERROR_MESSAGES = {
  PREMATURE_TABLE_CALL: 'Attempt to use a table before calling createTable',
  BLOCK_IN_PRODUCTION:
    'This method is set to be ignored in environments other than dev',
  AS_NEEDS_TO_BE_DEFINED: `Column "$1" requires "alterations.as" to be defined`,
  COLUMN_NAME_ILLEGAL: `Column statement $1 doesn't meet requirements`,
  MODEL_ERROR: 'Model error: \n$1',
};
