<template>
  <div id="datenschutz">
    <template v-if="locale==='de'">
      <h1>Datenschutz</h1>
      <p>Bei der Nutzung dieser Website werden Ihre Requests an entscheidsuche.ch übertragen. In den übertragenen Daten sind technisch
         notwendigerweise Ihre IP-Adresse, sowie die aufgerufenen Dokumente und gestellten Suchanfragen enthalten. Diese Daten werden
         durch unsere Auftragsverarbeiter cyon.ch und pansoft.de verarbeitet. Eine Weiterleitung an weitere Dritte findet nicht statt.
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
      <h1>Protection des données</h1>
      <p>Lorsque vous utilisez ce site web, vos demandes sont transmises à entscheidsuche.ch. Les données transmises comprennent nécessairement votre adresse IP, ainsi que les documents consultés et les requêtes de recherche effectuées. Ces données sont traitées par nos sous-traitants <a href="https://cyon.ch">cyon.ch</a> et <a href="https://pansoft.de">pansoft.de</a>. Elles ne sont pas transmises à d'autres tiers. Nous ne conservons pas de statistiques individuelles, mais procédons uniquement à une analyse rudimentaire des fichiers journaux afin de contrôler le nombre d'accès et l'utilisation de nos systèmes et de réagir aux attaques si nécessaire. En cas d'attaques spécifiques, nous nous réservons le droit d'effectuer une journalisation et un suivi détaillés.</p>
      <p>Ce site web n'utilise pas de cookies. Votre navigateur peut stocker les fichiers de l'application web dans son cache. Toutefois, nous ne les analysons pas à des fins de profilage ou autres.</p>
      <p>En tant que sponsor ou membre de entscheidsuche.ch, nous stockons vos données à des fins d'administration et de comptabilité des membres. Avec votre consentement, nous vous inscrivons également sur notre site web en tant que sympathisant. Dès que nous n'avons plus besoin de ces données à ces fins, nous les supprimons.</p>
      <p>La <a href="https://www.fedlex.admin.ch/eli/cc/1993/1945_1945_1945/fr">loi suisse sur la protection des données</a> s'applique à ce site web. Dans des cas exceptionnels, les lois sur la protection des données d'autres pays, telles que le <a href="https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679&from=FR">RGPD</a> de l'Union européenne, peuvent également s'appliquer.</p>
      <p>Les données sont traitées parce que nous avons un intérêt prépondérant privé (RGPD : intérêt légitime), une obligation légale, un accord contractuel ou un consentement explicite.</p>
      <p>Les lois sur la protection des données vous donnent, en tant que personne concernée, certains droits, tels que le droit d'être informé sur les données que nous traitons. Vous pouvez également demander la correction, la suppression ou limitation du traitement des données si nécessaire.</p>
      <p>L'association <a href="https://entscheidsuche.ch">entscheidsuche.ch</a>, 3000 Berne, est responsable du traitement des données. Vous êtes également libre de contacter le <a href="https://www.edoeb.admin.ch/edoeb/fr/home.html">préposé fédéral à la protection des données</a> autorité compétente en la matière.</p>
    </template>
    <template v-if="locale==='it'">
      <p>La versione in lingua italiana non è ancora disponibile</p>
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
