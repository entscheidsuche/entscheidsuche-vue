<template>
  <div id="upload">
    <template v-if="locale==='de'">
      <h1>Upload von Urteilen / Entscheiden</h1>
      <p>Unser nächstes Projekt ist eine Uploadfunktion, die es Rechtsanwältinnen und Rechtsanwälten sowie weiteren Personen erlaubt, von Behörden nicht veröffentlichte Urteile in geeigneter Form via entscheidsuche.ch zu publizieren. Hierzu haben wir von Ihnen in einer Crowdfunding-Kampagne die nötige Unterstützung erhalten. Haben Sie vielen Dank!</p>
      <p>Zunächst können Sie uns von Behörden nicht veröffentlichte Urteile/Entscheide zum Upload auf die Plattform entscheidsuche.ch im Format PDF via dieses Kontaktformular auf <a href="https://www.privasphere.com/e.d?c=withAddr&email=5fq3hy9u3_1v_fw91lsy">Privasphere.com</a> hochladen. Diesen Prozess werden wir teilautomatisieren. Die Urteile/Entscheide werden dabei vor der Publikation vom Verein entscheidsuche.ch geprüft. Als folgenden Schritt planen wir Formulare, zum Anfordern von Entscheidungen von den Gerichten sowie zum Hinweis auf von uns bislang nicht abgedeckte Entscheidsammlungen im Internet.</p>
    </template>
    <template v-if="locale==='fr'">
      <h1>Téléversement des arrêts / décisions</h1>
      <p>Notre prochain projet est une fonction de téléversement qui permettra aux avocates et avocats ainsi qu'à d'autres personnes de publier sous une forme appropriée via entscheidsuche.ch des jugements non publiés en ligne par les autorités. Pour ce faire, nous avons obtenu le soutien nécessaire de votre part dans le cadre d'une campagne de financement participatif. Nous vous en remercions vivement!</p>
      <p>Dans un premier temps, vous pouvez nous envoyer des jugements/décisions non publiés en ligne par les autorités pour les télécharger sur la plateforme recherchedarrets.ch au format PDF via ce formulaire de contact sur <a href="https://www.privasphere.com/e.d?c=withAddr&email=5fq3hy9u3_1v_fw91lsy">Privasphere.com</a> pour les faire téléverser. Nous allons partiellement automatiser ce processus. Les jugements/décisions seront contrôlés par l'association entscheidsuche.ch avant leur publication. L'étape suivante consistera à utiliser des formulaires pour demander des décisions aux tribunaux et pour indiquer les recueils de décisions sur internet que nous ne couvrons pas encore.</p>
    </template>
    <template v-if="locale==='it'">
      <h1>Caricamento di sentenze / decisioni</h1>
      <p>Il nostro prossimo progetto è una funzione di upload che permetterà agli avvocati e ad altri di pubblicare sentenze non pubblicate online dalle autorità in una forma adeguata tramite entscheidsuche.ch. A tal fine, abbiamo ottenuto da voi il sostegno necessario sotto forma di una campagna di crowdfunding. Grazie mille!</p>
      <p>Come primo passo, potete inviarci le sentenze che non sono state pubblicate online dalle autorità per caricarle sulla piattaforma recherchedarrets.ch in formato PDF tramite questo modulo di contatto su <a href="https://www.privasphere.com/e.d?c=withAddr&email=5fq3hy9u3_1v_fw91lsy">privasphere.com</a> per farli caricare. Automatizzeremo parzialmente questo processo. Le sentenze saranno controllate dall'associazione entscheidsuche.ch prima della pubblicazione. Il prossimo passo sarà quello di utilizzare dei moduli per richiedere le decisioni dei tribunali e di indicare le raccolte di decisioni su internet che non copriamo ancora.</p>
    </template>
  </div>
</template>

<style lang="scss">
#upload {
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'Upload'
})
export default class Upload extends Vue {
  public get locale () {
    return AppModule.locale
  }
}
</script>
