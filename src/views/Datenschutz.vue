<template>
  <div id="datenschutz">
    <template v-if="locale==='de'">
      <h1>Datenschutz</h1>
      <p>Bei der Nutzung dieser Website werden Ihre Requests an entscheidsuche.ch übertragen. In den übertragenen Daten sind technisch
         notwendigerweise Ihre IP-Adresse, sowie die aufgerufenen Dokumente und gestellten Suchanfragen enthalten. Diese Daten werden
         durch unsere Auftragsverarbeiter cyon.ch und pansoft.de verarbeitet. Eine Weiterleitung an Dritte findet nicht statt.
         Wir führen keine individuellen Statistiken, sondern machen lediglich eine rudimentäre Logfile-Analyse, um die Anzahl der Zugriffe
         und die Auslastung unserer Systeme zu monitoren und im Bedarfsfall bei Angriffen zu reagieren. Im Fall konkreter Angriffe
         behalten wir uns ein detailliertes Logging und eine detaillierte Nachverfolgung vor.
      </p>
      <p>Diese Website nutzt keine Cookies. Ihr Browser legt die Dateien der Web-Anwendung ggf. in seinem Cache ab. Das wird von uns jedoch
         nicht zur Profilbildung oder anderen Zwecken analysiert.
      </p>
      <p>Als Sponsor*in oder Mitglied von entscheidsuche.ch speichern wir Ihre Daten zwecks Mitgliederverwaltung und Buchführung. Mit Ihrem
         Einverständnis führen wir Sie zudem auf unserer Website als Unterstützer*in auf. Sobald wir diese Daten nicht mehr für diese Zwecke benötigen, löschen wir sie.
      </p>
      <p>Auf diese Website findet das <a href="https://www.fedlex.admin.ch/eli/cc/1993/1945_1945_1945/de">Datenschutzgesetz</a> der Schweiz
         Anwendung. In Ausnahmefällen können auch Datenschutzgesetze anderer Länder, wie etwa die <a href="https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679&from=DE">DSGVO</a>
         der Europäischen Union Anwendung finden.
      </p>
      <p>Die Verarbeitung der Daten erfolgt, weil wir ein überwiegendes privates Interesse (DSGVO: berechtigtes Interesse), eine gesetzliche
         Pflicht, eine vertragliche Vereinbarung oder eine explizite Einwilligung haben.
      </p>
      <p>Die Datenschutzgesetze geben Ihnen als Betroffene bestimmte Rechte, so etwa das Recht auf Auskunft über die von uns verarbeiteten
         Daten. Auch können Sie ggf. die Berichtigung, Löschung oder Sperrung der Daten verlangen.
      </p>
      <p>Verantwortlich für die Verarbeitung der Daten ist der Verein entscheidsuche.ch, 3000 Bern. Es steht Ihnen zudem frei, sich an den
         für entscheidsuche.ch zuständigen <a href="https://www.edoeb.admin.ch/edoeb/de/home.html">eidgenössischen Datenschutzbeauftragten</a> zu wenden.
      </p>
    </template>
    <template v-if="locale==='fr'">
    </template>
    <template v-if="locale==='it'">
    </template>
  </div>
</template>

<style lang="scss">
#datenschutz {
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'Datenschutz'
})
export default class Organization extends Vue {
  public get locale () {
    return AppModule.locale
  }
}
</script>
