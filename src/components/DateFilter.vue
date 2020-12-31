<template>
  <HistogramSlider
    ref="histogram"
    :width="sliderWidth"
    :bar-height="100"
    :data="getDates()"
    :drag-interval="true"
    :force-edges="false"
    :colors="['#c8d4f8', '#6183ec']"
    :handleSize="16"
    :min="getFromDate()"
    :max="getToDate()"
    :primaryColor="'#6183ec'"
    :labelColor="'#6183ec'"
    :prettify="prettifyDate"
    :grid="false"
    @finish="onValueChanged"
  />
</template>

<style lang="scss">
</style>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'
import { SearchModule } from '@/store/modules/search'
import HistogramSlider from 'vue-histogram-slider'

@Component({
  components: {
    HistogramSlider
  }
})
export default class DateFilter extends Vue {
  @Prop() sliderWidth

  public mounted () {
    const filter = SearchModule.filters.edatum
    if (filter !== undefined) {
      (this.$refs.histogram as any).update({ from: filter.payload.from, to: filter.payload.to })
      this.$emit('value-changed', { from: filter.payload.from, to: filter.payload.to })
    }
  }

  @Emit('value-changed')
  public onValueChanged (value) {
    SearchModule.AddFilter({ type: 'edatum', payload: { from: value.from, to: value.to } })
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
    return datesArray
  }

  public getFromDate () {
    const filter = SearchModule.filters.edatum
    const edatum = SearchModule.aggregations.edatum || []
    if (filter !== undefined && edatum.length > 0) {
      return Math.min(filter.payload.from, edatum[0].key as number)
    }
    if (filter !== undefined) {
      return filter.payload.from
    }
    if (edatum.length > 0) {
      return edatum[0].key
    }
  }

  public getToDate () {
    const filter = SearchModule.filters.edatum
    const edatum = SearchModule.aggregations.edatum || []
    if (filter !== undefined && edatum.length > 0) {
      return Math.max(filter.payload.to, edatum[edatum.length - 1].key as number)
    }
    if (filter !== undefined) {
      return filter.payload.to
    }
    if (edatum.length > 0) {
      return edatum[edatum.length - 1].key
    }
  }

  public prettifyDate (date: Date | number): string {
    // eslint-disable-next-line use-isnan
    if (date !== NaN && date instanceof Date) {
      return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    } else if (!isNaN(date)) {
      const d = new Date(date)
      return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`
    }
    return '2020'
  }
}
</script>
