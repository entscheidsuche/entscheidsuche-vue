<template>
  <div id="searchResults">
    <div class="flex-row">
      <div v-bind:class="['filter', this.filterVisible ? '' : 'hidden', this.fullScreen ? 'hidden' : '']">
        <div v-bind:class="['button-wrapper', this.showMessage ? 'messageOffset' : '']">
          <div v-on:click="onToggleFilter()" class="hide-filter">
            <b-icon icon="caret-left-fill" aria-hidden="true"></b-icon>
          </div>
        </div>
        <div class="total-hits">
          <div class="title-wrapper">
            <p class="title">Trefferanzahl: {{ resultsTotal }}</p>
          </div>
          <b-button v-on:click="undoFilter()" v-bind:class="['undoFilter', this.allowUndoFilter ? '' : 'disabled']" block variant="outline-primary" size="sm">
            Alle Filter zurücksetzen
          </b-button>
        </div>
        <div class="sort">
          <div class="title-wrapper">
            <p class="title">Sortieren nach:</p>
          </div>
          <b-form-group v-slot="{ ariaDescribedby }">
            <b-form-radio-group v-model="selectedRadio" stacked>
            <b-form-radio :aria-describedby="ariaDescribedby" value="relevance">Relevanz</b-form-radio>
            <b-form-radio :aria-describedby="ariaDescribedby" value="date">Datum</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </div>
        <div class="year-range">
          <div id="slider-wrapper">
            <div v-bind:class="['title-wrapper', this.dateFilterEmpty() ? '' : 'active']" v-on:click="undoDateFilter()">
              <p class="title">Jahr</p>
              <b-icon class="undo-filter" icon="x"></b-icon>
            </div>
            <template v-if="this.showHistogram">
              <DateFilter
                :sliderWidth="sliderWidth"
                @value-changed="onDateRangeChanged"/>
            </template>
          </div>
        </div>
        <div class="languages">
          <div class="title-wrapper">
            <p class="title">Sprache</p>
          </div>
          <b-form-group>
            <b-form-checkbox
              v-for="option in myOptions"
              v-model="selected"
              :key="option.value"
              :value="option.value"
              name="flavour-3a">
              <span>{{ option.text }}</span>
              <span class="language-count">(1)</span>
            </b-form-checkbox>
          </b-form-group>
        </div>
        <div class="authority">
          <div v-bind:class="['title-wrapper', this.hierarchieFilterEmpty() ? '' : 'active']" v-on:click="undoHierarchieFilter()">
            <div class="row-wrapper">
              <p class="title">Verfasser</p>
              <b-icon class="undo-filter" icon="x"></b-icon>
            </div>
          </div>
          <b-form-group>
            <treeselect v-model="hierarchieValues"  placeholder="Filtern" id="tree" openDirection="below"
              :multiple="true"
              :options="this.transformFacets()"
              :always-open="true"
              :show-count="true"
              :maxHeight="this.authorityHeight"
              :clearable="false">
              @input="onHierarchieChanged"
              <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName}" v-bind:class="[labelClassName, node.raw.count === 0 ? 'empty' : '']">
                <div class="text-wrapper">
                  <span>{{ node.label }}</span>
                </div>
                <span :class="countClassName">({{ node.raw.count }})</span>
              </label>
            </treeselect>
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

      .title-wrapper{
        border-radius: 4px;
        display: inline-block;
        margin-bottom: 7px;
        .title{
          color:#212529;
          display: inline;
          padding-left:4px;
          padding-right:4px;
        }
        .undo-filter{
          display:none;
        }
        &.active{
          background-color: #6183ec;
          .title{
            color:#fff;
          }
          .undo-filter{
            display:inline;
            border-left:1px solid #fff;
            color:#fff;
            font-size:20px;
            position: relative;
            top:2px;
          }
        }
        &.active:hover{
          background-color: #3f68e8;
        }
      }

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
          z-index:1000;
          justify-content: center;
          align-items: center;
          cursor:pointer;

          svg{
            font-size:20px;
          }
        }
      }
      .total-hits{
        margin-bottom:16px;
        .title{
          margin-bottom:7px;
        }
        .undoFilter{
          &.disabled{
            cursor:default;
            pointer-events:none;
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
      .languages{
        .custom-control-label{
          display:flex;
          justify-content:space-between;
          .language-count{
            opacity: 0.6;
          }
        }
      }
      .authority{
        #tree{
          font-size: 16px;
          font-weight:normal;

          .vue-treeselect__multi-value-item{
            color:#fff;
            background-color: #6183ec;
            border-radius: 4px;
            .vue-treeselect__multi-value-label{
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              max-width: 110px;
              padding-right:0;
            }
            .vue-treeselect__icon{
              color:#fff;
              border-left-color:#fff;
            }
          }
          .vue-treeselect__multi-value-item:hover{
            background-color:#3f68e8;
          }
          .vue-treeselect__checkbox{
            width:16px;
            height:16px;
            border-radius:4px;
            border: 1px solid #adb5bd;

            .vue-treeselect__check-mark{
              position:relative;
              top:3px;
              left:3px;
            }
            .vue-treeselect__minus-mark{
              position:relative;
              top:-5px;
              left:3px;
            }
            &.vue-treeselect__checkbox--checked,&.vue-treeselect__checkbox--indeterminate{
              background-color: #6183ec;
              border-color: #6183ec;
            }
          }
          .vue-treeselect__label{
            display: flex;
            justify-content: space-between;
            margin-bottom: 0;
            &.empty{
              color:#bdbdbd
            }
            .text-wrapper{
              flex-shrink: 1;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
              .vue-treeselect__count{
                flex-shrink: 0;
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
          z-index:999;
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
import { Aggregations, SearchModule, SearchResult, Facet, Aggregation, Filters, Filter } from '@/store/modules/search'
import HistogramSlider from 'vue-histogram-slider'
import 'vue-histogram-slider/dist/histogram-slider.css'
import { TreeModel } from '@/util/treeModel'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import DateFilter from '@/components/DateFilter.vue'

Vue.component(HistogramSlider.name, HistogramSlider)
Vue.component('treeselect', Treeselect)

@Component({
  name: 'SearchResult',
  components: {
    DateFilter
  }
})

export default class SearchResults extends Vue {
  private filterVisible = true
  private fullScreen = false
  private windowWidth = 0
  private previewVisible = false
  private sliderWidth = 1
  private showHistogram = true
  private authorityHeight = 300
  private allowUndoFilter = false
  private dateRange: { from: number; to: number } | undefined

  data () {
    return {
      hierarchieValues: [],
      selected: [],
      selectedRadio: 'relevance',
      myOptions: [
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

  get filter () {
    return SearchModule.filters
  }

  @Watch('selectedResult')
  public onSelectedResultChanged (selectedResult: SearchResult) {
    if (!('id' in selectedResult)) {
      this.previewVisible = false
      this.fullScreen = false
    }
  }

  @Watch('hierarchieValues')
  public onHierarchieValuesChanged (values: Array<string>) {
    if (values.length > 0) {
      SearchModule.AddFilter({ type: 'hierarchie', payload: values })
    } else {
      SearchModule.RemoveFilter('hierarchie')
    }
  }

  @Watch('filter')
  public onFilterChanged (filters: Filters) {
    if (!Object.prototype.hasOwnProperty.call(filters, 'edatum') && this.dateRange !== undefined) {
      this.showHistogram = false
      this.$nextTick(() => { this.showHistogram = true })
    }
    if (Object.keys(filters).length > 0) {
      this.allowUndoFilter = true
    } else {
      this.allowUndoFilter = false
    }
  }

  created () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    this.getFilterInnerWidth()
    this.getAuthorityHeight()
  }

  mounted () {
    if (Object.keys(this.filter).length > 0) {
      this.allowUndoFilter = true
    } else {
      this.allowUndoFilter = false
    }
  }

  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize () {
    this.getFilterInnerWidth()
    this.getAuthorityHeight()
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

  public getAuthorityHeight () {
    if (this.windowWidth > 1024) {
      if (this.showMessage) {
        this.authorityHeight = window.innerHeight - 514
      } else {
        this.authorityHeight = window.innerHeight - 474
      }
    } else {
      if (this.showMessage) {
        this.authorityHeight = window.innerHeight - 564
      } else {
        this.authorityHeight = window.innerHeight - 524
      }
    }
  }

  @Watch('aggregations.edatum')
  public onAggregationsChange (aggs: Array<Aggregation>, oldAggs: Array<Aggregation>) {
    if (aggs === oldAggs) {
      return
    }
    this.showHistogram = false
    this.$nextTick(() => { this.showHistogram = true })
  }

  public onDateRangeChanged (value: { from: number; to: number }) {
    this.dateRange = value
  }

  public transformFacets () {
    const tree: Array<TreeModel> = []
    const locale = this.locale
    const facets: Array<Facet> = this.facets
    const hierarchie = SearchModule.aggregations.hierarchie || []
    const hierarchieDict: { [key: string]: number } = {}
    for (const aggregation of hierarchie) {
      hierarchieDict[aggregation.key] = aggregation.count
    }
    const lookupCount = function (id: string) {
      if (hierarchieDict[id] !== undefined) {
        return hierarchieDict[id]
      }
      return 0
    }
    const isDisabled = function (id: string) {
      // return lookupCount(id) === 0
      return false
    }
    facets.forEach((facet: Facet) => {
      if (facet.children !== null && facet.children !== undefined) {
        if (facet.children.length > 0) {
          const childrenArray: Array<TreeModel> = []
          facet.children.forEach((child: Facet) => {
            if (child.children !== null && child.children !== undefined) {
              if (child.children.length > 0) {
                const grandChildrenArray: Array<TreeModel> = []
                child.children.forEach((grandChild: Facet) => {
                  grandChildrenArray.push({ id: grandChild.id, label: grandChild.label[locale], count: lookupCount(grandChild.id), isDisabled: isDisabled(grandChild.id) })
                })
                childrenArray.push({ id: child.id, label: child.label[locale], children: grandChildrenArray, count: lookupCount(child.id), isDisabled: isDisabled(child.id) })
              }
            } else {
              childrenArray.push({ id: child.id, label: child.label[locale], count: lookupCount(child.id), isDisabled: isDisabled(child.id) })
            }
          })
          tree.push({ id: facet.id, label: facet.label[locale], children: childrenArray, count: lookupCount(facet.id), isDisabled: isDisabled(facet.id) })
        }
      } else {
        tree.push({ id: facet.id, label: facet.label[locale], count: lookupCount(facet.id), isDisabled: isDisabled(facet.id) })
      }
    })
    return tree
  }

  public undoFilter () {
    SearchModule.SetFilters([])
  }

  public undoDateFilter () {
    // TODO
  }

  public undoHierarchieFilter () {
    // TODO
  }

  public dateFilterEmpty () {
    return !(Object.keys(this.filter).includes('edatum'))
  }

  public hierarchieFilterEmpty () {
    return !(Object.keys(this.filter).includes('hierarchie'))
  }
}
</script>
