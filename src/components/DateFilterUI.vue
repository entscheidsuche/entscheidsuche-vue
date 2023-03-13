<template>
  <HistogramSlider
    :ref="outerRef"
    :id="outerRef"
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
    @update="onValueChanged"
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
  @Prop() outerRef
  public prevFrom = ''
  public prevTo = ''

  public mounted () {
    if (this.range !== undefined && (this.range.from !== undefined || this.range.to !== undefined)) {
      setTimeout(() => {
        if (this.range !== undefined && this.interval !== undefined) {
          if (this.range.from !== undefined || this.range.to !== undefined) {
            (this.$refs[this.outerRef] as HistogramSlider).update(
              {
                from: this.range.from !== undefined ? this.range.from : this.interval.min,
                to: this.range.to !== undefined ? this.range.to : this.interval.max
              })
          }
        }
      }, 20)
    }
    this.addHandleListeners()
  }

  destroyed () {
    const histogram = document.getElementById(this.outerRef)
    if (histogram) {
      const fromHandle = histogram.getElementsByClassName('irs-from')[0]
      const toHandle = histogram.getElementsByClassName('irs-to')[0]
      const singleHandle = histogram.getElementsByClassName('irs-single')[0]
      if (fromHandle) {
        fromHandle.removeEventListener('mousedown', this.showDateOverlay)
        fromHandle.removeEventListener('touchend', this.showDateOverlay)
      }
      if (toHandle) {
        toHandle.removeEventListener('mousedown', this.showDateOverlay)
        toHandle.removeEventListener('touchend', this.showDateOverlay)
      }
      if (singleHandle) {
        singleHandle.removeEventListener('mousedown', this.showDateOverlay)
        singleHandle.removeEventListener('touchend', this.showDateOverlay)
      }
    }
  }

  public addHandleListeners () {
    const histogram = document.getElementById(this.outerRef)
    if (histogram) {
      setTimeout(() => {
        const fromHandle = histogram.getElementsByClassName('irs-from')[0]
        const toHandle = histogram.getElementsByClassName('irs-to')[0]
        const singleHandle = histogram.getElementsByClassName('irs-single')[0]
        if (fromHandle) {
          fromHandle.removeEventListener('mousedown', this.showDateOverlay)
          fromHandle.removeEventListener('touchend', this.showDateOverlay)
          fromHandle.addEventListener('mousedown', this.showDateOverlay)
          fromHandle.addEventListener('touchend', this.showDateOverlay)
        }
        if (toHandle) {
          toHandle.removeEventListener('mousedown', this.showDateOverlay)
          toHandle.removeEventListener('touchend', this.showDateOverlay)
          toHandle.addEventListener('mousedown', this.showDateOverlay)
          toHandle.addEventListener('touchend', this.showDateOverlay)
        }
        if (singleHandle) {
          singleHandle.removeEventListener('mousedown', this.showDateOverlay)
          singleHandle.removeEventListener('touchend', this.showDateOverlay)
          singleHandle.addEventListener('mousedown', this.showDateOverlay)
          singleHandle.addEventListener('touchend', this.showDateOverlay)
        }
      }, 20)
    }
  }

  public showDateOverlay () {
    this.$emit('show-date-overlay')
  }

  public onValueChanged (value) {
    if (!this.prevFrom) {
      this.prevFrom = value.from_pretty
    } if (!this.prevTo) {
      this.prevTo = value.to_pretty
    }
    if (this.prevFrom !== value.from_pretty || this.prevTo !== value.to_pretty) {
      this.prevFrom = value.from_pretty
      this.prevTo = value.to_pretty
      this.$emit('value-changed', value)
    }
  }

  public handleRangeChange (fromUpdated: number, toUpdated: number) {
    (this.$refs[this.outerRef] as HistogramSlider).update(
      {
        from: fromUpdated,
        to: toUpdated
      }
    )
    this.addHandleListeners()
  }

  public prettifyDate (date: Date | number): string {
    if (date instanceof Date) {
      return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    } else if (!isNaN(date)) {
      const d = new Date(date)
      return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`
    }
    return '2021'
  }
}
</script>
