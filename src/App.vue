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
    <div v-bind:class="['footer-wrapper', this.inSearch ? 'hidden' : '']">
      <Footer/>
    </div>
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
      -moz-box-shadow: 0 20px 0px 20px rgba(255,255,255,0.5);
      -webkit-box-shadow: 0 20px 0px 20px rgba(255,255,255,0.5);
      box-shadow: 0 20px 0px 20px rgba(255,255,255,0.5);
      background-color: #fff;
      margin-left: 10px;
      margin-right: 10px;
      margin: 0 auto;
      padding-bottom:80px;

      &.full-width{
        width:100%;
        box-shadow:none;
        margin-left:0;
        margin-right:0;
        padding-bottom:0;
        position:relative;
        &.messageOffset{
          padding-top: 0;
          top:110px;
          height: calc(100vh - 110px);
        }
        &.noMessageOffset{
          padding-top: 0;
          top:70px;
          height: calc(100vh - 70px);
        }
      }
      &.messageOffset{
        padding-top: 110px;
      }
      &.noMessageOffset{
        padding-top: 70px;
      }
    }
  }
  .footer-wrapper{
    &.hidden{
      display:none;
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

        &.full-width{
          &.messageOffset{
            top:160px;
            height: calc(100vh - 160px);
          }
          &.noMessageOffset{
            top:120px;
            height: calc(100vh - 120px);
          }
        }

        &.messageOffset{
          padding-top: 160px;
        }
        &.noMessageOffset{
          padding-top: 120px;
        }
      }
    }
  }
}
//smartphone
@media (max-width: 534px){
  #app{
    .app-content{
      .content-wrapper{
        margin-left: 20px;
        margin-right: 20px;

        &.full-width{
        margin-left: 20px;
        margin-right: 20px;
        }
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
import { store } from '@/store'

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
    return store.state.route.path === '/search' || store.state.route.name === 'View'
  }
}
</script>
