<template>
  <div id="header">
    <div class="header-main">
      <router-link :to="{ name: 'Home' }" class="logo"></router-link>
      <form class="header-search" action="#">
        <div class="flex-container">
          <input type="text" placeholder="Suchbegriff" name="search" autocomplete="off">
          <b-button variant="secondary" id="toggle-search">Suchen</b-button>
        </div>
      </form>
      <div id="language-toggler" v-on:click="onLocaleChange()">
        <span id="current">{{locale.toUpperCase()}}</span>
         <a class="language-icon"></a>
      </div>
      <b-button v-b-toggle.sidebar-right id="burger" style="border:none;outline:none;box-shadow:none;"></b-button>
    </div>
    <b-collapse visible id="optional-bar" v-if="showOptionalBar">
      Aktuelles bei Bedarf
      <div id="close-optional-bar" v-on:click="onCloseOptionalBar()"></div>
    </b-collapse>
    <LocaleSelector/>
    <b-sidebar id="sidebar-right" right no-header>
      <div class="menu-overlay">
        <div v-b-toggle.sidebar-right id="close-menu" style="border:none;outline:none;box-shadow:none;"></div>
        <nav>
          <ul class="menu-desktop">
            <li><router-link :to="{ name: 'About' }" class="desktop-menu-item">Über uns</router-link></li>
            <li><a href="" class="desktop-menu-item">Verein entscheidsuche.ch</a></li>
            <li><a href="" class="desktop-menu-item">Upload von Urteilen / Entscheiden</a></li>
            <li><a href="" class="desktop-menu-item">Wer unsere Daten weiterverwendet</a></li>
            <li><a href="" class="desktop-menu-item">Hinweis / Status</a></li>
          </ul>
        </nav>
      </div>
    </b-sidebar>
  </div>
</template>

<style lang="scss">
#header{
  z-index: 1000;
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  //background-color: #191919;
  background-color: #6183ec;
  //background-color: #11569e;

  .header-main{
    padding-top:5px;
    padding-bottom:5px;
    display: flex;
    align-items: center;

    .logo{
      margin-left:20px;
      z-index: 10;
      width: 290px;
      height: 60px;
      background: url('../assets/logo-white.png') no-repeat center;
      color:#fff;
      background-size: contain;
      flex-shrink: 0;
    }

    .header-search{
      height:40px;
      width:100%;
      flex-grow:1;
      margin-right: 160px;

      .flex-container{
        height:40px;
        align-items: center;
        justify-content: center;
        display:flex;
        input{
          height:40px;
          width: calc(100% - 140px);
          max-width: 379px;
          border:0;
          padding:0;
          padding-left:5px;
          border-radius:0;
          font-size: 16px;
        }
        input::placeholder{
          color:#9ca2a9;
          }
        input:focus{
          border:none;
          outline:none;
        }
        #toggle-search{
          flex-shrink: 0;
          height:40px;
          width:100px;
          padding:0;
          font-size: 16px;
          font-weight: bold;
          position:relative;
        }
      }
    }
    #language-toggler{
      flex-shrink: 0;
      height:40px;
      width:80px;
      margin-bottom:0;
      margin-right: 20px;
      font-size: 20px;
      color:#fff;
      cursor:pointer;
      display:flex;
      align-items: center;
      justify-content: space-between;

      #current{
        padding-top:3px;
      }

      .language-icon{
        position: absolute;
        top:21px;
        right:85px;
        background: url('../assets/world2.svg') no-repeat center;
        background-size: 26px;
        height:30px;
        width:30px;
      }
    }
    #burger{
      flex-shrink: 0;
      margin-right:20px;
      cursor:pointer;
      background: url('../assets/menu-white.svg') no-repeat center;
      background-size: 30px;
      height:30px;
      width:30px;
    }
  }
  #optional-bar{
    height: 40px;
    padding-top:10px;
    color: #000;
    background-color: #e5e9f1;
    font-weight: bold;
    position:relative;

    #close-optional-bar{
      position: absolute;
      top:10px;
      right:20px;
      cursor:pointer;
      background: url('../assets/close.svg') no-repeat center;
      background-size: 20px;
      height:20px;
      width:20px;
      transition: all .2s ease-in-out;
    }
    #close-optional-bar:hover{
      transform: scale(1.1);
    }
  }
  #sidebar-right{
    width:460px;
    .menu-overlay{
      z-index: 1001;
      height:100%;
      width:100%;
      position:fixed;
      top:0;
      right:0;
      background-color:#fff;
      box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 25px 0px;

      ul{
        list-style-type:none;
        }

      #close-menu{
        position: absolute;
        top:21px;
        right:20px;
        cursor:pointer;
        background: url('../assets/close-big.svg') no-repeat center;
        background-size: 30px;
        height:30px;
        width:30px;
        transition: all .2s ease-in-out;
      }

      #close-menu:hover{
        transform: scale(1.1);
      }
      .menu-desktop{
        margin-top:70px;

        li{
          padding: 10px 0 20px 0;
          text-align: left;

          .desktop-menu-item{
            text-decoration: none;
            font-size:20px;
            //font-weight: bold;
            line-height: 20px;
            color:#191919;
          }
        }
      }
    }
  }
}
//tablet
@media (max-width: 1024px){
  #header{
    .header-main{
      height:120px;
      position: relative;
      display: flex;

      .logo{
        position: absolute;
        margin:0;
        top:5px;
        margin-left:20px;
        max-width:50%;
      }

      .header-search{
        position: absolute;
        bottom:15px;
        width: 100%;
        .flex-container{
          input{
              max-width: calc(100% - 140px);
              padding:0;
              padding-left:15px;
            }
          }
        }
        #language-toggler{
          position: absolute;
          top:16px;
          right:49px;

          .language-icon{
            top:6px;
            right:16px;
          }
        }
        #burger{
          position: absolute;
          margin:0;
          top:21px;
          right:20px;
        }
      }
    }
  }
//smartphone
@media (max-width: 534px){
  #header{
    #sidebar-right{
      .menu-overlay{
        width:100vw;
        height:100vh;
        .menu-desktop{
          li{
            .desktop-menu-item{
                font-size: 16px;
            }
          }
        }
      }
    }
  }
}
</style>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import LocaleSelector from '@/components/LocaleSelector.vue'
import { AppModule } from '@/store/modules/app'

@Component({
  components: {
    LocaleSelector
  }
})
export default class Header extends Vue {
  private showOptionalBar = true;

  public get locale () {
    return AppModule.locale
  }

  public onLocaleChange (): void {
    AppModule.SetShowLocaleSelector(!AppModule.showLocaleSelector)
  }

  public onCloseOptionalBar (): void {
    this.showOptionalBar = false
  }
}
</script>
