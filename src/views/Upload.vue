<template>
  <div id="upload">
    <template v-if="locale==='de'">
      <h1>Upload von Urteilen / Entscheiden</h1>
      <p>Wir planen auch eine Uploadfunktion, die es Rechtsanwältinnen und Rechtsanwälten erlaubt, von Behörden nicht veröffentlichte Urteile in geeigneter Form via entscheidsuche.ch zu publizieren. Diese Funktionalität möchten wir im Jahr 2021 umsetzen.
      </p>
    </template>
    <template v-if="locale==='fr'">
      <h1>Téléversement des arrêts / décisions</h1>
      <p>L'association entscheidsuche.ch a l'intention d'introduire une fonction de téléversement qui permettra aux avocat/e/s de mettre à disposition du public les jugements non publiés par les autorités sous une forme appropriée via entscheidsuche.ch. Nous aimerions mettre en place cette fonctionnalité en 2021.
      </p>
    </template>
    <template v-if="locale==='it'">
      <h1>Caricamento di sentenze / decisioni</h1>
      <p>L'associazione entscheidsuche.ch intende introdurre una funzione di upload che permetterà agli avvocati di mettere a disposizione del pubblico le sentenze non pubblicate delle autorità in una forma adeguata tramite entscheidsuche.ch. Vorremmo implementare questa funzionalità nel 2021.
      </p>
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
