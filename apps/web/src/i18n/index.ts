export {
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_LABELS,
  LOCALE_NAMES,
  HTML_LANG,
  type Locale,
} from "./locales";
export type { Messages } from "./types";
export { LocaleProvider, useLocale, useMessages, useT } from "./LocaleProvider";
export { pt } from "./messages/pt";
export { en } from "./messages/en";
export { es } from "./messages/es";
