<template>
  <DateFilterUI
    ref="dateFilterUI"
    v-if="showHistogram"
    :sliderWidth="sliderWidth"
    :interval="dateInterval"
    :range="dateRange"
    :dates="dates"
    @value-changed="onDateRangeChanged"
    @show-date-overlay="onShowDateOverlay"/>
</template>

<style lang="scss">
.vue-histogram-slider-wrapper{
  .vue-histogram-view{
    width:calc(100% - 10px);
    padding-left:2.5px;
  }
  margin: auto;
  .irs-handle{
    top: calc(50% - var(--handle-size)/2 + 13px);
  }
  .irs-from,.irs-to,.irs-single{
    top:56px;
    @media (hover: none) and (pointer: coarse) {
      font-size: 16px;
    }
  }
  .irs-from::before,.irs-to::before,.irs-single::before{
    transform: scaleY(-1);
    bottom:19px;

    @media (hover: none) and (pointer: coarse) {
      bottom: 22px;
    }
  }
}
@media (max-width: 534px){
  .vue-histogram-slider-wrapper{
    margin-left:24px;
  }
}
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Aggregations, Filters, FilterType, SearchModule } from '@/store/modules/search'
import DateFilterUI from '@/components/DateFilterUI.vue'
import 'vue-histogram-slider/dist/histogram-slider.css'

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

  created () {
    window.addEventListener('popstate', this.handlePopState)
  }

  destroyed () {
    window.removeEventListener('popstate', this.handlePopState)
  }

  private handlePopState () {
    const filters = this.$route.query.filter
    let edate = ''
    if (filters) {
      if (Array.isArray(filters)) {
        for (let i = 0; i < filters.length; i++) {
          const currentFilter = filters[i]
          if (currentFilter !== null) {
            if (currentFilter.substring(0, 1) === 'e') {
              edate = currentFilter
            }
          }
        }
      } else {
        if (filters.substring(0, 1) === 'e') {
          edate = filters
        }
      }
    }
    const dates = edate.substring(2)
    const dateStringFilters = dates.split(',')
    const dateFilters: Array<number|undefined> = []
    if (dateStringFilters[0] === '' || dateStringFilters[0] === undefined) {
      dateFilters[0] = undefined
    } else {
      dateFilters[0] = Number(dateStringFilters[0])
    }
    if (dateStringFilters[1] === '' || dateStringFilters[1] === undefined) {
      dateFilters[1] = undefined
    } else {
      dateFilters[1] = Number(dateStringFilters[1])
    }
    const stateDate = SearchModule.filters.edatum
    const stateDateFilters: Array<number|undefined> = []
    if (stateDate) {
      if (stateDate.payload.from) {
        stateDateFilters[0] = Number(stateDate.payload.from)
      } else {
        stateDateFilters[0] = undefined
      }
      if (stateDate.payload.to) {
        stateDateFilters[1] = Number(stateDate.payload.to)
      } else {
        stateDateFilters[1] = undefined
      }
    } else {
      stateDateFilters[0] = undefined
      stateDateFilters[1] = undefined
    }
    if (dateFilters[0] !== stateDateFilters[0] || dateFilters[1] !== stateDateFilters[1]) {
      this.dateRange = { from: dateFilters[0], to: dateFilters[1] }
      if (this.dateRange.from !== undefined || this.dateRange.to !== undefined) {
        SearchModule.AddFilter({ type: FilterType.DATE, payload: this.dateRange })
        this.dateInterval = { min: Number(dateFilters[0]), max: Number(dateFilters[1]) }
      } else {
        SearchModule.RemoveFilter(FilterType.DATE)
        this.dateInterval = { min: Number(dateFilters[0]), max: Number(dateFilters[1]) }
      }
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

  public onShowDateOverlay () {
    this.$emit('show-date-overlay')
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

  public handleRangeChange (fromUpdated: number, toUpdated: number) {
    (this.$refs.dateFilterUI as DateFilterUI).handleRangeChange(fromUpdated, toUpdated)
  }

  private update () {
    let changed = false
    let min = 0
    let max = 0
    let from: number | undefined
    let to: number | undefined
    const edatum = SearchModule.aggregations.edatum || []
    const minEdatum = SearchModule.aggregations.min_edatum || []
    const maxEdatum = SearchModule.aggregations.max_edatum || []

    if (Object.prototype.hasOwnProperty.call(this.filters, 'edatum')) {
      from = this.filters.edatum.payload.from
      to = this.filters.edatum.payload.to
    }
    let tempMin: number | undefined
    let tempMax: number | undefined
    if (minEdatum.length > 0) {
      tempMin = minEdatum[0].key as number
    } else if (edatum.length > 0) {
      tempMin = edatum[0].key as number
    }
    if (maxEdatum.length > 0) {
      tempMax = maxEdatum[0].key as number
    } else if (edatum.length > 0) {
      tempMax = edatum[edatum.length - 1].key as number
    }
    if (from !== undefined && tempMin !== undefined) {
      min = Math.min(from, tempMin)
    } else if (from !== undefined) {
      min = from
    } else if (tempMin !== undefined) {
      min = tempMin
    }
    if (to !== undefined && tempMax !== undefined) {
      max = Math.max(to, tempMax)
    } else if (to !== undefined) {
      max = to
    } else if (tempMax !== undefined) {
      max = tempMax
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
