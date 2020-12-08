<template>
  <div id="about">
    <template v-if="locale==='de'">
      <h1>Über uns</h1>
      <h3>Plattform entscheidsuche.ch</h3>
      <p>Die Webseite entscheidsuche.ch bietet eine unentgeltliche Suche in allen publizierten Gerichtsurteilen von Schweizer Gerichten aller Instanzen.</p>
      <p>In einer ersten Phase (2018-2020) wurde eine Sammlung aus dem Jahr 2018 publiziert.</p>
      <p>Im Jahr 2020 konnte der Verein entscheidsuche.ch dank einer Crowd-Funding-Aktion (<b-link href="https://www.link.ch/" target="_blank">www.link.ch</b-link>) und zahlreichen Unterstützer/innen die notwendigen finanziellen Mittel verfügbar machen, um die neu publizierten Urteile in regelmässigen Abständen bei den jeweiligen Quellen abzuholen und via entscheidsuche.ch auffindbar zu machen, <b-link href="#">vgl. technische Dokumentation</b-link> zu entscheidsuche.ch.</p>
      <p>Im Jahr 2021 soll eine Upload-Funktion geschaffen werden, die es interessierten Personen ermöglicht, von Behörden nicht publizierte Urteile in geeigneter Form via entscheidsuche.ch auffindbar machen (<b-link href="#">Upload-Konzept.pdf</b-link>)</p>
      <h3>Verein entscheidsuche.ch</h3>
      <p>Der Verein entscheidsuche.ch wurde 2017 in Landquart (GR) gegründet. Der Vereinszweck besteht darin, die Rechtsprechung schweizerischer Gerichte für jedermann durchsuchbar und zugreifbar zu machen (<b-link href="#">Statuten.pdf</b-link>). Im Jahr 2020 hat der Kanton Bern den Verein entscheidsuche.ch wegen Verfolgung gemeinnütziger Zwecke von der Steuerpflicht befreit (<b-link href="#">Verfügung.pdf</b-link>).</p>
      <p>Mitglieder des Vorstands des Vereins entscheidsuche.ch sind Jörn Erbguth, Daniel Hürlimann und Claudia Schreiber. Der Vorstand ist unter der Adresse <b-link href="mailto:info@entcheidsuche.ch">info@entcheidsuche.ch</b-link> erreichbar.</p>
      <h3>Mitgliedschaft im Verein</h3>
      <p>Wer den Vereinszweck unterstützen möchten, kann Mitglied des Vereins entscheidsuche.ch werden. Der Mitgliederbeitrag beträgt für natürliche Personen 100 Franken und für institutionelle Mitglieder 1000 Franken pro Jahr. (<b-link href="#">Antragsformular.pdf)</b-link></p>
      <div class="contact">
        <h3>Koordinaten des Vereins</h3>
        <p>Postadresse des Vereins: Verein entscheidsuche.ch, 3000 Bern<br>
          Konto des Vereins entscheidsuche.ch:<br>
          Postfinance IBAN: CH04 0900 0000 1412 0685 4,<br>
          Verein entscheidsuche.ch, 8000 Zürich</p>
      </div>
    </template>
    <template v-if="locale==='fr'">
      <h1>FR: Über uns</h1>
      <h3>Plattform entscheidsuche.ch</h3>
      <p>Die Webseite entscheidsuche.ch bietet eine unentgeltliche Suche in allen publizierten Gerichtsurteilen von Schweizer Gerichten aller Instanzen.</p>
      <p>In einer ersten Phase (2018-2020) wurde eine Sammlung aus dem Jahr 2018 publiziert.</p>
      <p>Im Jahr 2020 konnte der Verein entscheidsuche.ch dank einer Crowd-Funding-Aktion (<b-link href="https://www.link.ch/" target="_blank">www.link.ch</b-link>) und zahlreichen Unterstützer/innen die notwendigen finanziellen Mittel verfügbar machen, um die neu publizierten Urteile in regelmässigen Abständen bei den jeweiligen Quellen abzuholen und via entscheidsuche.ch auffindbar zu machen, <b-link href="#">vgl. technische Dokumentation</b-link> zu entscheidsuche.ch.</p>
      <p>Im Jahr 2021 soll eine Upload-Funktion geschaffen werden, die es interessierten Personen ermöglicht, von Behörden nicht publizierte Urteile in geeigneter Form via entscheidsuche.ch auffindbar machen (<b-link href="#">Upload-Konzept.pdf</b-link>)</p>
      <h3>Verein entscheidsuche.ch</h3>
      <p>Der Verein entscheidsuche.ch wurde 2017 in Landquart (GR) gegründet. Der Vereinszweck besteht darin, die Rechtsprechung schweizerischer Gerichte für jedermann durchsuchbar und zugreifbar zu machen (<b-link href="#">Statuten.pdf</b-link>). Im Jahr 2020 hat der Kanton Bern den Verein entscheidsuche.ch wegen Verfolgung gemeinnütziger Zwecke von der Steuerpflicht befreit (<b-link href="#">Verfügung.pdf</b-link>).</p>
      <p>Mitglieder des Vorstands des Vereins entscheidsuche.ch sind Jörn Erbguth, Daniel Hürlimann und Claudia Schreiber. Der Vorstand ist unter der Adresse <b-link href="mailto:info@entcheidsuche.ch">info@entcheidsuche.ch</b-link> erreichbar.</p>
      <h3>Mitgliedschaft im Verein</h3>
      <p>Wer den Vereinszweck unterstützen möchten, kann Mitglied des Vereins entscheidsuche.ch werden. Der Mitgliederbeitrag beträgt für natürliche Personen 100 Franken und für institutionelle Mitglieder 1000 Franken pro Jahr. (<b-link href="#">Antragsformular.pdf)</b-link></p>
      <div class="contact">
        <h3>Koordinaten des Vereins</h3>
        <p>Postadresse des Vereins: Verein entscheidsuche.ch, 3000 Bern<br>
          Konto des Vereins entscheidsuche.ch:<br>
          Postfinance IBAN: CH04 0900 0000 1412 0685 4,<br>
          Verein entscheidsuche.ch, 8000 Zürich</p>
      </div>
    </template>
    <template v-if="locale==='it'">
      <h1>IT: Über uns</h1>
      <h3>Plattform entscheidsuche.ch</h3>
      <p>Die Webseite entscheidsuche.ch bietet eine unentgeltliche Suche in allen publizierten Gerichtsurteilen von Schweizer Gerichten aller Instanzen.</p>
      <p>In einer ersten Phase (2018-2020) wurde eine Sammlung aus dem Jahr 2018 publiziert.</p>
      <p>Im Jahr 2020 konnte der Verein entscheidsuche.ch dank einer Crowd-Funding-Aktion (<b-link href="https://www.link.ch/" target="_blank">www.link.ch</b-link>) und zahlreichen Unterstützer/innen die notwendigen finanziellen Mittel verfügbar machen, um die neu publizierten Urteile in regelmässigen Abständen bei den jeweiligen Quellen abzuholen und via entscheidsuche.ch auffindbar zu machen, <b-link href="#">vgl. technische Dokumentation</b-link> zu entscheidsuche.ch.</p>
      <p>Im Jahr 2021 soll eine Upload-Funktion geschaffen werden, die es interessierten Personen ermöglicht, von Behörden nicht publizierte Urteile in geeigneter Form via entscheidsuche.ch auffindbar machen (<b-link href="#">Upload-Konzept.pdf</b-link>)</p>
      <h3>Verein entscheidsuche.ch</h3>
      <p>Der Verein entscheidsuche.ch wurde 2017 in Landquart (GR) gegründet. Der Vereinszweck besteht darin, die Rechtsprechung schweizerischer Gerichte für jedermann durchsuchbar und zugreifbar zu machen (<b-link href="#">Statuten.pdf</b-link>). Im Jahr 2020 hat der Kanton Bern den Verein entscheidsuche.ch wegen Verfolgung gemeinnütziger Zwecke von der Steuerpflicht befreit (<b-link href="#">Verfügung.pdf</b-link>).</p>
      <p>Mitglieder des Vorstands des Vereins entscheidsuche.ch sind Jörn Erbguth, Daniel Hürlimann und Claudia Schreiber. Der Vorstand ist unter der Adresse <b-link href="mailto:info@entcheidsuche.ch">info@entcheidsuche.ch</b-link> erreichbar.</p>
      <h3>Mitgliedschaft im Verein</h3>
      <p>Wer den Vereinszweck unterstützen möchten, kann Mitglied des Vereins entscheidsuche.ch werden. Der Mitgliederbeitrag beträgt für natürliche Personen 100 Franken und für institutionelle Mitglieder 1000 Franken pro Jahr. (<b-link href="#">Antragsformular.pdf)</b-link></p>
      <div class="contact">
        <h3>Koordinaten des Vereins</h3>
        <p>Postadresse des Vereins: Verein entscheidsuche.ch, 3000 Bern<br>
          Konto des Vereins entscheidsuche.ch:<br>
          Postfinance IBAN: CH04 0900 0000 1412 0685 4,<br>
          Verein entscheidsuche.ch, 8000 Zürich</p>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
#about{
  //height:100vh;
  position: relative;
  min-height: 100%;
  max-width: 984px;
  padding-bottom: 80px;
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
