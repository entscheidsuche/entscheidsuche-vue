<template>
  <div id="app">
    <div class="header">
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
      <div class="optional-bar">
        Aktuelles bei Bedarf
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
    <div class="content">
      <h1>Wer uns untersützt:</h1>
      <div class="main-sponsors">
          <a class="tile" href="https://my-d.org/index.php/www-my-d-org" target="_blank">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor1.png" class="tile-img" alt="sponsor1">
            </div>
            <div class="tile-footer" data-description="MY-D Foundation, Geneva">
              <div class="tile-text-wrapper">
                <span class="tile-text">MY-D Foundation, Geneva</span>
              </div>
            </div>
          </a>
          <a class="tile" href="https://www3.unifr.ch/ius/de/" target="_blank">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor2.png" class="tile-img" alt="sponsor2">
            </div>
            <div class="tile-footer" data-description="Université de Fribourg Universität Freiburg">
              <div class="tile-text-wrapper">
                <span class="tile-text">Université de Fribourg Universität Freiburg</span>
              </div>
            </div>
          </a>
          <a class="tile" href="https://www.advo-schreiber.ch/advo/" target="_blank">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor3.png" class="tile-img" alt="sponsor3">
            </div>
            <div class="tile-footer" data-description="Advokatur Schreiber">
              <div class="tile-text-wrapper">
                <span class="tile-text">Advokatur Schreiber</span>
              </div>
            </div>
          </a>
          <a class="tile" href="https://www.unisg.ch/de/universitaet/schools/law" target="_blank">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor4.png" class="tile-img" alt="sponsor4">
            </div>
            <div class="tile-footer" data-description="Universität St.Gallen, Law School">
              <div class="tile-text-wrapper">
                <span class="tile-text">Universität St.Gallen, Law School</span>
              </div>
            </div>
          </a>
          <a class="tile" href="https://www.legalis.ch/de/" target="_blank">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor5.png" class="tile-img" alt="sponsor5">
            </div>
            <div class="tile-footer" data-description="legalis.ch">
              <div class="tile-text-wrapper">
                <span class="tile-text">legalis.ch</span>
              </div>
            </div>
          </a>
          <a class="tile" href="https://www.bav-aab.ch/de/" target="_blank">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor6.png" class="tile-img" alt="sponsor6">
            </div>
            <div class="tile-footer" data-description="Bernischer Anwaltsverband Association des avocats bernois">
              <div class="tile-text-wrapper">
                <span class="tile-text">Bernischer Anwaltsverband Association des avocats bernois</span>
              </div>
            </div>
          </a>
          <a class="tile" href="https://www.zav.ch/" target="_blank">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor7.jpg" class="tile-img" alt="sponsor7">
            </div>
            <div class="tile-footer" data-description="Zürcher Anwaltsverband">
              <div class="tile-text-wrapper">
                <span class="tile-text">Zürcher Anwaltsverband</span>
              </div>
            </div>
          </a>
          <a class="tile" href="https://www.zhaw.ch/de/hochschule/" target="_blank">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor8.png" class="tile-img" alt="sponsor8">
            </div>
            <div class="tile-footer" data-description="Züricher Hochschule für Angewandte Wissenschaften">
              <div class="tile-text-wrapper">
                <span class="tile-text">Züricher Hochschule für Angewandte Wissenschaften</span>
              </div>
            </div>
          </a>
          <a class="tile" href="https://www.kellerhals-carrard.ch/de/home/index.php" target="_blank">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor9.svg" class="tile-img" alt="sponsor9">
            </div>
            <div class="tile-footer" data-description="Kellerhals Carrard">
              <div class="tile-text-wrapper">
                <span class="tile-text">Kellerhals Carrard</span>
              </div>
            </div>
          </a>
          <a class="tile" href="https://www.legaltechradar.com/de" target="_blank">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor10.png" class="tile-img" alt="sponsor10">
            </div>
            <div class="tile-footer" data-description="LegalTechRadar">
              <div class="tile-text-wrapper">
                <span class="tile-text">LegalTechRadar</span>
              </div>
            </div>
          </a>
          <a class="tile" href="https://www3.unifr.ch/federalism/en/" target="_blank">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor11.jpg" class="tile-img" alt="sponsor11">
            </div>
            <div class="tile-footer" data-description="Institut für Föderalismus, Universität Freiburg Institut du Fédéralisme, Université de Fribourg">
              <div class="tile-text-wrapper">
                <span class="tile-text">Institut für Föderalismus, Universität Freiburg Institut du Fédéralisme, Université de Fribourg</span>
              </div>
            </div>
          </a>
          <a class="tile" href="https://www.oav.ch/" target="_blank">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor12.jpg" class="tile-img" alt="sponsor12">
            </div>
            <div class="tile-footer" data-description="Ordre des avocats vaudois">
              <div class="tile-text-wrapper">
                <span class="tile-text">Ordre des avocats vaudois</span>
              </div>
            </div>
          </a>
          <a class="tile" href="https://www.schkg-vereinigung.ch/" target="_blank">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor13.jpg" class="tile-img" alt="sponsor13">
            </div>
            <div class="tile-footer" data-description="SchKG-Vereinigung Association LP">
              <div class="tile-text-wrapper">
                <span class="tile-text">SchKG-Vereinigung Association LP</span>
              </div>
            </div>
          </a>
          <a class="tile" href="https://www.sgav.ch/" target="_blank">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor14.svg" class="tile-img" alt="sponsor14">
            </div>
            <div class="tile-footer" data-description="St.Galler Anwaltsverband">
              <div class="tile-text-wrapper">
                <span class="tile-text">St.Galler Anwaltsverband</span>
              </div>
            </div>
          </a>
      </div>
      <div class="other-sponsors">
        <h1>Weitere Unterstützung erhalten wir von:</h1>
        <ul>
          <li>Timur Acemoglu, Olten</li>
          <li>Martina Arioli, Zürich</li>
          <li>Fatih Aslantas, Weinfelden</li>
          <li>Stephan Bernard, Zürich</li>
          <li>Harold Bouchex-Bellomie, Bienne</li>
          <li>Renato Bucher, Zürich</li>
          <li>Bertil Cottier, Préverenges</li>
          <li>deju.re, Bern</li>
          <li>Philipp do Canto, Zürich</li>
          <li>DomizilPlus Treuhand, Zürich</li>
          <li>Daniel Emch, Bern</li>
          <li>Lucien Fluri, Solothurn</li>
          <li>Marco Fritschi, Winterthur</li>
          <li>Markus Gehrig, Fehraltorf</li>
          <li>Patrick Gehrig, Biglen</li>
          <li>Daniela Giovanoli, Bern</li>
          <li>Nils Güggi, Bern</li>
          <li>André Golliez, Zürich</li>
          <li>Ralph Hemsley, Luzern</li>
          <li>Mathias Hemsley, Zürich</li>
          <li>Elias Hofstetter, Bern</li>
          <li>Kanzlei 5, Steffisburg</li>
          <li>Pranvera Këllezi, Genève</li>
          <li>Kneubühl Recht, Mühlethurnen</li>
          <li>Karola Krell, Food Lex, Bern</li>
          <li>Oleg Lavrovsky, Köniz</li>
          <li>Kilian Meyer, Schaffhausen</li>
          <li>Lukas Müller, Zürich</li>
          <li>Gregor Münch, Zürich</li>
          <li>Elia Nesti, Solothurn</li>
          <li>Dario Picecchi, Luzern</li>
          <li>Sarah Progin, Granges-Paccot</li>
          <li>Reinhard Riedl, Effretikon</li>
          <li>Stefan Rolli, Rubigen</li>
          <li>Nora Scheidegger, Bern</li>
          <li>Clemens Schuster, Zürich</li>
          <li>Mark Schweizer, Winterthur</li>
          <li>Charlotte Sieber-Gasser, Bern</li>
          <li>Advokatur Spycher, Bern</li>
          <li>Sabine Steiger-Sackmann, Winterthur</li>
          <li>Dominique Strebel, Zürich</li>
          <li>sui generis Verlag, Zürich</li>
          <li>Rolf A. Tobler, Bern</li>
          <li>Johannes Wagner, Appenzell</li>
        </ul>
        <p>... sowie vielen weiteren Unterstützerinnen und Unterstützern, die anonym bleiben wollen.</p>
      </div>
    </div>
    <footer>
      <a class="logo" href="#" onclick=""></a>
    </footer>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  position: relative;
  min-height: 100%;

  .header{
    z-index: 1000;
    top: 0;
    left: 0;
    position: fixed;
    width: 100%;
    //background-color: #105285;
    background-color: #191919;
    color: #0c5284;

    .header-main{
      padding-top:10px;
      padding-bottom:10px;
      display: flex;
      align-items: center;

      .logo{
        margin-left:20px;
        z-index: 10;
        width: 290px;
        height: 60px;
        background: url('assets/logo-white.png') no-repeat center;
        color:#fff;
        background-size: contain;
        flex-shrink: 0;
      }

      .header-search{
        height:40px;
        width:100%;
        flex-grow:1;
        margin-right: 113px;

        .flex-container{
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
            top:0.5px;
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

            &.active{
              text-decoration: underline #fff;
            }
          }
        }
      }
      #burger{
        flex-shrink: 0;
        //position: absolute;
        margin-right:20px;
        cursor:pointer;
        background: url('assets/menu-white.svg') no-repeat center;
        background-size: 30px;
        height:30px;
        width:30px;
      }
    }
    .optional-bar{
      //display:none;
      height: 40px;
      padding-top:10px;
      color: #000;
      background-color: #e5e9f1;
      font-weight: bold;
    }
  }
  #sidebar-right{
    .menu-overlay{
      z-index: 1001;
      height:100%;
      width:500px;
      position:fixed;
      top:0;
      right:0;
      background-color:#fff;
      box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 25px 0px;

      ul { list-style-type: none; }

      #close-menu{
        position: absolute;
        top:21px;
        right:20px;
        cursor:pointer;
        background: url('assets/close.svg') no-repeat center;
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
  .content{
    padding-top: 120px!important; //-30px if optional bar not visible
    padding-bottom: 80px;
    margin-left: 10px;
    margin-right: 10px;
    margin: 0 auto;
    max-width: 984px;
    //background-color:#fff;

    .main-sponsors{
      display:flex;
      flex-flow: row wrap;
      justify-content: center;
      height:auto;

      .tile{
        flex-basis:234px;
        flex-shrink: 2;
        height:160px;
        background-color: #fff;
        box-shadow: 0 2px 30px rgba(0,0,0,.15);
        border-radius: 0 0 20px 0;
        margin: 5px;
        position:relative;
        cursor:pointer;

        .tile-img-wapper{
          height:100px;
          position:relative;

          .tile-img{
            height:calc(100% - 10px);
            width:calc(100% - 10px);
            transform: matrix(0.9,0,0,0.9,0,0);
            object-fit: contain;
            position: absolute;
            margin: auto;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }
        }
        .tile-footer{
          height:60px;
          width:100%;
          position:absolute;
          bottom:0;
          color:#000;
          border-radius: 0 0 20px 0;
          border-top: 1px solid #e5e9f1;

          .tile-text-wrapper{
            white-space: nowrap;
            text-overflow: ellipsis;
            display: block;
            overflow: hidden;

            .tile-text{
              line-height:60px;
              font-size:14px;
              padding:10px;
              vertical-align: middle;
              text-align: center;
            }
          }
        }
        //tooltip
        .tile-footer:before {
          content:attr(data-description);
          overflow:visible;
          box-sizing:border-box;
          display:block;
          background:rgba(0,0,0,.7);
          color:white;
          padding:10px;
          position:absolute;
          left:42.5%;
          margin-left:-100px;
          width:234px;
          height:100px;
          line-height:22px;
          border-radius:5px;
          opacity:0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index:100;
          font-size: 14px;
        }
        .tile-footer:after {
          content:'';
          display:block;
          position:absolute;
          left:50%;
          margin-left:-8px;
          height:0;
          width:0;
          border-left:8px solid transparent;
          border-right:8px solid transparent;
          border-top:8px solid rgba(0,0,0,.7);
          opacity:0;
        }

        .tile-footer:hover:before {
          opacity:1;
          top:-100px;
          transition-delay: 0.5s;
          -webkit-transition-delay: 0.5s;
        }

        .tile-footer:hover:after {
          opacity:1;
          top:0;
          transition-delay: 0.5s;
          -webkit-transition-delay: 0.5s;
        }
      }
      .tile:hover{
        .tile-img-wapper{
          .tile-img{
            transform: matrix(1,0,0,1,0,0);
          }
        }
      }
    }
    .other-sponsors{
      text-align: left;
      //font-size: 20px;
    }
  }
  footer{
    position:absolute;
    bottom: 0;
    left:0;
    height:50px;
    width:100%;
    //margin-top: 50px;
    background-color: #191919;
    display: flex;
    align-items: center;
    justify-content: center;

    .logo{
      width: 200px;
      height: 20px;
      background: url('assets/logo-white.png') no-repeat center;
      color:#fff;
      background-size: contain;
      flex-shrink: 0;
    }
  }
}
//tablet
@media (max-width: 1024px){
  #app{
    .header{
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
          top:18px;
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
    .content{
      padding-top: 160px!important;
      max-width: 1024px;
      margin-left: 10px;
      margin-right: 10px;

      .main-sponsors{
        .tile{
          margin:5px;
          flex: 0 1 160px;
          height:160px;

          .tile-img-wapper{
            height:100px;
          }

          .tile-footer{
            height:60px;
            text-overflow: ellipsis;

            .tile-text{
              padding:5px;
              font-size:14px;
            }
          }
          .tile-footer:before {
            width:160px;
            left:62.5%;
            font-size: 13px;
            line-height: 16px;
          }
        }
      }
    }
  }
}
//smartphone
@media (max-width: 534px){
  #app{
    .header{
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
            background: url('assets/world2.svg') no-repeat center;
            background-size: 30px;
            height:30px;
            width:30px;
          }
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
    .content{
      .main-sponsors{
        .tile-row{
          .tile{
            //width:160px;
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
      options: [
        { text: 'DE', value: 'radio1' },
        { text: 'FR', value: 'radio2' },
        { text: 'IT', value: 'radio3' }
      ]
    }
  }
}
</script>
