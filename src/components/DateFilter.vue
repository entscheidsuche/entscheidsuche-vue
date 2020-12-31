<template>
  <DateFilterUI
    v-if="showHistogram"
    :sliderWidth="sliderWidth"
    @value-changed="onDateRangeChanged"/>
</template>

<style lang="scss">
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Aggregations, Filters, SearchModule } from '@/store/modules/search'
import DateFilterUI from '@/components/DateFilterUI.vue'

@Component({
  components: {
    DateFilterUI
  }
})
export default class DateFilter extends Vue {
  private showHistogram = false
  private dateRange: { from: number; to: number } | undefined
  @Prop() sliderWidth

  get aggregations () {
    return SearchModule.aggregations
  }

  get filter () {
    return SearchModule.filters
  }

  public mounted () {
    this.showHistogram = true
  }

  public onDateRangeChanged (value: { from: number; to: number }) {
    this.dateRange = value
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

  @Watch('filter')
  public onFilterChanged (filters: Filters) {
    if (!Object.prototype.hasOwnProperty.call(filters, 'edatum') && this.dateRange !== undefined) {
      this.update()
    }
  }

  private update () {
    this.showHistogram = false
    this.$nextTick(() => { this.showHistogram = true })
  }
}
</script>
