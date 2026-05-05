import axios from 'axios'

// =============================================================================
// Datenquellen
// =============================================================================

const FACETTEN_URL = 'https://entscheidsuche.ch/docs/Facetten_alle.json'
// Trigger statt direkter File-Zugriff: das Skript regeneriert den Cache, sobald
// ein neuer Job-Lauf vorliegt, und liefert anschließend die aktuelle status.json
// als Antwort zurück.
const STATUS_URL = 'https://entscheidsuche.ch/generate_status.php'
const SEARCH_URL = 'https://entscheidsuche.ch/_searchV2.php'

// =============================================================================
// Typen
// =============================================================================

export interface Kammer {
  spider: string
  de?: string
  fr?: string
  it?: string
}
export interface Gericht {
  de: string
  fr: string
  it: string
  kammern: { [k: string]: Kammer }
}
export interface Kanton {
  de: string
  fr: string
  it: string
  gerichte: { [g: string]: Gericht }
}
export type Facetten = { [k: string]: Kanton }

export interface SpiderRunSig { gesamt: number; aktuell_neu: number }
export interface SpiderLetzterLauf {
  zeit: string | null
  erfolgreich: boolean
  anzahl_fehler: number
}
export interface SpiderLetzterErfolg {
  zeit: string | null
  gesamt: number
  aktuell_neu: number
  anzahl_fehler: number
}
export interface SpiderStatus {
  letzter_lauf?: SpiderLetzterLauf
  letzter_erfolgreicher_lauf?: SpiderLetzterErfolg
  fehlversuche_seit_letzter_erfolg: number
  vergleich_90_tage_gesamt_max: number
  signaturen?: { [kammer: string]: SpiderRunSig }
}
export interface StatusData {
  generated: string
  spider_count: number
  spiders: { [spider: string]: SpiderStatus }
}

export interface ESCounts {
  total: { [hierarchy: string]: number }
  d1: { [hierarchy: string]: number }
  d7: { [hierarchy: string]: number }
  d30: { [hierarchy: string]: number }
}

// =============================================================================
// Loader (3 Calls parallel)
// =============================================================================

const ES_QUERY = {
  size: 0,
  track_total_hits: true,
  query: { match_all: {} },
  aggs: {
    total: { terms: { field: 'hierarchy', size: 1000 } },
    since_1d: {
      filter: { range: { scrapedate: { gte: 'now-1d/d' } } },
      aggs: { per_h: { terms: { field: 'hierarchy', size: 1000 } } }
    },
    since_7d: {
      filter: { range: { scrapedate: { gte: 'now-7d/d' } } },
      aggs: { per_h: { terms: { field: 'hierarchy', size: 1000 } } }
    },
    since_30d: {
      filter: { range: { scrapedate: { gte: 'now-30d/d' } } },
      aggs: { per_h: { terms: { field: 'hierarchy', size: 1000 } } }
    }
  }
}

function bucketsToMap (buckets: any[]): { [k: string]: number } {
  const m: { [k: string]: number } = {}
  for (const b of buckets || []) {
    if (b && typeof b.key === 'string') m[b.key] = +b.doc_count
  }
  return m
}

export async function ladeAlles (): Promise<{
  facetten: Facetten
  status: StatusData
  es: ESCounts
}> {
  const [fResp, sResp, esResp] = await Promise.all([
    axios.get(FACETTEN_URL),
    axios.get(STATUS_URL),
    axios.post(SEARCH_URL, ES_QUERY, {
      headers: { 'Content-Type': 'application/json' }
    })
  ])
  const aggs = esResp.data.aggregations || {}
  const es: ESCounts = {
    total: bucketsToMap(aggs.total ? aggs.total.buckets : []),
    d1: bucketsToMap(aggs.since_1d ? aggs.since_1d.per_h.buckets : []),
    d7: bucketsToMap(aggs.since_7d ? aggs.since_7d.per_h.buckets : []),
    d30: bucketsToMap(aggs.since_30d ? aggs.since_30d.per_h.buckets : [])
  }
  return {
    facetten: fResp.data,
    status: sResp.data,
    es
  }
}

// =============================================================================
// Farb-Logik
// =============================================================================

export type Color = 'green' | 'yellow' | 'orange' | 'red'
const ORDER: { [c in Color]: number } = { green: 0, yellow: 1, orange: 2, red: 3 }

function maxColor (farben: Color[]): Color {
  let best: Color = 'green'
  for (const f of farben) {
    if (ORDER[f] > ORDER[best]) best = f
  }
  return best
}

/** "2026-05-04_07:06:20" → Date */
export function parseLaufZeit (s: string | null | undefined): Date | null {
  if (!s) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})_(\d{2}):(\d{2}):(\d{2})/.exec(s)
  if (!m) return null
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]))
}

function tageZeit (zeit: string | null | undefined): number | null {
  const d = parseLaufZeit(zeit)
  if (!d) return null
  return (Date.now() - d.getTime()) / 86400000
}

function ampelZeit (zeit: string | null | undefined): Color {
  const t = tageZeit(zeit)
  if (t === null) return 'red'
  if (t < 2) return 'green'
  if (t < 3) return 'yellow' // genau zwei Tage her = Gelb
  if (t < 10) return 'orange'
  return 'red'
}

function ampelBestand (gesamt: number, max: number): Color | null {
  if (max <= 0) return null
  const r = gesamt / max
  if (r >= 1.0) return 'green'
  if (r > 0.95) return 'yellow'
  if (r > 0.90) return 'orange'
  return 'red'
}

function ampelFehler (n: number): Color {
  if (n === 0) return 'green'
  if (n <= 2) return 'yellow'
  return 'orange' // mehr als 2 Fehler nie rot
}

/** Farbe eines einzelnen Spiders über die drei Achsen Zeit / Bestand / Fehler. */
export function spiderAmpel (s: SpiderStatus): Color {
  const e = s.letzter_erfolgreicher_lauf
  if (!e) return 'red'
  const arr: Color[] = [ampelZeit(e.zeit), ampelFehler(e.anzahl_fehler)]
  const ab = ampelBestand(e.gesamt, s.vergleich_90_tage_gesamt_max)
  if (ab) arr.push(ab)
  return maxColor(arr)
}

/**
 * Farbe einer Hierarchieebene aus den Farben der beteiligten Spider.
 * Sonderfall: ein einzelner roter Scraper unter sonst gelben/grünen → orange.
 */
export function aggregatAmpel (farben: Color[]): Color | null {
  if (farben.length === 0) return null
  const rot = farben.filter(f => f === 'red').length
  const orange = farben.filter(f => f === 'orange').length
  if (rot === 1 && orange === 0) return 'orange'
  return maxColor(farben)
}

// =============================================================================
// Hierarchie-Modell für Ansicht (a)
// =============================================================================

export interface HierarchyRow {
  key: string
  parent: string | null
  level: 0 | 1 | 2 | 3 // Total / Kanton / Gericht / Kammer
  label: string
  bestand: number
  seit1d: number
  seit7d: number
  seit30d: number
  spider: string | null // einzelner Spider (auf Kammer-Ebene)
  spiders: string[] // alle beteiligten Spider (Kanton/Gericht/Total)
  letzterLauf: string | null // Datum des jüngsten erfolgreichen Laufs
  color: Color | null
  searchFilter: string // Hierarchie-Schlüssel für /search?filter=h@<...>
  hatKinder: boolean
}

interface I18nKey { de: string; fr: string; it: string }

function getName (obj: I18nKey, lang: string): string {
  if (lang === 'fr' && obj.fr) return obj.fr
  if (lang === 'it' && obj.it) return obj.it
  return obj.de || obj.fr || obj.it || ''
}

/** Aggregat über mehrere Spider: schlechteste Farbe (mit Sonderfall). */
function spidersAmpel (spiders: string[], status: StatusData): Color | null {
  const farben: Color[] = []
  for (const sp of spiders) {
    const s = status.spiders[sp]
    if (s) farben.push(spiderAmpel(s))
  }
  return aggregatAmpel(farben)
}

/** Jüngster letzter erfolgreicher Lauf über mehrere Spider. */
function jüngsterErfolg (spiders: string[], status: StatusData): string | null {
  let best: string | null = null
  for (const sp of spiders) {
    const z = status.spiders[sp] && status.spiders[sp].letzter_erfolgreicher_lauf
      ? (status.spiders[sp].letzter_erfolgreicher_lauf as SpiderLetzterErfolg).zeit
      : null
    if (z && (best === null || z > best)) best = z
  }
  return best
}

/**
 * Sortiert Kantons-Schlüssel alphabetisch, schiebt aber 'CH' (Eidgenossenschaft)
 * an den Anfang und 'TA' (Schiedsgerichte) ans Ende.
 */
function sortKantonKeys (keys: string[]): string[] {
  const rest = keys.filter(k => k !== 'CH' && k !== 'TA').sort()
  const out: string[] = []
  if (keys.includes('CH')) out.push('CH')
  out.push(...rest)
  if (keys.includes('TA')) out.push('TA')
  return out
}

const XX_UPLOAD = 'XX_Upload'

/**
 * Sortiert Spider-Namen alphabetisch, schiebt aber XX_Upload ans Ende.
 */
function sortSpiderNamen (spiders: string[]): string[] {
  const rest = spiders.filter(s => s !== XX_UPLOAD).sort()
  return spiders.includes(XX_UPLOAD) ? [...rest, XX_UPLOAD] : rest
}

/**
 * Hat ein Spider in einer einzelnen Kammer Dokumente? Prüft ES und den
 * letzten erfolgreichen Lauf-Stand.
 */
function kammerHatDaten (
  kKey: string, sp: string, status: StatusData, es: ESCounts
): boolean {
  if ((es.total[kKey] || 0) > 0) return true
  if ((es.d1[kKey] || 0) > 0) return true
  if ((es.d7[kKey] || 0) > 0) return true
  if ((es.d30[kKey] || 0) > 0) return true
  const s = status.spiders[sp]
  if (s && s.signaturen && s.signaturen[kKey] && s.signaturen[kKey].gesamt > 0) {
    return true
  }
  return false
}

/**
 * Hat ein Spider in einer bestimmten Kammer-Menge tatsächlich Dokumente
 * geliefert? Wird genutzt, um etwa XX_Upload nur dann in der Spider-Liste
 * einer Hierarchieebene zu zeigen, wenn dort tatsächlich etwas eingespielt
 * wurde.
 */
function spiderHatDatenInKammern (
  sp: string, kammern: string[], status: StatusData, es: ESCounts
): boolean {
  for (const k of kammern) {
    if (kammerHatDaten(k, sp, status, es)) return true
  }
  return false
}

/** Eine Hierarchie-Zeile gilt als leer, wenn nichts gefunden wurde. */
function rowIstLeer (r: HierarchyRow, status: StatusData): boolean {
  if (r.bestand > 0 || r.seit1d > 0 || r.seit7d > 0 || r.seit30d > 0) return false
  // wenn ein zugehöriger Spider mal erfolgreich war: nicht leer
  for (const sp of r.spiders) {
    const s = status.spiders[sp]
    const e = s && s.letzter_erfolgreicher_lauf
    if (e && e.gesamt > 0) return false
  }
  return true
}

export function buildHierarchyRows (
  facetten: Facetten,
  status: StatusData,
  es: ESCounts,
  lang: string
): HierarchyRow[] {
  const rows: HierarchyRow[] = []
  const kantonKeys = sortKantonKeys(Object.keys(facetten))

  // 1) Pro Kanton/Gericht/Kammer
  const totalSpidersToKammern: { [sp: string]: string[] } = {}
  for (const cKey of kantonKeys) {
    const c = facetten[cKey]
    const cSpiderToKammern: { [sp: string]: string[] } = {}
    for (const gKey of Object.keys(c.gerichte || {})) {
      const g = c.gerichte[gKey]
      for (const kKey of Object.keys(g.kammern || {})) {
        const sp = g.kammern[kKey].spider
        if (!sp) continue
        if (!cSpiderToKammern[sp]) cSpiderToKammern[sp] = []
        cSpiderToKammern[sp].push(kKey)
        if (!totalSpidersToKammern[sp]) totalSpidersToKammern[sp] = []
        totalSpidersToKammern[sp].push(kKey)
      }
    }
    const cSpidersGefiltert = Object.keys(cSpiderToKammern).filter(sp =>
      spiderHatDatenInKammern(sp, cSpiderToKammern[sp], status, es)
    )
    const cSpidersSortiert = sortSpiderNamen(cSpidersGefiltert)
    rows.push({
      key: cKey,
      parent: '_total',
      level: 1,
      label: getName(c, lang),
      bestand: es.total[cKey] || 0,
      seit1d: es.d1[cKey] || 0,
      seit7d: es.d7[cKey] || 0,
      seit30d: es.d30[cKey] || 0,
      spider: null,
      spiders: cSpidersSortiert,
      letzterLauf: jüngsterErfolg(cSpidersSortiert, status),
      color: spidersAmpel(cSpidersSortiert, status),
      searchFilter: cKey,
      hatKinder: true
    })

    for (const gKey of Object.keys(c.gerichte || {})) {
      const g = c.gerichte[gKey]
      const gKammern = Object.keys(g.kammern || {})
      const gSpiderToKammern: { [sp: string]: string[] } = {}
      for (const kKey of gKammern) {
        const sp = g.kammern[kKey].spider
        if (!sp) continue
        if (!gSpiderToKammern[sp]) gSpiderToKammern[sp] = []
        gSpiderToKammern[sp].push(kKey)
      }
      const gSpidersGefiltert = Object.keys(gSpiderToKammern).filter(sp =>
        spiderHatDatenInKammern(sp, gSpiderToKammern[sp], status, es)
      )
      const gSpidersSortiert = sortSpiderNamen(gSpidersGefiltert)
      rows.push({
        key: gKey,
        parent: cKey,
        level: 2,
        label: getName(g, lang),
        bestand: es.total[gKey] || 0,
        seit1d: es.d1[gKey] || 0,
        seit7d: es.d7[gKey] || 0,
        seit30d: es.d30[gKey] || 0,
        spider: null,
        spiders: gSpidersSortiert,
        letzterLauf: jüngsterErfolg(gSpidersSortiert, status),
        color: spidersAmpel(gSpidersSortiert, status),
        searchFilter: gKey,
        hatKinder: gKammern.length > 0
      })
      for (const kKey of gKammern) {
        const k = g.kammern[kKey]
        const sp = k.spider
        const s = sp ? status.spiders[sp] : undefined
        rows.push({
          key: kKey,
          parent: gKey,
          level: 3,
          label: getName(k as any, lang),
          bestand: es.total[kKey] || 0,
          seit1d: es.d1[kKey] || 0,
          seit7d: es.d7[kKey] || 0,
          seit30d: es.d30[kKey] || 0,
          spider: sp,
          spiders: sp ? [sp] : [],
          letzterLauf: s && s.letzter_erfolgreicher_lauf ? s.letzter_erfolgreicher_lauf.zeit : null,
          color: s ? spiderAmpel(s) : null,
          searchFilter: kKey,
          hatKinder: false
        })
      }
    }
  }

  // 2) Total-Zeile als oberster Eintrag (über alle Kantone)
  let totalBestand = 0
  let totalD1 = 0
  let totalD7 = 0
  let totalD30 = 0
  for (const cKey of kantonKeys) {
    totalBestand += es.total[cKey] || 0
    totalD1 += es.d1[cKey] || 0
    totalD7 += es.d7[cKey] || 0
    totalD30 += es.d30[cKey] || 0
  }
  const totalSpidersGefiltert = Object.keys(totalSpidersToKammern).filter(sp =>
    spiderHatDatenInKammern(sp, totalSpidersToKammern[sp], status, es)
  )
  const tSpiders = sortSpiderNamen(totalSpidersGefiltert)
  rows.unshift({
    key: '_total',
    parent: null,
    level: 0,
    label: '', // wird im Template via $t('Schweiz') gesetzt
    bestand: totalBestand,
    seit1d: totalD1,
    seit7d: totalD7,
    seit30d: totalD30,
    spider: null,
    spiders: tSpiders,
    letzterLauf: jüngsterErfolg(tSpiders, status),
    color: spidersAmpel(tSpiders, status),
    searchFilter: '',
    hatKinder: true
  })

  // Leere Zeilen ausfiltern: erst Kammern, dann Gerichte (wenn alle ihre
  // Kammern weg sind), dann Kantone. Total bleibt immer.
  const behalten = new Set<string>()
  for (const r of rows) {
    if (r.level === 3 && !rowIstLeer(r, status)) behalten.add(r.key)
  }
  for (const r of rows) {
    if (r.level === 2) {
      const hatKind = rows.some(c => c.parent === r.key && behalten.has(c.key))
      if (hatKind || !rowIstLeer(r, status)) behalten.add(r.key)
    }
  }
  for (const r of rows) {
    if (r.level === 1) {
      const hatKind = rows.some(c => c.parent === r.key && behalten.has(c.key))
      if (hatKind || !rowIstLeer(r, status)) behalten.add(r.key)
    }
  }
  return rows.filter(r => r.level === 0 || behalten.has(r.key))
}

// =============================================================================
// Scraper-Modell für Ansicht (b)
// =============================================================================

export interface ScraperRow {
  spider: string
  letzterLauf: string | null // letzter erfolgreicher Lauf (Zeit)
  letzterLaufRoh: string | null // allerletzter Lauf (Zeit)
  bestandES: number // ES-Bestand summiert über alle Kammern
  bestandLog: number // Bestand laut letztem erfolgreichen Lauf
  last: number // aktuell_neu im letzten erfolgreichen Lauf
  seit1d: number // ES seit gestern, summiert über alle Kammern
  seit7d: number // ES seit Vorwoche, summiert über alle Kammern
  seit30d: number // ES seit Vormonat, summiert über alle Kammern
  fehlerlaeufe: number
  einzelfehler: number
  color: Color
  ampelGruende: AmpelGrund[] // für den Ampel-Tooltip
  kammern: HierarchyRow[] // Kammern aus Facetten dieses Spiders
}

export interface AmpelGrund {
  achse: 'zeit' | 'bestand' | 'fehler'
  color: Color
  /** {zeit_pre} <wert> {zeit_post}; bei zeit auch wert=null möglich (kein Lauf) */
  wert: number | null
}

/** Gibt eine Liste der Ampel-Gründe pro Achse zurück (auch grüne, für Tooltip). */
export function ampelGruende (s: SpiderStatus): AmpelGrund[] {
  const e = s.letzter_erfolgreicher_lauf
  const out: AmpelGrund[] = []
  if (!e) {
    out.push({ achse: 'zeit', color: 'red', wert: null })
    return out
  }
  const t = tageZeit(e.zeit)
  out.push({ achse: 'zeit', color: ampelZeit(e.zeit), wert: t === null ? null : Math.floor(t) })
  const max = s.vergleich_90_tage_gesamt_max
  if (max > 0) {
    const prozent = Math.round((e.gesamt / max) * 100)
    const c = ampelBestand(e.gesamt, max)
    if (c) out.push({ achse: 'bestand', color: c, wert: prozent })
  }
  out.push({ achse: 'fehler', color: ampelFehler(e.anzahl_fehler), wert: e.anzahl_fehler })
  return out
}

export function buildScraperRows (
  facetten: Facetten,
  status: StatusData,
  es: ESCounts,
  lang: string
): ScraperRow[] {
  // Spider → Liste der Kammer-Hierarchien sammeln. Kammern, die für diesen
  // Spider weder im ES Bestand haben noch im letzten erfolgreichen Lauf-Stand
  // auftauchen (z.B. die XX_Upload-Kammer eines Kantons, in den noch nie
  // etwas hochgeladen wurde), werden ausgefiltert.
  const sp2hier: { [sp: string]: HierarchyRow[] } = {}
  for (const cKey of Object.keys(facetten)) {
    const c = facetten[cKey]
    for (const gKey of Object.keys(c.gerichte || {})) {
      const g = c.gerichte[gKey]
      for (const kKey of Object.keys(g.kammern || {})) {
        const k = g.kammern[kKey]
        const sp = k.spider
        if (!sp) continue
        if (!kammerHatDaten(kKey, sp, status, es)) continue
        const label = `${getName(c, lang)} · ${getName(g, lang)} · ${getName(k as any, lang) || kKey}`
        const row: HierarchyRow = {
          key: kKey,
          parent: sp,
          level: 3,
          label,
          bestand: es.total[kKey] || 0,
          seit1d: es.d1[kKey] || 0,
          seit7d: es.d7[kKey] || 0,
          seit30d: es.d30[kKey] || 0,
          spider: sp,
          spiders: [sp],
          letzterLauf: null,
          color: null,
          searchFilter: kKey,
          hatKinder: false
        }
        if (!sp2hier[sp]) sp2hier[sp] = []
        sp2hier[sp].push(row)
      }
    }
  }

  const rows: ScraperRow[] = []
  for (const sp of sortSpiderNamen(Object.keys(status.spiders))) {
    const s = status.spiders[sp]
    const er = s.letzter_erfolgreicher_lauf
    const ll = s.letzter_lauf
    const kammern = (sp2hier[sp] || []).sort((a, b) => a.key.localeCompare(b.key))
    let bestandES = 0
    let seit1dES = 0
    let seit7dES = 0
    let seit30dES = 0
    for (const k of kammern) {
      bestandES += k.bestand
      seit1dES += k.seit1d
      seit7dES += k.seit7d
      seit30dES += k.seit30d
    }
    const bestandLog = er ? er.gesamt : 0
    // leere Spider: nichts im ES, kein erfolgreicher Lauf-Bestand
    if (bestandES === 0 && bestandLog === 0 && seit1dES === 0 && seit7dES === 0 && seit30dES === 0) {
      continue
    }
    rows.push({
      spider: sp,
      letzterLauf: er ? er.zeit : null,
      letzterLaufRoh: ll ? ll.zeit : null,
      bestandES,
      bestandLog,
      last: er ? er.aktuell_neu : 0,
      seit1d: seit1dES,
      seit7d: seit7dES,
      seit30d: seit30dES,
      fehlerlaeufe: s.fehlversuche_seit_letzter_erfolg,
      einzelfehler: er ? er.anzahl_fehler : 0,
      color: spiderAmpel(s),
      ampelGruende: ampelGruende(s),
      kammern
    })
  }
  return rows
}

// =============================================================================
// Datums-Helpers fürs UI
// =============================================================================

export function formatDatumDDMMYYYY (d: Date): string {
  const pad = (n: number) => (n < 10 ? '0' + n : '' + n)
  return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear()
}

/** "2026-05-04_07:06:20" → "04.05.2026" */
export function formatLaufDatum (s: string | null | undefined): string {
  const d = parseLaufZeit(s)
  return d ? formatDatumDDMMYYYY(d) : '–'
}

/** Heute-N als Date */
export function tageVorher (n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(0, 0, 0, 0)
  return d
}
