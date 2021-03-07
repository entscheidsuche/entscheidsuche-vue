<template>
  <div id="about">
    <template v-if="locale==='de'">
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
        <b-link href="mailto:info@entscheidsuche.ch">info@entscheidsuche.ch</b-link>
        erreichbar.
      </p>
      <h2>Mitgliedschaft im Verein</h2>
      <p>Wer den Vereinszweck unterstützen möchten, kann Mitglied des Vereins entscheidsuche.ch werden. Der
        Mitgliederbeitrag beträgt für natürliche Personen 100 Franken und für institutionelle Mitglieder 1000 Franken
        pro Jahr. Antrag bitte formlos per e-Mail (<b-link href="mailto:info@entscheidsuche.ch">info@entscheidsuche.ch</b-link>).
      </p>
      <div class="contact">
        <h2>Koordinaten des Vereins</h2>
        <p>Postadresse des Vereins: Verein entscheidsuche.ch, 3000 Bern<br>
          Konto des Vereins entscheidsuche.ch:<br>
          Postfinance IBAN: CH04 0900 0000 1412 0685 4,<br>
          Verein entscheidsuche.ch, 8000 Zürich</p>
      </div>
    </template>
    <template v-if="locale==='fr'">
      <h1>À propos de nous</h1>
      <h2>Le portail entscheidsuche.ch</h2>
      <p>Le portail entscheidsuche.ch, accessible gratuitement, permet d'effectuer des recherches dans tous les arrêts publiés de tribunaux suisses, de toutes les instances.</p>
      <p>Dans une première étape (2018-2020), une collection d'arrêts (état de données 2018) a été publiée.</p>
      <p>En 2020, suite à une campagne de financement participatif (<b-link href="https://wemakeit.com/projects/entscheidsuche-ch" target="_blank">wemakeit.com</b-link>) et grâce à de nombreux soutiens, l'association entscheidsuche.ch a pu mettre à disposition les moyens financiers nécessaires pour collecter règulièrement les nouveaux jugements publiés par les autorités et pour les rendre par la suite consultables via entscheidsuche.ch. Les scrapers programmés à cette fin sont disponibles sur <b-link href="https://github.com/entscheidsuche/NeueScraper" target="_blank">GitHub</b-link>.</p>
      <p>En 2021, il est prévu de créer une fonction de téléversement qui permettra aux personnes intéressées de mettre à disposition des jugements non publiés par les autorités sous une forme appropriée via entscheidsuche.ch (<b-link href="https://entscheidsuche.ch/pdf/entscheidsuche.ch_Upload-Konzept_V1.1_Austausch-Aktennotiz_08.12.2020.pdf">concept de téléversement</b-link>).</p>
      <h2>L'association entscheidsuche.ch</h2>
      <p>L'association entscheidsuche.ch a été fondée en 2017 à Landquart (GR). L'association a pour but de rendre la jurisprudence des tribunaux suisses consultable et accessible à tous (<b-link href="https://entscheidsuche.ch/pdf/entscheidsuche-statuten.pdf">statuts de l'association en allemand</b-link>). En 2020, le canton de Berne a exonéré l'association entscheidsuche.ch de exonérées d'impôts l'association entscheidsuche.ch car elle poursuit des buts d’utilité publique (<b-link href="https://entscheidsuche.ch/pdf/VerfuegungBE_Gemeinnuetzigkeit_19.12.2019.pdf">décision de l'administration fiscale BE</b-link>).</p>
      <p>Les membres du comité directeur de l'association entscheidsuche.ch sont Jörn Erbguth, Daniel Hürlimann et Claudia Schreiber. Le comité peut être contacté sous l'adresse <b-link href="mailto:info@entscheidsuche.ch">info@entscheidsuche.ch</b-link>.</p>
      <h2>Adhésion à l'association</h2>
      <p>Toute personne qui souhaite soutenir le but de l'association peut devenir membre de l'association entscheidsuche.ch. La cotisation est de 100 francs suisses par an pour les personnes physiques et de 1000 francs suisses par an pour les membres institutionnels. Nous vous invitions de nous faire parvenir votre demande d'adhésion par courrier électronique (<b-link href="mailto:info@entscheidsuche.ch">info@entscheidsuche.ch</b-link>).</p>
      <div class="contact">
        <h2>Coordonnées de l'association</h2>
        <p>Adresse postale de l'association : Verein entscheidsuche.ch, 3000 Berne<br>
          Compte de l'association entscheidsuche.ch :<br>
          Postfinance IBAN: CH04 0900 0000 1412 0685 4,<br>
          Association entscheidsuche.ch, 8000 Zurich</p>
      </div>
    </template>
    <template v-if="locale==='it'">
      <h1>Chi siamo</h1>
      <h2>Il portale entscheidsuche.ch</h2>
      <p>Il portale entscheidsuche.ch, accessibile gratuitamente, permette di cercare tutte le decisioni pubblicate dei tribunali svizzeri di tutte le istanze.</p>
      <p>In una prima fase (2018-2020), è stata pubblicata una raccolta di sentenze (stato dei dati 2018).</p>
      <p>Nel 2020, in seguito a una campagna partecipativa di raccolta di fondi (<b-link href="https://wemakeit.com/projects/entscheidsuche-ch" target="_blank">wemakeit.com</b-link>) e grazie a numerosi sostenitori, l'associazione entscheidsuche.ch ha potuto fornire i mezzi finanziari per raccogliere regolarmente le nuove sentenze pubblicate dalle autorità e renderle consultabili tramite entscheidsuche.ch. Gli scrapers programmati per questo scopo sono disponibili su <b-link href="https://github.com/entscheidsuche/NeueScraper" target="_blank">GitHub</b-link>.</p>
      <p>Nel 2021 è prevista la creazione di una funzione di upload che permetterà alle parti interessate di mettere a disposizione le sentenze non pubblicate delle autorità in una forma adeguata tramite entscheidsuche.ch (<b-link href="https://entscheidsuche.ch/pdf/entscheidsuche.ch_Upload-Konzept_V1.1_Austausch-Aktennotiz_08.12.2020.pdf">concetto di upload</b-link>).</p>
      <h2>L'associazione entscheidsuche.ch</h2>
      <p>L'associazione entscheidsuche.ch è stata fondata nel 2017 a Landquart (GR). Lo scopo dell'associazione è di rendere la giurisprudenza dei tribunali svizzeri disponibile e accessibile a tutti (<b-link href="https://entscheidsuche.ch/pdf/entscheidsuche-statuten.pdf">statuti dell'associazione in tedesco</b-link>). Nel 2020, il cantone di Berna ha esentato l'associazione entscheidsuche.ch dall'esenzione fiscale in quanto persegue obiettivi di pubblica utilità (<b-link href="https://entscheidsuche.ch/pdf/VerfuegungBE_Gemeinnuetzigkeit_19.12.2019.pdf">decisione delle autorità fiscali BE</b-link>).</p>
      <p>I membri del comitato esecutivo dell'associazione entscheidsuche.ch sono Jörn Erbguth, Daniel Hürlimann e Claudia Schreiber. Il consiglio può essere contattato all'indirizzo <b-link href="mailto:info@entscheidsuche.ch">info@entscheidsuche.ch</b-link>.</p>
      <h2>Appartenenza all'associazione</h2>
      <p>Chiunque voglia sostenere lo scopo dell'associazione può diventare membro dell'associazione entscheidsuche.ch. La quota di adesione è di 100 franchi svizzeri all'anno per le persone fisiche e di 1000 franchi svizzeri all'anno per i membri istituzionali. Vi invitiamo a inviarci la vostra domanda di adesione via e-mail (<b-link href="mailto:info@entscheidsuche.ch">info@entscheidsuche.ch</b-link>).</p>
      <div class="contact">
        <h2>Dati di contatto dell'associazione</h2>
        <p>Indirizzo postale dell'associazione: Verein entscheidsuche.ch, 3000 Bern<br>
          Conto dell'associazione entscheidsuche.ch :<br>
          Postfinance IBAN: CH04 0900 0000 1412 0685 4,<br>
          Associazione entscheidsuche.ch, 8000 Zurigo</p>
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
