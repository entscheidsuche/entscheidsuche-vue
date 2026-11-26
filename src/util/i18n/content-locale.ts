// The decisions, their titles and abstracts and the names of courts exist in German, French and
// Italian only. For any other interface language (English) the German texts are shown.
const contentLocales = ['de', 'fr', 'it']

export default function contentLocale (locale: string): string {
  const lang = (locale || '').toLowerCase()
  return contentLocales.includes(lang) ? lang : 'de'
}
