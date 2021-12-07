<template>
  <div id="upload">
    <template v-if="locale==='de'">
      <h1>Upload von Urteilen / Entscheiden</h1>
      <p>Wir planen eine Uploadfunktion, die es Rechtsanwältinnen und Rechtsanwälten erlaubt, von Behörden nicht veröffentlichte Urteile in geeigneter Form via entscheidsuche.ch zu publizieren. Unterstützen Sie die Umsetzung dieser Funktion durch <a href="https://wemakeit.com/projects/upload-entscheide-urteile">Crowdfunding</a>.</p>
      <p>Bitte senden Sie uns von Behörden nicht veröffentlichte Urteile/Entscheide zum Upload auf die Plattform entscheidsuche.ch im Format PDF via dieses Kontaktformular auf <a href="https://www.privasphere.com/e.d?c=withAddr&email=5fq3hy9u3_1v_fw91lsy">Privasphere.com</a>. Die Urteile/Entscheide werden vor der Publikation vom Verein entscheidsuche.ch geprüft.</p>
    </template>
    <template v-if="locale==='fr'">
      <h1>Téléversement des arrêts / décisions</h1>
      <p>L'association entscheidsuche.ch a l'intention d'introduire une fonction de téléversement qui permettra aux avocat/e/s de mettre à disposition du public les jugements non publiés par les autorités sous une forme appropriée via entscheidsuche.ch. Soutenez la mise en œuvre de cette fonctionnalité par <a href="https://wemakeit.com/projects/upload-entscheide-urteile">crowdfunding</a></p>
      <p>Veuillez nous envoyer les jugements/décisions qui n'ont pas été publiés par les autorités pour les télécharger sur la plateforme entscheidsuche.ch en format PDF via ce formulaire de contact sur <a href="https://www.privasphere.com/e.d?c=withAddr&email=5fq3hy9u3_1v_fw91lsy">Privasphere.com</a>. Les jugements/décisions seront vérifiés par l'association entscheidsuche.ch avant d'être publiés.</p>
    </template>
    <template v-if="locale==='it'">
      <h1>Caricamento di sentenze / decisioni</h1>
      <p>L'associazione entscheidsuche.ch intende introdurre una funzione di upload che permetterà agli avvocati di mettere a disposizione del pubblico le sentenze non pubblicate delle autorità in una forma adeguata tramite entscheidsuche.ch. Sostenete l'implementazione di questa funzione tramite <a href="https://wemakeit.com/projects/upload-entscheide-urteile">crowdfunding</a>.</p>.
      <p>Si prega di inviarci sentenze/decisioni non pubblicate dalle autorità per il caricamento sulla piattaforma entscheidsuche.ch in formato PDF tramite questo modulo di contatto su <a href="https://www.privasphere.com/e.d?c=withAddr&email=5fq3hy9u3_1v_fw91lsy">Privasphere.com</a>. Le sentenze/decisioni sono controllate dall'associazione entscheidsuche.ch prima della pubblicazione.</p>

Tradotto con www.DeepL.com/Translator (versione gratuita)
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
