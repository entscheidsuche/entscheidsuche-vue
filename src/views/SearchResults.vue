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
            <p class="title">{{ $t('allHits') }}: {{ resultsTotal }}</p>
          </div>
          <div class="undo-all" v-if="this.allowUndoFilter" v-on:click="undoFilter()">
            <div v-bind:class="['title-wrapper', this.allowUndoFilter ? 'active' : '']" v-on:click="undoFilter()">
              <p class="title">{{ $t('allFilter') }}</p>
              <b-icon class="undo-filter" icon="x"></b-icon>
            </div>
          </div>
        </div>
        <div class="sort">
          <div class="title-wrapper">
            <p class="title">{{ $t('sort') }}:</p>
          </div>
          <SortOrderSelector/>
        </div>
        <div class="year-range">
          <div id="slider-wrapper">
            <div v-bind:class="['title-wrapper', this.dateFilterEmpty() ? '' : 'active']" v-on:click="undoDateFilter()">
              <p class="title">{{ $t('year') }}</p>
              <b-icon class="undo-filter" icon="x"></b-icon>
            </div>
            <DateFilter :sliderWidth="sliderWidth"/>
          </div>
        </div>
        <div class="languages">
          <div v-bind:class="['title-wrapper', this.languageFilterEmpty() ? '' : 'active']" v-on:click="undoLanguageFilter()">
            <p class="title">{{ $t('language') }}</p>
            <b-icon class="undo-filter" icon="x"></b-icon>
          </div>
          <LanguageFilter/>
        </div>
        <div class="authority">
          <div v-bind:class="['title-wrapper', this.hierarchieFilterEmpty() ? '' : 'active']" v-on:click="undoHierarchieFilter()">
            <div class="row-wrapper">
              <p class="title">{{ $t('authority') }}</p>
              <b-icon class="undo-filter" icon="x"></b-icon>
            </div>
          </div>
         <HierarchieFilter/>
        </div>
      </div>
      <div v-bind:class="['results', this.fullScreen ? 'hidden' : '']" @scroll="handleScroll" id="results">
        <div v-bind:class="['button-wrapper', this.showMessage ? 'messageOffset' : '']">
          <div v-on:click="onToggleFilter()" v-bind:class="['show-filter', this.filterVisible ? '' : 'visible', this.fullScreen ? 'fullScreen' : '']">
            <b-icon icon="caret-right-fill" aria-hidden="true"></b-icon>
          </div>
        </div>
        <div v-if="!pristine && results.length === 0" class="no-results">
          <h3 class="hint">Ihre Suche nach "{{ query }}" ergab leider keine Treffer</h3>
        </div>
        <div v-for="(result, index) in results" :key="result.id" v-bind:class="['result-item', isSelected(result) ? 'selected' : '']" v-on:click="[onOpenPreview(), onSelectResult(result)]">
          <div class="result-body">
            <div class="result-header">
              <img :src="getImgUrl(result.canton)" class="canton-logo">
              <h4 class="result-title" v-html="result.title"/>
              <img v-if="result.pdf" src="../assets/pdf.png" class="link-logo">
              <img v-else src="../assets/html.png" class="link-logo">
            </div>
            <div class="abstract" v-if="result.abstract.length > 0">
              <div class="first-row">
                <div v-on:click.stop="onToggleAbstract(result.id)" v-bind:class="['show-more']" v-bind:id="('button-' + result.id)" style="border:none;outline:none;box-shadow:none;">
                  <b-icon icon="caret-right-fill" aria-hidden="true"></b-icon>
                </div>
                <p class="card-text" v-html="result.abstract" v-bind:id="result.id"/>
              </div>
            </div>
            <div class="text-preview">
              <p v-html="result.text"/>
            </div>
            <div class="result-index">
              <p>{{ $t('hit') }} {{ index + 1}} {{ $t('of') }} {{ resultsTotal }}</p>
            </div>
          </div>
        </div>
        <div v-if="this.resultsPending" id="spinner-wrapper" class="d-flex justify-content-center mb-3">
          <b-spinner variant="primary" label="Loading..."></b-spinner>
        </div>
      </div>
      <div v-if="this.previewVisible" v-bind:class="['preview', this.previewVisible ? 'visible' : '', this.fullScreen ? 'fullScreen' : '']">
        <div class="preview-content" v-show="this.selectedResult">
          <div class="doc-info">
            <div class="doc-header">
              <div class="flex-row">
                <div v-if="selectedResult.canton !== undefined">
                  <img :src="getImgUrl(selectedResult.canton)" class="canton-logo">
                </div>
                <h4 v-if="this.windowWidth > 1024" class="result-title" v-html="selectedResult.title"/>
                <div class="controls-wrapper">
                  <b-button variant="primary"  v-on:click="onFullScreen()" id="maximize-preview-btn">
                    <b-icon id="maximize-preview" icon="arrows-fullscreen"></b-icon>
                  </b-button>
                  <b-button variant="primary"  v-on:click="onNewTab()" id="separate-preview-btn">
                    <b-icon id="separate-preview" icon="folder-plus"></b-icon>
                  </b-button>
                  <b-button variant="primary"  v-on:click="onFullScreen()" id="minimize-preview-btn">
                    <b-icon id="minimize-preview" icon="fullscreen-exit"></b-icon>
                  </b-button>
                  <b-button variant="primary" v-on:click="onClosePreview()" id="close-preview-btn">
                    <b-icon id="close-preview"></b-icon>
                  </b-button>
                </div>
              </div>
              <h4 v-if="this.windowWidth <= 1024" class="result-title-mobile" v-html="selectedResult.title"/>
            </div>
            <div class="abstract" v-if="selectedResult.abstract !== undefined && selectedResult.abstract.length > 0">
              <div class="first-row">
                <div v-on:click.stop="onToggleAbstract((selectedResult.id + '-preview'))" v-bind:class="['show-more']" v-bind:id="('button-' + selectedResult.id + '-preview')" style="border:none;outline:none;box-shadow:none;">
                  <b-icon icon="caret-right-fill" aria-hidden="true"></b-icon>
                </div>
                <p class="card-text" v-html="selectedResult.abstract" v-bind:id="(selectedResult.id + '-preview')"/>
              </div>
            </div>
          </div>
          <div id="outer-pdf" style="-webkit-overflow-scrolling: touch; overflow: auto;">
            <iframe v-if="this.windowWidth > 1024" frameborder="0" id="result-iframe" class="desktop-pdf" scrolling="auto" :src="this.iframeUrl" width="100%" height="100%" :type="selectedResult.pdf ? 'application/pdf' : 'text/html'" title="Title"></iframe>
            <iframe v-if="this.windowWidth <= 1024" class="mobile-pdf" id="mobile-result-iframe" scrolling="auto" :src="selectedResult.pdf ? getMobileDocUrl(selectedResult.url) : selectedResult.url" width="100%" height="100%" :type="selectedResult.pdf ? 'application/pdf' : 'text/html'" title="Title"></iframe>
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
          cursor:pointer;
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
        width:20px;
        top:calc(((100vh - 38px) / 2) - 70px );
        right:0;

        &.messageOffset{
          top: calc(((100vh - 38px) / 2) - 110px );
        }

        .hide-filter{
          display:flex;
          position: fixed;
          height:38px;
          width:20px;
          border-radius: 4px 0 0 4px;
          background-color: #6183ec;
          color:#fff;
          z-index:999;
          justify-content: center;
          align-items: center;
          cursor:pointer;

          svg{
            font-size:20px;
          }
        }
        .hide-filter:hover{
          background-color: #3f68e8;
        }
      }
      .button-wrapper:hover{
        width:26px;
        .hide-filter{
          width:26px;
        }
      }

      .total-hits{
        margin-bottom:2px;
        .title{
          margin-bottom:7px;
        }
        .undo-all{
          display:inline;
          float:right;
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
        width:20px;
        height:38px;
        left:0;
        top: calc(((100vh - 38px) / 2) - 70px );

        &.messageOffset{
          top: calc(((100vh - 38px) / 2) - 110px );
        }
        .show-filter{
          position: fixed;
          height:38px;
          width:0px;
          border-radius: 0 4px 4px 0;
          background-color: #6183ec;
          color:#fff;
          z-index:998;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          display: flex;
          width:0;
          clip:rect(0px,26px,38px,0px);
          transition: all 0.2s linear;
          svg{
            flex-shrink: 0;
            font-size:20px;
          }
          &.visible{
            width:20px;
          }
          &.fullScreen{
            display:none;
          }
        }
        .show-filter.visible:hover{
          background-color: #3f68e8;
          width:26px;
        }
      }
      .no-results{
        //height:auto;
        //margin-top:50px;
        display:flex;
        justify-content:center;
        align-items: center;

        .hint{
          height:auto;
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
            }
            .result-title{
              font-size: 16px;
              margin-top: 0;
              text-align: left;
              width:100%;
              margin-bottom: 0;
              word-break: break-all;
              em{
                font-style: italic;
                background-color: #FFFF00;
              }
            }
          }
          .abstract{
            font-size:14px;
            font-weight: bold;
            em{
              font-style: italic;
              background-color: #FFFF00;
            }
            .first-row{
              display:flex;

              .card-text{
                flex-shrink: 1;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
              }
              .show-more{
                display: flex;
                justify-content: center;
                align-items: center;
                flex-shrink: 0;
                height:21px;
                width:21px;
                margin-right: 14px;
                background-color: transparent;
                margin-left:4px;

                svg{
                  font-size:14px;
                }

                &.hidden {
                  svg{
                    display:none;
                  }
                }
              }
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
              margin-bottom:10px;

              .canton-logo{
                max-height:36px;
                width: auto;
                height: auto;
                margin-right:10px;
                flex-shrink: 0;
              }
              .controls-wrapper{
                width:100px;
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
                #separate-preview-btn{
                  height:30px;
                  width:30px;
                  margin-left: 5px;
                  #separate-preview{
                    height:22px;
                    width:22px;
                    position:relative;
                    top:-1px;
                    left:-8px;
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
          .abstract{
            font-size:14px;
            font-weight: bold;
            .first-row{
              display:flex;

              .card-text{
                flex-shrink: 1;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
              }
              .show-more{
                display: flex;
                justify-content: center;
                align-items: center;
                flex-shrink: 0;
                height:21px;
                width:21px;
                margin-right: 14px;
                background-color: transparent;
                margin-left:4px;

                svg{
                  font-size:14px;
                }

                &.hidden {
                  svg{
                    display:none;
                  }
                }
              }
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
                  #separate-preview-btn{
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
    #outer-pdf{
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
                margin-bottom: 10px;
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
import { Filters, FilterType, SearchModule, SearchResult } from '@/store/modules/search'
import DateFilter from '@/components/DateFilter.vue'
import HierarchieFilter from '@/components/HierarchieFilter.vue'
import LanguageFilter from '@/components/LanguageFilter.vue'
import SortOrderSelector from '@/components/SortOrderSelector.vue'
import { Route } from 'vue-router'

@Component({
  name: 'SearchResult',
  components: {
    SortOrderSelector,
    DateFilter,
    LanguageFilter,
    HierarchieFilter
  }
})

export default class SearchResults extends Vue {
  private filterVisible = true
  private fullScreen = false
  private windowWidth = 0
  private previewVisible = false
  private sliderWidth = 1
  private allowUndoFilter = false
  private iframeUrl = ''

  data () {
    return {
      selected: [],
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

  get pristine () {
    return SearchModule.pristine
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

  get filter () {
    return SearchModule.filters
  }

  get query () {
    return SearchModule.query
  }

  get locale () {
    return AppModule.locale
  }

  @Watch('locale')
  public onLocaleChanged () {
    if (SearchModule.document !== '') {
      SearchModule.SetDocumentResult()
    } else {
      SearchModule.SetResults()
    }
  }

  @Watch('results')
  public onResultsChanged () {
    const selectedId = this.$route.query.selected
    if (selectedId && !('id' in this.selectedResult)) {
      const oldSelectedResult = this.getResultbyId(selectedId.toString())
      if (oldSelectedResult) {
        SearchModule.Select(oldSelectedResult)
        if (!this.previewVisible) {
          this.onOpenPreview()
        }
      }
    }
  }

  @Watch('selectedResult')
  public onSelectedResultChanged (selectedResult: SearchResult) {
    if (!('id' in selectedResult)) {
      this.previewVisible = false
      this.fullScreen = false
      return
    }
    let iFrame = document.getElementById('result-iframe')
    if (this.windowWidth <= 1024) {
      iFrame = document.getElementById('mobile-result-iframe')
    }
    const iFrameParent = document.getElementById('outer-pdf')
    if (iFrame && iFrameParent && selectedResult.url) {
      const newUrl = selectedResult.url + (this.fullScreen ? '' : '#view=FitH')
      const url = iFrame.getAttribute('src')
      if (url !== newUrl) {
        iFrame.remove()
        iFrame.setAttribute('src', newUrl)
        this.iframeUrl = newUrl
        iFrameParent.append(iFrame)
      }
    }
  }

  @Watch('filter')
  public onFilterChanged (filters: Filters) {
    this.allowUndoFilter = Object.keys(filters).length > 0
  }

  @Watch('$route', { immediate: true, deep: true })
  onRouteChange (to: Route) {
    const query = this.$route.query.query
    const preview = this.$route.query.preview
    if (query && (this.windowWidth > 534 || (this.windowWidth <= 534 && query !== this.query))) {
      if (this.fullScreen && to.name === 'Search') {
        if (preview === undefined) {
          this.previewVisible = false
        }
        this.fullScreen = false
      }
    }
    if (query === undefined && to.name === 'View') {
      if (!this.previewVisible && !this.fullScreen) {
        this.previewVisible = true
        this.fullScreen = true
        // TODO set old query
      }
    }
  }

  @Watch('query')
  public onQueryChange () {
    this.previewVisible = false
    this.fullScreen = false
  }

  created () {
    this.fullScreen = SearchModule.document !== '' && Object.prototype.hasOwnProperty.call(SearchModule.selectedResult, 'id')
    if (this.fullScreen) {
      this.previewVisible = true
    }
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('popstate', this.handlePopState)
    this.handleResize()
    this.getFilterInnerWidth()
  }

  mounted () {
    this.allowUndoFilter = Object.keys(this.filter).length > 0
  }

  destroyed () {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('popstate', this.handlePopState)
  }

  handleResize () {
    this.getFilterInnerWidth()
    this.windowWidth = window.innerWidth
    this.filterVisible = this.windowWidth > 1024
  }

  handleScroll () {
    const searchResultsDiv = document.getElementById('results')
    if (!SearchModule.allResultsLoaded && !SearchModule.resultsPending && searchResultsDiv !== null) {
      if (searchResultsDiv.scrollTop + searchResultsDiv.clientHeight >= searchResultsDiv.scrollHeight - 10) {
        this.getMoreResults()
      }
    }
  }

  handlePopState () {
    const name = this.$route.name
    const query = this.$route.query.query
    if (query && query !== this.query) {
      SearchModule.SetQuery(query.toString())
    }
    const selectedId = this.$route.query.selected
    const preview = this.$route.query.preview
    if ('id' in this.selectedResult) {
      if (this.selectedResult.id !== selectedId) {
        if (selectedId) {
          const oldSelectedResult = this.getResultbyId(selectedId.toString())
          if (oldSelectedResult) {
            SearchModule.Select(oldSelectedResult)
            if (preview === undefined && this.previewVisible) {
              this.previewVisible = false
            }
          }
        } else if (name !== 'View') {
          SearchModule.Select()
        }
      } else if (preview === undefined && this.previewVisible) {
        this.previewVisible = false
      } else if (preview && !this.previewVisible) {
        this.previewVisible = true
      }
    }
    if (name === 'Search' && this.fullScreen) {
      this.fullScreen = false
      if (this.windowWidth <= 534) {
        this.previewVisible = false
      }
    }
    if (name === 'View') {
      this.fullScreen = true
    }
  }

  getResultbyId (id: string): SearchResult | undefined {
    for (let i = 0; i < this.results.length; i++) {
      if (this.results[i].id === id) {
        return this.results[i]
      }
    }
    return undefined
  }

  public onToggleFilter (): void {
    this.filterVisible = !this.filterVisible
  }

  public onFullScreen (): void{
    if (!this.fullScreen) {
      if ('id' in SearchModule.selectedResult) {
        SearchModule.SetDocument(SearchModule.selectedResult.id)
        this.fullScreen = true
      }
    } else {
      if (SearchModule.document !== '') {
        SearchModule.SetDocument('')
      }
      if (this.fullScreen && this.windowWidth <= 534) {
        this.previewVisible = false
        this.fullScreen = false
      } else {
        this.fullScreen = false
      }
    }
  }

  public onNewTab (): void{
    if (!this.fullScreen) {
      if ('id' in SearchModule.selectedResult) {
        window.open('/view/' + SearchModule.selectedResult.id, '_blank')
        self.focus()
      }
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
    SearchModule.SetPreview(false)
    if (this.fullScreen) {
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

  public undoFilter () {
    SearchModule.SetFilters([])
  }

  public undoDateFilter () {
    SearchModule.RemoveFilter(FilterType.DATE)
  }

  public undoLanguageFilter () {
    SearchModule.RemoveFilter(FilterType.LANGUAGE)
  }

  public undoHierarchieFilter () {
    SearchModule.RemoveFilter(FilterType.HIERARCHY)
  }

  public dateFilterEmpty () {
    return !(Object.keys(this.filter).includes('edatum'))
  }

  public languageFilterEmpty () {
    return !(Object.keys(this.filter).includes('language'))
  }

  public hierarchieFilterEmpty () {
    return !(Object.keys(this.filter).includes('hierarchie'))
  }

  public onToggleAbstract (id: string) {
    const textDiv = document.getElementById(id)
    const button = document.getElementById(('button-' + id))
    if (textDiv !== null && button !== null) {
      if (textDiv.style.whiteSpace !== 'normal') {
        textDiv.style.whiteSpace = 'normal'
      } else {
        textDiv.style.whiteSpace = 'nowrap'
      }
      if (button.style.transform !== 'rotate(90deg)') {
        button.style.transform = 'rotate(90deg)'
      } else {
        button.style.transform = 'rotate(0deg)'
      }
    }
  }
}
</script>
