import Vue from 'vue'
import VueI18n, { LocaleMessages } from 'vue-i18n'
import getBrowserLocale from '@/util/i18n/get-browser-locale'
import router from '@/router'

Vue.use(VueI18n)

const supportedLocales = {
  de: 'german',
  fr: 'french',
  it: 'italian'
}

function loadLocaleMessages (): LocaleMessages {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages: LocaleMessages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

export function getStartingLocale () {
  const browserLocale = getBrowserLocale({ languageCodeOnly: true })

  if (browserLocale && Object.keys(supportedLocales).includes(browserLocale)) {
    return browserLocale
  } else {
    return process.env.VUE_APP_I18N_LOCALE || 'de'
  }
}

export default new VueI18n({
  locale: getStartingLocale(),
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'de',
  messages: loadLocaleMessages()
})
