import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { store } from '@/store'
import { SearchUtil } from '@/util/search/search'
import _ from 'lodash'
import router from '@/router'
import { Dictionary } from 'vue-router/types/router'
import { AppModule } from '@/store/modules/app'

const FILTER_DELIMITER = '@'

export type Facets = Array<Facet>

export enum FilterType {
  HIERARCHY = 'hierarchie', DATE = 'edatum', LANGUAGE = 'language'
}

export enum SortOrder {
  RELEVANCE = 'relevance', DATE = 'date'
}

function updateRoute (queryString: string, filters: Filters, sortOrder: SortOrder): void {
  const name = router.currentRoute.name
  const query = { ...router.currentRoute.query }
  const existingQueryString = query.query
  const existingFilters = query.filter !== undefined ? Array.isArray(query.filter) ? query.filter : [query.filter] : undefined
  const newFilters: Array<string> | undefined = Object.keys(filters).length > 0 ? [] : undefined
  const newQueryString = queryString !== '' ? queryString : undefined
  const existingSort = query.sort !== undefined && query.sort === SortOrder.DATE ? SortOrder.DATE : undefined
  const newSort = sortOrder === SortOrder.DATE ? SortOrder.DATE : undefined

  if (newFilters !== undefined) {
    for (const filterKey in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, filterKey)) {
        const filter = filters[filterKey]
        if (filter.type === FilterType.HIERARCHY) {
          newFilters.push(`h${FILTER_DELIMITER}${filter.payload.join()}`)
        } else if (filter.type === FilterType.DATE) {
          newFilters.push(`e${FILTER_DELIMITER}${filter.payload.from ? filter.payload.from : ''},${filter.payload.to !== undefined ? filter.payload.to : ''}`)
        } else if (filter.type === FilterType.LANGUAGE) {
          newFilters.push(`l${FILTER_DELIMITER}${filter.payload.join()}`)
        }
      }
    }
  }
  if (existingQueryString !== newQueryString || !_.isEqual(existingFilters, newFilters) || existingSort !== newSort) {
    const newQuery: Dictionary<string | string[]> = {}
    if (newQueryString !== undefined) {
      newQuery.query = newQueryString
    }
    if (newFilters !== undefined) {
      newQuery.filter = newFilters
    }
    if (newSort !== undefined) {
      newQuery.sort = newSort
    } else {
      delete newQuery.sort
    }
    if (name !== undefined && name !== null && newQueryString !== undefined) {
      router.push({ name: name, query: newQuery })
    }
  }
}

export interface Label {
  de: string;
  fr: string;
  it: string;
}

export type Facet = {
  id: string;
  label: Label;
  children?: Array<Facet>;
}

export interface Filter {
  type: FilterType;
  // eslint-disable-next-line
  payload: any;
}

export type Filters = {
  [key in string]: Filter
}

export interface SearchResult {
  id: string;
  title: string;
  abstract: string;
  text: string;
  date: string;
  canton: string;
  pdf: boolean;
  url: string;
  sort: Array<string | number>;
}

export interface Aggregation {
  key: string | number;
  count: number;
}

export type Aggregations = {
  [key in string]: Array<Aggregation>
}

export interface SearchState {
  pristine: boolean;
  query: string;
  filters: Filters;
  sortOrder: SortOrder;
  searchTotal: number;
  searchResults: Array<SearchResult>;
  resultsPending: boolean;
  selectedResult: SearchResult | {};
  allResultsLoaded: boolean;
  aggregations: Aggregations;
  facets: Facets;
}

@Module({ dynamic: true, store, name: 'search' })
export class Search extends VuexModule implements SearchState {
  private prist = true
  private queryString = ''
  private resPending = false
  private total = 0
  private results: Array<SearchResult> = []
  private selectedRes: SearchResult | {} = {}
  private allResLoaded = false
  private aggs: Aggregations = {}
  private fac: Facets = []
  private filt: Filters = {}
  private sort = SortOrder.RELEVANCE

  public get pristine () {
    return this.prist
  }

  @Mutation
  public SET_QUERY (query: string) {
    this.queryString = query
    if (query === '') {
      this.filt = {}
    }
    updateRoute(query, this.filt, this.sort)
  }

  @Action
  public SetQuery (query: string) {
    if (this.fac.length === 0) {
      return this.context.dispatch('GetFacets').then(() => {
        if (query !== this.queryString) {
          this.context.commit('SET_QUERY', query)
          return this.context.dispatch('SetResults')
        }
      })
    } else {
      if (query !== this.queryString) {
        this.context.commit('SET_QUERY', query)
        return this.context.dispatch('SetResults')
      }
    }
  }

  public get sortOrder (): SortOrder {
    return this.sort
  }

  @Mutation
  public SET_SORT_ORDER (sortOrder: SortOrder) {
    this.sort = sortOrder
    updateRoute(this.queryString, this.filt, sortOrder)
  }

  @Action
  public SetSortOrder (sortOrder: SortOrder) {
    this.context.commit('SET_SORT_ORDER', sortOrder)
    if (this.queryString !== '') {
      return this.context.dispatch('SetResults')
    }
  }

  public get query (): string {
    return this.queryString
  }

  @Mutation
  public SET_FILTERS (filters: Array<Filter | string>) {
    const newFilters: Filters = {}
    for (const filter of filters) {
      if (typeof filter === 'string') {
        if (filter.startsWith('e' + FILTER_DELIMITER)) {
          const numbers = filter.substring(1 + FILTER_DELIMITER.length).split(',')
          newFilters.edatum =
          {
            type: FilterType.DATE,
            payload:
            {
              from: numbers[0].length > 0 ? parseInt(numbers[0]) : undefined,
              to: numbers[1].length > 0 ? parseInt(numbers[1]) : undefined
            }
          }
        } else if (filter.startsWith('h' + FILTER_DELIMITER)) {
          const ids = filter.substring(1 + FILTER_DELIMITER.length).split(',')
          newFilters.hierarchie = { type: FilterType.HIERARCHY, payload: ids }
        } else if (filter.startsWith('l' + FILTER_DELIMITER)) {
          const ids = filter.substring(1 + FILTER_DELIMITER.length).split(',')
          newFilters.language = { type: FilterType.LANGUAGE, payload: ids }
        }
      } else {
        newFilters[filter.type] = filter
      }
    }
    this.filt = newFilters
    updateRoute(this.queryString, newFilters, this.sort)
  }

  @Mutation
  public ADD_FILTER (filter: Filter) {
    this.filt = { ...this.filt, [filter.type]: filter }
    updateRoute(this.queryString, this.filt, this.sort)
  }

  @Mutation
  public REMOVE_FILTER (type: FilterType) {
    const newFilters = { ...this.filt }
    delete newFilters[type]
    this.filt = newFilters
    updateRoute(this.queryString, newFilters, this.sort)
  }

  @Action
  public SetFilters (filters: Array<Filter | string>) {
    this.context.commit('SET_FILTERS', filters)
    if (this.queryString !== '') {
      return this.context.dispatch('SetResults')
    }
  }

  @Action
  public AddFilter (filter: Filter) {
    this.context.commit('ADD_FILTER', filter)
    if (this.queryString !== '') {
      return this.context.dispatch('SetResults')
    }
  }

  @Action
  public RemoveFilter (type: FilterType) {
    this.context.commit('REMOVE_FILTER', type)
    if (this.queryString !== '') {
      return this.context.dispatch('SetResults')
    }
  }

  public get filters (): Filters {
    return this.filt
  }

  @Mutation
  public SET_FACETS (facets: Facets) {
    this.fac = facets
  }

  @Action({ commit: 'SET_FACETS' })
  public async GetFacets () {
    return SearchUtil.facets()
  }

  public get facets (): Facets {
    return this.fac
  }

  @Mutation
  public SET_RESULTS (results: [Array<SearchResult>, number, Aggregations]) {
    if (this.prist) {
      this.prist = false
    }
    this.results = results[0]
    if ('id' in this.selectedRes) {
      const id = this.selectedRes.id
      let found = false
      for (const result of results[0]) {
        if (result.id === id) {
          this.selectedRes = result
          found = true
          break
        }
      }
      if (!found) {
        this.selectedRes = {}
      }
    }
    this.total = results[1]
    const newAggregations = {}
    for (const key in results[2]) {
      if (Object.prototype.hasOwnProperty.call(results[2], key)) {
        const oldAggs = this.aggs[key]
        const newAggs = results[2][key]
        if (oldAggs !== undefined && _.isEqual(oldAggs, newAggs)) {
          newAggregations[key] = oldAggs
        } else {
          newAggregations[key] = newAggs
        }
      }
    }
    this.aggs = newAggregations
  }

  @Mutation
  public SET_MORE_RESULTS (results: [Array<SearchResult>, number] | undefined) {
    if (results !== undefined) {
      this.allResLoaded = results[0].length === 0
      this.results = [...this.results, ...results[0]]
    }
  }

  @Action({ commit: 'SET_RESULTS' })
  public async SetResults () {
    this.context.commit('RESULTS_PENDING', true)
    return SearchUtil.search(this.queryString, AppModule.locale, this.filt, this.sort)
      .finally(() => this.context.commit('RESULTS_PENDING', false))
  }

  @Action({ commit: 'SET_MORE_RESULTS' })
  public async SetMoreResults () {
    if (this.results.length > 0) {
      const sortAfter = this.results[this.results.length - 1].sort
      this.context.commit('RESULTS_PENDING', true)
      return SearchUtil.search(this.queryString, AppModule.locale, this.filt, this.sort, sortAfter)
        .finally(() => this.context.commit('RESULTS_PENDING', false))
    }
  }

  public get searchResults (): Array<SearchResult> {
    return this.results
  }

  public get searchTotal (): number {
    return this.total
  }

  @Mutation
  public SELECT_RESULT (selectedResult: SearchResult) {
    this.selectedRes = selectedResult
  }

  @Action({ commit: 'SELECT_RESULT' })
  public Select (selectedResult: SearchResult) {
    return selectedResult
  }

  public get selectedResult (): SearchResult | {} {
    return this.selectedRes
  }

  @Mutation
  public RESULTS_PENDING (pending: boolean) {
    this.resPending = pending
  }

  public get resultsPending (): boolean {
    return this.resPending
  }

  public get allResultsLoaded (): boolean {
    return this.allResLoaded
  }

  public get aggregations (): Aggregations {
    return this.aggs
  }
}

export const SearchModule = getModule(Search)
