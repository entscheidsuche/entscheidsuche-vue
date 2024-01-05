<template>
  <div id="altsystem">
    <template v-if="locale==='de'">
      <h1>Seite des Altsystems</h1>
      <p>Sie sind einem Link gefolgt der auf einen alten Prototyps führte. Leider wird dieser Prototyp von 2018/2019 nicht mehr betrieben. Die im Prototyp enthaltenen Urteile und noch mehr finden Sie Sie nun auf unserer aktuellen Website. Geben Sie dazu Suchbegriffe in das obige Suchfeld oben ein.</p>
    </template>
    <template v-if="locale==='fr'">
      <h1>Page de l'ancien système</h1>
      <p>Vous avez suivi un lien qui menait à un ancien prototype. Malheureusement, ce prototype de 2018/2019 n'est plus exploité. Vous trouverez désormais les jugements contenus dans le prototype et bien plus encore sur notre site actuel. Pour ce faire, il vous suffit de saisir des termes de recherche dans le champ de recherche ci-dessus.</p>
    </template>
    <template v-if="locale==='it'">
      <h1>Pagina del vecchio sistema</h1>
      <p>Hai seguito un link che portava a un vecchio prototipo. Purtroppo questo prototipo del 2018/2019 non è più in funzione. Ora è possibile trovare le sentenze contenute nel prototipo e altro ancora sul nostro sito web attuale. Inserite i termini di ricerca nel campo di ricerca in alto.</p>
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
  name: 'Altsystem'
})
export default class Organization extends Vue {
  public get locale () {
    return AppModule.locale
  }
}
</script>
