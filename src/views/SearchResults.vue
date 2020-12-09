<template>
  <div id="searchResults">
    <div class="flex-row">
      <div v-bind:class="['filter', this.showFilter ? '' : 'hidden']">
        <div class="hide-wrapper">
          <b-button id="hide-filter" variant="primary" v-on:click="onFilterClose()">
            <b-icon icon="caret-left-fill" aria-hidden="true"></b-icon>
            Filter einklappen
          </b-button>
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
      <div class="results">
        <div v-on:click="onFilterClose()" v-bind:class="['show-filter', this.showFilter ? '' : 'visible']">
          <b-icon icon="caret-right-fill" aria-hidden="true"></b-icon>
        </div>
        <div class="result-item selected">
          <div class="result-body">
            <div class="result-header">
              <a class="canton-logo"></a>
              <h4 class="result-title">
                Obergericht, Zivilkammern, 27 II 2018, Urteil vom 11.12.2018
              </h4>
              <a class="link-logo"></a>
            </div>
            <div class="text-preview">
              <p>Strafanzeige wegen Widerhandlung gegen die Lebensmittelgesetzgebung ein, da sie im Winter 1995/96 <span class="keyword">Hanföl</span>
                Zudem war Ende der 90er Jahre die Diskussion um die Zulässigkeit von <span class="keyword">Hanfgeschäften</span> in aller Munde
                Gleichzeitig war die Rechtslage bezüglich der Bewirtschaftung von <span class="keyword">Hanffeldern</span> Ende der 90er Jahre alles
                Mai 1997 beschlossenen Haltung, grundsätzlich nur die subventionierten Hanfanfplanzungen für legal zu
                Die Tatsache, dass der Berufungsgegner die Polizei über seine <span class="keyword">Hanffelder</span> informierte und ihnen Personen
               </p>
            </div>
          </div>
        </div>
        <div class="result-item">
          <div class="result-body">
            <div class="result-header">
              <a class="canton-logo"></a>
              <h4 class="result-title">
                Bundesverwaltungsgericht, I. Abteilung, A-100/2011, Urteil vom 24.5.2011
              </h4>
              <a class="link-logo"></a>
            </div>
            <div class="text-preview">
              <p>Des Weiteren wurde erkannt, dass die örtlich beschlagnahmten Pflanzen in unterschiedlichen Wachstumsstadien
               und die örtlich beschlagnahmten Gegenstände sowie die von der Polizei beschlagnahmten <span class="keyword">Hanfpflanzen</span> und
               </p>
            </div>
          </div>
        </div>
        <div class="result-item">
          <div class="result-body">
            <div class="result-header">
              <a class="canton-logo"></a>
              <h4 class="result-title">
                Bundesverwaltungsgericht, I. Abteilung, A-100/2011, Urteil vom 24.5.2011
              </h4>
              <a class="link-logo"></a>
            </div>
            <div class="text-preview">
              <p>Des Weiteren wurde erkannt, dass die örtlich beschlagnahmten Pflanzen in unterschiedlichen Wachstumsstadien
               und die örtlich beschlagnahmten Gegenstände sowie die von der Polizei beschlagnahmten <span class="keyword">Hanfpflanzen</span> und
               </p>
            </div>
          </div>
        </div>
        <div class="result-item">
          <div class="result-body">
            <div class="result-header">
              <a class="canton-logo"></a>
              <h4 class="result-title">
                Bundesverwaltungsgericht, I. Abteilung, A-100/2011, Urteil vom 24.5.2011
              </h4>
              <a class="link-logo"></a>
            </div>
            <div class="text-preview">
              <p>Des Weiteren wurde erkannt, dass die örtlich beschlagnahmten Pflanzen in unterschiedlichen Wachstumsstadien
               und die örtlich beschlagnahmten Gegenstände sowie die von der Polizei beschlagnahmten <span class="keyword">Hanfpflanzen</span> und
               </p>
            </div>
          </div>
        </div>
        <div class="result-item">
          <div class="result-body">
            <div class="result-header">
              <a class="canton-logo"></a>
              <h4 class="result-title">
                Bundesverwaltungsgericht, I. Abteilung, A-100/2011, Urteil vom 24.5.2011
              </h4>
              <a class="link-logo"></a>
            </div>
            <div class="text-preview">
              <p>Des Weiteren wurde erkannt, dass die örtlich beschlagnahmten Pflanzen in unterschiedlichen Wachstumsstadien
               und die örtlich beschlagnahmten Gegenstände sowie die von der Polizei beschlagnahmten <span class="keyword">Hanfpflanzen</span> und
               </p>
            </div>
          </div>
        </div>
        <div class="result-item">
          <div class="result-body">
            <div class="result-header">
              <a class="canton-logo"></a>
              <h4 class="result-title">
                Bundesverwaltungsgericht, I. Abteilung, A-100/2011, Urteil vom 24.5.2011
              </h4>
              <a class="link-logo"></a>
            </div>
            <div class="text-preview">
              <p>Des Weiteren wurde erkannt, dass die örtlich beschlagnahmten Pflanzen in unterschiedlichen Wachstumsstadien
               und die örtlich beschlagnahmten Gegenstände sowie die von der Polizei beschlagnahmten <span class="keyword">Hanfpflanzen</span> und
               </p>
            </div>
          </div>
        </div>
        <div class="result-item">
          <div class="result-body">
            <div class="result-header">
              <a class="canton-logo"></a>
              <h4 class="result-title">
                Bundesverwaltungsgericht, I. Abteilung, A-100/2011, Urteil vom 24.5.2011
              </h4>
              <a class="link-logo"></a>
            </div>
            <div class="text-preview">
              <p>Des Weiteren wurde erkannt, dass die örtlich beschlagnahmten Pflanzen in unterschiedlichen Wachstumsstadien
               und die örtlich beschlagnahmten Gegenstände sowie die von der Polizei beschlagnahmten <span class="keyword">Hanfpflanzen</span> und
               </p>
            </div>
          </div>
        </div>
        <div class="result-item">
          <div class="result-body">
            <div class="result-header">
              <a class="canton-logo"></a>
              <h4 class="result-title">
                Bundesverwaltungsgericht, I. Abteilung, A-100/2011, Urteil vom 24.5.2011
              </h4>
              <a class="link-logo"></a>
            </div>
            <div class="text-preview">
              <p>Des Weiteren wurde erkannt, dass die örtlich beschlagnahmten Pflanzen in unterschiedlichen Wachstumsstadien
               und die örtlich beschlagnahmten Gegenstände sowie die von der Polizei beschlagnahmten <span class="keyword">Hanfpflanzen</span> und
               </p>
            </div>
          </div>
        </div>
        <div class="result-item">
          <div class="result-body">
            <div class="result-header">
              <a class="canton-logo"></a>
              <h4 class="result-title">
                Bundesverwaltungsgericht, I. Abteilung, A-100/2011, Urteil vom 24.5.2011
              </h4>
              <a class="link-logo"></a>
            </div>
            <div class="text-preview">
              <p>Des Weiteren wurde erkannt, dass die örtlich beschlagnahmten Pflanzen in unterschiedlichen Wachstumsstadien
               und die örtlich beschlagnahmten Gegenstände sowie die von der Polizei beschlagnahmten <span class="keyword">Hanfpflanzen</span> und
               </p>
            </div>
          </div>
        </div>
        <div class="result-item">
          <div class="result-body">
            <div class="result-header">
              <a class="canton-logo"></a>
              <h4 class="result-title">
                Bundesverwaltungsgericht, I. Abteilung, A-100/2011, Urteil vom 24.5.2011
              </h4>
              <a class="link-logo"></a>
            </div>
            <div class="text-preview">
              <p>Des Weiteren wurde erkannt, dass die örtlich beschlagnahmten Pflanzen in unterschiedlichen Wachstumsstadien
               und die örtlich beschlagnahmten Gegenstände sowie die von der Polizei beschlagnahmten <span class="keyword">Hanfpflanzen</span> und
               </p>
            </div>
          </div>
        </div>
      </div>
      <div class="preview show">
        <div class="doc-info">
          <div class="doc-header">
            <a class="canton-logo"></a>
            <a class="link-logo"></a>
            <h4 class="result-title">
            Obergericht, Zivilkammern, 27 II 2018, Urteil vom 11.12.2018
            </h4>
            <b-icon class="maximize-logo" icon="arrows-fullscreen" aria-hidden="true"></b-icon>
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

      &.hidden{
        width:0;
        padding: 8px 0 8px 0;
      }

      .hide-wrapper{
        width:100%;
        padding:10px 0 20px 0;
        position:relative;
        display:flex;
        justify-content: center;

        #hide-filter{
          width:100%;
          height: 38px;
          overflow:hidden;
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
      max-width: calc(100vw - 300px);
      width:35%;
      float: left;
      border-right:2px solid #e5e9f1;
      overflow:scroll;
      overflow-x: hidden;
      box-sizing: border-box;
      padding: 0.5em;
      position: relative;

       .show-filter{
        display:flex;
        position: fixed;
        height:38px;
        width:26px;
        //border-radius:0 100% 100% 0;
        border-radius: 0 4px 4px 0;
        background-color: #6183ec;
        color:#fff;
        left:0;
        top: calc((100% - 38px) / 2);
        //top:128px; //Message beachten
        z-index:100;
        justify-content: center;
        align-items: center;
        transition: all .2s linear;
        opacity:0;

        &.visible{
          display:flex;
          opacity:1;
        }

        svg{
          font-size:20px;
        }
      }

      .result-item{
        border: 1px solid rgba(0, 0, 0, 0.125);
        border-radius: 4px;
        margin-bottom:10px;

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
        &.selected{
          background-color: rgba(97, 131, 236, 0.2);
        }
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
      &.show{
        display: block;
      }
      .doc-info{
        max-height: 104px;
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
          .link-logo{
            background: url('../assets/pdf.png') no-repeat center;
            background-size: contain;
            background-position: right top;
            height:43px;
            width:43px;
            margin-right:10px;
          }
          .maximize-logo{
            height:25px;
            width:25px;
            margin-left: 20px;
            cursor:pointer;
            transition: all .2s ease-in-out;
          }
          .maximize-logo:hover{
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
      //padding-right: 0.5em;
      height:calc(100% - 80px);
      width:100%;
    }
  }
}
//smartphone
@media (max-width: 534px){
  #searchResults{
    .flex-row{
      .filter{
        width:0;
        padding:8px 0 8px 0;
        border:0;
        &.hidden{
          width:100vw;
          padding: 8px 20px 8px 20px;
        }
      }
      .results{
        max-width: 100vw;
        width: 0;
        padding:10px 0  0  0;
        border:0;
        .show-filter{
          opacity:1;
          &.visible{
            opacity:0;
          }
        }
      }
      .preview{
        &.show{
          display:none;
        }
      }
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component({
  name: 'SearchResult'
})

export default class SearchResults extends Vue {
  private showFilter = true;

  data () {
    return {
      selected: [],
      options: [
        { text: 'DE', value: 'de' },
        { text: 'FR', value: 'fr' },
        { text: 'IT', value: 'it' }
      ]
    }
  }

  public onFilterClose (): void {
    if (this.showFilter === true) {
      this.showFilter = false
    } else {
      this.showFilter = true
    }
  }
}
</script>
