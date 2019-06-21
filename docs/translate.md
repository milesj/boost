# Translations

## Installation

```
yarn add @boost/translate
```

## Environment Variables

- `LANGUAGE`, `LANG` - The locale to explicitly use for translation loading.

## Usage

### Options

The following options can be defined when creating a translator. They _cannot_ be customized after
the fact.

- `autoDetect` (`boolean`) - Automatically detect the locale from the environment. Defaults to
  `true`.
- `debug` (`boolean`) - Enable i18next debugging by logging info to the console. Defaults to
  `false`.
- `fallbackLocale` (`Locale | Locale[]`) - Fallback locale(s) to use when the detected locale isn't
  translated. Defaults to `en`.
- `locale` (`Locale`) - Locale to explicitly use.
- `lookupType` (`'all' | 'currentOnly' | 'languageOnly'`) - Order in which to load and lookup locale
  translations. Based on the i18next `load` option.
- `resourceFormat` (`'js' | 'json' | 'yaml'`) - File format resource bundles are written in.
  Defaults to `yaml`.

### Locale Detection

To load resource bundles, we require a locale. A locale is code based representation of a human
language and is based on [IETF language tags](https://en.wikipedia.org/wiki/IETF_language_tag).
Boost locales align with ISO 639, with the language being lowercased (`en`), and the optional region
being uppercased and separated by a dash (`en-US`).

The current locale is automatically detected from the environment using the following lookup
strategies, one by one, until a valid locale is found.

- Defined by the `locale` option or through the translator's `changeLocale` method.
- Passed on the command line with the `--locale` option.
- Defined a `LANGUAGE` or `LANG` environment variable.
- Inherited from the operating system.

### Resource Bundles

A resource bundle is a collection of [namespaced](#namespaces) [translation](#translations) files
for a single locale, located within a resource path passed to `createTranslator`.

An example file structure of a resources folder may look something like the following.

```
res/
├── en/
│   ├── common.yaml
│   ├── errors.yaml
│   └── validations.yaml
├── en-GB/
│   ├── common.yaml
│   └── validations.yaml
└── fr/
    └── ...
```

#### Namespaces

A [namespace](https://www.i18next.com/principles/namespaces) is a file that contains
[translations](#translations), is located within a locale folder, and can be written in JavaScript,
JSON, or YAML (default and preferred).

```js
// res/en/common.js
module.exports = {
  welcome: 'Hello {{name}}!',
};
```

```json
// res/en/common.json
{
  "welcome": "Hello {{name}}!"
}
```

```yaml
# res/en/common.yaml
welcome: 'Hello {{name}}!'
```

When retrieving messages with the translator function, the target namespace can be defined by
prefixing the namespace before the key and separating with a colon.

```ts
msg('common:hello'); // Hello {{name}}!
```

#### Translations
