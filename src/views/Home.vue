<template>
  <div id="home">
    <div class="content">
      <div class="intro">
        <p>{{$t('intro')}}</p>
      </div>
      <a href="https://jobfairzav.ch" target="_blank">
        <img class="banner" src="~/../assets/sponsors/Banner.jpg" alt="Banner Job Fair ZAV" top v-b-tooltip.hover title="Job Fair ZAV"/>
      </a>
      <h1>{{$t('support')}}</h1>
      <b-card-group id='bcards' deck>
        <sponsor-card v-for="(sponsor, index) in this.sponsors" :key="index" :logo="sponsor.logo" :link="sponsor.link" :text="sponsor.text" :tooltip="sponsor.tooltip"/>

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
    .banner{
      background-color: #fff;
      border:none;
      box-shadow: 0 2px 30px rgba(0,0,0,.15);
      border-radius: 0 0 20px 0;
      margin: 5px 0 5px 0;
      width: 100%;
      .banner:hover{
        .banner{
           transform: matrix(1,0,0,1,0,0);
        }
      }
    }
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
import SponsorCard from '@/components/SponsorCard.vue'
import data from '../data/sponsors.json'

@Component({
  name: 'Home',
  components: {
    SponsorCard
  }
})

export default class Home extends Vue {
  public sponsors = data.filter(s => s.active)

  mounted () {
    const bcards = document.getElementById('bcards')
    if (bcards) {
      const cards1 = bcards.children
      const zahl = cards1.length
      let belegt = 0
      const karten: {'card': Node; 'position': number}[] = []
      for (let i = 0; i < zahl; i++) {
        if (cards1[i].getAttribute('class') !== 'search-placeholder') {
          belegt++
          karten[i] = { card: cards1[i], position: Math.random() }
        }
      }
      karten.sort((a, b) => { return Math.sign(a.position - b.position) })

      for (let i = 0; i < belegt; i++) {
        bcards.appendChild((karten[i]).card)
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
