<template>
  <div id="dataUsage">
    <template>
      <h1>Daten</h1>
      <h2>Speicherung</h2>
      <p>Die auf der Plattform <b-link href="https://entscheidsuche.ch">entscheidsuche.ch</b-link> veröffenlichten Dokumente werden vom Verein entscheidsuche.ch öffentlich zugänglich im Format HTML oder im Format PDF gespeichert. Pro Entscheiddatei besteht eine Metadaten-Datei im Format JSON, diese Metadaten-Files sind ebenfalls öffentlich zugänglich gespeichert. Die Daten sind frei zugänglich unter <b-link href="https://entscheidsuche.ch/docs">https://entscheidsuche.ch/docs</b-link>. Der aktuelle Stand der Scraper ist unter <b-link href="status">Gerichte</b-link> verfügbar. Eine Dokumentation dieser Schnittstelle inkl. der Möglichkeit, nur aktuelle Entscheide abzurufen, wird noch erstellt.</p>
      <h2>Weiterverwendung der Daten</h2>
      <p>Die Plattform entscheidsuche.ch versteht sich als privat betriebener Service public. Die von der Plattform gesammelten und veröffentlichten Daten stehen alle Interessierten zur freien Benutzung und Weiterbearbeitung zur Verfügung. Bitte nennen Sie uns bei der Weiterverwendung der Daten als Quelle. Der Verein entscheidsuche.ch ist zur Finanzierung dieses Service public darauf angewiesen, dass neben den direkten NutzerInnen auch Dienste, welche die Daten von entscheidsuche.ch weiterverarbeiten, freiwillige Zuwendungen an den Verein vorsehen. Freiwillige Zuwendungen an den Verein sind im Rahmen der einschlägigen gesetzlichen Vorgaben steuerlich abzugsfähig (<b-link href="https://entscheidsuche.ch/pdf/VerfuegungBE_Gemeinnuetzigkeit_19.12.2019.pdf">Verfügung über die Gemeinnützigkeit</b-link>).</p>
      <h2>Langzeitarchivierung</h2>
      <p>Die Inhalte der Plattform entscheidsuche.ch werden von der Schweizerischen Nationalbibliothek jährlich eingesammelt und in eine Langzeitarchivierung (Open Archival Information System - OAIS) im Webarchiv Schweiz überführt <b-link href="https://www.nb.admin.ch/snl/de/home/fachinformationen/e-helvetica/webarchiv-schweiz.html">Webarchiv Schweiz</b-link> überführt. Diese "Zeitschnitte" ergeben einen Nachweis der Inhalte der Plattform entscheidsuche.ch über die Jahre hinweg. Der Zugang zum Webarchiv Schweiz ist eingeschränkt, d.h. die älteren Versionen der Plattform entscheidsuche.ch können nur in der Nationalbibliothek und den Partnerinstitutionen der Nationalbibliothek vor Ort eingesehen werden.</p>
    </template>
  </div>
</template>

<style lang="scss">
#dataUsage {
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'DataUsage'
})
export default class DataUsage extends Vue {
  public get locale () {
    return AppModule.locale
  }
}
</script>
