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

  @Watch('sortOrder')
  public onSortOrderChange (sortOrder: SortOrder) {
    if (SearchModule.sortOrder === sortOrder) {
      return
    }
    SearchModule.SetSortOrder(sortOrder)
  }
}
</script>
