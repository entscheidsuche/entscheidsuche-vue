<template>
  <div id="app">
    <Header/>
    <router-view/>
    <Footer/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

@Component({
  components: {
    Header,
    Footer
  }
})
export default class App extends Vue {}
</script>
<style lang="scss">
#app {
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height:100%;
}
</style>
