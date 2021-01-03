<template>
  <HistogramSlider
    ref="histogram"
    :width="sliderWidth"
    :bar-height="100"
    :transitionDuration="10"
    :data="dates"
    :drag-interval="true"
    :force-edges="false"
    :colors="['#c8d4f8', '#6183ec']"
    :handleSize="16"
    :min="interval.min"
    :max="interval.max"
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
import { Component, Prop, Vue } from 'vue-property-decorator'
import HistogramSlider from 'vue-histogram-slider'

@Component({
  components: {
    HistogramSlider
  }
})
export default class DateFilterUI extends Vue {
  @Prop() sliderWidth
  @Prop() dates
  @Prop() interval: { min: number; max: number } | undefined
  @Prop() range: { from: number | undefined; to: number | undefined } | undefined

  public mounted () {
    if (this.range !== undefined && (this.range.from !== undefined || this.range.to !== undefined)) {
      setTimeout(() => {
        if (this.range !== undefined && this.interval !== undefined) {
          if (this.range.from !== undefined || this.range.to !== undefined) {
            (this.$refs.histogram as HistogramSlider).update(
              {
                from: this.range.from !== undefined ? this.range.from : this.interval.min,
                to: this.range.to !== undefined ? this.range.to : this.interval.max
              })
          }
        }
      }, 20)
    }
  }

  public onValueChanged (value) {
    this.$emit('value-changed', value)
  }

  public prettifyDate (date: Date | number): string {
    if (date instanceof Date) {
      return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    } else if (!isNaN(date)) {
      const d = new Date(date)
      return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`
    }
    return '2020'
  }
}
</script>
