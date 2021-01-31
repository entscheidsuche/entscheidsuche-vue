<template>
  <div id="about">
    <template>
      <h1>Über uns</h1>
      <h2>Plattform entscheidsuche.ch</h2>
      <p>Die Webseite entscheidsuche.ch bietet eine unentgeltliche Suche in publizierten Gerichtsurteilen von Schweizer Gerichten aller Instanzen.</p>
      <p>In einer ersten Phase (2018-2020) wurde eine Sammlung aus dem Jahr 2018 publiziert.</p>
      <p>Im Jahr 2020 konnte der Verein entscheidsuche.ch dank einer Crowd-Funding-Aktion (<b-link href="https://wemakeit.com/projects/entscheidsuche-ch" target="_blank">wemakeit.com</b-link>) und zahlreichen Unterstützer/innen die notwendigen finanziellen Mittel verfügbar machen, um die neu
        publizierten Urteile überwiegend täglich bei den jeweiligen Quellen abzuholen und via entscheidsuche.ch
        auffindbar zu machen. Die Scraper sind auf <b-link href="https://github.com/entscheidsuche/NeueScraper" target="_blank">GitHub</b-link>
        verfügbar.
      </p>
      <p>Im Jahr 2021 soll eine Upload-Funktion geschaffen werden, die es interessierten Personen ermöglicht, von
        Behörden nicht publizierte Urteile in geeigneter Form via entscheidsuche.ch auffindbar machen (<b-link href="https://entscheidsuche.ch/pdf/entscheidsuche.ch_Upload-Konzept_V1.1_Austausch-Aktennotiz_08.12.2020.pdf">Upload-Konzept</b-link>)
      </p>
      <h2>Verein entscheidsuche.ch</h2>
      <p>Der Verein entscheidsuche.ch wurde 2017 in Landquart (GR) gegründet. Der Vereinszweck besteht darin, die
        Rechtsprechung schweizerischer Gerichte für jedermann durchsuchbar und zugreifbar zu machen (<b-link href="https://entscheidsuche.ch/pdf/entscheidsuche-statuten.pdf">Statuten</b-link>). Im Jahr 2020 hat der Kanton Bern den Verein entscheidsuche.ch wegen Verfolgung gemeinnütziger Zwecke von der
        Steuerpflicht befreit (<b-link href="https://entscheidsuche.ch/pdf/VerfuegungBE_Gemeinnuetzigkeit_19.12.2019.pdf">Verfügung Steuerverwaltung BE</b-link>).
      </p>
      <p>Mitglieder des Vorstands des Vereins entscheidsuche.ch sind Jörn Erbguth, Daniel Hürlimann und Claudia
        Schreiber. Der Vorstand ist unter der Adresse
        <b-link href="mailto:info@entcheidsuche.ch">info@entcheidsuche.ch</b-link>
        erreichbar.
      </p>
      <h2>Mitgliedschaft im Verein</h2>
      <p>Wer den Vereinszweck unterstützen möchten, kann Mitglied des Vereins entscheidsuche.ch werden. Der
        Mitgliederbeitrag beträgt für natürliche Personen 100 Franken und für institutionelle Mitglieder 1000 Franken
        pro Jahr. Antrag bitte formlos per e-Mail (<b-link href="mailto:info@entcheidsuche.ch">info@entcheidsuche.ch</b-link>).
      </p>
      <div class="contact">
        <h2>Koordinaten des Vereins</h2>
        <p>Postadresse des Vereins: Verein entscheidsuche.ch, 3000 Bern<br>
          Konto des Vereins entscheidsuche.ch:<br>
          Postfinance IBAN: CH04 0900 0000 1412 0685 4,<br>
          Verein entscheidsuche.ch, 8000 Zürich</p>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
#about {
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'About'
})
export default class About extends Vue {
  public get locale () {
    return AppModule.locale
  }
}
</script>
