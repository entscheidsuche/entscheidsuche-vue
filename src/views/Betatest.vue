<template>
  <div id="betatest">
    <template>
      <h1>Betatest</h1>
      <p>Willkommen zum Betatest. Die neue Plattform entscheidsuche.ch ist fast fertig. Jetzt bitten wir Sie um Ihre Mithilfe: Wo hakt es noch?
         Bitte teilen Sie uns Ihre Kritik und Anregungen per email <a href="mailto:info@entscheidsuche.ch">info@entscheidsuche.ch</a> mit. Wir danken Ihnen schon jetzt für Ihre Unterstützung.</p>
      <h2>Bekannte Probleme, an denen wir aktuell arbeiten:</h2>
      <ul style="text-align:left">
      <li>Einzelne Dokumente werden noch nicht indexiert, d.h. sie werden ggf. mit der Suche noch nicht gefunden</li>
      <li>Einige Gerichte fehlen noch, so z.B. auch der Kanton Solothurn</li>
      <li>Die Übersetzung einiger statischer Seiten ins Französische und Italienische fehlt noch</li>
      </ul>
    </template>
  </div>
</template>

<style lang="scss">
#betatest {
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'Betatest'
})
export default class Organization extends Vue {
  public get locale () {
    return AppModule.locale
  }
}
</script>
