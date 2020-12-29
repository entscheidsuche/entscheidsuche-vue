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
          <div id="slider-wrapper">
            <p class="title">Jahr</p>
            <template v-if="this.showHistogram">
              <HistogramSlider
                :width="this.sliderWidth"
                :bar-height="100"
                :data="this.getDates()"
                :drag-interval="true"
                :force-edges="false"
                :colors="['#c8d4f8', '#6183ec']"
                :handleSize="16"
                :min="this.getFromDate()"
                :max="this.getToDate()"
                :primaryColor="'#6183ec'"
                :labelColor="'#6183ec'"
                :prettify="this.prettifyDate"
                :grid="false"
              />
            </template>
          </div>
        </div>
        <div class="languages">
          <b-form-group label="Sprache" class="title">
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
            <!--<ejs-treeview id='treeview' :fields="this.transformFacets()" :showCheckBox='true'></ejs-treeview>-->
             <div class="control_wrapper">
              <ejs-treeview id='treeview' :fields="fields" :nodeTemplate='Template'></ejs-treeview>
            </div>
          </b-form-group>
        </div>
      </div>
      <div v-bind:class="['results', this.fullScreen ? 'hidden' : '']" @scroll="handleScroll" id="results">
        <div v-bind:class="['button-wrapper', this.showMessage ? 'messageOffset' : '']">
          <div v-on:click="onToggleFilter()" v-bind:class="['show-filter', this.filterVisible ? '' : 'visible', this.fullScreen ? 'fullScreen' : '']">
            <b-icon icon="caret-right-fill" aria-hidden="true"></b-icon>
          </div>
        </div>
        <div v-for="(result, index) in results" :key="result.id" v-bind:class="['result-item', isSelected(result) ? 'selected' : '']" v-on:click="[onOpenPreview(), onSelectResult(result)]">
          <div class="result-body">
            <div class="result-header">
              <img :src="getImgUrl(result.canton)" class="canton-logo">
              <h4 class="result-title">{{ result.title }} vom {{ result.date }}</h4>
              <img v-bind:class="['link-logo', result.pdf ? 'pdf' : 'html']">
            </div>
            <div class="text-preview">
              <p v-html="result.text"/>
            </div>
            <div class="result-index">
              <p>Treffer {{ index + 1}} von {{ resultsTotal }}</p>
            </div>
          </div>
        </div>
        <div v-if="this.resultsPending" id="spinner-wrapper" class="d-flex justify-content-center mb-3">
          <b-spinner variant="primary" label="Loading..."></b-spinner>
        </div>
      </div>
      <div v-bind:class="['preview', this.previewVisible ? 'visible' : '', this.fullScreen ? 'fullScreen' : '']">
        <div class="preview-content" v-show="this.selectedResult">
        <div class="doc-info">
          <div class="doc-header">
            <div class="flex-row">
              <div v-if="selectedResult.canton != undefined">
                <img :src="getImgUrl(selectedResult.canton)" class="canton-logo">
              </div>
              <h4 v-if="this.windowWidth > 1024" class="result-title">{{ selectedResult.title }} vom {{ selectedResult.date }}</h4>
              <div class="controls-wrapper">
                <b-button variant="primary"  v-on:click="onFullScreen()" id="maximize-preview-btn">
                  <b-icon id="maximize-preview" icon="arrows-fullscreen"></b-icon>
                </b-button>
                <b-button variant="primary"  v-on:click="onFullScreen()" id="minimize-preview-btn">
                  <b-icon id="minimize-preview" icon="fullscreen-exit"></b-icon>
                </b-button>
                <b-button variant="primary" v-on:click="onClosePreview()" id="close-preview-btn">
                  <b-icon id="close-preview"></b-icon>
                </b-button>
              </div>
            </div>
            <h4 v-if="this.windowWidth <= 1024" class="result-title-mobile">{{ selectedResult.title }} vom {{ selectedResult.date }}</h4>
          </div>
        </div>
        <div class="outer-pdf" style="-webkit-overflow-scrolling: touch; overflow: auto;">
          <iframe v-if="this.windowWidth > 1024" frameborder="0"  class="desktop-pdf" scrolling="auto" :src="selectedResult.url + (this.fullScreen ? '' : '#view=FitH')" width="100%" height="100%" type='application/pdf' title="Title"></iframe>
          <iframe v-if="this.windowWidth <= 1024" class="mobile-pdf" scrolling="auto" :src="getMobileDocUrl(selectedResult.url)" width="100%" height="100%" type='application/pdf' title="Title"></iframe>
        </div>
      </div>
      </div>
    </div>
  <router-view/>
  </div>
</template>

<style lang="scss">
@import "../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-vue-navigations/styles/material.css";
@import "../../node_modules/@syncfusion/ej2-buttons/styles/material.css";

#searchResults {
  height: 100%;
  display:flex;
  overflow: hidden;
  margin: 0;
  text-align: left;
  padding-bottom:8px;

  .flex-row{
    display:flex;
    width:100%;

    .filter{
      width:340px;
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
      .year-range{
        padding: 0 0 16px 0;
        #slider-wrapper{
          margin-bottom:30px;
          .vue-histogram-slider-wrapper{
            margin-left:20px;
            .irs-handle{
              top: calc(50% - var(--handle-size)/2 + 13px);
            }
            .irs-from,.irs-to,.irs-single{
              top:56px;
            }
            .irs-from::before,.irs-to::before,.irs-single::before{
              transform: scaleY(-1);
              bottom:19px;
            }
          }
        }
      }
      .authority{
        .bv-no-focus-ring{
          #treeview{
            background-color:#fff;
            border:none;

            .e-list-text{
              padding:0;
              padding-left:5px;
              color: #2b2b2b;
              width: 235px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .e-list-item{
              padding:0;
            }
            .e-fullrow{
              background-color: #fff;
              border:none;
            }
            .e-icons{
              color:#adb5bd;
              &.e-check{
                background-color: #6183ec;
                border-color:#6183ec;
                color:#fff;
                background-image: url('../assets/check.svg');
                background-repeat:no-repeat;
                background-position: center;
                font-size: 0;
              }
            }
            .e-frame{
              height:16px;
              width:16px;
              border-radius: 4px;
              border: 1px solid #adb5bd;
            }
            .e-list-parent.e-ul{
              padding-left: 10px;
              overflow-y: hidden;
              overflow-x: hidden;
              .e-text-content.e-icon-wrapper{
                padding-left: 6px;
                .e-checkbox-wrapper{
                  margin-left:0;
                }
              }
            }
            .e-text-content{
              padding-left: 0;
              width: 250px;
            }
          }
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

      &.hidden{
        width:0;
        padding: 8px 0 8px 0;
        border:0;
        overflow:none;
      }
      .button-wrapper{
        position:absolute;
        width:26px;
        height:38px;
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
          display: flex;
          width:0;
          clip:rect(0px,26px,38px,0px);
          transition: all 0.2s linear;
          &.visible{
            width:26px;
          }
          &.fullScreen{
            display:none;
          }
          svg{
            flex-shrink: 0;
            font-size:20px;
          }
        }
      }
      .result-item:hover{
        background-color: #f6f8fa;
      }
      .result-item{
        border: 1px solid rgba(0, 0, 0, 0.125);
        border-radius: 4px;
        margin-bottom:10px;
        cursor: pointer;

        .result-body{
          padding:20px 20px 10px 20px;

          .result-header{
            width:100%;
            display:flex;
            justify-content: space-between;
            flex-direction: row;
            margin-bottom: 12px;

            .canton-logo{
              max-height:36px;
              width: auto;
              height: auto;
              margin-right:10px;
              flex-shrink: 0;
            }
            .link-logo{
              max-height:36px;
              width:auto;
              height: auto;
              margin-left:10px;

              &.pdf{
                content: url('../assets/pdf.png');
              }
              &.html{
                content: url('../assets/html.png');
              }
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
            em{
              font-style: italic;
              background-color: #FFFF00;
            }
            p{
              margin-bottom:0;
            }
          }
          .result-index{
            font-size: 12px;
            p{
              margin-bottom:0;
              color: #6183ec;
              text-align: right;
            }
          }
        }
        &.selected{
          background-color: rgba(97, 131, 236, 0.2);
          border-color: rgba(97, 131, 236, 0.2);
        }
      }
    }
    .preview{
      min-width:0;
      width:0;
      float: left;
      overflow: auto;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: hidden;
      flex-grow:0;
      transition: width 0 linear;

      .preview-content{
        height:100%;
        width:auto;
        .doc-info{
          width:100%;
          padding:15px 11px 15px 11px;
          border: 1px solid rgba(0, 0, 0, 0.125);
          border-radius: 4px;
          margin-bottom: 0.5em;
          position:relative;

          .doc-header{
            width:100%;
            height:100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .flex-row{
              width:100%;
              display: flex;
              justify-content: space-between;
              flex-direction: row;

              .canton-logo{
                max-height:36px;
                width: auto;
                height: auto;
                margin-right:10px;
                flex-shrink: 0;
              }
              .controls-wrapper{
                width:70px;
                height:30px;
                margin-left: 20px;
                position:relative;
                flex-shrink:0;

                #close-preview-btn{
                  height:30px;
                  width:30px;
                  position:absolute;
                  top:0;
                  right:0;
                  #close-preview{
                    background: url('../assets/bootstrap-close-big-white.svg') no-repeat center;
                    height:28px;
                    width:28px;
                    position:absolute;
                    top:0;
                    left:0;
                  }
                }
                #maximize-preview-btn{
                  height:30px;
                  width:30px;
                  #maximize-preview{
                    height:22px;
                    width:22px;
                    position:absolute;
                    top:4px;
                    left:4px;
                  }
                }
                #minimize-preview-btn{
                  height:30px;
                  width:30px;
                  display:none;
                  position: absolute;
                  right:0;
                  #minimize-preview{
                    height:22px;
                    width:22px;
                    position:absolute;
                    top:3px;
                    left:3px;
                  }
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
            .result-title-mobile{
              margin-top: 0;
              text-align: left;
              width:100%;
              margin-bottom: 0;
              word-break: break-all;
              display:none;
            }
          }
        }
      }
      &.visible{
        width:35%;
        padding:0.5em;
        flex-grow:2;
      }
      &.fullScreen{
        display: block;
        width:100vw;

        .preview-content{
          .doc-info{
            .doc-header{
              .flex-row{
                .controls-wrapper{
                  #minimize-preview-btn{
                    display:block;
                    float:right;
                  }
                  #maximize-preview-btn{
                    display:none;
                  }
                  #close-preview-btn{
                    display:none;
                  }
                }
              }
            }
          }
        }
      }
    }
    .outer-pdf{
      bottom:0;
      height:calc(100% - 75px);
      width:100%;
      overflow-x: hidden;

      .desktop-pdf {
        display: block;
      }
      .mobile-pdf {
        display: block;
      }
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
        .preview-content{
          .doc-info{
            .doc-header{
              .flex-row{
                padding-bottom: 10px;
                .canton-logo{
                  max-height:30px;
                  width: auto;
                  height: auto;
                  margin-top:0;
                }
                .result-title{
                  display: none;
                }
              }
              .result-title-mobile{
                font-size: 16px;
                display:block;
              }
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
    width: 100vw;
    .flex-row{
      .filter{
        width:100vw;
        flex-shrink: 0;
        padding: 8px 20px 8px 20px;
        &.hidden{
          padding:8px 0 8px 0;
          border:0;
          width:0;
        }
        .year-range{
          #slider-wrapper{
            .vue-histogram-slider-wrapper{
              margin-left:24px;
            }
          }
        }
        .authority{
          .bv-no-focus-ring{
            #treeview{
              .e-list-text{
                width:calc(150%);
              }
            }
          }
        }
      }
      .results{
        width:100vw;
        min-width: 0;
        padding:8px 0  0  0;
        border:0;
        padding-left: 20px;
        padding-right: 20px;
        .show-filter{
          &.visible{
          top: calc((100vh - 38px) / 2);
          }
        }
      }
      .preview{
        .preview-content{
          padding-left:0;
          padding-right:0;
        }
      }
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { AppModule, MessageState } from '@/store/modules/app'
import { Aggregations, SearchModule, SearchResult, Facets, Facet } from '@/store/modules/search'
import HistogramSlider from 'vue-histogram-slider'
import 'vue-histogram-slider/dist/histogram-slider.css'
import { TreeViewPlugin } from '@syncfusion/ej2-vue-navigations'
import { TreeModel } from '@/util/treeModel'
import { mount } from '@vue/test-utils'

Vue.component(HistogramSlider.name, HistogramSlider)
Vue.use(TreeViewPlugin)

@Component({
  name: 'SearchResult'
})

export default class SearchResults extends Vue {
  private filterVisible = true;
  private fullScreen = false;
  private windowWidth = 0;
  private previewVisible = false;
  private sliderWidth = 1;
  private showHistogram = true;

  data () {
    const demoVue = Vue.component('demo', {
      template: "<div><div class='ename'>{{ data.name }}</div><div class='ejob'>{{ data.job }}</div></div>"
    })
    const dataSource = [
      { id: 1, name: 'Steven Buchanan', eimg: 'https://ej2.syncfusion.com/demos/src/treeview/images/employees/10.png', job: 'CEO', hasChild: true, expanded: true },
      { id: 2, pid: 1, name: 'Laura Callahan', eimg: 'https://ej2.syncfusion.com/demos/src/treeview/images/employees/2.png', job: 'Product Manager', hasChild: false },
      { id: 3, pid: 1, name: 'Andrew Fuller', eimg: 'https://ej2.syncfusion.com/demos/src/treeview/images/employees/7.png', job: 'Team Lead', hasChild: false }
    ]
    return {
      fields: { dataSource: dataSource, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild' },
      Template: function (e) {
        return {
          template: demoVue
        }
      },
      selected: [],
      options: [
        { text: 'DE', value: 'de' },
        { text: 'FR', value: 'fr' },
        { text: 'IT', value: 'it' }
      ],
      prettify: function (ts) {
        return new Date(ts).toLocaleDateString('de', {
          year: 'numeric'
        })
      }
    }
  }

  get results () {
    return SearchModule.searchResults
  }

  get selectedResult () {
    return SearchModule.selectedResult
  }

  get resultsPending () {
    return SearchModule.resultsPending
  }

  get resultsTotal () {
    return SearchModule.searchTotal
  }

  get aggregations () {
    return SearchModule.aggregations
  }

  get facets () {
    return SearchModule.facets
  }

  get locale () {
    return AppModule.locale
  }

  @Watch('selectedResult')
  public onSelectedResultChanged (selectedResult: SearchResult) {
    if (!('id' in selectedResult)) {
      this.previewVisible = false
      this.fullScreen = false
    }
  }

  created () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    this.getFilterInnerWidth()
  }

  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize () {
    this.getFilterInnerWidth()
    this.windowWidth = window.innerWidth
    if (this.windowWidth <= 1024) {
      this.filterVisible = false
    } else {
      this.filterVisible = true
    }
  }

  handleScroll () {
    const searchResultsDiv = document.getElementById('results')!
    if (!SearchModule.allResultsLoaded) {
      if (searchResultsDiv.scrollTop + searchResultsDiv.clientHeight >= searchResultsDiv.scrollHeight) {
        this.getMoreResults()
      }
    }
  }

  public onToggleFilter (): void {
    if (this.filterVisible === true) {
      this.filterVisible = false
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
      if (this.windowWidth > 534) {
        this.previewVisible = true
      }
    }
  }

  public getImgUrl (canton: string) {
    return require('../assets/cantons/' + canton + '.png')
  }

  public onSelectResult (result: SearchResult): void {
    SearchModule.Select(result)
  }

  public isSelected (result: SearchResult): boolean {
    return SearchModule.selectedResult === result
  }

  public getMobileDocUrl (url: string) {
    return 'https://drive.google.com/viewerng/viewer?embedded=true&url=' + url
  }

  public getMoreResults () {
    SearchModule.SetMoreResults()
  }

  public getFilterInnerWidth () {
    if (this.windowWidth > 1024) {
      this.sliderWidth = 258 - 16
    } else if (this.windowWidth > 534) {
      this.sliderWidth = 258
    } else {
      this.sliderWidth = (this.windowWidth - 90)
    }
  }

  @Watch('aggregations')
  public onAggregationsChange (aggs: Aggregations) {
    this.showHistogram = false
    this.$nextTick(() => { this.showHistogram = true })
  }

  public getDates () {
    const edatum = SearchModule.aggregations.edatum || []
    const datesArray: Date[] = []
    for (const agg of edatum) {
      const date = new Date(agg.key)
      for (let i = 0; i < agg.count; i++) {
        datesArray.push(date)
      }
    }
    console.log('calling getDates()')
    return datesArray
  }

  public getFromDate () {
    const edatum = SearchModule.aggregations.edatum || []
    if (edatum.length > 0) {
      return edatum[0].key
    }
  }

  public getToDate () {
    const edatum = SearchModule.aggregations.edatum || []
    if (edatum.length > 0) {
      return (edatum[edatum.length - 1].key as number) + (1000 * 60 * 60 * 24 * 30 * 3)
    }
  }

  public prettifyDate (date: Date | number): string {
    // eslint-disable-next-line use-isnan
    if (date !== NaN && date instanceof Date) {
      return date.getFullYear().toString() + '/Q' + Math.ceil((date.getMonth() + 1) / 3).toString()
    } else if (typeof date === 'number' && !isNaN(date)) {
      return new Date(date).getFullYear().toString() + '/Q' + Math.ceil((new Date(date).getMonth() + 1) / 3).toString()
    }
    return '2020'
  }

  public transformFacets () {
    window.console.log('transformFacets')
    const facetsTree: Array<TreeModel> = []
    const locale = this.locale
    const facets: Array<Facet> = this.facets
    facets.forEach((facet: Facet) => {
      if (facet.children !== undefined) {
        if (facet.children.length > 0) {
          facetsTree.push({ id: facet.id, name: facet.label[locale], hasChildren: true, count: 123 })
          // push children
          facet.children.forEach((child: Facet) => {
            facetsTree.push(this.getChildEntry(child, locale, facet.id))
            if (child.children !== undefined) {
              if (child.children.length > 0) {
                // push grandchildren
                child.children.forEach((grandchild: Facet) => {
                  facetsTree.push(this.getChildEntry(grandchild, locale, child.id))
                })
              }
            }
          })
        }
      } else {
        facetsTree.push({ id: facet.id, name: facet.label[locale], hasChildren: false, count: 123 })
      }
    })
    window.console.log(facetsTree)
    return { dataSource: facetsTree, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChildren' }
  }

  public getChildEntry (facet: Facet, locale: string, parentID: string) {
    if (facet.children !== undefined) {
      if (facet.children.length > 0) {
        return ({ id: facet.id, pid: parentID, name: facet.label[locale], hasChildren: true, count: 123 })
      }
    }
    return ({ id: facet.id, pid: parentID, name: facet.label[locale], hasChildren: false, count: 123 })
  }
}
</script>
