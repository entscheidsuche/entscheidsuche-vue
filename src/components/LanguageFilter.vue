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
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Aggregations, Filters, FilterType, SearchModule } from '@/store/modules/search'

@Component
export default class LanguageFilter extends Vue {
  selected = []
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
