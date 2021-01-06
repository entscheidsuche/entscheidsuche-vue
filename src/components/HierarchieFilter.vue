<template>
  <b-form-group>
    <treeselect v-model="hierarchieValues"  placeholder="" id="tree" openDirection="below"
      :multiple="true"
      :options="this.transformFacets()"
      :always-open="true"
      :show-count="true"
      :maxHeight="2000"
      :clearable="false"
      :z-index="997">
      @input="onHierarchieChanged"
      <label slot="option-label" slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName}" v-bind:class="[labelClassName, node.raw.count === 0 ? 'empty' : '']">
        <div class="text-wrapper">
          <span>{{ node.label }}</span>
        </div>
        <span :class="countClassName">({{ node.raw.count }})</span>
      </label>
    </treeselect>
  </b-form-group>
</template>

<style lang="scss">
#tree{
  font-size: 16px;
  font-weight:normal;

  .vue-treeselect__multi-value-item{
    color:#fff;
    background-color: #6183ec;
    border-radius: 4px;
    .vue-treeselect__multi-value-label{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 110px;
    }
    .vue-treeselect__icon{
      color:#fff;
      border-left-color:#fff;
    }
  }
  .vue-treeselect__multi-value-item:hover{
    background-color:#3f68e8;
  }
  .vue-treeselect__checkbox{
    width:16px;
    height:16px;
    border-radius:4px;
    border: 1px solid #adb5bd;

    .vue-treeselect__check-mark{
      position:relative;
      top:3px;
      left:3px;
    }
    .vue-treeselect__minus-mark{
      position:relative;
      top:-5px;
      left:3px;
    }
    &.vue-treeselect__checkbox--checked,&.vue-treeselect__checkbox--indeterminate{
      background-color: #6183ec;
      border-color: #6183ec;
    }
  }
  .vue-treeselect__label{
    display: flex;
    justify-content: space-between;
    margin-bottom: 0;
    &.empty{
      color:#bdbdbd
    }
    .text-wrapper{
      flex-shrink: 1;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .vue-treeselect__count{
      flex-shrink: 0;
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { Facet, Filters, FilterType, SearchModule } from '@/store/modules/search'
import { TreeModel } from '@/util/treeModel'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import i18n from '@/i18n'

@Component({
  components: {
    Treeselect
  }
})

export default class HierarchieFilter extends Vue {
  private hierarchieValues: Array<string> = []

  get locale () {
    return AppModule.locale
  }

  get facets () {
    return SearchModule.facets
  }

  get filters () {
    return SearchModule.filters
  }

  mounted () {
    if (Object.prototype.hasOwnProperty.call(this.filters, 'hierarchie')) {
      this.hierarchieValues = this.filters.hierarchie.payload
    }
  }

  @Watch('hierarchieValues')
  public onHierarchieValuesChanged (values: Array<string>) {
    if (values.length > 0) {
      SearchModule.AddFilter({ type: FilterType.HIERARCHY, payload: values })
    } else {
      SearchModule.RemoveFilter(FilterType.HIERARCHY)
    }
  }

  @Watch('filters')
  public onFilterChanged (filters: Filters) {
    if (!Object.prototype.hasOwnProperty.call(filters, 'hierarchie')) {
      if (this.hierarchieValues.length > 0) {
        this.hierarchieValues = []
      }
    }
  }

  public transformFacets () {
    const tree: Array<TreeModel> = []
    const locale = this.locale
    const facets: Array<Facet> = this.facets
    const hierarchie = SearchModule.aggregations.hierarchie || []
    const hierarchieDict: { [key: string]: number } = {}
    for (const aggregation of hierarchie) {
      hierarchieDict[aggregation.key] = aggregation.count
    }
    const lookupCount = function (id: string) {
      if (hierarchieDict[id] !== undefined) {
        return hierarchieDict[id]
      }
      return 0
    }
    facets.forEach((facet: Facet) => {
      if (facet.children !== null && facet.children !== undefined) {
        if (facet.children.length > 0) {
          const childrenArray: Array<TreeModel> = []
          facet.children.forEach((child: Facet) => {
            if (child.children !== null && child.children !== undefined) {
              if (child.children.length > 0) {
                const grandChildrenArray: Array<TreeModel> = []
                child.children.forEach((grandChild: Facet) => {
                  grandChildrenArray.push({ id: grandChild.id, label: grandChild.label[locale], count: lookupCount(grandChild.id) })
                })
                childrenArray.push({ id: child.id, label: child.label[locale], children: grandChildrenArray, count: lookupCount(child.id) })
              }
            } else {
              childrenArray.push({ id: child.id, label: child.label[locale], count: lookupCount(child.id) })
            }
          })
          tree.push({ id: facet.id, label: facet.label[locale], children: childrenArray, count: lookupCount(facet.id) })
        }
      } else {
        tree.push({ id: facet.id, label: facet.label[locale], count: lookupCount(facet.id) })
      }
    })
    return tree
  }
}
</script>
