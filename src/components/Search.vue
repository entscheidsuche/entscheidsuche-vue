<template>
  <b-input-group id="header-search" class="mt">
    <b-form-input v-on:keyup.enter="onSearch($event)" is-text v-model="searchterm" :placeholder="$t('searchterm')"/>
    <b-input-group-append>
      <b-button variant="secondary" id="toggle-search" v-on:click="onSearch($event)">{{ $t('search') }}</b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<i18n>
{
  "de": {
    "search": "Suchen",
    "searchterm": "Suchbegriff"
  },
  "fr": {
    "search": "Suchen",
    "searchterm": "Suchbegriff"
  },
  "it": {
    "search": "Suchen",
    "searchterm": "Suchbegriff"
  }
}
</i18n>

<style lang="scss">
#header{
  .header-main{
    #header-search{
      height:40px;
      width:100%;
      flex-grow:1;
      margin-right: 160px;
      margin-left:20px;
      margin-top: 0;
      align-items: center;
      justify-content: center;
      display:flex;

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

@Component
export default class Search extends Vue {
  private searchterm = ''

  public get query () {
    return SearchModule.query
  }

  created () {
    this.searchterm = this.query
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
      if (this.$route.name !== 'Search' ||
            (this.$route.query.query === undefined || this.$route.query.query !== this.searchterm)) {
        router.push({ name: 'Search', query: { query: this.searchterm } })
      }
    }
  }
}
</script>
