<template>
  <DateFilterUI
    v-if="showHistogram"
    :sliderWidth="sliderWidth"
    :interval="dateInterval"
    :range="dateRange"
    :dates="dates"
    @value-changed="onDateRangeChanged"/>
</template>

<style lang="scss">
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Aggregations, Filters, FilterType, SearchModule } from '@/store/modules/search'
import DateFilterUI from '@/components/DateFilterUI.vue'

@Component({
  components: {
    DateFilterUI
  }
})
export default class DateFilter extends Vue {
  private showHistogram = false
  private dateInterval: { min: number; max: number } | undefined
  private dateRange: { from: number | undefined; to: number | undefined } | undefined
  @Prop() sliderWidth

  get aggregations () {
    return SearchModule.aggregations
  }

  get filters () {
    return SearchModule.filters
  }

  get dates () {
    const edatum = this.aggregations.edatum || []
    const datesArray: Date[] = []
    for (const agg of edatum) {
      const date = new Date(agg.key)
      for (let i = 0; i < agg.count; i++) {
        datesArray.push(date)
      }
    }
    return datesArray
  }

  public mounted () {
    if (Object.prototype.hasOwnProperty.call(this.aggregations, 'edatum')) {
      this.update()
    }
  }

  public onDateRangeChanged (value: { from: number; to: number }) {
    if (this.dateInterval) {
      this.dateRange = {
        from: value.from > this.dateInterval.min ? value.from : undefined,
        to: value.to < this.dateInterval.max ? value.to : undefined
      }
      if (this.dateRange.from !== undefined || this.dateRange.to !== undefined) {
        SearchModule.AddFilter({ type: FilterType.DATE, payload: this.dateRange })
      } else {
        SearchModule.RemoveFilter(FilterType.DATE)
      }
    }
  }

  @Watch('aggregations')
  public onAggregationsChange (aggs: Aggregations, oldAggs: Aggregations) {
    if (aggs === oldAggs) {
      return
    }
    if (aggs.edatum === oldAggs.edatum) {
      return
    }
    this.update()
  }

  @Watch('filters')
  public onFilterChanged (filters: Filters) {
    if (!Object.prototype.hasOwnProperty.call(filters, 'edatum')) {
      this.update()
    }
  }

  private update () {
    let changed = false
    let min = 0
    let max = 0
    let from: number | undefined
    let to: number | undefined
    const edatum = SearchModule.aggregations.edatum || []
    if (Object.prototype.hasOwnProperty.call(this.filters, 'edatum')) {
      from = this.filters.edatum.payload.from
      to = this.filters.edatum.payload.to
    }
    if (from !== undefined && edatum.length > 0) {
      min = Math.min(from, edatum[0].key as number)
    } else if (from !== undefined) {
      min = from
    } else if (edatum.length > 0) {
      min = edatum[0].key as number
    }
    if (to !== undefined && edatum.length > 0) {
      max = Math.max(to, edatum[edatum.length - 1].key as number)
    } else if (to !== undefined) {
      max = to
    } else if (edatum.length > 0) {
      max = edatum[edatum.length - 1].key as number
    }
    if (this.dateInterval === undefined || min !== this.dateInterval.min || max !== this.dateInterval.max) {
      this.dateInterval = { min, max }
      changed = true
    }
    if (this.dateRange === undefined || from !== this.dateRange.from || to !== this.dateRange.to) {
      this.dateRange = { from, to }
      changed = true
    }
    if (changed) {
      this.showHistogram = false
      this.$nextTick(() => { this.showHistogram = true })
    }
  }
}
</script>
