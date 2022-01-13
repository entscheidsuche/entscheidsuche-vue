<template>
  <div id="home">
    <div class="content">
      <div class="intro">
        <p>{{$t('intro')}}</p>
      </div>
      <h1>{{$t('support')}}</h1>
      <b-card-group id='bcards' deck>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://my-d.org/index.php/www-my-d-org" target="_blank">
            <b-card-img src="~/../assets/sponsors/sponsor1.png" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="MY-D Foundation, Geneva">
            <div class="card-text-wrapper">
              <b-card-text>
              MY-D Foundation, Geneva
              </b-card-text>
            </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://www3.unifr.ch/ius/de/" target="_blank">
            <b-card-img src="~/../assets/sponsors/sponsor2.png" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="Université de Fribourg Universität Freiburg">
            <div class="card-text-wrapper">
              <b-card-text>
              Université de Fribourg Universität Freiburg
              </b-card-text>
            </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://www.advo-schreiber.ch/advo/" target="_blank">
            <b-card-img src="~/../assets/sponsors/sponsor3.png" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="Advokatur Schreiber">
             <div class="card-text-wrapper">
              <b-card-text>
              Advokatur Schreiber
              </b-card-text>
             </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://www.unisg.ch/de/universitaet/schools/law" target="_blank">
              <b-card-img src="~/../assets/sponsors/sponsor4.png" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="Universität St.Gallen, Law School">
            <div class="card-text-wrapper">
              <b-card-text>
              Universität St.Gallen, Law School
              </b-card-text>
            </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://www.legalis.ch/de/" target="_blank">
              <b-card-img src="~/../assets/sponsors/sponsor5.png" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="legalis.ch">
            <div class="card-text-wrapper">
              <b-card-text>
              legalis.ch
              </b-card-text>
            </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://www.bav-aab.ch/de/" target="_blank">
              <b-card-img src="~/../assets/sponsors/sponsor6.png" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="Bernischer Anwaltsverband Association des avocats bernois">
            <div class="card-text-wrapper">
              <b-card-text>
              Bernischer Anwaltsverband Association des avocats bernois
              </b-card-text>
            </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://www.zav.ch/" target="_blank">
            <b-card-img src="~/../assets/sponsors/sponsor7.jpg" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="Zürcher Anwaltsverband">
            <div class="card-text-wrapper">
              <b-card-text>
              Zürcher Anwaltsverband
              </b-card-text>
            </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://www.zhaw.ch/de/hochschule/" target="_blank">
              <b-card-img src="~/../assets/sponsors/sponsor8.png" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="Zürcher Hochschule für Angewandte Wissenschaften">
            <div class="card-text-wrapper">
              <b-card-text>
                Zürcher Hochschule für Angewandte Wissenschaften
              </b-card-text>
            </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://www.kellerhals-carrard.ch/de/home/index.php" target="_blank">
              <b-card-img src="~/../assets/sponsors/sponsor9.svg" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="Kellerhals Carrard">
            <div class="card-text-wrapper">
              <b-card-text>
              Kellerhals Carrard
              </b-card-text>
            </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://www3.unifr.ch/federalism/en/" target="_blank">
              <b-card-img src="~/../assets/sponsors/sponsor11.jpg" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="Institut für Föderalismus, Universität Freiburg Institut du Fédéralisme, Université de Fribourg">
            <div class="card-text-wrapper">
              <b-card-text>
              Institut für Föderalismus, Universität Freiburg Institut du Fédéralisme, Université de Fribourg
              </b-card-text>
            </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://www.oav.ch/" target="_blank">
            <b-card-img src="~/../assets/sponsors/sponsor12.jpg" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="Ordre des avocats vaudois">
            <div class="card-text-wrapper">
              <b-card-text>
              Ordre des avocats vaudois
              </b-card-text>
            </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://www.schkg-vereinigung.ch/" target="_blank">
              <b-card-img src="~/../assets/sponsors/sponsor13.jpg" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="SchKG-Vereinigung Association LP">
            <div class="card-text-wrapper">
              <b-card-text>
              SchKG-Vereinigung Association LP
              </b-card-text>
            </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://www.sgav.ch/" target="_blank">
              <b-card-img src="~/../assets/sponsors/sponsor14.svg" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="St.Galler Anwaltsverband">
            <div class="card-text-wrapper">
              <b-card-text>
              St.Galler Anwaltsverband
              </b-card-text>
            </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://pansoft.de/" target="_blank">
              <b-card-img src="~/../assets/sponsors/sponsor15.png" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="Pansoft GmbH">
            <div class="card-text-wrapper">
              <b-card-text>
              Pansoft GmbH
              </b-card-text>
            </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://www.betreibung-konkurs.ch/" target="_blank">
              <b-card-img src="~/../assets/sponsors/sponsor16.png" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="Konferenz der Betreibungs- und Konkursbeamten der Schweiz">
            <div class="card-text-wrapper">
              <b-card-text>
              Konferenz der Betreibungs- und Konkursbeamten der Schweiz
              </b-card-text>
            </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://www.oeffentlichkeitsgesetz.ch/deutsch" target="_blank">
              <b-card-img src="~/../assets/sponsors/sponsor17.png" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="Öffentlichkeitsgesetz">
            <div class="card-text-wrapper">
              <b-card-text>
              Öffentlichkeitsgesetz
              </b-card-text>
            </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://steigerlegal.ch" target="_blank">
              <b-card-img src="~/../assets/sponsors/sponsor18.svg" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="Steiger Legal">
            <div class="card-text-wrapper">
              <b-card-text>
              Steiger Legal
              </b-card-text>
            </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://aslantas.ch" target="_blank">
              <b-card-img src="~/../assets/sponsors/sponsor19.jpg" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="Anwaltskanzlei Aslantas">
            <div class="card-text-wrapper">
              <b-card-text>
              Anwaltskanzlei Aslantas
              </b-card-text>
            </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://www.sedlex-avocats.ch/" target="_blank">
              <b-card-img src="~/../assets/sponsors/sponsor20.jpg" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="sedlex Rechtsanwälte Lausanne">
            <div class="card-text-wrapper">
              <b-card-text>
              sedlex Rechtsanwälte Lausanne
              </b-card-text>
            </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://www.ub.unibe.ch/teilbibliotheken/rechtswissenschaft/juristische_bibliothek_jbb/index_ger.html" target="_blank">
              <b-card-img src="~/../assets/sponsors/sponsor21.png" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="Universitätsbibliothek Bern, Juristische Bibliothek">
            <div class="card-text-wrapper">
              <b-card-text>
              Universitätsbibliothek Bern, Juristische Bibliothek
              </b-card-text>
            </div>
          </div>
        </b-card>
        <b-card>
          <div class="card-img-wapper">
            <a href="https://fritschi.foundation/" target="_blank">
              <b-card-img src="~/../assets/sponsors/sponsor22.jpg" alt="Image" top></b-card-img>
            </a>
          </div>
          <div class="card-footer" v-b-tooltip.hover title="Marco Fritschi, Fritschi Foundation">
            <div class="card-text-wrapper">
              <b-card-text>
              Marco Fritschi, Fritschi Foundation
              </b-card-text>
            </div>
          </div>
        </b-card>

        <div class="search-placeholder"></div>
        <div class="search-placeholder"></div>
        <div class="search-placeholder"></div>
      </b-card-group>
      <div class="other-sponsors">
      <h1 v-if="locale==='de'">Weitere Unterstützung erhalten wir von:</h1>
      <h1 v-if="locale==='fr'">Autres soutiens :</h1>
      <h1 v-if="locale==='it'">Altro sostegno:</h1>
Timur <b>Acemoglu</b>, Olten;
Martina <b>Arioli</b>, Zürich;
Fatih <b>Aslantas</b>, Weinfelden;
Stephan <b>Bernard</b>, Basel;
Daniel <b>Boos</b>, Zürich;
Harold <b>Bouchex-Bellomie</b>, Bienne;
Renato <b>Bucher</b>, Zürich;
Simon <b>Canonica</b>, Stadel;
Bertil <b>Cottier</b>, Préverenges;
<b>deju.re</b>;
Philipp <b>do Canto</b>, Zürich;
<b>Domizilplus Treuhand</b>, Zürich;
Daniel <b>Emch</b>, Bern;
Lucien <b>Fluri</b>, Solothurn;
Markus <b>Gehrig</b>, Fehraltorf;
Patrick <b>Gehrig</b>, Biglen;
Daniela <b>Giovanoli</b>, Bern;
André <b>Golliez</b>, Zürich;
Sven <b>Gretler</b>, Zürich;
Angelina <b>Grossenbacher</b>, Burgdorf;
Nils <b>Güggi</b>, Bern;
J. <b>Haefeli</b>, Gipf-Oberfrick;
Ralph <b>Hemsley</b>, Zürich;
Mathias <b>Hemsley</b>, Zürich;
Ruedi <b>Herzig</b>, Arbon;
Elias <b>Hofstetter</b>, Bern;
<b>Kanzlei 5</b>, Steffisburg;
Pranvera <b>Këllezi</b>, Genève;
Daniel <b>Kettiger</b>, Bolligen;
<b>Kneubühl Recht</b>, Mühlethurnen;
Karola <b>Krell, Foodlex</b>, Bern;
Oleg <b>Lavrovsky</b>, Köniz;
Simona <b>Liechti</b>, Bern;
Kilian <b>Meyer</b>, Schaffhausen;
Daniel <b>Moccand</b>, Meggen;
Lukas <b>Müller</b>, Zürich;
Moritz <b>Müller</b>, Bern;
Gregor <b>Münch</b>, Zürich;
Elias <b>Nesti</b>, Solothurn;
Stefan <b>Oderbolz</b>, Thalwil;
Markus <b>Prazeller</b>, Basel;
Dario <b>Piececchi</b>, Luzern;
Sarah <b>Progin</b>, Granges-Paccot;
Luca <b>Ranzoni</b>, St. Gallen;
Reinhard <b>Riedl</b>, Effretikon;
Stefan <b>Rolli</b>, Rubigen;
Nora <b>Scheidegger</b>, Bern;
Clemens <b>Schuster</b>, Zürich;
Mark <b>Schweizer</b>, Winterthur;
Charlotte <b>Sieber-Gasser</b>, Bern;
<b>Advokatur Spycher</b>, Bern;
Sabine <b>Steiger-Sachmann</b>, Winterthur;
Dominique <b>Strebel</b>, Zürich;
<b>sui generis Verlag</b>, Zürich;
Rolf A. <b>Tobler</b>, Bern;
Johannes <b>Wagner</b>, Appenzell;
<font v-if="locale==='de'"><b>sowie</b> vielen weiteren Unterstützerinnen und Unterstützern, die anonym bleiben wollen.</font>
<font v-if="locale==='fr'"><b>ainsi</b> que de nombreux autres soutiens qui souhaitent rester anonymes.</font>
<font v-if="locale==='it'"><b>e</b> molti altri sostenitori che desiderano rimanere anonimi</font>
     </div>
    </div>
  </div>
</template>

<style lang="scss">
  div.intro{
    padding-top: 10px;
  }

#home {
  .content{
    .card-deck{
      width:100%;
      display:flex;
      flex-flow:row wrap;
      justify-content:space-between;
      margin:0px;

      .search-placeholder {
        height: 2px;
        width:260px;
        flex-basis: 260px;
        max-width:calc((100% - 40px) / 4);
        flex-grow: 1;
      }
      .card{
        background-color: #fff;
        border:none;
        box-shadow: 0 2px 30px rgba(0,0,0,.15);
        border-radius: 0 0 20px 0;
        margin: 5px 0 5px 0;
        width: 260px;
        max-width:calc((100% - 40px) / 4);
        flex-basis: 260px;
        flex-grow: 1;
        justify-content:space-between;
        .card-body{
          padding:0;
          .card-img-wapper{
            height:100px;
            position:relative;
            .card-img-top{
              max-height:calc(100% - 10px);
              max-width:calc(100% - 10px);
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
          .card-footer{
            height:60px;
            width:100%;
            color:#000;
            border-radius: 0 0 20px 0;
            border-top: 1px solid #e5e9f1;
            background-color: #fff;
            position:relative;
            padding:0;

            .card-text-wrapper{
              height:60px;
              position:absolute;
              top:0;
              overflow:hidden;
              width: calc(100%);
              display: flex;
              justify-content: center;

              .card-text{
                line-height:60px;
                font-size:14px;
                white-space: nowrap;
                text-overflow: ellipsis;
                display: block;
                overflow: hidden;
                padding-left:20px;
                padding-right:20px;
                }
              }
            }
          }
        }
        .card:hover{
          .card-img-wapper{
            .card-img-top{
              transform: matrix(1,0,0,1,0,0);
            }
          }
        }
      }
    //old
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
            .tile-text{
              white-space: nowrap;
              text-overflow: ellipsis;
              display: flex;
              overflow: hidden;
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

      ul{
        color:#2b2b2b;
      }
    }
  }
}
//tablet
@media (max-width: 1024px){
  #home{
    .content{

      .card-deck{
        .search-placeholder{
          max-width:calc((100% - 20px) / 3);
        }
        .card{
          max-width:calc((100% - 20px) / 3);
        }
      }

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
  #home{
    .content{
      .card-deck{
        width:100%;
        .card{
          min-width:100px;
          //max-width:160px;
          max-width:calc((100% - 20px) / 2);
        }
      }
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'Home'
})

export default class Home extends Vue {
  mounted () {
    const bcards = document.getElementById('bcards')
    if (bcards) {
      const cards1 = bcards.children
      const zahl = cards1.length
      let belegt = 0
      for (let i = 0; i < zahl; i++) {
        if (cards1[i].getAttribute('class') !== 'search-placeholder') belegt++
      }
      for (let i = 0; i < zahl; i++) {
        bcards.appendChild(cards1[Math.floor(Math.random() * zahl)])
      }
      for (let i = 0; i < belegt;) {
        const cards2 = bcards.children
        if (cards2[i].getAttribute('class') === 'search-placeholder') {
          bcards.appendChild(cards2[i])
        } else i++
      }
    }
  }

  public get locale () {
    return AppModule.locale
  }
}
</script>
<!--
        <b-card>
          <div class="card-img-wapper">
            <a href="https://my-d.org/index.php/www-my-d-org" target="_blank" id='bc-a1'>
            <b-card-img id='bc-b1' src="~/../assets/sponsors/sponsor2.png" alt="Image" top></b-card-img>
            </a>
          </div>
          <div id='bc-c1' class="card-footer" v-b-tooltip.hover title="XXXXMY-D Foundation, Geneva">
            <div class="card-text-wrapper">
              <b-card-text id='bc-d1'>
              XXXMY-D Foundation, Geneva
              </b-card-text>
            </div>
          </div>
        </b-card>
-->
