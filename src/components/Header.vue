<template>
  <div id="header">
    <div class="header-main">
      <router-link :to="{ name: 'Home' }" class="logo"></router-link>
      <Search/>
      <div id="language-toggler" v-on:click="onLocaleChange()">
        <span id="current">{{locale.toUpperCase()}}</span>
         <a class="language-icon"></a>
      </div>
      <div v-b-toggle.sidebar-right id="burger" style="border:none;outline:none;box-shadow:none;"></div>
    </div>
    <Message/>
    <LocaleSelector/>
    <b-sidebar id="sidebar-right" right no-header>
      <div class="menu-overlay">
        <b-button v-b-toggle.sidebar-right variant="primary" id="close-menu-btn">
          <b-icon id="close-menu"></b-icon>
        </b-button>
        <nav>
          <ul class="menu-desktop">
            <li><router-link :to="{ name: 'About' }" class="desktop-menu-item">{{ $t('about') }}</router-link></li>
            <li><router-link :to="{ name: 'Suchhilfe' }" class="desktop-menu-item">{{ $t('suchhilfe') }}</router-link></li>
            <li><router-link :to="{ name: 'Upload' }" class="desktop-menu-item">{{ $t('upload') }}</router-link></li>
            <li><router-link :to="{ name: 'DataUsage' }" class="desktop-menu-item">{{ $t('dataUsage') }}</router-link></li>
            <li><router-link :to="{ name: 'Status' }" class="desktop-menu-item">{{ $t('status') }}</router-link></li>
            <li><router-link :to="{ name: 'Datenschutz' }" class="desktop-menu-item">{{ $t('datenschutz') }}</router-link></li>
          </ul>
        </nav>
      </div>
    </b-sidebar>
  </div>
</template>

<style lang="scss">
#header {
  z-index: 1000;
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  background-color: #6183ec;

  .header-main {
    padding-top: 5px;
    padding-bottom: 5px;
    display: flex;
    align-items: center;

    .logo {
      margin-left: 20px;
      z-index: 10;
      width: 290px;
      height: 60px;
      background: url('../assets/logo-white.png') no-repeat center;
      color: #fff;
      background-size: contain;
      flex-shrink: 0;
    }

    #language-toggler {
      flex-shrink: 0;
      height: 40px;
      width: 80px;
      margin-bottom: 0;
      margin-right: 20px;
      font-size: 20px;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;

      #current {
        padding-top: 3px;
      }

      .language-icon {
        position: absolute;
        top: 21px;
        right: 85px;
        background: url('../assets/world2.svg') no-repeat center;
        background-size: 26px;
        height: 30px;
        width: 30px;
      }
    }

    #burger {
      flex-shrink: 0;
      margin-right: 20px;
      cursor: pointer;
      background: url('../assets/menu-white.svg') no-repeat center;
      background-size: 30px;
      height: 30px;
      width: 30px;
    }
  }

  #sidebar-right {
    width: 460px;

    .menu-overlay {
      z-index: 1001;
      height: 100%;
      width: 100%;
      position: fixed;
      top: 0;
      right: 0;
      background-color: #fff;
      box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 25px 0px;

      ul {
        list-style-type: none;
      }

      #close-menu-btn{
        position: absolute;
        top: 21px;
        right: 20px;
        height:30px;
        width:30px;
        #close-menu {
          background: url('../assets/bootstrap-close-big-white.svg') no-repeat center;
          position:absolute;
          height:28px;
          width:28px;
          top:0;
          left:0;
        }
      }

      .menu-desktop {
        margin-top: 70px;

        li {
          padding: 10px 0 20px 0;
          text-align: left;

          .desktop-menu-item {
            text-decoration: none;
            font-size: 20px;
            //font-weight: bold;
            line-height: 20px;
            color: #191919;
          }
        }
      }
    }
  }
}

//tablet
@media (max-width: 1024px) {
  #header {
    .header-main {
      height: 120px;
      position: relative;
      display: flex;

      .logo {
        position: absolute;
        margin: 0;
        top: 5px;
        margin-left: 20px;
        max-width: 50%;
      }

      #language-toggler {
        position: absolute;
        top: 15px;
        right: 38px;

        .language-icon {
          top: 6px;
          right: 16px;
        }
      }

      #burger {
        position: absolute;
        margin: 0;
        top: 21px;
        right: 20px;
      }
    }
  }
}

//smartphone
@media (max-width: 534px) {
  #header {
    #sidebar-right {
      .menu-overlay {
        width: 100vw;
        height: 100vh;

        .menu-desktop {
          li {
            .desktop-menu-item {
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
import { AppModule } from '@/store/modules/app'
import Search from '@/components/Search.vue'
import LocaleSelector from '@/components/LocaleSelector.vue'
import Message from '@/components/Message.vue'

@Component({
  components: {
    Search,
    LocaleSelector,
    Message
  }
})
export default class Header extends Vue {
  private showOptionalBar = true

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
