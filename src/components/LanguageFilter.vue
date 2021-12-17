<template>
  <b-form-group>
    <b-form-checkbox
      v-for="option in languages"
      v-model="selected"
      :key="option.value"
      :value="option.value"
      name="flavour-3a">
      <div v-bind:class="['option-wrapper', option.count === 0 ? 'empty' : '']">
        <span>{{ option.text }}</span>
        <span class="language-count">({{ option.count }})</span>
      </div>
    </b-form-checkbox>
  </b-form-group>
</template>

<style lang="scss">
.custom-control-label{
  width: 100%;
  .option-wrapper{
    display:flex;
    justify-content:space-between;
    .language-count{
      opacity: 0.6;
    }
    &.empty{
      color:#bdbdbd
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Aggregations, Filters, FilterType, SearchModule } from '@/store/modules/search'

@Component
export default class LanguageFilter extends Vue {
  selected: Array<string> = []
  myOptions = [
    { text: 'DE', value: 'de', count: 0 },
    { text: 'FR', value: 'fr', count: 0 },
    { text: 'IT', value: 'it', count: 0 }
  ]

  get aggregations () {
    return SearchModule.aggregations
  }

  get filters () {
    return SearchModule.filters
  }

  get languages () {
    return this.myOptions
  }

  public mounted () {
    if (Object.prototype.hasOwnProperty.call(this.filters, 'language')) {
      this.selected = this.filters.language.payload
    }
    if (Object.prototype.hasOwnProperty.call(this.aggregations, 'language')) {
      this.update()
    }
  }

  created () {
    window.addEventListener('popstate', this.handlePopState)
  }

  destroyed () {
    window.removeEventListener('popstate', this.handlePopState)
  }

  private handlePopState () {
    const filters = this.$route.query.filter
    let language = ''
    if (filters) {
      if (Array.isArray(filters)) {
        for (let i = 0; i < filters.length; i++) {
          const currentFilter = filters[i]
          if (currentFilter !== null) {
            if (currentFilter.substring(0, 1) === 'l') {
              language = currentFilter
            }
          }
        }
      } else {
        if (filters.substring(0, 1) === 'l') {
          language = filters
        }
      }
    }
    const languages = language.substring(2)
    const languageFilters = languages.split(',')
    if (languageFilters.includes('')) {
      languageFilters.splice(languageFilters.indexOf(''), 1)
    }
    const stateLanguage = SearchModule.filters.language
    let stateLanguageFilters: string[] = []
    let updateLanguage = false
    if (stateLanguage) {
      stateLanguageFilters = stateLanguage.payload
    }
    if (languageFilters.length === stateLanguageFilters.length) {
      for (let j = 0; j < languageFilters.length; j++) {
        if (!stateLanguageFilters.includes(languageFilters[j])) {
          updateLanguage = true
        }
      }
    } else {
      updateLanguage = true
    }
    if (updateLanguage) {
      if (languageFilters.length !== 0) {
        this.selected = languageFilters
      } else {
        SearchModule.RemoveFilter(FilterType.LANGUAGE)
      }
    }
  }

  @Watch('aggregations')
  public onAggregationsChange (aggs: Aggregations, oldAggs: Aggregations) {
    if (aggs === oldAggs) {
      return
    }
    if (aggs.language === oldAggs.language) {
      return
    }
    this.update()
  }

  @Watch('filters')
  public onFilterChanged (filters: Filters) {
    if (!Object.prototype.hasOwnProperty.call(filters, 'language')) {
      this.selected = []
    }
  }

  @Watch('selected')
  public onSelectionChanged (selected: Array<string>) {
    if (selected.length > 0) {
      SearchModule.AddFilter({ type: FilterType.LANGUAGE, payload: selected })
    } else {
      if (Object.prototype.hasOwnProperty.call(this.filters, 'language')) {
        SearchModule.RemoveFilter(FilterType.LANGUAGE)
      }
    }
  }

  private update () {
    if (Object.prototype.hasOwnProperty.call(this.aggregations, 'language')) {
      const language = this.aggregations.language || []
      const languageDict: { [key: string]: number } = {}
      for (const aggregation of language) {
        languageDict[aggregation.key] = aggregation.count
      }
      for (const option of this.myOptions) {
        if (Object.prototype.hasOwnProperty.call(languageDict, option.value)) {
          option.count = languageDict[option.value]
        } else {
          option.count = 0
        }
      }
    }
  }
}
</script>
