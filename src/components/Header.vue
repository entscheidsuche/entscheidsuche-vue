<template>
  <div id="header">
    <div class="header-main">
      <a class="logo" href="#" onclick=""></a>
      <form class="header-search" action="#">
        <div class="flex-container">
          <input type="text" placeholder="Suchbegriff" name="search" autocomplete="off">
          <button>Suchen</button>
        </div>
      </form>
      <b-form-group class="languages">
        <b-form-radio-group
          id="btn-radios-1"
          v-model="selected"
          :options="options"
          buttons
          name="radios-btn-default"
        ></b-form-radio-group>
      </b-form-group>
      <div class="languages-mobile">
        <a class="toggle-languages"></a>
      </div>
      <b-button v-b-toggle.sidebar-right id="burger" style="border:none;outline:none;border-radius:0;box-shadow:none;"></b-button>
    </div>
    <b-collapse visible id="optional-bar">
      Aktuelles bei Bedarf
      <b-button v-b-toggle.optional-bar id="close-optional-bar" style="border:none;outline:none;box-shadow:none;"></b-button>
    </b-collapse>
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
      margin-right: 98px;

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
        button{
          flex-shrink: 0;
          height:40px;
          width:100px;
          border:0;
          padding:0;
          background-color:#11a3eb;
          color:#fff;
          font-size: 16px;
          font-weight: bold;
          position:relative;
        }
        button:focus{
          border:none;
          outline:none;
        }
        button:hover,button:active{
          background-color:#41b5ef;
          cursor:pointer;
        }
      }
    }
    .languages{
      flex-shrink: 0;
      margin-bottom:0;
      margin-right: 20px;

      .bv-no-focus-ring{
        .btn-secondary{
          font-size: 24px;
          font-weight: bold;
          background-color: #191919;
          border:none;
          outline:none;
          box-shadow: none;
          padding-top:5px;

          &.active{
            text-decoration: underline #fff;
          }
        }
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
            button{
            position:relative;
            //top:0px;//0.5px mobile
            }
          }
        }
        .languages{
          position: absolute;
          top:13px;
          right:50px;
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
    .header-main{
      .languages{
        display:none;
      }
      .languages-mobile{
        .toggle-languages{
          position: absolute;
          top:21px;
          right:80px;
          cursor:pointer;
          background: url('../assets/world2.svg') no-repeat center;
          background-size: 30px;
          height:30px;
          width:30px;
        }
      }
    }
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
<script>
export default {
  data () {
    return {
      selected: 'radio1',
      show: false,
      options: [
        { text: 'DE', value: 'radio1' },
        { text: 'FR', value: 'radio2' },
        { text: 'IT', value: 'radio3' }
      ]
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
</script>
