<template>
  <div id="status">
    <h1>{{ $t('Statustitle') }}</h1>

    <div class="tabs">
      <button :class="['tab', view === 'hierarchy' ? 'active' : '']" @click="setView('hierarchy')">
        {{ $t('Hierarchie') }}
      </button>
      <button :class="['tab', view === 'scrapers' ? 'active' : '']" @click="setView('scrapers')">
        {{ $t('Scraper') }}
      </button>
    </div>

    <div v-if="!loading && !error && indexer" class="indexer-banner">
      <span class="ib-label">{{ $t('Indexer') }}:</span>
      <span class="ib-zeit">{{ $t('Letzte Aktualisierung') }} {{ indexerLetzteAktualisierung }}</span>
      <span class="ib-trenner">·</span>
      <span class="ib-feld">{{ indexer.gesamt.spider }} {{ $t('Spider') }}</span>
      <span class="ib-trenner">·</span>
      <span class="ib-feld ib-ok">{{ indexer.gesamt.ok }} {{ $t('ok') }}</span>
      <span v-if="indexer.gesamt.offen > 0" class="ib-feld ib-offen">
        <span class="ib-trenner">·</span>
        {{ indexer.gesamt.offen }} {{ $t('offen') }}
      </span>
      <span v-if="indexer.gesamt.kritisch > 0" class="ib-feld ib-kritisch">
        <span class="ib-trenner">·</span>
        {{ indexer.gesamt.kritisch }} {{ $t('kritisch') }}
      </span>
      <span v-if="indexer.gesamt.kaputt > 0" class="ib-feld ib-kaputt">
        <span class="ib-trenner">·</span>
        {{ indexer.gesamt.kaputt }} {{ $t('kaputt') }}
      </span>
    </div>

    <div v-if="loading" class="info">{{ $t('lädt') }}…</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <!-- Hierarchie-Ansicht -->
    <table v-else-if="view === 'hierarchy'" class="status-table">
      <thead>
        <tr>
          <th class="col-name">{{ $t('Hierarchie') }}</th>
          <th class="col-num">{{ $t('Bestand') }}</th>
          <th v-for="snap in snaps" :key="snap.datum" class="col-num">
            {{ $t('Seit') }} {{ fmtSnapDatum(snap.datum) }}
          </th>
          <th class="col-scraper">{{ $t('Scraper') }}</th>
          <th class="col-lauf">{{ $t('Letzter Lauf') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in sichtbareHierarchyRows" :key="row.key"
            :class="['lvl-' + row.level, row.color ? 'ampel-' + row.color : '',
                     istWeggefallen(row) ? 'weg' : '']"
            :title="hierarchyTooltip(row)">
          <td class="col-name" :style="{ paddingLeft: (row.level * 14 + 4) + 'px' }">
            <span v-if="row.hatKinder" class="caret" @click="toggle(row.key)">{{ expandedKeys[row.key] ? '▾' : '▸' }}</span><span v-else class="caret-empty"></span>
            <a v-if="row.searchFilter"
               :href="searchUrl(row.searchFilter)"
               class="hierarchy-label">{{ labelFor(row) }}</a>
            <span v-else class="hierarchy-label">{{ labelFor(row) }}</span>
            <span v-if="row.level > 0 && row.level < 3 && row.key !== '_weggefallen'" class="hierarchy-key">{{ row.key }}</span>
          </td>
          <td class="col-num">{{ formatNumber(row.bestand) }}</td>
          <td v-for="(d, i) in row.diffs" :key="i" class="col-num">
            <span :class="signClass(d)">{{ formatDiff(d) }}</span>
          </td>
          <td class="col-scraper">
            <template v-if="row.level !== 0">
              <a v-if="row.spider" href="#" @click.prevent="zumScraper(row.spider)">{{ row.spider }}</a>
              <span v-else-if="row.spiders.length === 1">
                <a href="#" @click.prevent="zumScraper(row.spiders[0])">{{ row.spiders[0] }}</a>
              </span>
              <span v-else-if="row.spiders.length > 1" class="scraper-list">
                <template v-for="(sp, idx) in row.spiders"><a :key="sp" href="#"
                   @click.prevent="zumScraper(sp)">{{ sp }}</a><span v-if="idx < row.spiders.length - 1" :key="sp + '-sep'">, </span></template>
              </span>
            </template>
          </td>
          <td class="col-lauf">{{ formatLauf(row.letzterLauf) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="view === 'hierarchy' && !loading && !error" class="hinweis">{{ $t('Statushinweis') }}</p>

    <!-- Scraper-Ansicht -->
    <table v-else-if="view === 'scrapers'" class="status-table scrapers">
      <thead>
        <tr>
          <th class="col-scraper" rowspan="2">{{ $t('Scraper') }}</th>
          <th class="col-lauf" rowspan="2">{{ $t('Letzter Lauf') }}</th>
          <th class="col-num" rowspan="2">{{ $t('Gesamt') }}</th>
          <th class="col-num group-neu" colspan="5">{{ $t('Neu gescraped') }}</th>
          <th v-if="snaps.length > 0" class="col-num group-diff" :colspan="snaps.length">
            {{ $t('Bestand-Differenz') }}
          </th>
          <th class="col-num" rowspan="2">{{ $t('Fehlversuche') }}</th>
          <th class="col-num" rowspan="2">{{ $t('Fehler') }}</th>
          <th v-if="indexer" class="col-num" rowspan="2">{{ $t('Zustand') }}</th>
          <th v-if="indexer" class="col-num" rowspan="2">{{ $t('kaputt') }}</th>
          <th v-if="indexer" class="col-num" rowspan="2">{{ $t('Reports') }}</th>
        </tr>
        <tr>
          <th class="col-num group-neu">{{ $t('Last') }}</th>
          <th class="col-num group-neu">{{ $t('Seit') }} {{ datumGestern }}</th>
          <th class="col-num group-neu">{{ $t('Seit') }} {{ datumVorwoche }}</th>
          <th class="col-num group-neu">{{ $t('Seit') }} {{ datumVormonat }}</th>
          <th class="col-num group-neu">{{ $t('Seit') }} {{ datumVorjahr }}</th>
          <th v-for="snap in snaps" :key="snap.datum" class="col-num group-diff">
            {{ $t('Seit') }} {{ fmtSnapDatum(snap.datum) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Gesamt-Zeile (Aggregat aller Scraper). Nicht klappbar, keine Ampel. -->
        <tr class="scraper-gesamt">
          <td class="col-scraper"><strong>{{ $t('Schweiz') }}</strong></td>
          <td class="col-lauf">{{ formatLauf(scraperGesamt.letzterLauf) }}</td>
          <td class="col-num">
            <strong>{{ formatNumber(scraperGesamt.bestandES) }}</strong>
          </td>
          <td class="col-num group-neu"><span :class="signClass(scraperGesamt.last)">{{ formatPlus(scraperGesamt.last) }}</span></td>
          <td class="col-num group-neu"><span :class="signClass(scraperGesamt.neu1d)">{{ formatPlus(scraperGesamt.neu1d) }}</span></td>
          <td class="col-num group-neu"><span :class="signClass(scraperGesamt.neu7d)">{{ formatPlus(scraperGesamt.neu7d) }}</span></td>
          <td class="col-num group-neu"><span :class="signClass(scraperGesamt.neu30d)">{{ formatPlus(scraperGesamt.neu30d) }}</span></td>
          <td class="col-num group-neu"><span :class="signClass(scraperGesamt.neu365d)">{{ formatPlus(scraperGesamt.neu365d) }}</span></td>
          <td v-for="(d, i) in scraperGesamt.diffs" :key="'g' + i" class="col-num group-diff">
            <span :class="signClass(d)">{{ formatDiff(d) }}</span>
          </td>
          <td class="col-num">{{ scraperGesamt.fehlerlaeufe > 0 ? scraperGesamt.fehlerlaeufe : '–' }}</td>
          <td class="col-num">{{ scraperGesamt.einzelfehler > 0 ? scraperGesamt.einzelfehler : '–' }}</td>
          <td v-if="indexer" class="col-num zustand-zelle">
            <span :class="gesamtZustandText().klasse">{{ gesamtZustandText().text }}</span>
          </td>
          <td v-if="indexer" class="col-num">
            <span v-if="scraperGesamt.kaputt > 0" class="kaputt">{{ scraperGesamt.kaputt }}</span>
            <span v-else>–</span>
          </td>
          <td v-if="indexer" class="col-num">
            <span v-if="scraperGesamt.offene_reports > 0" class="reports">{{ scraperGesamt.offene_reports }}</span>
            <span v-else>–</span>
          </td>
        </tr>
        <template v-for="row in scraperRows">
          <tr :key="row.spider"
              :class="['scraper-row', 'ampel-' + row.color, expandedScraper === row.spider ? 'expanded' : '',
                       highlightedScraper === row.spider ? 'highlighted' : '']"
              :ref="'scraper-' + row.spider"
              :title="ampelTooltip(row)"
              @click="toggleScraper(row.spider)">
            <td class="col-scraper">
              <span class="caret">{{ expandedScraper === row.spider ? '▾' : '▸' }}</span>
              {{ row.spider }}
            </td>
            <td class="col-lauf">{{ formatLauf(row.letzterLauf) }}</td>
            <td class="col-num">
              {{ formatNumber(row.bestandES) }}
              <span v-if="row.bestandLog > 0" :class="logClass(row.bestandES, row.bestandLog)">({{ formatNumber(row.bestandLog) }})</span>
            </td>
            <td class="col-num group-neu"><span :class="signClass(row.last)">{{ formatPlus(row.last) }}</span></td>
            <td class="col-num group-neu"><span :class="signClass(row.neu1d)">{{ formatPlus(row.neu1d) }}</span></td>
            <td class="col-num group-neu"><span :class="signClass(row.neu7d)">{{ formatPlus(row.neu7d) }}</span></td>
            <td class="col-num group-neu"><span :class="signClass(row.neu30d)">{{ formatPlus(row.neu30d) }}</span></td>
            <td class="col-num group-neu"><span :class="signClass(row.neu365d)">{{ formatPlus(row.neu365d) }}</span></td>
            <td v-for="(d, i) in row.diffs" :key="i" class="col-num group-diff">
              <span :class="signClass(d)">{{ formatDiff(d) }}</span>
            </td>
            <td class="col-num">{{ row.fehlerlaeufe > 0 ? row.fehlerlaeufe : '–' }}</td>
            <td class="col-num">{{ row.einzelfehler > 0 ? row.einzelfehler : '–' }}</td>
            <td v-if="indexer" class="col-num zustand-zelle">
              <span v-if="row.indexer" :class="'zustand-' + row.indexer.zustand"
                    :title="zustandTooltip(row.indexer)">
                {{ $t('zustand_' + row.indexer.zustand) }}
              </span>
              <span v-else>–</span>
            </td>
            <td v-if="indexer" class="col-num">
              <span v-if="row.indexer && row.indexer.kaputt > 0" class="kaputt">{{ row.indexer.kaputt }}</span>
              <span v-else>–</span>
            </td>
            <td v-if="indexer" class="col-num">
              <span v-if="row.indexer && row.indexer.offene_reports > 0" class="reports">{{ row.indexer.offene_reports }}</span>
              <span v-else>–</span>
            </td>
          </tr>
          <tr v-if="expandedScraper === row.spider" :key="row.spider + '-detail'"
              :class="['scraper-detail', 'ampel-' + row.color]">
            <td :colspan="detailColspan">
              <table class="status-table inner">
                <thead>
                  <tr>
                    <th class="col-name">{{ $t('Hierarchie') }}</th>
                    <th class="col-num">{{ $t('Bestand') }}</th>
                    <th v-for="snap in snaps" :key="snap.datum" class="col-num">
                      {{ $t('Seit') }} {{ fmtSnapDatum(snap.datum) }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="kammer in row.kammern" :key="kammer.key">
                    <td class="col-name">
                      <a :href="searchUrl(kammer.searchFilter)">{{ kammer.label }}</a>
                      <span class="hierarchy-key">{{ kammer.key }}</span>
                    </td>
                    <td class="col-num">{{ formatNumber(kammer.bestand) }}</td>
                    <td v-for="(d, i) in kammer.diffs" :key="i" class="col-num">
                      <span :class="signClass(d)">{{ formatDiff(d) }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <p v-if="view === 'scrapers' && !loading && !error" class="hinweis">{{ $t('Statushinweis') }}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import {
  ladeAlles, buildHierarchyRows, buildScraperRows, ampelGruende,
  formatLaufDatum, formatDatumDDMMYYYY, formatIsoDatum, formatIndexerZeit,
  tageVorher,
  HierarchyRow, ScraperRow, Facetten, StatusData, ESCounts, AmpelGrund,
  SnapshotInfo, IndexerStatus, IndexerSpiderStatus
} from '@/util/status'

@Component({ name: 'Status' })
export default class Status extends Vue {
  loading = true
  error = ''
  facetten: Facetten = {}
  status: StatusData = { generated: '', spider_count: 0, spiders: {} }
  es: ESCounts = {
    total: {},
    d1: {},
    d7: {},
    d30: {},
    d365: {},
    snaps: [],
    snap365echt: null
  }

  indexer: IndexerStatus | null = null

  expandedKeys: { [k: string]: boolean } = { _total: true }
  expandedScraper: string | null = null
  highlightedScraper: string | null = null

  // ---- Lifecycle ----------------------------------------------------------

  async mounted () {
    try {
      const r = await ladeAlles()
      this.facetten = r.facetten
      this.status = r.status
      this.es = r.es
      this.indexer = r.indexer
    } catch (e: any) {
      this.error = (e && e.message) ? e.message : String(e)
    } finally {
      this.loading = false
      this.$nextTick(() => this.handleQuerySpider())
    }
  }

  @Watch('$route.query.spider')
  onSpiderQueryChange () {
    if (!this.loading) this.handleQuerySpider()
  }

  handleQuerySpider () {
    const sp = this.$route.query.spider
    if (typeof sp === 'string' && sp) {
      this.expandedScraper = sp
      this.highlightedScraper = sp
      this.$nextTick(() => {
        const els = (this.$refs['scraper-' + sp] as Element[] | undefined)
        if (els && els.length > 0) {
          (els[0] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        setTimeout(() => { this.highlightedScraper = null }, 2500)
      })
    }
  }

  // ---- View-Switch --------------------------------------------------------

  get view (): 'hierarchy' | 'scrapers' {
    const v = this.$route.query.view
    return v === 'scrapers' ? 'scrapers' : 'hierarchy'
  }

  setView (v: 'hierarchy' | 'scrapers') {
    if (v === this.view) return
    const q: any = { ...this.$route.query, view: v }
    if (v !== 'scrapers') delete q.spider
    this.$router.push({ path: '/status', query: q }).catch(() => { /* ignore */ })
  }

  zumScraper (sp: string) {
    this.$router.push({
      path: '/status',
      query: { view: 'scrapers', spider: sp }
    }).catch(() => { /* ignore */ })
  }

  // ---- Reaktive Daten -----------------------------------------------------

  get lang (): string {
    return AppModule.locale || 'de'
  }

  get hierarchyRows (): HierarchyRow[] {
    if (this.loading) return []
    return buildHierarchyRows(this.facetten, this.status, this.es, this.lang)
  }

  get scraperRows (): ScraperRow[] {
    if (this.loading) return []
    return buildScraperRows(this.facetten, this.status, this.es, this.lang, this.indexer)
  }

  /** Aktualisierungs-Zeit des Indexer-Status, formatiert nach 24h-Regel. */
  get indexerLetzteAktualisierung (): string {
    return this.indexer ? formatIndexerZeit(this.indexer.letzte_aktualisierung) : ''
  }

  get sichtbareHierarchyRows (): HierarchyRow[] {
    const map: { [k: string]: HierarchyRow } = {}
    for (const r of this.hierarchyRows) map[r.key] = r
    return this.hierarchyRows.filter(row => {
      if (row.level === 0) return true
      let cur: HierarchyRow | undefined = row
      while (cur && cur.parent) {
        if (!this.expandedKeys[cur.parent]) return false
        cur = map[cur.parent]
      }
      return true
    })
  }

  toggle (key: string) {
    Vue.set(this.expandedKeys, key, !this.expandedKeys[key])
  }

  toggleScraper (sp: string) {
    this.expandedScraper = (this.expandedScraper === sp) ? null : sp
  }

  // ---- Format-Helpers -----------------------------------------------------

  get datumGestern (): string {
    return formatDatumDDMMYYYY(tageVorher(1))
  }

  get datumVorwoche (): string {
    return formatDatumDDMMYYYY(tageVorher(7))
  }

  get datumVormonat (): string {
    return formatDatumDDMMYYYY(tageVorher(30))
  }

  get datumVorjahr (): string {
    return formatDatumDDMMYYYY(tageVorher(365))
  }

  /** Tatsächlich geladene Snapshots — 0–4 Einträge.
   *  Hierarchie- und Detail-Tabelle iterieren darüber. */
  get snaps (): SnapshotInfo[] {
    return this.es.snaps
  }

  /** colspan der aufgeklappten Detailzeile:
   *  3 (Scraper/Lauf/Gesamt) + 5 (Neu gescraped) + snaps.length + 2 (Fehler)
   *  + 3 (Zustand/Kaputt/Reports, sofern Indexer-Status geladen).
   */
  get detailColspan (): number {
    return 10 + this.snaps.length + (this.indexer ? 3 : 0)
  }

  /** Aggregat aller Scraper-Zeilen für die Gesamt-Kopfzeile. */
  get scraperGesamt (): {
      letzterLauf: string | null;
      bestandES: number;
      bestandLog: number;
      last: number;
      neu1d: number;
      neu7d: number;
      neu30d: number;
      neu365d: number;
      diffs: number[];
      fehlerlaeufe: number;
      einzelfehler: number;
      kaputt: number;
      offene_reports: number;
      kritisch: number;
      offen: number;
      } {
    const g = {
      letzterLauf: null as string | null,
      bestandES: 0,
      bestandLog: 0,
      last: 0,
      neu1d: 0,
      neu7d: 0,
      neu30d: 0,
      neu365d: 0,
      diffs: this.snaps.map(() => 0),
      fehlerlaeufe: 0,
      einzelfehler: 0,
      kaputt: 0,
      offene_reports: 0,
      kritisch: 0,
      offen: 0
    }
    for (const r of this.scraperRows) {
      if (r.letzterLauf && (g.letzterLauf === null || r.letzterLauf > g.letzterLauf)) {
        g.letzterLauf = r.letzterLauf
      }
      g.bestandES += r.bestandES
      g.bestandLog += r.bestandLog
      g.last += r.last
      g.neu1d += r.neu1d
      g.neu7d += r.neu7d
      g.neu30d += r.neu30d
      g.neu365d += r.neu365d
      for (let i = 0; i < g.diffs.length; i++) g.diffs[i] += r.diffs[i] || 0
      g.fehlerlaeufe += r.fehlerlaeufe
      g.einzelfehler += r.einzelfehler
      if (r.indexer) {
        g.kaputt += r.indexer.kaputt
        g.offene_reports += r.indexer.offene_reports
        if (r.indexer.zustand === 'kritisch') g.kritisch++
        else if (r.indexer.zustand === 'offen') g.offen++
      }
    }
    return g
  }

  /** Wortlaut in der Zustand-Zelle der Gesamtzeile.
   *  - mind. 1 kritisch  → 'Indexierungsfehler'  (rot)
   *  - mind. 1 offen     → 'indexiert…'          (normal)
   *  - kaputt > 0         → 'X Fehler'            (rot)
   *  - sonst              → 'ok'                  (dezent) */
  gesamtZustandText (): { text: string; klasse: string } {
    const g = this.scraperGesamt
    if (g.kritisch > 0) return { text: this.$t('zustand_kritisch') as string, klasse: 'zustand-kritisch' }
    if (g.offen > 0) return { text: this.$t('zustand_offen') as string, klasse: 'zustand-offen' }
    if (g.kaputt > 0) {
      return {
        text: g.kaputt + ' ' + (this.$t('Fehler_plural') as string),
        klasse: 'zustand-fehler'
      }
    }
    return { text: this.$t('zustand_ok') as string, klasse: 'zustand-ok' }
  }

  /** Tooltip-Text für die Zustands-Zelle (hover). */
  zustandTooltip (s: IndexerSpiderStatus): string {
    const zeilen: string[] = []
    if (s.zustand === 'kritisch') {
      if (s.grund) zeilen.push(this.$t('Grund') + ': ' + s.grund)
      if (s.seit) zeilen.push(this.$t('seit') + ' ' + this.fmtZeit(s.seit))
      if (s.job) zeilen.push('Job ' + s.job)
      if (s.letzter_ok) zeilen.push(this.$t('letzter ok') + ': ' + this.fmtZeit(s.letzter_ok))
    } else if (s.zustand === 'offen') {
      if (s.job) zeilen.push('Job ' + s.job)
      if (s.seit) zeilen.push(this.$t('seit') + ' ' + this.fmtZeit(s.seit))
    } else {
      if (s.letzter_ok) zeilen.push(this.$t('letzter ok') + ': ' + this.fmtZeit(s.letzter_ok))
      if (s.job) zeilen.push('Job ' + s.job)
    }
    return zeilen.join('\n')
  }

  /** ISO-Z → 'HH:MM' bzw. 'DD.MM.YYYY HH:MM' für Tooltips. */
  fmtZeit (iso: string | null): string {
    return formatIndexerZeit(iso)
  }

  /** 'YYYY-MM-DD' → 'DD.MM.YYYY' für die Snapshot-Spaltenüberschriften. */
  fmtSnapDatum (datum: string): string {
    return formatIsoDatum(datum)
  }

  /** Label einer Hierarchie-Zeile inkl. Sonderbehandlung für Pseudo-Knoten. */
  labelFor (row: HierarchyRow): string {
    if (row.level === 0) return this.$t('Schweiz') as string
    if (row.key === '_weggefallen') return this.$t('Weggefallen') as string
    return row.label || row.key
  }

  /** Eine Zeile, die zum Weggefallen-Block gehört (Sammelzeile oder Detail). */
  istWeggefallen (row: HierarchyRow): boolean {
    return row.key === '_weggefallen' || row.parent === '_weggefallen'
  }

  formatNumber (n: number): string {
    return new Intl.NumberFormat('de-CH').format(n)
  }

  formatPlus (n: number): string {
    if (n === 0) return '–'
    return (n > 0 ? '+' : '') + this.formatNumber(n)
  }

  /** Wie formatPlus, aber null = '–' (kein Snapshot vorhanden). */
  formatDiff (n: number | null): string {
    if (n === null || n === 0) return '–'
    return (n > 0 ? '+' : '') + this.formatNumber(n)
  }

  formatLauf (s: string | null): string {
    return formatLaufDatum(s)
  }

  signClass (n: number | null): string {
    if (n === null) return 'zero'
    if (n < 0) return 'neg'
    if (n > 0) return 'plus'
    return 'zero'
  }

  /** Klammerwert (Lauf-Bestand) rot, wenn er größer ist als der ES-Bestand. */
  logClass (es: number, log: number): string {
    return log > es ? 'log-warn' : 'log-info'
  }

  searchUrl (filter: string): string {
    if (!filter) return '/search?query=*&sort=date'
    return '/search?query=*&filter=h%40' + encodeURIComponent(filter) + '&sort=date'
  }

  /** Tooltip-Text aus den Ampel-Gründen einer Scraper-Zeile. */
  ampelTooltip (row: ScraperRow): string {
    const parts: string[] = []
    for (const g of row.ampelGruende) {
      parts.push(this.beschreibeGrund(g))
    }
    return parts.filter(s => !!s).join('\n')
  }

  /** Tooltip-Text einer Hierarchie-Zeile: pro beteiligtem Spider eine Zeile,
   *  plus Stagnations-Hinweis auf Zeilenebene falls zutreffend. */
  hierarchyTooltip (row: HierarchyRow): string {
    const lines: string[] = []
    for (const sp of row.spiders) {
      const s = this.status.spiders[sp]
      if (!s) continue
      const teil = ampelGruende(s)
        .map((g: AmpelGrund) => this.beschreibeGrund(g))
        .filter((x: string) => !!x)
        .join(' · ')
      if (teil) lines.push(sp + ': ' + teil)
    }
    if (row.stagnation) {
      lines.push(this.beschreibeGrund({
        achse: 'stagnation', color: 'orange', wert: null
      }))
    }
    return lines.filter(s => !!s).join('\n')
  }

  beschreibeGrund (g: AmpelGrund): string {
    // Nur Achsen, die mindestens orange sind, im Tooltip ausgeben
    if (g.color !== 'orange' && g.color !== 'red') return ''
    if (g.achse === 'zeit') {
      if (g.wert === null) return String(this.$t('tip_kein_lauf'))
      if (g.wert < 1) return this.$t('tip_lauf') + ': < 1 ' + this.$t('tip_tage')
      return this.$t('tip_lauf') + ': ' + g.wert + ' ' + this.$t('tip_tage')
    }
    if (g.achse === 'bestand') {
      return this.$t('tip_bestand') + ': ' + g.wert + this.$t('tip_prozent_max')
    }
    if (g.achse === 'fehler') {
      const n = g.wert || 0
      if (n === 0) return ''
      return n + ' ' + this.$t('tip_einzelfehler')
    }
    if (g.achse === 'stagnation') {
      return String(this.$t('tip_stagnation'))
    }
    return ''
  }
}
</script>

<style lang="scss" scoped>
$color-green:  #2c6a3a;
$color-yellow: #d4ad15;
$color-orange: #c97816;
$color-red:    #b00020;
$bar-width:    8px;

#status {
  text-align: left;
  padding: 16px 24px 40px;
  font-size: 12px;
  color: #1d1d1f;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  background: #fff;

  h1 {
    font-size: 20px;
    margin: 0 0 10px;
  }

  .tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 12px;
    border-bottom: 1px solid #e5e5e7;
  }

  .tab {
    background: transparent;
    border: 0;
    border-bottom: 2px solid transparent;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 12px;
    color: #666;

    &:hover { color: #003a70; }

    &.active {
      color: #003a70;
      border-bottom-color: #003a70;
      font-weight: 600;
    }
  }

  .info, .error { padding: 10px 0; }
  .error { color: #b00020; }

  .hinweis {
    margin-top: 16px;
    padding: 10px 12px;
    border-left: 3px solid #c9d6e0;
    background: #f5f7fa;
    font-size: 11px;
    color: #555;
    line-height: 1.45;
  }

  // Status-Banner unter den Tabs, zeigt Indexer-Aktualisierung und Aggregate.
  .indexer-banner {
    margin: 4px 0 12px;
    padding: 8px 12px;
    background: #f5f7fa;
    border: 1px solid #e1e6ee;
    border-radius: 4px;
    font-size: 11px;
    color: #555;
    line-height: 1.4;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;

    .ib-label { font-weight: 600; color: #1d1d1f; }
    .ib-trenner { color: #bbb; }
    .ib-feld { font-variant-numeric: tabular-nums; }
    .ib-ok       { color: $color-green; font-weight: 600; }
    .ib-offen    { color: $color-orange; font-weight: 600; }
    .ib-kritisch { color: $color-red; font-weight: 600; }
    .ib-kaputt   { color: $color-red; font-weight: 600; }
  }
}

.status-table {
  border-collapse: collapse;
  width: 100%;
  // table-layout: auto (Default) — Browser bestimmt Spaltenbreiten je nach Inhalt

  thead th {
    position: sticky;
    top: 0;
    background: #fff;
    border-bottom: 2px solid #1d1d1f;
    padding: 6px 10px;
    font-weight: 600;
    font-size: 10px;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    text-align: left;
    white-space: nowrap;
  }

  tbody tr { border-bottom: 1px solid #eee; }

  td {
    padding: 4px 10px;
    vertical-align: middle;
  }

  .col-name {
    // Hierarchie-Name darf umbrechen, wenn nötig
    white-space: normal;
    word-break: break-word;
  }

  .col-num {
    text-align: right;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .col-lauf { white-space: nowrap; }

  .col-scraper {
    // Mehrere Spider-Namen dürfen umbrechen, einzelne nicht
    white-space: normal;
    word-break: break-word;
    line-height: 1.5;
  }

  .caret {
    display: inline-block;
    width: 12px;
    cursor: pointer;
    color: #999;
    user-select: none;
  }

  .caret-empty {
    display: inline-block;
    width: 12px;
  }

  .hierarchy-label {
    color: #003a70;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }

  .hierarchy-key {
    color: #999;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 10px;
    margin-left: 4px;
  }

  .scraper-list a {
    color: #003a70;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }

  .plus  { color: $color-green; }
  .neg   { color: $color-red; font-weight: 600; }
  .zero  { color: #999; }

  // Zustand-Zelle: Text-Anzeige mit Detail-Tooltip (title-Attribut).
  // 'ok' und 'indexiert…' laufen in normaler Textfarbe,
  // nur 'Indexierungsfehler' wird rot fett hervorgehoben.
  .zustand-zelle {
    cursor: default;
    .zustand-ok       { color: #555; }
    .zustand-offen    { color: #1d1d1f; }
    .zustand-kritisch { color: $color-red; font-weight: 600; }
    .zustand-fehler   { color: $color-red; font-weight: 600; }
  }
  .kaputt  { color: $color-red; font-weight: 600; }
  .reports { color: $color-orange; font-weight: 600; }

  // Spaltengruppen in der Scraper-Tabelle: leichte Hintergrundfärbung,
  // damit die beiden Blöcke 'Neu gescraped' und 'Bestand-Differenz'
  // sofort optisch erkennbar sind.
  .group-neu  { background: #fafbfd; }
  .group-diff { background: #f5f7fa; }

  thead th.group-neu, thead th.group-diff {
    text-align: center;
    border-left: 1px solid #e5e5e7;
  }
  thead th.group-diff { border-right: 1px solid #e5e5e7; }
  .log-info { color: #999; }
  .log-warn { color: $color-red; font-weight: 600; }

  .lvl-0 { background: #f5f5f7; font-weight: 600; }
  .lvl-1 { background: #fafafa; font-weight: 600; }
  .lvl-2 { background: #fcfcfd; }

  // Gesamt-Zeile über den Scraper-Rows (Summen aller Spider).
  .scraper-gesamt {
    background: #f5f5f7;
    font-weight: 600;
    border-bottom: 2px solid #1d1d1f;
  }

  // Hierarchien, die in einem Snapshot vorkamen, aber heute nicht mehr in
  // den Facetten stehen (Bestand 0). Visuell gedimmt, damit die Diff-Werte
  // klar als Verlust erkennbar bleiben.
  tr.weg {
    color: #888;
    font-style: italic;
    background: #fafafa;
    .hierarchy-label { color: #666; }
  }

  // Hierarchie: Ampel als linker Balken am Letzter-Lauf-Feld
  .ampel-green  td:last-child { box-shadow: inset $bar-width 0 0 $color-green; }
  .ampel-yellow td:last-child { box-shadow: inset $bar-width 0 0 $color-yellow; }
  .ampel-orange td:last-child { box-shadow: inset $bar-width 0 0 $color-orange; }
  .ampel-red    td:last-child { box-shadow: inset $bar-width 0 0 $color-red; }
}

// Scraper-Ansicht: Balken durchgehend über Hauptzeile + aufgeklappte Detailzeile
.status-table.scrapers {
  .scraper-row {
    cursor: pointer;
    &:hover { background: #f5f5f7; }
    &.expanded { background: #f5f5f7; border-bottom: 0; }
    &.highlighted { background: #fff5d6; transition: background-color 1.5s; }

    // Hauptzelle bekommt linken Balken; falls expanded weiter unten fortgeführt
    td:first-child {
      position: relative;
      padding-left: 12px;
    }
  }

  // Linker Balken pro Ampelfarbe — auf der Hauptzeile UND auf der Detailzeile,
  // damit das Aufklappen optisch zusammenhängend ist.
  .scraper-row.ampel-green  td:first-child::before,
  .scraper-detail.ampel-green  > td::before { background: $color-green; }
  .scraper-row.ampel-yellow td:first-child::before,
  .scraper-detail.ampel-yellow > td::before { background: $color-yellow; }
  .scraper-row.ampel-orange td:first-child::before,
  .scraper-detail.ampel-orange > td::before { background: $color-orange; }
  .scraper-row.ampel-red    td:first-child::before,
  .scraper-detail.ampel-red    > td::before { background: $color-red; }

  .scraper-row td:first-child::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: $bar-width;
  }

  .scraper-detail {
    background: #f5f5f7;

    > td {
      position: relative;
      padding: 0 0 8px 12px;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: -1px;          // damit der Balken die Trennlinie zur Hauptzeile überdeckt
        bottom: 0;
        width: $bar-width;
      }
    }
  }

  .status-table.inner {
    width: 100%;
    margin: 0;
    background: #fff;

    thead th {
      background: #fafafa;
      border-bottom: 1px solid #ddd;
      position: static;
    }

    tbody tr:last-child { border-bottom: 0; }

    .col-name {
      width: 50%;
      padding-left: 24px;   // Einrückung wie eine Hierarchieebene
    }
  }
}
</style>
