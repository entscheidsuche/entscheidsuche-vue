import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { store } from '@/store'
import { SearchUtil } from '@/util/search/search'
import _ from 'lodash'
import router from '@/router'
import { AppModule } from '@/store/modules/app'

const FILTER_DELIMITER = '@'

export type Facets = Array<Facet>

export enum FilterType {
  HIERARCHY = 'hierarchie', DATE = 'edatum', LANGUAGE = 'language'
}

export enum SortOrder {
  RELEVANCE = 'relevance', DATE = 'date'
}

function updateRoute (queryString: string, filters: Filters, sortOrder: SortOrder, selectedId?: string, preview?: string, fullScreen?: string): void {
  const name = router.currentRoute.name
  const query = { ...router.currentRoute.query }
  const existingQueryString = query.query
  const existingFilters = query.filter !== undefined ? Array.isArray(query.filter) ? query.filter : [query.filter] : undefined
  const newFilters: Array<string> | undefined = Object.keys(filters).length > 0 ? [] : undefined
  const newQueryString = queryString !== '' ? queryString : undefined
  const existingSort = query.sort !== undefined && query.sort === SortOrder.DATE ? SortOrder.DATE : undefined
  const newSort = sortOrder === SortOrder.DATE ? SortOrder.DATE : undefined
  const existingSelectedId = query.selectedId
  const newSelectedId = selectedId !== '' ? selectedId : undefined
  const existingPreview = query.preview
  const newPreview = preview !== '' ? preview : undefined
  const existingFullScreen = query.fullScreen
  const newFullScreen = fullScreen !== '' ? fullScreen : undefined

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
  if (existingQueryString !== newQueryString || !_.isEqual(existingFilters, newFilters) || existingSort !== newSort ||
    name !== 'Search' || newSelectedId !== existingSelectedId || newPreview !== existingPreview || newFullScreen !== existingFullScreen) {
    if (newQueryString !== undefined) {
      query.query = newQueryString
    } else {
      delete query.query
    }
    if (newFilters !== undefined) {
      query.filter = newFilters
    } else {
      delete query.filter
    }
    if (newSort !== undefined) {
      query.sort = newSort
    } else {
      delete query.sort
    }
    if (newSelectedId !== undefined) {
      query.selected = newSelectedId
    } else {
      delete query.selected
    }
    if (newPreview !== undefined) {
      query.preview = newPreview
    } else {
      delete query.preview
    }
    if (newFullScreen !== undefined) {
      query.fullScreen = newFullScreen
    } else {
      delete query.fullScreen
    }
    if (name !== undefined && name !== null && newQueryString !== undefined) {
      router.push({ name: 'Search', query: query })
    }
  }
}

function updateViewRoute (document: string): void {
  const name = router.currentRoute.name
  const params = { ...router.currentRoute.params }
  const existingDocument = router.currentRoute.params.doc
  const existingLang = router.currentRoute.query.lang

  if (existingDocument !== document || name !== 'View') {
    let query: {} | { lang: string } = {}
    if (document !== undefined) {
      params.doc = document
    } else {
      delete params.doc
    }
    if (existingLang !== undefined) {
      query = { lang: existingLang }
    }
    if (name !== undefined && name !== null && document !== undefined) {
      router.push({ name: 'View', params: params, query: query })
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
  document: string;
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
  private doc = ''
  private resPending = false
  private total = 0
  private results: Array<SearchResult> = []
  private selectedRes: SearchResult | {} = {}
  private allResLoaded = false
  private aggs: Aggregations = {}
  private fac: Facets = []
  private filt: Filters = {}
  private sort = SortOrder.RELEVANCE
  private preview = ''
  private fullscreen = ''

  public get pristine () {
    return this.prist
  }

  @Mutation
  public SET_QUERY (query: string) {
    this.queryString = query
    this.doc = ''
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

  @Mutation
  public RESET_QUERY (query: string) {
    this.queryString = query
  }

  @Action
  public ResetQuery (query: string) {
    if (this.fac.length === 0) {
      return this.context.dispatch('GetFacets').then(() => {
        if (query !== this.queryString) {
          this.context.commit('RESET_QUERY', query)
          return this.context.dispatch('SetResults')
        }
      })
    } else {
      if (query !== this.queryString) {
        this.context.commit('RESET_QUERY', query)
        return this.context.dispatch('SetResults')
      }
    }
  }

  public get query (): string {
    return this.queryString
  }

  @Mutation
  public SET_DOCUMENT (doc: string) {
    this.doc = doc
    if (doc === '') {
      if (this.queryString !== '') {
        updateRoute(this.queryString, this.filt, this.sort)
      } else {
        router.push({ name: 'Home', query: { ...router.currentRoute.query } })
      }
    }
  }

  @Action
  public SetDocument (doc: string) {
    if (doc !== this.doc) {
      this.context.commit('SET_DOCUMENT', doc)
      if (doc !== '') {
        if ('id' in this.selectedRes && this.selectedRes.id === doc) {
          updateViewRoute(this.doc)
        } else {
          return this.context.dispatch('SetDocumentResult').then(() => {
            updateViewRoute(this.doc)
          })
        }
      } else {
        return this.context.dispatch('SetResults')
      }
    }
  }

  @Mutation
  public SET_FULLSCREEN (fullscreen: string) {
    if (fullscreen !== '') {
      if ('id' in this.selectedRes) {
        this.fullscreen = fullscreen
        updateRoute(this.queryString, this.filt, this.sort, this.selectedRes.id, this.preview, this.fullscreen)
      } else {
        router.push({ name: 'Home', query: { ...router.currentRoute.query } })
      }
    } else {
      if ('id' in this.selectedRes) {
        this.fullscreen = ''
        updateRoute(this.queryString, this.filt, this.sort, this.selectedRes.id, this.preview)
      }
    }
  }

  @Action({ commit: 'SET_FULLSCREEN' })
  public SetFullScreen (fullscreen: string) {
    return fullscreen
  }

  public get document (): string {
    return this.doc
  }

  public get sortOrder (): SortOrder {
    return this.sort
  }

  @Mutation
  public SET_SORT_ORDER (sortOrder: SortOrder) {
    if (this.sort !== sortOrder) {
      this.sort = sortOrder
      updateRoute(this.queryString, this.filt, sortOrder)
    }
  }

  @Action
  public SetSortOrder (sortOrder: SortOrder) {
    this.context.commit('SET_SORT_ORDER', sortOrder)
    if (this.queryString !== '') {
      return this.context.dispatch('SetResults')
    }
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
    if (!_.isEqual(this.filt, newFilters)) {
      this.filt = newFilters
      updateRoute(this.queryString, newFilters, this.sort)
    }
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
    if (!(filters.length === 0 && Object.keys(this.filt).length === 0)) {
      this.context.commit('SET_FILTERS', filters)
      if (this.queryString !== '') {
        return this.context.dispatch('SetResults')
      }
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
    this.allResLoaded = false
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
  public SET_DOCUMENT_RESULT (result: SearchResult) {
    if (this.prist) {
      this.prist = false
    }
    this.results = [result]
    this.selectedRes = result
    this.total = 1
    this.aggs = {}
    this.allResLoaded = true
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

  @Action({ commit: 'SET_DOCUMENT_RESULT' })
  public async SetDocumentResult () {
    this.context.commit('RESULTS_PENDING', true)
    return SearchUtil.document(this.doc, AppModule.locale)
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

  public getResultbyId (id: string): SearchResult | undefined {
    for (let i = 0; i < this.results.length; i++) {
      if (this.results[i].id === id) {
        return this.results[i]
      }
    }
    return undefined
  }

  @Mutation
  public SELECT_RESULT (selectedResult?: SearchResult) {
    if (selectedResult) {
      const query = { ...router.currentRoute.query }
      const selectedId = query.selected
      const preview = query.preview
      if ('id' in this.selectedRes) {
        if (selectedResult.id && preview === undefined && selectedId === selectedResult.id && selectedId === this.selectedRes.id) {
          this.preview = 'true'
          updateRoute(this.queryString, this.filt, this.sort, selectedResult.id, this.preview)
        }
      }
      if (selectedResult.id && (selectedId !== selectedResult.id)) {
        this.preview = 'true'
        updateRoute(this.queryString, this.filt, this.sort, selectedResult.id, this.preview)
      }
      this.selectedRes = selectedResult
    } else {
      this.selectedRes = {}
    }
  }

  @Mutation
  public SET_PREVIEW (visible: boolean) {
    if (!visible && 'id' in this.selectedRes) {
      this.preview = ''
      updateRoute(this.queryString, this.filt, this.sort, this.selectedRes.id, this.preview)
    }
  }

  @Action({ commit: 'SELECT_RESULT' })
  public Select (selectedResult?: SearchResult) {
    return selectedResult
  }

  @Action({ commit: 'SET_PREVIEW' })
  public SetPreview (visible: boolean) {
    return visible
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
