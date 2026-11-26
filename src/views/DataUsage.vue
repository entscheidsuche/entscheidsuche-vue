<template>
  <div id="dataUsage">
    <template v-if="locale==='de'">
      <h1>Daten</h1>
      <h2>Speicherung</h2>
      <p>Die auf der Plattform <b-link href="https://entscheidsuche.ch">entscheidsuche.ch</b-link> veröffenlichten Dokumente werden vom Verein entscheidsuche.ch öffentlich zugänglich im Format HTML oder im Format PDF gespeichert. Pro Entscheiddatei besteht eine Metadaten-Datei im Format JSON, diese Metadaten-Files sind ebenfalls öffentlich zugänglich gespeichert. Die Daten sind frei zugänglich unter <b-link href="https://entscheidsuche.ch/docs">https://entscheidsuche.ch/docs</b-link>. Der aktuelle Stand der Scraper ist unter <b-link href="status">Datenstand</b-link> verfügbar. Eine Dokumentation dieser Schnittstelle findet sich <b-link href="https://entscheidsuche.ch/pdf/EntscheidsucheAPI.pdf">hier</b-link>.</p>
      <h2>Weiterverwendung der Daten</h2>
      <p>Die Plattform entscheidsuche.ch versteht sich als privat betriebener Service public. Die von der Plattform gesammelten und veröffentlichten Daten stehen alle Interessierten zur freien Benutzung und Weiterbearbeitung zur Verfügung. Bitte nennen Sie uns bei der Weiterverwendung der Daten als Quelle. Der Verein entscheidsuche.ch ist zur Finanzierung dieses Service public darauf angewiesen, dass neben den direkten NutzerInnen auch Dienste, welche die Daten von entscheidsuche.ch weiterverarbeiten, freiwillige Zuwendungen an den Verein vorsehen. Freiwillige Zuwendungen an den Verein sind im Rahmen der einschlägigen gesetzlichen Vorgaben steuerlich abzugsfähig (<b-link href="https://entscheidsuche.ch/pdf/VerfuegungBE_Gemeinnuetzigkeit_19.12.2019.pdf">Verfügung über die Gemeinnützigkeit</b-link>).</p>
      <h2>Langzeitarchivierung</h2>
      <p>Die Inhalte der Plattform entscheidsuche.ch werden von der Schweizerischen Nationalbibliothek jährlich eingesammelt und in eine Langzeitarchivierung (Open Archival Information System - OAIS) im Webarchiv Schweiz überführt <b-link href="https://www.nb.admin.ch/snl/de/home/fachinformationen/e-helvetica/webarchiv-schweiz.html">Webarchiv Schweiz</b-link> überführt. Diese "Zeitschnitte" ergeben einen Nachweis der Inhalte der Plattform entscheidsuche.ch über die Jahre hinweg. Der Zugang zum Webarchiv Schweiz ist eingeschränkt, d.h. die älteren Versionen der Plattform entscheidsuche.ch können nur in der Nationalbibliothek und den Partnerinstitutionen der Nationalbibliothek vor Ort eingesehen werden.</p>
    </template>
    <template v-if="locale==='fr'">
      <h1>Données</h1>
      <h2>Sauvegarde des données</h2>
      <p>Les documents publiés sur le portail <b-link href="https://entscheidsuche.ch">entscheidsuche.ch</b-link> sont sauvegardées par l'association entscheidsuche.ch dans un format HTML ou PDF accessible au public. Pour chaque fichier de décision, il existe un fichier de métadonnées au format JSON, ces fichiers de métadonnées sont également stockés dans un format accessible au public. Les données sont librement accessibles sur le site <b-link href="https://entscheidsuche.ch/docs">https://entscheidsuche.ch/docs</b-link>. L'état actuel du processus de scraping est disponible sous la rubrique <b-link href="status">État des données</b-link>. La documentation de cette interface, se trouve <b-link href="https://entscheidsuche.ch/pdf/EntscheidsucheAPI.pdf">ici</b-link>.</p>
      <h2>Utilisation des données mises à disposition par l'association entscheidsuche.ch</h2>
      <p>La plate-forme entscheidsuche.ch est un service public mis à disposition par le secteur privé. Les données collectées et publiées par le portail sont à la disposition de toutes les parties intéressées. Si vous utilisez les données de ce portail, veuillez nous mentionner comme source. Pour financer ce service public, l'association entscheidsuche.ch s'appuie sur les contributions des utilisateurs directs ainsi que des services qui traitent les données de entscheidsuche.ch. Les contributions volontaires à l'association sont déductibles fiscalement dans le cadre des dispositions légales applicables (<b-link href="https://entscheidsuche.ch/pdf/VerfuegungBE_Gemeinnuetzigkeit_19.12.2019.pdf">décision sur l'exonératoin d'impôts de l'intendance des impôts du canton de Berne</b-link>).</p>
      <h2>Archivage à long terme</h2>
      <p>Les contenus de la plate-forme entscheidsuche.ch sont collectés chaque année par la Bibliothèque nationale suisse et transférés dans l'archivage à long terme (Open Archival Information System - OAIS) dans les <b-link href="https://www.nb.admin.ch/snl/de/home/fachinformationen/e-helvetica/webarchiv-schweiz.html">Archives Web Suisse</b-link>. Ces "instantanés archivés" permettent d'enregistrer le contenu de la plate-forme entscheidsuche.ch au fil des ans. L'accès à Archives Web Suisse est restreint, c'est-à-dire que les anciennes versions de la plate-forme entscheidsuche.ch ne peuvent être consultées que sur place à la Bibliothèque nationale et dans les institutions partenaires de la Bibliothèque nationale.</p>
    </template>
    <template v-if="locale==='it'">
      <h1>Dati</h1>
      <h2>Stoccaggio dei dati</h2>
      <p>I documenti pubblicati sul portale <b-link href="https://entscheidsuche.ch">entscheidsuche.ch</b-link> sono salvati dall'associazione entscheidsuche.ch in un formato HTML o PDF accessibile al pubblico. Per ogni file di decisione c'è un file di metadati in formato JSON. Questi file di metadati sono anche memorizzati in un formato accessibile al pubblico. I dati sono liberamente accessibili su <b-link href="https://entscheidsuche.ch/docs">https://entscheidsuche.ch/docs</b-link>. Lo stato attuale del processo di "scraping" è disponibile sotto la rubrica <b-link href="status">Stato dei dati</b-link>. La documentazione di questa interfaccia è disponibile <b-link href="https://entscheidsuche.ch/pdf/EntscheidsucheAPI.pdf">qui</b-link>.</p>
      <h2>Utilizzo dei dati forniti dall'associazione entscheidsuche.ch</h2>
      <p>La piattaforma entscheidsuche.ch è un servizio pubblico fornito dal settore privato. I dati raccolti e pubblicati dal portale sono disponibili a tutte le parti interessate. Se usate i dati di questo portale, vi preghiamo di citarci come fonte. Per finanziare questo servizio pubblico, l'associazione entscheidsuche.ch si basa sui contributi degli utenti diretti e dei servizi che elaborano i dati di entscheidsuche.ch. I contributi volontari all'associazione sono fiscalmente deducibili nel quadro delle disposizioni legali applicabili (<b-link href="https://entscheidsuche.ch/pdf/VerfuegungBE_Gemeinnuetzigkeit_19.12.2019.pdf">decisione di esenzione fiscale dell'ufficio delle imposte del Cantone di Berna</b-link>).</p>
      <h2>Archiviazione a lungo termine</h2>
      <p>I contenuti della piattaforma entscheidsuche.ch sono raccolti annualmente dalla Biblioteca Nazionale Svizzera e trasferiti all'archiviazione a lungo termine (Open Archival Information System - OAIS) nel <b-link href="https://www.nb.admin.ch/snl/de/home/fachinformationen/e-helvetica/webarchiv-schweiz.html">Web Archive Switzerland</b-link>. Queste "istantanee archiviate" permettono di registrare il contenuto della piattaforma entscheidsuche.ch nel corso degli anni. L'accesso all'Archivio Web Svizzera è limitato, vale a dire che le vecchie versioni della piattaforma entscheidsuche.ch possono essere consultate solo in loco presso la Biblioteca nazionale e le istituzioni partner della Biblioteca nazionale.</p>
    </template>
    <template v-if="locale==='en'">
      <h1>Data</h1>
      <h2>Storage</h2>
      <p>The documents published on the <b-link href="https://entscheidsuche.ch">entscheidsuche.ch</b-link> platform are stored by the association entscheidsuche.ch in HTML or PDF format and are publicly accessible. For each decision file there is a metadata file in JSON format; these metadata files are publicly accessible as well. The data are freely available at <b-link href="https://entscheidsuche.ch/docs">https://entscheidsuche.ch/docs</b-link>. The current state of the scrapers is shown under <b-link href="status">Data status</b-link>. Documentation of this interface (in German) can be found <b-link href="https://entscheidsuche.ch/pdf/EntscheidsucheAPI.pdf">here</b-link>.</p>
      <h2>Reuse of the data</h2>
      <p>The entscheidsuche.ch platform sees itself as a privately run public service. The data collected and published by the platform are available to everyone for free use and further processing. Please name us as the source when you reuse the data. To finance this public service, the association entscheidsuche.ch depends on voluntary contributions not only from direct users but also from services that process data from entscheidsuche.ch. Voluntary contributions to the association are tax-deductible within the applicable statutory limits (<b-link href="https://entscheidsuche.ch/pdf/VerfuegungBE_Gemeinnuetzigkeit_19.12.2019.pdf">ruling on charitable status, in German</b-link>).</p>
      <h2>Long-term archiving</h2>
      <p>The content of the entscheidsuche.ch platform is collected once a year by the Swiss National Library and transferred to long-term archiving (Open Archival Information System, OAIS) in <b-link href="https://www.nb.admin.ch/snl/de/home/fachinformationen/e-helvetica/webarchiv-schweiz.html">Web Archive Switzerland</b-link>. These snapshots document the content of the platform over the years. Access to Web Archive Switzerland is restricted: older versions of the entscheidsuche.ch platform can only be consulted on site at the National Library and its partner institutions.</p>
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
