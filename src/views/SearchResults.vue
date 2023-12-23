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
            <DateFilter ref="dateFilter"
              :sliderWidth="sliderWidth"
              @show-date-overlay="onShowOverlay"/>
            <div class="date-overlay-bg" v-if="overlayVisible"></div>
            <div class="date-overlay" v-if="overlayVisible">
              <div class="focusguard" ref="focusguardFirst" tabindex="0"></div>
              <b-form class="form">
                <b-form-group id="from-date-group" class="mt-16" :label="$t('from')" label-for="form-date">
                  <b-form-input :state="fromState && rangeState" ref="fromField" @keydown.enter="onConfirmOverlay" tabindex="1" lang="fr" id="from-date" type="date" v-model="overlayFrom"></b-form-input>
                </b-form-group>
                <b-form-group id="to-date-group" class="mt-16" :label="$t('to')" label-for="to-date">
                  <b-form-input :state="toState && rangeState" ref="toField" @keydown.enter="onConfirmOverlay" tabindex="2" id="to-date" type="date" v-model="overlayTo"></b-form-input>
                </b-form-group>
              </b-form>
              <div class="btn-row">
                <b-button  tabindex="3" variant="primary" v-on:click="onCancelOverlay()" class="close-date-overlay">
                  {{ $t('cancelDateOverlay') }}
                </b-button>
                <b-button :disabled="!fromState || !toState || !rangeState " tabindex="4" variant="primary" ref="confirmBtn" v-on:click="onConfirmOverlay()" class="confirm-date-overlay">
                  {{ $t('confirmDateOverlay') }}
                </b-button>
              </div>
              <div class="focusguard" ref="focusguardSecond" tabindex="5"></div>
            </div>
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
        <h1 class="card-group-title">{{$t('also support')}}</h1>
        <b-card-group id='bcardsResults' deck>
          <sponsor-card v-for="(sponsor, index) in this.randomSponsors" :key="index" :logo="sponsor.logo" :link="sponsor.link" :text="sponsor.text" :tooltip="sponsor.tooltip"/>
        </b-card-group>
        <div v-bind:class="['button-wrapper', this.showMessage ? 'messageOffset' : '']">
          <div v-on:click="onToggleFilter()" v-bind:class="['show-filter', this.filterVisible ? '' : 'visible', this.fullScreen ? 'fullScreen' : '']">
            <b-icon icon="caret-right-fill" aria-hidden="true"></b-icon>
          </div>
        </div>
        <div v-if="!pristine && results.length === 0" class="no-results">
          <h3 class="hint">Ihre Suche nach "{{ query }}" ergab leider keine Treffer</h3>
        </div>
        <div v-for="(result, index) in results" :key="result.id" v-bind:class="['result-item', isSelected(result) ? 'selected' : '']" v-bind:id="isSelected(result) ? 'selectedRes' : ''" v-on:click="[onOpenPreview(), onSelectResult(result)]">
          <div class="result-body">
            <div class="result-header">
              <img :src="getImgUrl(result.canton)" class="canton-logo">
              <h4 class="result-title" v-html="result.title"/>

              <a v-if="directLink(result)" :href="result.url" target="_blank" @click.prevent.stop="onSource(result.url)">
                <b-button variant="primary" id="result-court-btn" :title="$t('courtHover')">
                  <b-icon id="result-court"></b-icon>
                </b-button>
              </a>
              <a :href="result.url.replace('/docs/','/dok/')" target="_blank" @click.prevent.stop="openPrint(result.url.replace('/docs/','/dok/'))">
                <b-button variant="primary" id="result-print-btn" :title="$t('printHover')">
                  <b-icon id="result-print" icon="printer"></b-icon>
                </b-button>
              </a>
              <img v-if="result.pdf" src="../assets/pdf.png" class="link-logo" :title="$t('pdfHover')">
              <img v-else src="../assets/html.png" class="link-logo" :title="$t('htmlHover')">
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
                  <a v-if="directLink(selectedResult)" :href="selectedResult.url" target="_blank" @click.prevent.stop="onSource(selectedResult.url)">
                    <b-button variant="primary" id="court-btn" :title="$t('courtHover')">
                      <b-icon id="court"></b-icon>
                    </b-button>
                  </a>
                  <a :href="selectedResult.url.replace('/docs/','/dok/')" target="_blank" @click.prevent.stop="openPrint(selectedResult.url.replace('/docs/','/dok/'))">
                    <b-button variant="primary" id="print-btn" :title="$t('printHover')">
                      <b-icon id="print" icon="printer"></b-icon>
                    </b-button>
                  </a>
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
                <div v-on:click.stop="onToggle((selectedResult.id + '-preview'))" v-bind:class="['show-more']" v-bind:id="('button-' + selectedResult.id + '-preview')" style="border:none;outline:none;box-shadow:none;">
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
          position: relative;

          .date-overlay-bg {
            background-color: #ffffff;
            position: absolute;
            top: 0;
            left: -20px;
            width: 338px;
            height: calc(100% + 30px);
            z-index: 100;
          }

          .date-overlay {
            background-color: #e5e9f1;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: calc(100% + 30px);
            z-index: 101;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            padding: 6px;

            .btn-row {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              width: 100%;

              .btn {
                display: flex;
                justify-content: center;
                align-items: center;
                width: calc(50% - 3px);
              }
            }

            .form {
              margin-bottom: 6px;

              .form-group {
                margin: 0;

                label {
                  margin-bottom: 0px;
                  font-size: 14px;
                }
              }

              #from-date-group {
                margin-bottom: 6px;
              }
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
      .card-group-title {
        margin: 0;
        padding-bottom: 15px;
      }
      .card-deck{
        width:100%;
        display:flex;
        flex-flow:row wrap;
        justify-content:space-between;
        margin:0px;

        .card {
          background-color: #fff;
          border: none;
          box-shadow: 0 2px 30px rgba(0, 0, 0, .15);
          border-radius: 0 0 20px 0;
          margin: 5px 0 5px 0;
          width: 260px;
          max-width: calc((100% - 40px) / 4);
          flex-basis: 260px;
          flex-grow: 1;
          justify-content: space-between;
        }
        .card:hover {
          .card-img-wapper {
            .card-img-top {
              transform: matrix(1, 0, 0, 1, 0, 0);
            }
          }
        }
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

            #result-court-btn{
              height:30px;
              width:30px;
              position: relative;
              margin-left: 5px;
              #result-court{
                background: url('../assets/court.svg') no-repeat center;
                height:22px;
                width:22px;
                position:absolute;
                top:3px;
                left:3px;
              }
            }
            #result-print-btn{
              height:30px;
              width:30px;
              margin-left: 5px;
              position: relative;
              #result-print{
                height:22px;
                width:22px;
                position:absolute;
                top:3px;
                left:3px;
              }
            }

            .canton-logo{
              max-height:36px;
              width: auto;
              height: auto;
              margin-right:5px;
              flex-shrink: 0;
            }
            .link-logo{
              max-height:36px;
              width:auto;
              height: auto;
              margin-left:5px;
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
        display: flex;
        flex-direction: column;
        .doc-info{
          width:100%;
          padding:15px 11px 15px 11px;
          border: 1px solid rgba(0, 0, 0, 0.125);
          border-radius: 4px;
          margin-bottom: 0.5em;
          display: flex;
          flex-direction: column;

          .doc-header{
            width:100%;
            height:100%;
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
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                width:170px;
                height:30px;
                margin-left: 20px;
                position:relative;
                flex-shrink:0;

                #close-preview-btn{
                  height:30px;
                  width:30px;
                  position:relative;
                  #close-preview{
                    background: url('../assets/bootstrap-close-big-white.svg') no-repeat center;
                    height:28px;
                    width:28px;
                    position:absolute;
                    top:0;
                    left:0;
                  }
                }
                #court-btn{
                  height:30px;
                  width:30px;
                  position: relative;
                  #court{
                    background: url('../assets/court.svg') no-repeat center;
                    height:22px;
                    width:22px;
                    position:absolute;
                    top:3px;
                    left:3px;
                  }
                }
                #print-btn{
                  height:30px;
                  width:30px;
                  position: relative;
                  #print{
                    height:22px;
                    width:22px;
                    position:absolute;
                    top:3px;
                    left:3px;
                  }
                }
                #maximize-preview-btn{
                  height:30px;
                  width:30px;
                  position: relative;
                  #maximize-preview{
                    height:22px;
                    width:22px;
                    position:absolute;
                    top:3px;
                    left:3px;
                  }
                }
                #separate-preview-btn{
                  height:30px;
                  width:30px;
                  position: relative;
                  #separate-preview{
                    height:22px;
                    width:22px;
                    position:absolute;
                    top:3px;
                    left:3px;
                  }
                }
                #minimize-preview-btn{
                  height:30px;
                  width:30px;
                  display:none;
                  position: relative;
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
                  width: 135px;
                  #minimize-preview-btn{
                    display:block;
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
        .card {
          max-width: calc((100% - 20px) / 3);
        }
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
        .year-range {
          #slider-wrapper{
            .date-overlay-bg{
              width: 100vw;
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
        .card-deck{
          .card{
            min-width:100px;
            //max-width:160px;
            max-width:calc((100% - 20px) / 2);
          }
        }
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
import { AppModule, MessageState, Sponsor } from '@/store/modules/app'
import { Filters, FilterType, SearchModule, SearchResult } from '@/store/modules/search'
import DateFilter from '@/components/DateFilter.vue'
import HierarchieFilter from '@/components/HierarchieFilter.vue'
import LanguageFilter from '@/components/LanguageFilter.vue'
import SortOrderSelector from '@/components/SortOrderSelector.vue'
import { Route } from 'vue-router'
import router from '@/router'
import { BButton } from 'bootstrap-vue'
import SponsorCard from '@/components/SponsorCard.vue'
import data from '../data/sponsors.json'

@Component({
  name: 'SearchResult',
  components: {
    SortOrderSelector,
    DateFilter,
    LanguageFilter,
    HierarchieFilter,
    SponsorCard
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
  private jsonData: any = null
  public overlayVisible = false
  public overlayFrom = ''
  public overlayTo = ''
  public sponsors = data.filter(s => s.active)
  public randomSponsors = data.filter(s => s.active)

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

  get fromState () {
    const from = new Date(this.overlayFrom)
    const fromNumber = from.getTime()
    return !isNaN(fromNumber)
  }

  get toState () {
    const to = new Date(this.overlayTo)
    const toNumber = to.getTime()
    return !isNaN(toNumber)
  }

  get rangeState () {
    const from = new Date(this.overlayFrom)
    const fromNumber = from.getTime()
    const to = new Date(this.overlayTo)
    const toNumber = to.getTime()
    if (!isNaN(toNumber) && !isNaN(fromNumber)) {
      return fromNumber - 1 < toNumber
    } else {
      return true
    }
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
    const preview = this.$route.query.preview
    if (selectedId && !('id' in this.selectedResult)) {
      const oldSelectedResult = this.getResultbyId(selectedId.toString())
      if (oldSelectedResult) {
        SearchModule.Select(oldSelectedResult)
        if (!this.previewVisible && preview) {
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
    setTimeout(() => {
      this.scrollToSelectedRes()
    }, 100)
  }

  @Watch('filter')
  public onFilterChanged (filters: Filters) {
    this.allowUndoFilter = Object.keys(filters).length > 0
  }

  @Watch('$route', { immediate: true, deep: true })
  onRouteChange (from: Route, to: Route) {
    const name = this.$route.name
    if (name === 'View') {
      if ('url' in this.selectedResult) {
        if (!this.previewVisible) {
          this.previewVisible = true
          this.fullScreen = true
        }
        const newUrl = this.selectedResult.url + (this.fullScreen ? '' : '#view=FitH')
        this.iframeUrl = newUrl
      }
    }
    if (from !== to && this.overlayVisible) {
      this.onCancelOverlay()
    }
    this.setRandomSponsors()
  }

  @Watch('query')
  public onQueryChange () {
    const preview = this.$route.query.preview
    const fullScreen = this.$route.query.fullScreen
    if (!preview && !fullScreen) {
      this.previewVisible = false
      this.fullScreen = false
    }
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
    this.handleResize()
  }

  destroyed () {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('popstate', this.handlePopState)
  }

  handleResize () {
    this.getFilterInnerWidth()
    this.windowWidth = window.innerWidth
    this.filterVisible = this.windowWidth > 1024
    this.setRandomSponsors()
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
    const query = this.$route.query.query
    const selectedId = this.$route.query.selected
    const preview = this.$route.query.preview
    const fullScreen = this.$route.query.fullScreen
    if (query && query !== this.query && ((fullScreen && this.windowWidth > 534) || (preview && this.windowWidth <= 534))) {
      this.fullScreen = true
      this.previewVisible = true
      SearchModule.ResetQuery(query.toString())
      return
    } else if (query && query !== this.query) {
      SearchModule.ResetQuery(query.toString())
      return
    }
    if ('id' in this.selectedResult) {
      if (this.selectedResult.id !== selectedId) {
        if (selectedId) {
          const oldSelectedResult = this.getResultbyId(selectedId.toString())
          if (oldSelectedResult) {
            SearchModule.Select(oldSelectedResult)
          }
        } else {
          SearchModule.Select()
        }
      }
    } else if (preview && !this.previewVisible && this.windowWidth <= 534) {
      const oldSelectedResult = this.getResultbyId(selectedId.toString())
      if (oldSelectedResult) {
        SearchModule.Select(oldSelectedResult)
        this.previewVisible = true
        this.fullScreen = true
        return
      }
    }
    if (preview && !this.previewVisible) {
      this.previewVisible = true
      if (this.windowWidth <= 534) {
        this.fullScreen = true
      }
      return
    }
    if (preview === undefined && this.previewVisible) {
      this.previewVisible = false
      if (this.windowWidth <= 534) {
        this.fullScreen = false
      }
    }
    if (fullScreen === undefined && this.fullScreen) {
      this.fullScreen = false
      if (this.windowWidth <= 534) {
        this.previewVisible = false
      }
    }
    if (fullScreen === 'true' && !this.fullScreen) {
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

  public onCancelOverlay (): void {
    this.overlayVisible = false
    this.removeGuardListeners()
  }

  public onConfirmOverlay (): void {
    if (this.fromState && this.toState && this.rangeState) {
      const from = new Date(this.overlayFrom)
      const fromNumber = from.getTime()
      const to = new Date(this.overlayTo)
      const toNumber = to.getTime();
      (this.$refs.dateFilter as DateFilter).handleRangeChange(fromNumber, toNumber)
      this.overlayVisible = false
      this.removeGuardListeners()
    }
  }

  public onShowOverlay (): void {
    this.overlayVisible = true
    this.initOverlayDates()
    this.$nextTick(() => {
      const focusGuard1 = this.$refs.focusguardFirst as HTMLElement
      const focusGuard2 = this.$refs.focusguardSecond as HTMLElement
      if (focusGuard1) {
        focusGuard1.addEventListener('focus', this.focusOnLast)
      }
      if (focusGuard2) {
        focusGuard2.addEventListener('focus', this.focusOnFirst)
      }
      (this.$refs.confirmBtn as BButton).focus()
    })
  }

  public removeGuardListeners () {
    const focusGuard1 = this.$refs.focusguardFirst as HTMLElement
    const focusGuard2 = this.$refs.focusguardSecond as HTMLElement
    if (focusGuard1) {
      focusGuard1.removeEventListener('focus', this.focusOnLast)
    }
    if (focusGuard2) {
      focusGuard2.removeEventListener('focus', this.focusOnFirst)
    }
  }

  public focusOnLast () {
    (this.$refs.confirmBtn as BButton).focus()
  }

  public focusOnFirst () {
    (this.$refs.fromField as HTMLInputElement).focus()
  }

  public onToggleFilter (): void {
    this.filterVisible = !this.filterVisible
  }

  public directLink (result) {
    const pathSegments = result.url.split('/').filter(Boolean)
    return (/^[A-Z]{2}_/.test(pathSegments[3]) && !(/^(CH_EDOEB|XX_Upload|BE_ZivilStraf|BE_Anwaltsaufsicht|BE_Verwaltungsgericht|BE_Steuerrekurs|BS_Omni|GL_Omni|GR_Gerichte|JU_Gerichte|TG_OG|VS_Gerichte)$/.test(pathSegments[3])))
  }

  public onSource (docurl): void {
    // const protocol = 'https:'
    // const host = 'entscheidsuche.ch'
    // const protocol = window.location.protocol
    // const host = window.location.host
    const url = docurl.replace(/\.([a-zA-Z0-9]+)$/, '.json')

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.')
        }
        return response.json()
      })
      .then(data => {
        // Here 'data' is the JSON object you've fetched
        console.log(data)
        // You can now set this data to a component's data property or work with it as needed
        this.processJsonData(data) // Process your data with another method
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error)
      })
  }

  processJsonData (data) {
    // Handle your JSON data here
    // For example, you might want to set it to a Vue data property
    let url = null
    if ('PDF' in data) {
      url = data.PDF.URL
    } else if ('HTML' in data) {
      url = data.HTML.URL
    }
    if (url) {
      this.openPrint(url)
    } else {
      alert('no deeplink available')
    }
  }

  public openPrint (url): void {
    // Calculate width and height as 80% of the current window's dimensions
    const width = window.innerWidth * 0.8
    const height = window.innerHeight * 0.8

    // Round down the numbers to avoid decimals
    const roundedWidth = Math.floor(width)
    const roundedHeight = Math.floor(height)

    // Calculate the position of the new window to be centered
    const left = (window.innerWidth / 2) - (roundedWidth / 2)
    const top = (window.innerHeight / 2) - (roundedHeight / 2)

    // Open a new window with the specified dimensions and position it in the center
    const newWindow = window.open(url, 'newwindow', `width=${roundedWidth},height=${roundedHeight},top=${top},left=${left}`)

    // Check if the new window was successfully opened
    if (newWindow) {
      // Focus the new window if it's opened in the background
      newWindow.focus()
    } else {
      // If the new window was blocked by the browser's popup blocker, inform the user
      alert('A popup blocker may be preventing the new window from opening.')
    }
  }

  public onFullScreen (): void {
    const name = this.$route.name
    if (name !== 'View') {
      if (!this.fullScreen) {
        if ('id' in SearchModule.selectedResult) {
          SearchModule.SetFullScreen('true')
          this.fullScreen = true
        }
      } else {
        if (this.windowWidth <= 534) {
          this.previewVisible = false
          SearchModule.SetPreview(false)
        } else {
          SearchModule.SetFullScreen('')
        }
        this.fullScreen = false
        setTimeout(() => {
          this.scrollToSelectedRes()
        }, 100)
      }
    } else if (this.fullScreen) {
      router.push({ name: 'Home' })
    }
  }

  public onNewTab (): void {
    // if (!this.fullScreen) {
    if ('id' in SearchModule.selectedResult) {
      window.open('/view/' + SearchModule.selectedResult.id, '_blank')
      self.focus()
    }
    // }
  }

  public onOpenPreview (): void {
    this.previewVisible = true
    if (this.windowWidth <= 534) {
      this.fullScreen = true
    }
  }

  public get showMessage () {
    return AppModule.showMessage === MessageState.VISIBLE
  }

  public onClosePreview (): void {
    this.previewVisible = false
    SearchModule.SetPreview(false)
    if (this.fullScreen) {
      this.fullScreen = false
      if (this.windowWidth > 534) {
        this.previewVisible = true
      }
    }
    setTimeout(() => {
      this.scrollToSelectedRes()
    }, 100)
  }

  public initOverlayDates (): void {
    const minEdatum = Number(SearchModule.aggregations.min_edatum[0].key)
    const maxEdatum = Number(SearchModule.aggregations.max_edatum[0].key)
    if (!Object.prototype.hasOwnProperty.call(this.filter, 'edatum')) {
      if (minEdatum) {
        this.overlayFrom = this.dateToString(minEdatum)
      }
      if (maxEdatum) {
        this.overlayTo = this.dateToString(maxEdatum)
      }
    } else {
      const from = this.filter.edatum.payload.from
      const to = this.filter.edatum.payload.to
      if (from) {
        this.overlayFrom = this.dateToString(from)
      } else if (minEdatum) {
        this.overlayFrom = this.dateToString(minEdatum)
      }
      if (to) {
        this.overlayTo = this.dateToString(to)
      } else if (maxEdatum) {
        this.overlayTo = this.dateToString(maxEdatum)
      }
    }
  }

  public dateToString (date: Date | number): string {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]
    } else {
      const d = new Date(date)
      return d.toISOString().split('T')[0]
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

  public setRandomSponsors () {
    const shuffledSponsors: {'sponsor': Sponsor; 'position': number}[] = []
    for (let i = 0; i < this.sponsors.length; i++) {
      shuffledSponsors[i] = { sponsor: this.sponsors[i], position: Math.random() }
    }
    shuffledSponsors.sort((a, b) => { return Math.sign(a.position - b.position) })
    let visibleSponsors = 0
    if (this.windowWidth <= 534) {
      visibleSponsors = 2
    } else if (this.windowWidth > 534) {
      visibleSponsors = 4
    } else {
      visibleSponsors = 0
    }
    const newSponsors: Sponsor[] = []
    for (let i = 0; i < visibleSponsors; i++) {
      newSponsors.push((shuffledSponsors[i]).sponsor)
    }
    this.randomSponsors = newSponsors
  }

  public scrollToSelectedRes () {
    const selectedRes = document.getElementById('selectedRes')
    if (selectedRes) {
      if (selectedRes.getBoundingClientRect().bottom > window.innerHeight) {
        selectedRes.scrollIntoView({ block: 'center' })
      }
      if (selectedRes.getBoundingClientRect().top < 0) {
        selectedRes.scrollIntoView({ block: 'center' })
      }
    }
  }
}
</script>
