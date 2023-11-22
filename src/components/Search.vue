<template>
  <b-input-group id="header-search" class="mt">
    <b-form-input v-on:keyup.enter="onSearch($event)" is-text v-model="searchterm" :placeholder="$t('searchterm')" v-bind:class="$t('postitMessage') !== '' ? 'hasPostit' : ''"/>
    <b-input-group-append>
      <b-button variant="secondary" id="toggle-search" v-on:click="onSearch($event)">{{ $t('search') }}</b-button>
    </b-input-group-append>
    <div class="post-it" v-bind:class="$t('postitMessage') === '' ? 'empty' : ''">
      <a class="post-inner" v-if="$t('postitMessage') !== ''" :href="$t('postitUrl')" target="_blank" v-b-tooltip.hover :title="$t('postitHover')">
        <span v-html="$t('postitMessage')"></span>
      </a>
    </div>
  </b-input-group>
</template>

<style lang="scss">
#header{
  .header-main{
    #header-search{
      height:40px;
      width:100%;
      flex-grow:1;
      flex-wrap: nowrap;
      margin-right:45px;
      margin-left:20px;
      margin-top: 0;
      align-items: center;
      justify-content: center;
      display:flex;

      .post-it {
        position: relative;
        width: 100px;
        height: 40px;
        margin-left: 15px;

        .post-inner {
          display: flex;
          align-items: center;
          position: absolute;
          z-index: 1;
          top:0;
          left:0;
          width:80px;
          height: 80px;
          font-size:12px;
          text-decoration: none;
          color: #000000;
          font-weight: 600;
          padding: 10px 5px;
          border-radius: 0 0 0 15px;
          box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.3);
          background-color: #ffffaa;
          overflow: hidden;
        }

        .post-inner:before {
          content:"";
          display:block;
          position:absolute;
          width:10px;
          height:12px;
          background-color: #ffffaa;
          box-shadow: 1px -1px 1px rgba(0, 0, 0, 0.2), inset 1px 0px 1px rgba(0, 0, 0, 0.3);
          left:0;
          bottom:0;
          z-index:2;
          transform:skewX(13deg);
        }
      }

      input{
        height:40px;
        width: calc(100% - 140px);
        max-width: 379px;
        border:0;
        padding:0;
        //border-radius:0;
        font-size: 16px;
        padding-left:15px;
      }
      input:focus{
        border:none;
        outline:none;
      }
      #toggle-search{
        flex-shrink: 0;
        height:40px;
        width:100px;
        padding:0;
        font-size: 16px;
        font-weight: bold;
        position:relative;
      }
    }
  }
}
//tablet
@media (max-width: 1024px){
  #header{
    .header-main{
      #header-search{
        position: absolute;
        bottom:15px;
        width: 100%;
        margin-left:0;
        input{
          max-width: calc(100% - 140px);
          padding:0;
          padding-left:15px;

          &.hasPostit{
            max-width: calc(100% - 235px);
            margin-left: 20px;
          }
        }
        .post-it {
          &.empty {
            display: none;
          }
        }
      }
    }
  }
}
</style>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SearchModule } from '@/store/modules/search'
import router from '@/router'
import { Route } from 'vue-router'

@Component
export default class Search extends Vue {
  private searchterm = ''

  public get query () {
    return SearchModule.query
  }

  created () {
    this.searchterm = this.query
  }

  @Watch('$route')
  onRouteChange () {
    const name = this.$route.name
    if (name === 'Home' && this.searchterm !== '') {
      this.searchterm = ''
      SearchModule.SetQuery('')
    }
    if (name === 'View' && this.searchterm !== '') {
      this.searchterm = ''
    }
  }

  @Watch('query')
  public onQueryChange (query: string) {
    this.searchterm = query
  }

  public onSearch ($event: Event) {
    if ($event.target !== null) {
      ($event.target as HTMLElement).blur()
    }
    if (this.searchterm !== '') {
      SearchModule.SetQuery(this.searchterm)
      /*
      if (this.$route.name !== 'Search' ||
            (this.$route.query.query === undefined || this.$route.query.query !== this.searchterm)) {
        router.push({ name: 'Search', query: { query: this.searchterm } })
      }
       */
    }
  }
}
</script>
