<template>
  <div id="mcp">
    <template v-if="locale==='de'">
      <h1>mcp-Interface</h1>
      <p>Auf dem Open Legal Lab 2026 wurde das mcp-Interface für
        <a href="https://entscheidsuche.ch">entscheidsuche.ch</a> entwickelt. Damit können Sie Ihrem KI-System
        die Möglichkeit geben, bei der Suche von Gerichtsentscheiden auf
        <a href="https://entscheidsuche.ch">entscheidsuche.ch</a> zurückzugreifen. Das mcp-Interface ist
        neu. Weitere Informationen finden Sie hier:
        <a href="https://mcp.entscheidsuche.ch">https://mcp.entscheidsuche.ch</a>
      </p>
    </template>
    <template v-if="locale==='fr'">
      <h1>Interface mcp</h1>
      <p>Lors de l'Open Legal Lab 2026, l'interface mcp pour
        <a href="https://entscheidsuche.ch">entscheidsuche.ch</a> a été développée. Elle permet à votre
        système d'IA d'accéder à <a href="https://entscheidsuche.ch">entscheidsuche.ch</a> lors de la
        recherche de décisions judiciaires. L'interface mcp est nouvelle. Vous trouverez
        de plus amples informations à ce sujet ici&nbsp;:
        <a href="https://mcp.entscheidsuche.ch">https://mcp.entscheidsuche.ch</a>
      </p>
    </template>
    <template v-if="locale==='it'">
      <h1>Interfaccia mcp</h1>
      <p>Durante l'Open Legal Lab 2026 è stata sviluppata l'interfaccia mcp per
        <a href="https://entscheidsuche.ch">entscheidsuche.ch</a>. Essa consente al vostro sistema di IA di
        accedere a <a href="https://entscheidsuche.ch">entscheidsuche.ch</a> per la ricerca di decisioni
        giudiziarie. L'interfaccia mcp è nuova. Ulteriori informazioni sono
        disponibili qui: <a href="https://mcp.entscheidsuche.ch">https://mcp.entscheidsuche.ch</a>
      </p>
    </template>
    <template v-if="locale==='en'">
      <h1>MCP interface</h1>
      <p>The MCP interface for
        <a href="https://entscheidsuche.ch">entscheidsuche.ch</a> was developed at the Open Legal Lab 2026. It allows your AI system
        to draw on
        <a href="https://entscheidsuche.ch">entscheidsuche.ch</a> when searching for court decisions. The MCP interface is
        new. You can find more information here:
        <a href="https://mcp.entscheidsuche.ch">https://mcp.entscheidsuche.ch</a>
      </p>
    </template>
  </div>
</template>

<style lang="scss">
#mcp {
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'MCP'
})
export default class MCP extends Vue {
  public get locale () {
    return AppModule.locale
  }
}
</script>
