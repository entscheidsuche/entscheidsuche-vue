<template>
  <div id="searchResults">
    <div class="flex-row">
      <div class="filter">
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
              name="flavour-3a"
            >
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
        <div class="result-item">
          <div class="result-body">
            <div class="result-header">
              <a class="canton-logo"></a>
              <h3 class="result-title">
                Obergericht, Zivilkammern, 27 II 2018, Urteil vom 11.12.2018
              </h3>
              <a class="link-logo"></a>
            </div>
            <div class="text-preview">
              Des Weiteren wurde erkannt, dass die örtlich beschlagnahmten Pflanzen in unterschiedlichen Wachstumsstadien
               und die örtlich beschlagnahmten Gegenstände sowie die von der Polizei beschlagnahmten <span class="keyword">Hanfpflanzen</span> und
               Unterlagen als auch die beschlagnahmten Schlüssel für die Räumlichkeiten an der V.strasse und an der
               G.strasse nach Rechtskraft des Urteils unter
            </div>
          </div>
        </div>
      </div>
      <div class="preview">
        <div class="doc-title">Preview
        </div>
      </div>
    </div>
  <router-view/>
  </div>
</template>

<style lang="scss">
#searchResults {
  padding-top: 110px!important; //-30px if optional bar not visible
  //padding-bottom: 80px; //footer
  min-height: 100%;
  overflow: hidden;
  margin: 0;
  text-align: left;

  .flex-row{
    display:flex;
    margin-left:20px;
    margin-right:20px;
    height:100%;

    .filter{
      width:260px;
      float: left;
      border-right:2px solid #e5e9f1;
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
      padding: 0.5em;
      padding-right:20px;
      //padding-left: 0;

      .title{
        font-weight: bold
      }
      .custom-control{
        font-weight:normal;
      }
      .authority{
        .first{
          border:none;
          box-shadow: none;
          outline:none;
        }
        .second{
          padding-left:20px;
          border:none;
          box-shadow: none;
          outline:none;
        }
        .third{
          padding-left:40px;
          border:none;
          box-shadow: none;
          outline:none;
        }
      }
    }
    .results{
      flex-grow:2;
      max-width:35%;
      float: left;
      border-right:2px solid #e5e9f1;
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
      padding: 0.5em;

      .result-item{
        border: 1px solid rgba(0, 0, 0, 0.125);
        border-radius: 4px;

        .result-body{
          padding:20px;

          .result-header{
            display:flex;
            justify-content: space-between;
            flex-direction: row;
/*
            .canton-logo{
              background: url('../assets/cantons/AR.png') no-repeat center;
              background-size: 40px;
              height:52px;
              width:52px;
              margin-right:15px;
            }
            .link-logo{
              background: url('../assets/pdf.png') no-repeat center;
              background-size: 40px;
              height:52px;
              width:52px;
              margin-left:15px;
            }
*/
          }
          .text-preview{
            .keyword{
              font-style: italic;
              background-color: #FFFF00;
            }
          }
        }
      }
    }
    .preview{
      flex-grow:2;
      max-width:35%;
      float: left;
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
      padding: 0.5em;
    }
  }
}
//tablet
@media (max-width: 1024px){
  #searchResults {
    padding-top: 160px!important;
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
  data () {
    return {
      selected: [], // Must be an array reference!
      options: [
        { text: 'Deutsch', value: 'de' },
        { text: 'Französisch', value: 'fr' },
        { text: 'Italienisch', value: 'it' }
      ]
    }
  }
}
</script>
