<template>
  <div id="app">
    <Header/>
    <Home/>
    <!--<SearchResults/>-->
    <!--<About/>-->
    <Footer/>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import Header from './components/Header.vue'
import Home from './components/Home.vue'
import SearchResults from './components/SearchResults.vue'
import About from './components/About.vue'
import Footer from './components/Footer.vue'

@Component({
  components: {
    Header,
    Home,
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
