<template>
  <div id="header">
    <div class="header-main">
      <a class="logo" href="#" onclick=""></a>
      <form class="header-search" action="#">
        <div class="flex-container">
          <input type="text" placeholder="Suchbegriff" name="search" autocomplete="off">
          <b-button class="primary">Suchen</b-button>
        </div>
      </form>
      <div id="language-toggler" v-on:click="onLanguageChange()">
        <span id="current">{{language}}</span>
         <a class="language-icon"></a>
      </div>
      <b-button v-b-toggle.sidebar-right id="burger" style="border:none;outline:none;border-radius:0;box-shadow:none;"></b-button>
    </div>
    <b-collapse visible id="optional-bar">
      Aktuelles bei Bedarf
      <b-button v-b-toggle.optional-bar id="close-optional-bar" style="border:none;outline:none;box-shadow:none;"></b-button>
    </b-collapse>
    <div id="language-overlay" v-show="showLanguageChange">
      <div class="language-wrapper">
        <b-button v-b-toggle id="close-language-overlay" v-on:click="onCancelLanguageChange()" style="border:none;outline:none;box-shadow:none;"></b-button>
        <div class="language-body">
          <h3 id="language-title">Welche Sprache möchten Sie nutzen?</h3>
          <b-form-group>
            <b-form-radio v-model="languageChangeSelected" name="some-radios" value="DE">Deutsch</b-form-radio>
            <b-form-radio v-model="languageChangeSelected" name="some-radios" value="FR">Französisch</b-form-radio>
            <b-form-radio v-model="languageChangeSelected" name="some-radios" value="IT">Italienisch</b-form-radio>
          </b-form-group>
          <div class="language-buttons">
            <b-button class="secondary" v-on:click="onCancelLanguageChange()">Abbrechen</b-button>
            <b-button class="primary" v-on:click="onSaveLanguageChange()">Speichern</b-button>
          </div>
        </div>
      </div>
    </div>
    <b-sidebar id="sidebar-right" right no-header>
      <div class="menu-overlay">
        <b-button v-b-toggle.sidebar-right id="close-menu" style="border:none;outline:none;box-shadow:none;"></b-button>
        <nav>
          <ul class="menu-desktop">
            <li><a href="" class="desktop-menu-item">Über uns</a></li>
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
  background-color: #191919;

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
        .primary{
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
      //font-weight: bold;
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
    transition-duration: 0s;

    #close-optional-bar{
      position: absolute;
      top:10px;
      right:20px;
      cursor:pointer;
      background: url('../assets/close.svg') no-repeat center;
      background-size: 20px;
      height:20px;
      width:20px;
    }
  }
  #language-overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5);
    z-index: 2;
    cursor: pointer;

    .language-wrapper{
      width:400px;
      height:300px;
      background-color: #fff;
      position: fixed;
      top: 50%;
      left: 50% ;
      margin-top: -180px;
      margin-left: -200px;

      #close-language-overlay{
        position: absolute;
        top:10px;
        right:10px;
        cursor:pointer;
        background: url('../assets/close.svg') no-repeat center;
        background-size: 20px;
        height:20px;
        width:20px;
      }
      .language-body{
        height:220px;
        width:320px;
        margin:40px;
        position:relative;

        #language-title{
          font-weight: bold;
        }

        .form-group{
          text-align:left;
          font-size:18px;
          margin-left:40px;
          margin-top:20px;
        }
        .language-buttons{
          position:absolute;
          bottom:0;

          button{
            width:150px;
          }
          .secondary{
            margin-right: 20px;
          }
        }
      }
    }
  }
  #sidebar-right{
    width:500px;
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
        background: url('../assets/close.svg') no-repeat center;
        background-size: 30px;
        height:30px;
        width:30px;
      }

      #close-menu:hover{
        transform: rotate(15deg);
      }
      .menu-desktop{
        margin-top:70px;

        li{
          padding: 15px 0 15px 0;
          text-align: left;

          .desktop-menu-item{
            text-decoration: none;
            font-size:20px;
            font-weight: bold;
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
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Header extends Vue {
  @Prop() private showLanguageChange = false;
  @Prop() private languageChangeSelected!: string;
  @Prop() private language = 'DE';

  public onLanguageChange (): void {
    this.languageChangeSelected = this.language
    this.showLanguageChange = !this.showLanguageChange
  }

  public onCancelLanguageChange (): void {
    this.showLanguageChange = false
  }

  public onSaveLanguageChange (): void {
    this.language = this.languageChangeSelected
    this.showLanguageChange = false
  }
}
/*
export default {
  data () {
    return {
    }
  },
  methods: {
    onShown () {
      // Focus the cancel button when the overlay is showing
      this.$refs.cancel.focus()
    },
    onHidden () {
      // Focus the show button when the overlay is removed
      this.$refs.show.focus()
    }
  }
}
 */
</script>
