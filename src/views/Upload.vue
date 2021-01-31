<template>
  <div id="upload">
    <template v-if="locale==='de'">
      <h1>Upload von Urteilen / Entscheiden</h1>
      <p>Wir planen auch eine Uploadfunktion, die es Rechtsanwältinnen und Rechtsanwälten erlaubt, von Behörden nicht veröffentlichte Urteile in geeigneter Form via entscheidsuche.ch zu publizieren. Diese Funktionalität möchten wir im Jahr 2021 umsetzen.
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
