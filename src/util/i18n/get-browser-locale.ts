export default function getBrowserLocale (options: { languageCodeOnly?: boolean } = {}) {
  const defaultOptions = { languageCodeOnly: false }

  const opt = { ...defaultOptions, ...options }

  const navigatorLocale =
    navigator.languages !== undefined
      ? navigator.languages[0]
      : navigator.language

  if (!navigatorLocale) {
    return undefined
  }

  return opt.languageCodeOnly
    ? navigatorLocale.trim().split(/[-_]/)[0]
    : navigatorLocale.trim()
}
