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
}

export interface SearchState {
  query: string;
  searchResults: Array<SearchResult>;
  selectedResult: SearchResult | {};
}

@Module({ dynamic: true, store, name: 'search' })
export class Search extends VuexModule implements SearchState {
  private queryString = ''
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

  @Action({ commit: 'SET_RESULTS' })
  public async SetResults () {
    return SearchUtil.search(this.queryString)
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
    window.console.log('IN isSelected')
    return this.selectedRes
  }
}

export const SearchModule = getModule(Search)
