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

    <div v-if="loading" class="info">{{ $t('lädt') }}…</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <!-- Hierarchie-Ansicht -->
    <table v-else-if="view === 'hierarchy'" class="status-table">
      <thead>
        <tr>
          <th class="col-name">{{ $t('Hierarchie') }}</th>
          <th class="col-num">{{ $t('Bestand') }}</th>
          <th class="col-num">{{ $t('Seit') }} {{ datumGestern }}</th>
          <th class="col-num">{{ $t('Seit') }} {{ datumVorwoche }}</th>
          <th class="col-num">{{ $t('Seit') }} {{ datumVormonat }}</th>
          <th class="col-scraper">{{ $t('Scraper') }}</th>
          <th class="col-lauf">{{ $t('Letzter Lauf') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in sichtbareHierarchyRows" :key="row.key"
            :class="['lvl-' + row.level, row.color ? 'ampel-' + row.color : '']"
            :title="hierarchyTooltip(row)">
          <td class="col-name" :style="{ paddingLeft: (row.level * 14 + 4) + 'px' }">
            <span v-if="row.hatKinder" class="caret" @click="toggle(row.key)">{{ expandedKeys[row.key] ? '▾' : '▸' }}</span><span v-else class="caret-empty"></span>
            <a v-if="row.searchFilter"
               :href="searchUrl(row.searchFilter)"
               class="hierarchy-label">{{ row.level === 0 ? $t('Schweiz') : row.label || row.key }}</a>
            <span v-else class="hierarchy-label">{{ row.level === 0 ? $t('Schweiz') : row.label || row.key }}</span>
            <span v-if="row.level > 0 && row.level < 3" class="hierarchy-key">{{ row.key }}</span>
          </td>
          <td class="col-num">{{ formatNumber(row.bestand) }}</td>
          <td class="col-num"><span :class="signClass(row.seit1d)">{{ formatPlus(row.seit1d) }}</span></td>
          <td class="col-num"><span :class="signClass(row.seit7d)">{{ formatPlus(row.seit7d) }}</span></td>
          <td class="col-num"><span :class="signClass(row.seit30d)">{{ formatPlus(row.seit30d) }}</span></td>
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

    <!-- Scraper-Ansicht -->
    <table v-else-if="view === 'scrapers'" class="status-table scrapers">
      <thead>
        <tr>
          <th class="col-scraper">{{ $t('Scraper') }}</th>
          <th class="col-lauf">{{ $t('Letzter Lauf') }}</th>
          <th class="col-num">{{ $t('Gesamt') }}</th>
          <th class="col-num">{{ $t('Last') }}</th>
          <th class="col-num">{{ $t('Seit') }} {{ datumGestern }}</th>
          <th class="col-num">{{ $t('Seit') }} {{ datumVorwoche }}</th>
          <th class="col-num">{{ $t('Seit') }} {{ datumVormonat }}</th>
          <th class="col-num">{{ $t('Fehlversuche') }}</th>
          <th class="col-num">{{ $t('Fehler') }}</th>
        </tr>
      </thead>
      <tbody>
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
            <td class="col-num"><span :class="signClass(row.last)">{{ formatPlus(row.last) }}</span></td>
            <td class="col-num"><span :class="signClass(row.seit1d)">{{ formatPlus(row.seit1d) }}</span></td>
            <td class="col-num"><span :class="signClass(row.seit7d)">{{ formatPlus(row.seit7d) }}</span></td>
            <td class="col-num"><span :class="signClass(row.seit30d)">{{ formatPlus(row.seit30d) }}</span></td>
            <td class="col-num">{{ row.fehlerlaeufe > 0 ? row.fehlerlaeufe : '–' }}</td>
            <td class="col-num">{{ row.einzelfehler > 0 ? row.einzelfehler : '–' }}</td>
          </tr>
          <tr v-if="expandedScraper === row.spider" :key="row.spider + '-detail'"
              :class="['scraper-detail', 'ampel-' + row.color]">
            <td colspan="9">
              <table class="status-table inner">
                <thead>
                  <tr>
                    <th class="col-name">{{ $t('Hierarchie') }}</th>
                    <th class="col-num">{{ $t('Bestand') }}</th>
                    <th class="col-num">{{ $t('Seit') }} {{ datumGestern }}</th>
                    <th class="col-num">{{ $t('Seit') }} {{ datumVorwoche }}</th>
                    <th class="col-num">{{ $t('Seit') }} {{ datumVormonat }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="kammer in row.kammern" :key="kammer.key">
                    <td class="col-name">
                      <a :href="searchUrl(kammer.searchFilter)">{{ kammer.label }}</a>
                      <span class="hierarchy-key">{{ kammer.key }}</span>
                    </td>
                    <td class="col-num">{{ formatNumber(kammer.bestand) }}</td>
                    <td class="col-num"><span :class="signClass(kammer.seit1d)">{{ formatPlus(kammer.seit1d) }}</span></td>
                    <td class="col-num"><span :class="signClass(kammer.seit7d)">{{ formatPlus(kammer.seit7d) }}</span></td>
                    <td class="col-num"><span :class="signClass(kammer.seit30d)">{{ formatPlus(kammer.seit30d) }}</span></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import {
  ladeAlles, buildHierarchyRows, buildScraperRows, ampelGruende,
  formatLaufDatum, formatDatumDDMMYYYY, tageVorher,
  HierarchyRow, ScraperRow, Facetten, StatusData, ESCounts, AmpelGrund
} from '@/util/status'

@Component({ name: 'Status' })
export default class Status extends Vue {
  loading = true
  error = ''
  facetten: Facetten = {}
  status: StatusData = { generated: '', spider_count: 0, spiders: {} }
  es: ESCounts = { total: {}, d1: {}, d7: {}, d30: {} }

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
    return buildScraperRows(this.facetten, this.status, this.es, this.lang)
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

  formatNumber (n: number): string {
    return new Intl.NumberFormat('de-CH').format(n)
  }

  formatPlus (n: number): string {
    if (n === 0) return '–'
    return (n > 0 ? '+' : '') + this.formatNumber(n)
  }

  formatLauf (s: string | null): string {
    return formatLaufDatum(s)
  }

  signClass (n: number): string {
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

  /** Tooltip-Text einer Hierarchie-Zeile: pro beteiligtem Spider eine Zeile. */
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
    return lines.join('\n')
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
    return ''
  }
}
</script>

<style lang="scss" scoped>
$color-green:  #2c6a3a;
$color-yellow: #d4ad15;
$color-orange: #c97816;
$color-red:    #b00020;
$bar-width:    4px;

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
  .log-info { color: #999; }
  .log-warn { color: $color-red; font-weight: 600; }

  .lvl-0 { background: #f5f5f7; font-weight: 600; }
  .lvl-1 { background: #fafafa; font-weight: 600; }
  .lvl-2 { background: #fcfcfd; }

  // Hierarchie: Ampel als linker Balken am Letzter-Lauf-Feld
  .ampel-green  td:last-child { box-shadow: inset 4px 0 0 $color-green; }
  .ampel-yellow td:last-child { box-shadow: inset 4px 0 0 $color-yellow; }
  .ampel-orange td:last-child { box-shadow: inset 4px 0 0 $color-orange; }
  .ampel-red    td:last-child { box-shadow: inset 4px 0 0 $color-red; }
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
