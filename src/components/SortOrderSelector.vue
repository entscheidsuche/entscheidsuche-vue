<template>
  <b-form-group v-slot="{ ariaDescribedby }">
    <b-form-radio-group v-model="sortOrder">
      <b-form-radio :aria-describedby="ariaDescribedby" value="relevance">{{ $t('relevance') }}</b-form-radio>
      <b-form-radio :aria-describedby="ariaDescribedby" value="date">{{ $t('date') }}</b-form-radio>
    </b-form-radio-group>
  </b-form-group>
</template>

<style lang="scss">
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SearchModule, SortOrder } from '@/store/modules/search'

@Component
export default class SortOrderSelector extends Vue {
  sortOrder = SortOrder.RELEVANCE

  public mounted () {
    this.sortOrder = SearchModule.sortOrder
  }

  created () {
    window.addEventListener('popstate', this.handlePopState)
  }

  destroyed () {
    window.removeEventListener('popstate', this.handlePopState)
  }

  private handlePopState () {
    const sort = this.$route.query.sort
    const stateSort = SearchModule.sortOrder
    if ((sort === undefined && stateSort === 'date') || (sort === 'date' && stateSort === 'relevance')) {
      if (sort) {
        this.sortOrder = SortOrder.DATE
      } else {
        this.sortOrder = SortOrder.RELEVANCE
      }
    }
  }

  @Watch('sortOrder')
  public onSortOrderChange (sortOrder: SortOrder) {
    if (SearchModule.sortOrder === sortOrder) {
      return
    }
    SearchModule.SetSortOrder(sortOrder)
  }
}
</script>
