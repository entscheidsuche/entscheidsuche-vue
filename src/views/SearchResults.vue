<template>
  <div id="searchResults">
    <div class="flex-row">
      <div v-bind:class="['filter', this.filterVisible ? '' : 'hidden', this.fullScreen ? 'hidden' : '']">
        <div v-bind:class="['button-wrapper', this.showMessage ? 'messageOffset' : '']">
          <div v-on:click="onToggleFilter()" class="hide-filter">
            <b-icon icon="caret-left-fill" aria-hidden="true"></b-icon>
          </div>
        </div>
        <div class="year-range">
          <label class="title" for="range-1">Jahr</label>
          <b-form-input id="range-1" type="range" min="0" max="5"></b-form-input>
        </div>
        <div class="languages">
          <b-form-group label="Sprachen" class="title">
            <b-form-checkbox
              v-for="option in options"
              v-model="selected"
              :key="option.value"
              :value="option.value"
              name="flavour-3a">
              {{ option.text }}
            </b-form-checkbox>
          </b-form-group>
        </div>
        <div class="authority">
          <b-form-group label="Verfasser" class="title">
            <div v-b-toggle="'collapse-1'" class="first">
              <b-form-checkbox>Bund</b-form-checkbox>
            </div>
            <b-collapse id="collapse-1">
              <div v-b-toggle="'collapse-1-1'" class="second">
                <b-form-checkbox>Bundesverwaltungsgericht</b-form-checkbox>
              </div>
              <b-collapse id="collapse-1-1" class="third">
                <b-form-checkbox>Abteilung I</b-form-checkbox>
                <b-form-checkbox>Abteilung II</b-form-checkbox>
                <b-form-checkbox>Abteilung III</b-form-checkbox>
              </b-collapse>
              <div v-b-toggle="'collapse-1-2'" class="second">
                <b-form-checkbox>Bundesgericht</b-form-checkbox>
              </div>
              <div v-b-toggle="'collapse-1-3'" class="second">
                <b-form-checkbox>Bundesstrafgericht</b-form-checkbox>
              </div>
              <div v-b-toggle="'collapse-1-4'" class="second">
                <b-form-checkbox>Bundespatentgericht</b-form-checkbox>
              </div>
              <div v-b-toggle="'collapse-1-5'" class="second">
                <b-form-checkbox>Entscheidungen des Militärkassationsgerichts</b-form-checkbox>
              </div>
            </b-collapse>
            <div v-b-toggle="'collapse-2'" class="first">
              <b-form-checkbox>ZH</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-3'" class="first">
              <b-form-checkbox>BE</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-4'" class="first">
              <b-form-checkbox>LU</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-5'" class="first">
              <b-form-checkbox>UR</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-6'" class="first">
              <b-form-checkbox>SZ</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-7'" class="first">
              <b-form-checkbox>OW</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-8'" class="first">
              <b-form-checkbox>NW</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-9'" class="first">
              <b-form-checkbox>GL</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-10'" class="first">
              <b-form-checkbox>ZG</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse11'" class="first">
              <b-form-checkbox>FR</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-12'" class="first">
              <b-form-checkbox>SO</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-13'" class="first">
              <b-form-checkbox>BS</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-14'" class="first">
              <b-form-checkbox>BL</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-15'" class="first">
              <b-form-checkbox>SH</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-16'" class="first">
              <b-form-checkbox>AR</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-17'" class="first">
              <b-form-checkbox>AI</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-18'" class="first">
              <b-form-checkbox>SG</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-19'" class="first">
              <b-form-checkbox>GR</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-20'" class="first">
              <b-form-checkbox>AG</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-21'" class="first">
              <b-form-checkbox>TG</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-22'" class="first">
              <b-form-checkbox>TI</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse23'" class="first">
              <b-form-checkbox>VD</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-24'" class="first">
              <b-form-checkbox>VS</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-25'" class="first">
              <b-form-checkbox>NE</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-24'" class="first">
              <b-form-checkbox>GE</b-form-checkbox>
            </div>
            <div v-b-toggle="'collapse-25'" class="first">
              <b-form-checkbox>JU</b-form-checkbox>
            </div>
          </b-form-group>
        </div>
      </div>
      <div v-bind:class="['results', this.fullScreen ? 'hidden' : '']">
        <div v-bind:class="['button-wrapper', this.showMessage ? 'messageOffset' : '']">
          <div v-on:click="onToggleFilter()" v-bind:class="['show-filter', this.filterVisible ? '' : 'visible']">
            <b-icon icon="caret-right-fill" aria-hidden="true"></b-icon>
          </div>
        </div>
        <div v-for="result in results" :key="result.message" class="result-item" v-on:click="onOpenPreview()">
          <div class="result-body">
            <div class="result-header">
              <a class="canton-logo"></a>
              <h4 class="result-title">{{ result.title }}</h4>
              <a class="link-logo"></a>
            </div>
            <div class="text-preview">
              <p>{{ result.message }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-bind:class="['preview', this.previewVisible ? 'visible' : '', this.fullScreen ? 'fullScreen' : '']">
        <div class="doc-info">
          <div class="doc-header">
            <a class="canton-logo"></a>
            <h4 class="result-title">
            Obergericht, Zivilkammern, 27 II 2018, Urteil vom 11.12.2018
            </h4>
            <b-icon v-on:click="onFullScreen()" id="maximize-preview" icon="arrows-fullscreen" aria-hidden="true"></b-icon>
            <b-icon v-on:click="onFullScreen()" id="minimize-preview" icon="fullscreen-exit" aria-hidden="true"></b-icon>
            <b-icon v-on:click="onClosePreview()" id="close-preview" icon="x" aria-hidden="true"></b-icon>
          </div>
        </div>
        <iframe class="pdf-viewer"
          src="https://entscheidsuche.ch/direkt_kantone%2Ffr_kg2011%2Fcap_2002_9_24_02_03.pdf"
          style="border:none;">
        </iframe>
      </div>
    </div>
  <router-view/>
  </div>
</template>

<style lang="scss">
#searchResults {
  min-height: 100%;
  height: calc(100vh - 110px);
  display:flex;
  overflow: hidden;
  margin: 0;
  text-align: left;
  padding-bottom:8px;

  .flex-row{
    display:flex;
    width:100%;

    .filter{
      width:300px;
      float: left;
      border-right:2px solid #e5e9f1;
      overflow: auto;
      box-sizing: border-box;
      padding: 0.5em;
      padding-right:20px;
      padding-left:20px;
      overflow:scroll;
      overflow-x: hidden;
      transition: all 0.2s linear;
      position: relative;

      &.hidden{
        width:0;
        padding: 8px 0 8px 0;
        border:0;
      }
      .button-wrapper{
        position:absolute;
        width:26px;
        top:calc(((100vh - 38px) / 2) - 70px );
        right:0;

        &.messageOffset{
          top: calc(((100vh - 38px) / 2) - 110px );
        }

        .hide-filter{
          display:flex;
          position: fixed;
          height:38px;
          width:26px;
          border-radius: 4px 0 0 4px;
          background-color: #6183ec;
          color:#fff;
          z-index:100;
          justify-content: center;
          align-items: center;
          cursor:pointer;

          svg{
            font-size:20px;
          }
        }
      }
      .title{
        font-weight: bold
      }
      .custom-control{
        font-weight:normal;
        max-height:24px;
        overflow:hidden;
      }
      .authority{
        overflow: hidden;
        .first{
          outline:none;
        }
        .second{
          padding-left:20px;
          outline:none;
        }
        .third{
          padding-left:40px;
          outline:none;
        }
      }
    }
    .results{
      flex-grow:2;
      min-width: 0;
      width:35%;
      float: left;
      border-right:2px solid #e5e9f1;
      overflow:scroll;
      overflow-x: hidden;
      box-sizing: border-box;
      padding: 0.5em;
      position: relative;
      transition: all 0.2s linear;

      .button-wrapper{
        position:absolute;
        width:26px;
        left:0;
        top: calc(((100vh - 38px) / 2) - 70px );

        &.messageOffset{
          top: calc(((100vh - 38px) / 2) - 110px );
        }
        .show-filter{
          position: fixed;
          height:38px;
          width:26px;
          border-radius: 0 4px 4px 0;
          background-color: #6183ec;
          color:#fff;
          z-index:100;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          display: none;

          &.visible{
            display:flex;
          }
          svg{
            font-size:20px;
          }
        }
        &.hidden{
          width:0;
          padding: 8px 0 8px 0;
          border:0;
          overflow:none;
        }
      }

      .result-item{
        border: 1px solid rgba(0, 0, 0, 0.125);
        border-radius: 4px;
        margin-bottom:10px;
        cursor: pointer;

        .result-body{
          padding:20px;

          .result-header{
            width:100%;
            display:flex;
            justify-content: space-between;
            flex-direction: row;
            margin-bottom: 12px;
            .canton-logo{
              background: url('../assets/cantons/AR.png') no-repeat center;
              background-size: contain;
              background-position: left center;
              height:40px;
              width:40px;
              margin-right:10px;
              flex-shrink: 0;
            }
            .link-logo{
              flex-shrink: 0;
              background: url('../assets/pdf.png') no-repeat center;
              background-size: contain;
              background-position: right center;
              height:40px;
              width:40px;
              margin-left:10px;
            }
            .result-title{
              font-size: 16px;
              margin-top: 0;
              text-align: left;
              width:100%;
              margin-bottom: 0;
              word-break: break-all;
            }
          }
          .text-preview{
            font-size: 14px;
            .keyword{
              font-style: italic;
              background-color: #FFFF00;
            }
          }
        }
      }
      .result-item:hover{
        background-color: rgba(97, 131, 236, 0.2);
      }
    }
    .preview{
      display:none;
      float: left;
      overflow: auto;
      box-sizing: border-box;
      padding: 0.5em;
      overflow-x: hidden;
      overflow-y: hidden;
      flex-grow:2;
      width:35%;
      transition: all 0.2s linear;

      &.visible{
        display:block;
      }

      &.fullScreen{
        display: block;
        width:100vw;

        .doc-info{
          .doc-header{
            #minimize-preview{
              display:block;
            }
            #maximize-preview{
              display:none;
            }
          }
        }
      }
      .doc-info{
        width:100%;
        padding:20px;
        border: 1px solid rgba(0, 0, 0, 0.125);
        border-radius: 4px;
        margin-bottom: 0.5em;
        position:relative;

        .doc-header{
          width:100%;
          display: flex;
          justify-content: space-between;
          flex-direction: row;
          .canton-logo{
            background: url('../assets/cantons/AR.png') no-repeat center;
            background-size: contain;
            background-position: left top;
            height:43px;
            width:43px;
            margin-right:10px;
          }
          #close-preview{
            background: url('../assets/bootstrap-close-big.svg') no-repeat center;
            cursor:pointer;
            height:20px;
            width:20px;
            margin-left: 20px;
            cursor:pointer;
            transition: all .2s ease-in-out;;
          }
          #close-preview:hover{
            transform: scale(1.1);
          }
          #maximize-preview{
            height:20px;
            width:20px;
            margin-left: 20px;
            cursor:pointer;
            transition: all .2s ease-in-out;
          }
          #maximize-preview:hover{
            transform: scale(1.1);
          }
          #minimize-preview{
            height:20px;
            width:20px;
            margin-left: 20px;
            cursor:pointer;
            transition: all .2s ease-in-out;
            display:none;
          }
          #minimize-preview:hover{
            transform: scale(1.1);
          }
        }
        .result-title{
          font-size:18px;
          margin-top: 0;
          text-align: left;
          width:100%;
          margin-bottom: 0;
          word-break: break-all;
        }
      }
    }
    .pdf-viewer{
      bottom:0;
      height:calc(100% - 80px);
      width:100%;
    }
  }
}
//tablet
@media (max-width: 1024px){
  #searchResults{
    .flex-row{
      .filter{
        padding: 8px 20px 8px 20px;

        &.hidden{
          width:0;
          padding:8px 0 8px 0;
        }
        .button-wrapper{
          top: calc(((100vh - 38px) / 2) - 120px );

          &.messageOffset{
            top: calc(((100vh - 38px) / 2) - 160px );
          }
        }
      }
      .results{
        .button-wrapper{
          top: calc(((100vh - 38px) / 2) - 120px );

          &.messageOffset{
            top: calc(((100vh - 38px) / 2) - 160px );
          }
        }
        &.hidden{
          padding:8px 0 8px 0;
          border:none;
          .show-filter{
            display:none;
          }
        }
      }
      .preview{
        .doc-info{
          .doc-header{
            .result-title{
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}
//smartphone
@media (max-width: 534px){
  #searchResults{
    .flex-row{
      .filter{
        width:100vw;
        padding: 8px 20px 8px 20px;
        &.hidden{
          padding:8px 0 8px 0;
          border:0;
          width:0;
        }
      }
      .results{
        max-width: 100vw;
        width: 0;
        padding:8px 0  0  0;
        border:0;
        .show-filter{
          position:fixed;
          left:0;

          &.visible{
          top: calc((100vh - 38px) / 2);
          }
        }
      }
      .preview{
        &.fullScreen{
          .doc-info{
            .doc-header{
              #minimize-preview{
                display:none;
              }
            }
          }
        }
      }
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { AppModule, MessageState } from '@/store/modules/app'

@Component({
  name: 'SearchResult'
})

export default class SearchResults extends Vue {
  private filterVisible = true;
  private fullScreen = false;
  private windowWidth = 0;
  private previewVisible = false;

  data () {
    return {
      selected: [],
      options: [
        { text: 'DE', value: 'de' },
        { text: 'FR', value: 'fr' },
        { text: 'IT', value: 'it' }
      ],
      results: [
        { title: 'Obergericht, Zivilkammern, 27 II 2018, Urteil vom 11.12.2018', message: 'Strafanzeige wegen Widerhandlung gegen die Lebensmittelgesetzgebung ein, da sie im Winter 1995/96 Hanföl. Zudem war Ende der 90er Jahre die Diskussion um die Zulässigkeit von Hanfgeschäften in aller Munde Gleichzeitig war die Rechtslage bezüglich der Bewirtschaftung von Hanffeldern Ende der 90er Jahre alles Mai 1997 beschlossenen Haltung, grundsätzlich nur die subventionierten Hanfanfplanzungen für legal zu Die Tatsache, dass der Berufungsgegner die Polizei über seine Hanffelder informierte und ihnen Personen' },
        { title: 'Bundesverwaltungsgericht, I. Abteilung, A-100/2011, Urteil vom 24.5.2011', message: 'Des Weiteren wurde erkannt, dass die örtlich beschlagnahmten Pflanzen in unterschiedlichen Wachstumsstadien und die örtlich beschlagnahmten Gegenstände sowie die von der Polizei beschlagnahmten Hanfpflanzen und' }
      ]
    }
  }

  created () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize () {
    this.windowWidth = window.innerWidth
    if (this.windowWidth <= 1024) {
      this.filterVisible = false
    } else {
      this.filterVisible = true
    }
  }

  public onToggleFilter (): void {
    if (this.filterVisible === true) {
      this.filterVisible = false
    } else if (this.previewVisible === true) {
      this.previewVisible = false
      this.filterVisible = true
    } else {
      this.filterVisible = true
    }
  }

  public onFullScreen (): void{
    if (this.fullScreen === false) {
      this.fullScreen = true
    } else if (this.fullScreen === true && this.windowWidth <= 534) {
      this.previewVisible = false
      this.fullScreen = false
    } else {
      this.fullScreen = false
    }
  }

  public onOpenPreview (): void{
    this.previewVisible = true
    if (this.windowWidth <= 534) {
      this.fullScreen = true
    }
  }

  public get showMessage () {
    return AppModule.showMessage === MessageState.VISIBLE
  }

  public onClosePreview (): void{
    this.previewVisible = false
    if (this.fullScreen === true) {
      this.fullScreen = false
    }
  }
}
</script>
