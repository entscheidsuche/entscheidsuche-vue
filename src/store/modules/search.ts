import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { store } from '@/store'
import { SearchUtil } from '@/util/search/search'

export interface SearchResult {
  id: string;
  text: string;
  title: string;
  date: string;
  canton: string;
  pdf: boolean;
  url: string;
  sort: Array<any>;
}

export interface SearchState {
  query: string;
  searchResults: Array<SearchResult>;
  resultsPending: boolean;
  selectedResult: SearchResult | {};
}

@Module({ dynamic: true, store, name: 'search' })
export class Search extends VuexModule implements SearchState {
  private queryString = ''
  private resPending = false
  private results: Array<SearchResult> = []
  private selectedRes: SearchResult | {} = {}

  @Mutation
  public SET_QUERY (query: string) {
    this.queryString = query
  }

  @Action
  public SetQuery (query: string) {
    if (query !== '' && query !== this.queryString) {
      this.context.commit('SET_QUERY', query)
      return this.context.dispatch('SetResults')
    }
  }

  public get query (): string {
    return this.queryString
  }

  @Mutation
  public SET_RESULTS (results: Array<SearchResult>) {
    this.results = results
  }

  @Mutation
  public SET_MORE_RESULTS (results: Array<SearchResult>) {
    this.results = [...this.results, ...results]
  }

  @Action({ commit: 'SET_RESULTS' })
  public async SetResults () {
    this.context.commit('RESULTS_PENDING', true)
    return SearchUtil.search(this.queryString)
      .finally(() => this.context.commit('RESULTS_PENDING', false))
  }

  @Action({ commit: 'SET_MORE_RESULTS' })
  public async SetMoreResults () {
    if (this.results.length > 0) {
      const sort = this.results[this.results.length - 1].sort
      this.context.commit('RESULTS_PENDING', true)
      return SearchUtil.search(this.queryString, sort)
        .finally(() => this.context.commit('RESULTS_PENDING', false))
    }
  }

  public get searchResults (): Array<SearchResult> {
    return this.results
  }

  @Mutation
  public SELECT_RESULT (selectedResult: SearchResult) {
    this.selectedRes = selectedResult
    this.results = [...this.results]
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
    this.selectedRes = pending
  }

  public get resultsPending (): boolean {
    return this.resPending
  }
}

export const SearchModule = getModule(Search)
