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
const SNAPSHOT_DIR_URL = 'https://entscheidsuche.ch/docs/Snapshots'
const INDEXER_STATUS_URL = 'https://entscheidsuche.ch/docs/Indexer/status.json'

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

// =============================================================================
// Indexer-Status (docs/Indexer/status.json — vom Konsolidator gepflegt)
// =============================================================================

// Schema (Konsolidator nach Umbau auf feeder_status.php):
//
//   {
//     "letzte_aktualisierung": "…",
//     "gesamt":  { "spider": N, "ok": A, "offen": B, "kritisch": C, "kaputt": D },
//     "spiders": {
//        "<name>": {
//          "zustand":       "ok" | "offen" | "kritisch",
//          "job":           string | null,
//          "grund":         string | null,   // nur bei kritisch
//          "seit":          string | null,   // ISO-Z: Zustand-Beginn
//          "letzter_ok":    string | null,   // ISO-Z: letzter erfolgreicher Push
//          "kaputt":        int,             // # Dokumente in Quarantäne
//          "offene_reports": int             // # unverarbeitete Reports auf Cyon
//        }
//     }
//   }

export type IndexerZustand = 'ok' | 'offen' | 'kritisch'

export interface IndexerSpiderStatus {
  zustand: IndexerZustand
  job: string | null
  grund: string | null
  seit: string | null
  letzter_ok: string | null
  kaputt: number
  offene_reports: number
}

export interface IndexerGesamt {
  spider: number
  ok: number
  offen: number
  kritisch: number
  kaputt: number
}

export interface IndexerStatus {
  /** ISO-Z des letzten Schreib-Ticks (nicht der aktuelle Zeitpunkt). */
  letzte_aktualisierung: string
  gesamt: IndexerGesamt
  spiders: { [spider: string]: IndexerSpiderStatus }
}

/**
 * Snapshot-Map (Bestand pro hierarchy zu einem Zeitpunkt). null als ganzes,
 * wenn für einen Stichtag kein Snapshot existiert.
 */
export type SnapshotMap = { [hierarchy: string]: number } | null

/**
 * Ein tatsächlich geladener Snapshot, ausgewählt durch die Slot-Logik.
 * tageZurueck ≠ Slot-Ziel: der nächstkleinere verfügbare Wert.
 */
export interface SnapshotInfo {
  /** 1–365 oder der Fallback-Wert. */
  tageZurueck: number
  /** 'YYYY-MM-DD' */
  datum: string
  total: { [hierarchy: string]: number }
}

export interface ESCounts {
  total: { [hierarchy: string]: number }
  // 'neu gescraped seit'-Zähler (scrapedate-basiert, ES-Aggregation)
  d1: { [hierarchy: string]: number }
  d7: { [hierarchy: string]: number }
  d30: { [hierarchy: string]: number }
  d365: { [hierarchy: string]: number }
  /** 0–4 tatsächlich geladene Snapshots, aufsteigend nach tageZurueck.
   *  Bestimmt die dynamischen 'Seit …'-Spalten in der Hierarchie-Tabelle
   *  und in der 'Bestand-Differenz'-Gruppe der Scraper-Tabelle. */
  snaps: SnapshotInfo[]
  /** Snapshot mit tageZurueck ≥ 360 (ca. 1 Jahr), wenn vorhanden; sonst null.
   *  Wird ausschliesslich von der Stagnations-Logik verwendet. */
  snap365echt: SnapshotMap
}

const SLOT_ZIELE = [1, 7, 30, 365]
const STAGNATION_MIN_TAGE = 360

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
    },
    since_365d: {
      filter: { range: { scrapedate: { gte: 'now-365d/d' } } },
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

/** Heute als UTC-00:00-Date. */
function heuteUTC (): Date {
  const n = new Date()
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()))
}

/** Tage zwischen einem 'YYYY-MM-DD'-Datum und heute (UTC). */
function tageZwischen (datum: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datum)
  if (!m) return null
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]))
  return Math.round((heuteUTC().getTime() - d.getTime()) / 86400000)
}

/** 'YYYY-MM-DD' → 'DD.MM.YYYY' (für Spaltenüberschriften). */
export function formatIsoDatum (datum: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datum)
  return m ? `${m[3]}.${m[2]}.${m[1]}` : datum
}

/**
 * Wählt für die Slot-Ziele [1, 7, 30, 365] jeweils das grösste
 * verfügbare Tage-zurück, das ≤ Slot ist. Duplikate werden zusammengeführt
 * (kleinere Slots, die kein eigenes Datum mehr finden, fallen weg).
 *
 *  3 Tage Historie: [1, 3]            (d3 vertritt d7/d30/d365)
 * 10 Tage Historie: [1, 7, 10]        (d10 vertritt d30/d365)
 * 60 Tage Historie: [1, 7, 30, 60]    (d60 vertritt d365)
 * ≥365 Tage:        [1, 7, 30, 365]
 */
export function waehleSlots (verfuegbareTage: number[]): number[] {
  const ausgewaehlt: number[] = []
  for (const slot of SLOT_ZIELE) {
    let best: number | null = null
    for (const x of verfuegbareTage) {
      if (x <= slot && (best === null || x > best)) best = x
    }
    if (best !== null && !ausgewaehlt.includes(best)) ausgewaehlt.push(best)
  }
  return ausgewaehlt.sort((a, b) => a - b)
}

/** Lädt eine Snapshot-Datei; liefert null, wenn sie nicht (mehr) existiert. */
async function ladeSnapshot (datum: string): Promise<{ [k: string]: number } | null> {
  try {
    const r = await axios.get(SNAPSHOT_DIR_URL + '/' + datum + '.json', {
      validateStatus: s => s === 200
    })
    if (r.data && typeof r.data === 'object' && r.data.total &&
        typeof r.data.total === 'object') {
      return r.data.total as { [k: string]: number }
    }
    return null
  } catch (_e) {
    return null
  }
}

/** Lädt index.json; liefert ein leeres Array, wenn nicht vorhanden. */
async function ladeSnapshotIndex (): Promise<string[]> {
  try {
    const r = await axios.get(SNAPSHOT_DIR_URL + '/index.json', {
      validateStatus: s => s === 200
    })
    if (r.data && Array.isArray(r.data.dates)) {
      return r.data.dates.filter((d: any) => typeof d === 'string')
    }
    return []
  } catch (_e) {
    return []
  }
}

/** Lädt den Indexer-Status; liefert null, wenn die Datei (noch) nicht
 *  existiert. Defensiv geparst, sodass eine kaputte Datei die Statusseite
 *  nicht zerschiesst. */
async function ladeIndexerStatus (): Promise<IndexerStatus | null> {
  try {
    const r = await axios.get(INDEXER_STATUS_URL, {
      validateStatus: s => s === 200
    })
    const d = r.data
    if (!d || typeof d !== 'object' || typeof d.letzte_aktualisierung !== 'string') {
      return null
    }
    const gesamt: IndexerGesamt = {
      spider: Number(d.gesamt?.spider) || 0,
      ok: Number(d.gesamt?.ok) || 0,
      offen: Number(d.gesamt?.offen) || 0,
      kritisch: Number(d.gesamt?.kritisch) || 0,
      kaputt: Number(d.gesamt?.kaputt) || 0
    }
    const spiders: { [k: string]: IndexerSpiderStatus } = {}
    const inSpiders = (d.spiders && typeof d.spiders === 'object') ? d.spiders : {}
    for (const sp of Object.keys(inSpiders)) {
      const s = inSpiders[sp]
      if (!s || typeof s !== 'object') continue
      const rohZustand = s.zustand
      const zustand: IndexerZustand =
        rohZustand === 'ok' || rohZustand === 'offen' || rohZustand === 'kritisch'
          ? rohZustand
          : 'ok'
      spiders[sp] = {
        zustand,
        job: typeof s.job === 'string' ? s.job : null,
        grund: typeof s.grund === 'string' ? s.grund : null,
        seit: typeof s.seit === 'string' ? s.seit : null,
        letzter_ok: typeof s.letzter_ok === 'string' ? s.letzter_ok : null,
        kaputt: Number(s.kaputt) || 0,
        offene_reports: Number(s.offene_reports) || 0
      }
    }
    return {
      letzte_aktualisierung: d.letzte_aktualisierung,
      gesamt,
      spiders
    }
  } catch (_e) {
    return null
  }
}

export async function ladeAlles (): Promise<{
  facetten: Facetten
  status: StatusData
  es: ESCounts
  indexer: IndexerStatus | null
}> {
  // Reihenfolge:
  //  1. Facetten, Status, ES, Snapshot-Index und Indexer-Status parallel laden.
  //  2. Anhand der vorhandenen Snapshot-Daten die Slots berechnen.
  //  3. Nur die gewählten Snapshots laden.
  const [fResp, sResp, esResp, indexDaten, indexer] = await Promise.all([
    axios.get(FACETTEN_URL),
    axios.get(STATUS_URL),
    axios.post(SEARCH_URL, ES_QUERY, {
      headers: { 'Content-Type': 'application/json' }
    }),
    ladeSnapshotIndex(),
    ladeIndexerStatus()
  ])

  // Datums in 'Tage-zurück' umrechnen (heutiger und zukünftige Werte ignorieren).
  const tagToDatum = new Map<number, string>()
  for (const d of indexDaten) {
    const t = tageZwischen(d)
    if (t === null || t < 1) continue
    // bei mehreren Files am gleichen Tage-Versatz die jüngere Aufnahme behalten
    if (!tagToDatum.has(t) || tagToDatum.get(t)! < d) tagToDatum.set(t, d)
  }
  const verfuegbareTage = Array.from(tagToDatum.keys())
  const ausgewaehlt = waehleSlots(verfuegbareTage)

  // Snapshots parallel laden
  const snapsRoh = await Promise.all(
    ausgewaehlt.map(async (t): Promise<SnapshotInfo | null> => {
      const datum = tagToDatum.get(t)!
      const total = await ladeSnapshot(datum)
      return total === null ? null : { tageZurueck: t, datum, total }
    })
  )
  const snaps: SnapshotInfo[] = snapsRoh
    .filter((s): s is SnapshotInfo => s !== null)
    .sort((a, b) => a.tageZurueck - b.tageZurueck)

  // Stagnations-Quelle: ältester verfügbarer Snapshot mit tageZurueck ≥ ~ 1 Jahr.
  let stagSnap: SnapshotInfo | null = null
  for (const s of snaps) {
    if (s.tageZurueck >= STAGNATION_MIN_TAGE &&
        (stagSnap === null || s.tageZurueck > stagSnap.tageZurueck)) {
      stagSnap = s
    }
  }
  const snap365echt: SnapshotMap = stagSnap ? stagSnap.total : null

  const aggs = esResp.data.aggregations || {}
  const es: ESCounts = {
    total: bucketsToMap(aggs.total ? aggs.total.buckets : []),
    d1: bucketsToMap(aggs.since_1d ? aggs.since_1d.per_h.buckets : []),
    d7: bucketsToMap(aggs.since_7d ? aggs.since_7d.per_h.buckets : []),
    d30: bucketsToMap(aggs.since_30d ? aggs.since_30d.per_h.buckets : []),
    d365: bucketsToMap(aggs.since_365d ? aggs.since_365d.per_h.buckets : []),
    snaps,
    snap365echt
  }
  return {
    facetten: fResp.data,
    status: sResp.data,
    es,
    indexer
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

/**
 * Ampel-Farbe für die Zeit-Achse:
 *   A = Tage seit letztem erfolgreichen Lauf
 *
 *   A < 2 Tage                                   → grün
 *   A < 4 Tage                                   → gelb
 *   A < 32 Tage UND fehlversuche ≤ 3             → gelb
 *     (Spider mit selteneren Lauf-Frequenzen wie monatlich; ein paar
 *      Fehlversuche dazwischen sind tolerabel)
 *   A < 10 Tage                                  → orange
 *   sonst                                        → rot
 */
function ampelZeit (
  letzterErfolg: string | null | undefined,
  fehlversuche: number
): Color {
  const A = tageZeit(letzterErfolg)
  if (A === null) return 'red'
  if (A < 2) return 'green'
  if (A < 4) return 'yellow'
  if (A < 32 && fehlversuche <= 3) return 'yellow'
  if (A < 10) return 'orange'
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

/**
 * Stagnation: hat sich der Bestand seit einem Jahr nicht vergrössert?
 *
 * Bevorzugt der exakte Snapshot-Vergleich: liegt ein Snapshot von vor 365
 * Tagen vor (snap365 ≠ null), gilt Stagnation, sobald `bestand ≤ snap365`.
 *
 * Falls noch kein Snapshot existiert (Anlauf-Phase nach Deploy),
 * Fallback auf die scrapedate-basierte Heuristik: `neu365 === 0`.
 */
function istStagnation (
  bestand: number, snap365: number | null, neu365: number
): boolean {
  if (bestand <= 0) return false
  if (snap365 !== null) return bestand <= snap365
  return neu365 === 0
}

/**
 * Hebt eine vorhandene Farbe bei Stagnation auf mindestens orange an
 * (rot bleibt rot). Liefert ein {color, stagnation}-Paar für die Zeile.
 */
function farbeMitStagnation (
  raw: Color | null,
  bestand: number,
  snap365: number | null,
  neu365: number
): { color: Color | null; stagnation: boolean } {
  const stag = istStagnation(bestand, snap365, neu365)
  if (!stag) return { color: raw, stagnation: false }
  if (!raw) return { color: 'orange', stagnation: true }
  return {
    color: ORDER[raw] > ORDER.orange ? raw : 'orange',
    stagnation: true
  }
}

/**
 * Bestand-Differenzen heute − Snapshot pro Schlüssel.
 * Liefert ein Array gleicher Länge wie `snaps` mit den Differenzen für `key`.
 * Fehlende Snapshot-Einträge zählen als 0 (Kammer existierte vor X Tagen noch
 * nicht). Heutiger Wert == 0 (Kammer heute weg) liefert negative Differenz.
 */
function diffsProSchluessel (
  snaps: SnapshotInfo[], heute: number, key: string
): number[] {
  return snaps.map(s => heute - (s.total[key] || 0))
}

/** Aggregierte Bestand-Differenzen über mehrere Schlüssel. */
function diffsAggregat (
  snaps: SnapshotInfo[], heuteWerte: { [k: string]: number }, keys: string[]
): number[] {
  return snaps.map(s => {
    let sum = 0
    for (const k of keys) sum += (heuteWerte[k] || 0) - (s.total[k] || 0)
    return sum
  })
}

/** Snap-Wert eines einzelnen Keys (oder null, wenn snap selbst null ist). */
function snap365Wert (snap: SnapshotMap, key: string): number | null {
  if (snap === null) return null
  return snap[key] || 0
}

/** Summe eines Snapshot-Maps über mehrere Keys (null wenn Snapshot null). */
function snap365Summe (snap: SnapshotMap, keys: string[]): number | null {
  if (snap === null) return null
  let s = 0
  for (const k of keys) s += snap[k] || 0
  return s
}

/** Farbe eines einzelnen Spiders über die drei Achsen Zeit / Bestand / Fehler. */
export function spiderAmpel (s: SpiderStatus): Color {
  const e = s.letzter_erfolgreicher_lauf
  if (!e) return 'red'
  const arr: Color[] = [
    ampelZeit(e.zeit, s.fehlversuche_seit_letzter_erfolg || 0),
    ampelFehler(e.anzahl_fehler)
  ]
  const ab = ampelBestand(e.gesamt, s.vergleich_90_tage_gesamt_max)
  if (ab) arr.push(ab)
  return maxColor(arr)
}

/**
 * Farbe einer Hierarchieebene aus den Farben der beteiligten Spider.
 * Sonderfall: ein einzelner roter Scraper unter mehreren, alle anderen
 * gelb oder besser → orange. Greift nur bei mehreren Scrapern; bei
 * genau einem Scraper schlägt die rohe Farbe durch (sonst würde ein
 * roter Einzel-Spider im Detail als orange erscheinen, während die
 * Total-Zeile ihn rot aggregiert — das wirkt inkonsistent).
 */
export function aggregatAmpel (farben: Color[]): Color | null {
  if (farben.length === 0) return null
  const rot = farben.filter(f => f === 'red').length
  const orange = farben.filter(f => f === 'orange').length
  if (farben.length > 1 && rot === 1 && orange === 0) return 'orange'
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
  /** Bestand-Differenzen heute − Snapshot pro Eintrag in es.snaps.
   *  Gleiche Länge und gleicher Index wie es.snaps. Leeres Array, solange
   *  noch keine Snapshots existieren. */
  diffs: number[]
  /** Bestand > 0, aber im letzten Jahr nicht gewachsen → mindestens orange. */
  stagnation: boolean
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

/**
 * Eine Hierarchie-Zeile gilt als leer, wenn weder heute Bestand vorliegt noch
 * in einem der Bestand-Vergleiche eine von 0 verschiedene Differenz steht.
 * (Negative Differenzen — Kammer ist heute weg, war aber damals vorhanden —
 * halten die Zeile sichtbar.)
 */
function rowIstLeer (r: HierarchyRow): boolean {
  if (r.bestand !== 0) return false
  return r.diffs.every(d => d === 0)
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
    {
      const bestand = es.total[cKey] || 0
      const sv365 = snap365Wert(es.snap365echt, cKey)
      const neu365 = es.d365[cKey] || 0
      const raw = spidersAmpel(cSpidersSortiert, status)
      const { color, stagnation } = farbeMitStagnation(raw, bestand, sv365, neu365)
      rows.push({
        key: cKey,
        parent: '_total',
        level: 1,
        label: getName(c, lang),
        bestand,
        diffs: diffsProSchluessel(es.snaps, bestand, cKey),
        stagnation,
        spider: null,
        spiders: cSpidersSortiert,
        letzterLauf: jüngsterErfolg(cSpidersSortiert, status),
        color,
        searchFilter: cKey,
        hatKinder: true
      })
    }

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
      {
        const bestand = es.total[gKey] || 0
        const sv365 = snap365Wert(es.snap365echt, gKey)
        const neu365 = es.d365[gKey] || 0
        const raw = spidersAmpel(gSpidersSortiert, status)
        const { color, stagnation } = farbeMitStagnation(raw, bestand, sv365, neu365)
        rows.push({
          key: gKey,
          parent: cKey,
          level: 2,
          label: getName(g, lang),
          bestand,
          diffs: diffsProSchluessel(es.snaps, bestand, gKey),
          stagnation,
          spider: null,
          spiders: gSpidersSortiert,
          letzterLauf: jüngsterErfolg(gSpidersSortiert, status),
          color,
          searchFilter: gKey,
          hatKinder: gKammern.length > 0
        })
      }
      for (const kKey of gKammern) {
        const k = g.kammern[kKey]
        const sp = k.spider
        const s = sp ? status.spiders[sp] : undefined
        const bestand = es.total[kKey] || 0
        const sv365 = snap365Wert(es.snap365echt, kKey)
        const neu365 = es.d365[kKey] || 0
        const raw = s ? spiderAmpel(s) : null
        const { color, stagnation } = farbeMitStagnation(raw, bestand, sv365, neu365)
        rows.push({
          key: kKey,
          parent: gKey,
          level: 3,
          label: getName(k as any, lang),
          bestand,
          diffs: diffsProSchluessel(es.snaps, bestand, kKey),
          stagnation,
          spider: sp,
          spiders: sp ? [sp] : [],
          letzterLauf: s && s.letzter_erfolgreicher_lauf ? s.letzter_erfolgreicher_lauf.zeit : null,
          color,
          searchFilter: kKey,
          hatKinder: false
        })
      }
    }
  }

  // 2) Total-Zeile als oberster Eintrag (über alle Kantone)
  let totalBestand = 0
  let totalNeu365 = 0
  for (const cKey of kantonKeys) {
    totalBestand += es.total[cKey] || 0
    totalNeu365 += es.d365[cKey] || 0
  }
  const totalSnap365 = snap365Summe(es.snap365echt, kantonKeys)
  const totalSpidersGefiltert = Object.keys(totalSpidersToKammern).filter(sp =>
    spiderHatDatenInKammern(sp, totalSpidersToKammern[sp], status, es)
  )
  const tSpiders = sortSpiderNamen(totalSpidersGefiltert)
  {
    const rawTotal = spidersAmpel(tSpiders, status)
    const { color, stagnation } =
      farbeMitStagnation(rawTotal, totalBestand, totalSnap365, totalNeu365)
    rows.unshift({
      key: '_total',
      parent: null,
      level: 0,
      label: '', // wird im Template via $t('Schweiz') gesetzt
      bestand: totalBestand,
      diffs: diffsAggregat(es.snaps, es.total, kantonKeys),
      stagnation,
      spider: null,
      spiders: tSpiders,
      letzterLauf: jüngsterErfolg(tSpiders, status),
      color,
      searchFilter: '',
      hatKinder: true
    })
  }

  // 3) Weggefallene Hierarchien — Schlüssel, die in einem Snapshot vorkamen,
  //    in der heutigen Facetten-Struktur aber nicht mehr existieren und auch
  //    heute kein ES-Bestand mehr haben. Erscheinen als eigener Sammelblock
  //    '(weggefallen)' am Ende der Hierarchie-Tabelle, damit der Verlust nicht
  //    stillschweigend untergeht.
  const facettenKeys = new Set<string>()
  for (const cKey of kantonKeys) {
    facettenKeys.add(cKey)
    const c = facetten[cKey]
    for (const gKey of Object.keys(c.gerichte || {})) {
      facettenKeys.add(gKey)
      const g = c.gerichte[gKey]
      for (const kKey of Object.keys(g.kammern || {})) {
        facettenKeys.add(kKey)
      }
    }
  }
  const verschwundeneKeys: string[] = []
  const gesehen = new Set<string>()
  for (const snap of es.snaps) {
    for (const k of Object.keys(snap.total)) {
      if (facettenKeys.has(k)) continue
      if (gesehen.has(k)) continue
      // heute noch da → nicht wirklich weg
      if ((es.total[k] || 0) > 0) continue
      // war auch damals leer → uninteressant
      if ((snap.total[k] || 0) <= 0) continue
      gesehen.add(k)
      verschwundeneKeys.push(k)
    }
  }
  verschwundeneKeys.sort()

  if (verschwundeneKeys.length > 0) {
    // Sammelzeile: Diffs sind Σ über alle weggefallenen Keys.
    // Label kommt im Template via $t('Weggefallen').
    rows.push({
      key: '_weggefallen',
      parent: '_total',
      level: 1,
      label: '',
      bestand: 0,
      diffs: diffsAggregat(es.snaps, es.total, verschwundeneKeys),
      stagnation: false,
      spider: null,
      spiders: [],
      letzterLauf: null,
      color: null,
      searchFilter: '',
      hatKinder: true
    })
    for (const k of verschwundeneKeys) {
      rows.push({
        key: k,
        parent: '_weggefallen',
        level: 2,
        label: k,
        bestand: 0,
        diffs: diffsProSchluessel(es.snaps, 0, k),
        stagnation: false,
        spider: null,
        spiders: [],
        letzterLauf: null,
        color: null,
        searchFilter: k,
        hatKinder: false
      })
    }
  }

  // Leere Zeilen ausfiltern: erst Kammern, dann Gerichte (wenn alle ihre
  // Kammern weg sind), dann Kantone. Total bleibt immer.
  const behalten = new Set<string>()
  for (const r of rows) {
    if (r.level === 3 && !rowIstLeer(r)) behalten.add(r.key)
  }
  for (const r of rows) {
    if (r.level === 2) {
      const hatKind = rows.some(c => c.parent === r.key && behalten.has(c.key))
      if (hatKind || !rowIstLeer(r)) behalten.add(r.key)
    }
  }
  for (const r of rows) {
    if (r.level === 1) {
      const hatKind = rows.some(c => c.parent === r.key && behalten.has(c.key))
      if (hatKind || !rowIstLeer(r)) behalten.add(r.key)
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
  // 'Neu gescraped seit ...': scrapedate-basierte ES-Aggregation,
  // summiert über alle Kammern.
  neu1d: number
  neu7d: number
  neu30d: number
  neu365d: number
  /** Bestand-Differenzen heute − Snapshot pro Eintrag in es.snaps,
   *  summiert über alle Kammern. */
  diffs: number[]
  /** Bestand > 0, aber im letzten Jahr nicht gewachsen. */
  stagnation: boolean
  fehlerlaeufe: number
  einzelfehler: number
  color: Color
  ampelGruende: AmpelGrund[] // für den Ampel-Tooltip
  kammern: HierarchyRow[] // Kammern aus Facetten dieses Spiders
  /** Indexer-Status für diesen Spider; null, wenn kein Indexer-Status-File
   *  vorhanden ist oder dieser Spider nicht erwähnt wird. */
  indexer: IndexerSpiderStatus | null
}

export interface AmpelGrund {
  achse: 'zeit' | 'bestand' | 'fehler' | 'stagnation'
  color: Color
  /** {zeit_pre} <wert> {zeit_post}; bei zeit auch wert=null möglich (kein Lauf) */
  wert: number | null
}

/**
 * Gibt eine Liste der Ampel-Gründe pro Achse zurück (auch grüne, für Tooltip).
 * Stagnation ist eine zeilenbezogene Eigenschaft (kein Spider-Status) und wird
 * deshalb optional von der jeweiligen Build-Funktion mitgegeben.
 */
export function ampelGruende (
  s: SpiderStatus, stagnation: boolean = false
): AmpelGrund[] {
  const e = s.letzter_erfolgreicher_lauf
  const out: AmpelGrund[] = []
  if (!e) {
    out.push({ achse: 'zeit', color: 'red', wert: null })
    if (stagnation) {
      out.push({ achse: 'stagnation', color: 'orange', wert: null })
    }
    return out
  }
  const t = tageZeit(e.zeit)
  out.push({
    achse: 'zeit',
    color: ampelZeit(e.zeit, s.fehlversuche_seit_letzter_erfolg || 0),
    wert: t === null ? null : Math.floor(t)
  })
  const max = s.vergleich_90_tage_gesamt_max
  if (max > 0) {
    const prozent = Math.round((e.gesamt / max) * 100)
    const c = ampelBestand(e.gesamt, max)
    if (c) out.push({ achse: 'bestand', color: c, wert: prozent })
  }
  out.push({ achse: 'fehler', color: ampelFehler(e.anzahl_fehler), wert: e.anzahl_fehler })
  if (stagnation) {
    out.push({ achse: 'stagnation', color: 'orange', wert: null })
  }
  return out
}

export function buildScraperRows (
  facetten: Facetten,
  status: StatusData,
  es: ESCounts,
  lang: string,
  indexer: IndexerStatus | null = null
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
        const bestand = es.total[kKey] || 0
        const sv365 = snap365Wert(es.snap365echt, kKey)
        const neu365 = es.d365[kKey] || 0
        const row: HierarchyRow = {
          key: kKey,
          parent: sp,
          level: 3,
          label,
          bestand,
          diffs: diffsProSchluessel(es.snaps, bestand, kKey),
          stagnation: istStagnation(bestand, sv365, neu365),
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
    let neu1dES = 0
    let neu7dES = 0
    let neu30dES = 0
    let neu365dES = 0
    for (const k of kammern) {
      bestandES += k.bestand
      neu1dES += es.d1[k.key] || 0
      neu7dES += es.d7[k.key] || 0
      neu30dES += es.d30[k.key] || 0
      neu365dES += es.d365[k.key] || 0
    }
    const bestandLog = er ? er.gesamt : 0
    // leere Spider: nichts im ES, kein erfolgreicher Lauf-Bestand,
    // keine Aktivität in den scrapedate-Aggregaten
    if (bestandES === 0 && bestandLog === 0 &&
        neu1dES === 0 && neu7dES === 0 && neu30dES === 0) {
      continue
    }
    const kammerKeys = kammern.map(k => k.key)
    const snap365Spider = snap365Summe(es.snap365echt, kammerKeys)
    const { color: rowColor, stagnation } =
      farbeMitStagnation(spiderAmpel(s), bestandES, snap365Spider, neu365dES)
    // rowColor kann hier nur dann null sein, wenn spiderAmpel null liefert
    // (passiert nicht). Defensiv casten.
    const finalColor: Color = (rowColor || 'red') as Color
    rows.push({
      spider: sp,
      letzterLauf: er ? er.zeit : null,
      letzterLaufRoh: ll ? ll.zeit : null,
      bestandES,
      bestandLog,
      last: er ? er.aktuell_neu : 0,
      neu1d: neu1dES,
      neu7d: neu7dES,
      neu30d: neu30dES,
      neu365d: neu365dES,
      diffs: diffsAggregat(es.snaps, es.total, kammerKeys),
      stagnation,
      fehlerlaeufe: s.fehlversuche_seit_letzter_erfolg,
      einzelfehler: er ? er.anzahl_fehler : 0,
      color: finalColor,
      ampelGruende: ampelGruende(s, stagnation),
      kammern,
      indexer: indexer && indexer.spiders[sp] ? indexer.spiders[sp] : null
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

/**
 * Formatiert einen ISO-Z-Zeitstempel (z.B. '2026-06-22T03:09:33Z') in
 * 'HH:MM' wenn weniger als 24 Stunden zurück, sonst 'DD.MM.YYYY HH:MM'.
 * Lokalzeit-Anzeige (Browser).
 */
export function formatIndexerZeit (iso: string | null | undefined): string {
  if (!iso) return '–'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '–'
  const pad = (n: number) => (n < 10 ? '0' + n : '' + n)
  const hhmm = pad(d.getHours()) + ':' + pad(d.getMinutes())
  const alterMs = Date.now() - d.getTime()
  if (alterMs < 86400000) return hhmm
  return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' +
         d.getFullYear() + ' ' + hhmm
}
