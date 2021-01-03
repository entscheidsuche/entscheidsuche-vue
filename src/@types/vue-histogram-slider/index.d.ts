import Vue from 'vue'

export default class HistogramSlider extends Vue {
  update: (value: { from: number; to: number }) => void
}
