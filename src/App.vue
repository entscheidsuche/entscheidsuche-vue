<template>
  <div id="app">
    <Header/>
    <div class="app-content">
      <div v-bind:class="['content-wrapper',
                          this.inSearch ? 'full-width' : '',
                          this.showMessage ? 'messageOffset' : 'noMessageOffset']">
        <router-view/>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height:100%;

  .app-content{
    position: relative;
    min-height: 100%;
    background-image: url('assets/hg-xs-25-gradient2.png');
    background-repeat: repeat;
    background-size: 100%;
    display:flex;
    justify-content: center;

    .content-wrapper{
      width: 984px;
      -moz-box-shaow: 0 20px 0px 20px rgba(255,255,255,0.5);
      -webkit-box-shadow: 0 20px 0px 20px rgba(255,255,255,0.5);
      box-shadow: 0 20px 0px 20px rgba(255,255,255,0.5);

      &.full-width{
        width:100%;
        box-shadow:none;
      }
    }
  }
}
@media (max-width: 1024px){
  #app{
    .app-content{
      background-image:none;
      .content-wrapper{
        margin-left: 20px;
        margin-right: 20px;
      }
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { AppModule, MessageState } from '@/store/modules/app'

@Component({
  components: {
    Header,
    Footer
  }
})
export default class App extends Vue {
  public get showMessage () {
    return AppModule.showMessage === MessageState.VISIBLE
  }

  public get inSearch () {
    return this.$router.currentRoute.path === '/search'
  }
}
</script>
