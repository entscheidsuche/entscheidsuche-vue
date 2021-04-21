<template>
  <div id="betatest">
    <template>
      <h1>Betatest</h1>
      <p>Willkommen zum Betatest. Die neue Plattform entscheidsuche.ch ist fast fertig. Jetzt bitten wir Sie um Ihre Mithilfe: Wo hakt es noch?
         Bitte teilen Sie uns Ihre Kritik und Anregungen per email <a href="mailto:info@entscheidsuche.ch">info@entscheidsuche.ch</a> mit. Wir danken Ihnen schon jetzt für Ihre Unterstützung.</p>
      <h2>Bekannte Probleme, an denen wir aktuell arbeiten:</h2>
      <ul style="text-align:left">
      <li>Die Übersetzung einiger statischer Seiten ins Französische und Italienische fehlt noch.</li>
      <li>In wenigen Fällen werden Entscheide nur mit den Metadaten, aber nicht mit dem Entscheidtext gefunden.</li>
      <li>Beim Scrollen zu mehr als 20, 40 oder 60 Treffern, wird in seltenen Fällen nicht nachgeladen.</li>
      </ul>
      <h2>Anregungen, die wir erhalten haben:</h2>
      <ul style="text-align:left">
      <li>Titel der HTML-Seite sollte für die jeweilige Darstellung angepasst werden. (z.B. Dokumentmetadaten bei der Dokumentanzeige)</li>
      <li>Es sollte die Möglichkeit geben, ein Dokument in einem neuen Tab zu öffnen</li>
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
