<template>
  <div id="dataUsage">
    <template v-if="locale==='de'">
      <h1>Wer unsere Daten weiterverwendet</h1>
      <p>Die Entscheide sind frei und können heruntergeladen werden. Wir bitten Sie dabei, unseren Server nicht zu überlasten. Bitte nennen Sie uns als Quelle. Demnächst planen wir eine spezielle Download-Schnittstelle, auf der Sie auch gezielt nur die Aktualisierungen herunterladen können.
      </p>
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
