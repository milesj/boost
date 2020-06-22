# Errors

Each package should contain a scoped error class, created with the `@boost/internal` package's
`createScopedError` function. This function requires a mapping of error codes to error messages.

## Code guidelines

Each code should follow the format of `<feature>_<category>`, where category is in the form of one
of the following:

- `UNKNOWN`, `UNKNOWN_*` - A value is unknown.
- `UNSUPPORTED`, `UNSUPPORTED_*` - A value is not supported currently.
- `INVALID_*` - A value is invalid.
- `REQUIRED`, `REQUIRED_*` - A value is missing.
- `DEFINED`, `PROVIDED` - A value already exists.
- `ONLY_*` - Only _this_ can be used.
- `NO`, `NON`, `NOT` - Disallow a specific value or symbol from being used.
- `*` - Other applicable actions/verbs.

## Interpolation

The following interpolated values should be wrapped with double quotes:

- User provided
- File paths

The following values should use backticks.

- Code provided values
- Hard coded file names (`package.json`, etc)
