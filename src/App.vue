<template>
  <div id="app">
    <div class="header">
      <div class="header-content">
        <a class="logo" href="#" onclick=""></a>
        <form class="header-search" action="#">
          <div class="flex-container">
            <input type="text" placeholder="Suchbegriff" name="search" autocomplete="off">
            <button>Suchen</button>
          </div>
        </form>
        <div class="languages">
          <span class="language-item active" id="de">DE</span>
          <span class="language-item" id="fr">FR</span>
          <span class="language-item" id="it">IT</span>
        </div>
        <div class="languages-mobile">
          <a class="toggle-languages"></a>
        </div>
        <a class="open-desktop-menu"></a>
      </div>
      <div class="optional-bar">
        Aktuelles bei Bedarf
      </div>
    </div>
    <div class="menu-overlay">
      <a class="close-desktop-menu"></a>
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
    <div class="content">
      <div class="main-sponsors">
        <h1>Wer uns untersützt:</h1>
        <div class="tile-row">
          <a class="tile" href="#">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor1.png" class="tile-img" alt="sponsor1">
            </div>
            <div class="tile-footer">
              <span class="tile-text">MY-D Foundation, Geneva</span>
            </div>
          </a>
          <a class="tile">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor2.png" class="tile-img" alt="sponsor2">
            </div>
            <div class="tile-footer">
              <span class="tile-text">Université de Fribourg<br>Universität Freiburg</span>
            </div>
          </a>
          <div class="mobile-break"></div>
          <a class="tile">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor3.png" class="tile-img" alt="sponsor3">
            </div>
            <div class="tile-footer">
              <span class="tile-text">Advokatur Schreiber</span>
            </div>
          </a>
          <a class="tile last">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor4.png" class="tile-img" alt="sponsor4">
            </div>
            <div class="tile-footer">
              <span class="tile-text">Universität St.Gallen,<br>Law School</span>
            </div>
          </a>
        </div>
        <div class="tile-row">
          <a class="tile double">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor6.png" class="tile-img" alt="sponsor6">
            </div>
            <div class="tile-footer">
              <span class="tile-text">Bernischer Anwaltsverband<br>Association des avocats bernois</span>
            </div>
          </a>
          <div class="mobile-break"></div>
          <a class="tile">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor5.png" class="tile-img" alt="sponsor5">
            </div>
            <div class="tile-footer">
              <span class="tile-text">legalis.ch</span>
            </div>
          </a>
          <a class="tile last">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor7.jpg" class="tile-img" alt="sponsor7">
            </div>
            <div class="tile-footer">
              <span class="tile-text">Zürcher Anwaltsverband</span>
            </div>
          </a>
        </div>
        <div class="tile-row">
          <a class="tile">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor8.png" class="tile-img" alt="sponsor8">
            </div>
            <div class="tile-footer">
              <span class="tile-text">Züricher Hochschule für Angewandte Wissenschaften</span>
            </div>
          </a>
          <a class="tile">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor9.svg" class="tile-img" alt="sponsor9">
            </div>
            <div class="tile-footer">
              <span class="tile-text">Kellerhals Carrard</span>
            </div>
          </a>
          <div class="mobile-break"></div>
          <a class="tile">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor10.png" class="tile-img" alt="sponsor10">
            </div>
            <div class="tile-footer">
              <span class="tile-text">LegalTechRadar</span>
            </div>
          </a>
          <a class="tile last">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor12.jpg" class="tile-img" alt="sponsor12">
            </div>
            <div class="tile-footer">
              <span class="tile-text">Ordre des avocats vaudois</span>
            </div>
          </a>
        </div>
        <div class="tile-row">
          <a class="tile">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor13.jpg" class="tile-img" alt="sponsor13">
            </div>
            <div class="tile-footer">
              <span class="tile-text">SchKG-Vereinigung<br>Association LP</span>
            </div>
          </a>
          <a class="tile">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor14.svg" class="tile-img" alt="sponsor14">
            </div>
            <div class="tile-footer">
              <span class="tile-text">St.Galler Anwaltsverband</span>
            </div>
          </a>
          <div class="mobile-break"></div>
          <a class="tile double last">
            <div class="tile-img-wapper">
              <img src="./assets/sponsors/sponsor11.jpg" class="tile-img" alt="sponsor11">
            </div>
            <div class="tile-footer">
              <span class="tile-text">Institut für Föderalismus, Universität Freiburg<br>Institut du Fédéralisme, Université de Fribourg</span>
            </div>
          </a>
        </div>
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
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  //general
  h1{
    text-align: left;
  }

  .header{
    z-index: 1000;
    top: 0;
    left: 0;
    position: fixed;
    width: 100%;
    background-color: #105285;
    color: #0c5284;

    .header-content{
      padding-top:15px;
      padding-bottom:15px;
      height: 40px;
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
            //border-radius: 30px 0 0 30px;
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
            //border-radius: 0 30px 30px 0;
            font-size: 16px;
            font-weight: bold;
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

        .language-item{
          font-size: 24px;
          font-weight: bold;
          padding-right: 20px;
          color:#fff;
          cursor:pointer;

          &.active{
            text-decoration: underline #fff;
            cursor:default;
          }
        }
      }
      .languages-mobile{
        display: none;
      }
      .open-desktop-menu{
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
      height: 30px;
      padding-top:10px;
      color: #000;
      background-color: #e5e9f1;
      font-weight: bold;
    }
  }
  .menu-overlay{
    display:none;
    z-index: 1001;
    height:100%;
    width:500px;
    position:fixed;
    top:0;
    right:0;
    background-color:#fff;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 25px 0px;

    ul { list-style-type: none; }

    .close-desktop-menu{
      position: absolute;
      top:21px;
      right:20px;
      cursor:pointer;
      background: url('assets/close-blue.svg') no-repeat center;
      background-size: 30px;
      height:30px;
      width:30px;
    }

    .close-desktop-menu:hover{
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
          color:#105285;
        }
      }
    }
  }
  .content{
    padding-top: 110px!important; //-30px if optional bar not visible
    margin: 0 auto;
    max-width: 984px;

    .main-sponsors{
      .tile-row{
        display:flex;
        flex-flow: row wrap;
        justify-content: center;

        .tile{
          width:234px;
          height:160px;
          background-color: #fff;
          box-shadow: 0 2px 30px rgba(0,0,0,.15);
          border-radius: 0 0 20px 0;
          margin-right:16px;
          margin-bottom:20px;
          position:relative;
          cursor:pointer;

          &.double{
            width:484px;
          }

          &.last{
            margin-right: 0;
          }

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
            width:100%;;
            position:absolute;
            bottom:0;
            background-color: #11a3eb;
            color:#fff;
            font-weight: bold;
            display: table;
            border-radius: 0 0 20px 0;

            .tile-text{
              display: table-cell;
              vertical-align: middle;
              text-align: center;
            }
          }
        }
        .tile:hover{
          .tile-img-wapper{
            .tile-img{
              transform: matrix(1,0,0,1,0,0);
            }
          }
          .tile-footer{
            background-color:#41b5ef;
          }
        }
      }
    }
    .other-sponsors{
      text-align: left;
      //font-size: 20px;
    }
  }
}
//tablet
@media (max-width: 1024px){
  #app{
    .header{
      .header-content{
        height:90px;
        position: relative;
        display: flex;

        .logo{
          position: absolute;
          margin:0;
          top:5px;
          left:15px;
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
        .languages{
          display:none;
        }
        .languages-mobile{
          display:inline-block;
          cursor:pointer;
          background: url('assets/world2.svg') no-repeat center;
          background-size: 35px;
          height:35px;
          width:35px;
          position: absolute;
          right:80px;
          top:19px;
        }
        .open-desktop-menu{
          position: absolute;
          margin:0;
          top:21px;
          right:15px;
        }
      }
    }
    .content{
      padding-top: 160px!important;
      max-width: 1024px;
      margin: 0 auto;
      margin-left:4px;
      margin-right:4px;

      .main-sponsors{
        .tile-row{
          .tile{
          //width:160px;
          height:160px;
          margin-right:10px;
          margin-bottom:10px;
          &.double{
            //width:330px;
            //width:160px;
          }

            .tile-img-wapper{
              height:80px;
            }

            .tile-footer{
              height:80px;

              .tile-text{
                padding:5px;
                font-size:14px;
              }
            }
          }
          .mobile-break{
            flex-basis: 100%;
            height: 0;
          }
        }
      }
    }
  }
}
//smartphone
@media (max-width: 534px){
  #app{
    .content{
      .main-sponsors{
        .tile-row{
          .tile{
            width:160px;
            &.double{
              width:330px;
            }
          }
          .mobile-break{
            flex-basis: 100%;
            height: 0;
          }
        }
      }
    }
  }
}
</style>
