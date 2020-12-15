import Vue from 'vue'
import Vuex from 'vuex'
import { AppState } from '@/store/modules/app'
import { SearchState } from '@/store/modules/search'

Vue.use(Vuex)

export interface RouteState {
  name?: string | null;
  path: string;
  hash: string;
  query: Record<string, string | (string | null)[]>;
  params: Record<string, string>;
  fullPath: string;
  from?: Omit<RouteState, 'from'>;
}

export interface RootState {
  app: AppState;
  search: SearchState;
  route: RouteState;
}

export const store = new Vuex.Store<RootState>({
  strict: true
})
