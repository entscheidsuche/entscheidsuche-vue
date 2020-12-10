import Vue from 'vue'
import Vuex from 'vuex'
import { AppState } from '@/store/modules/app'
import router from '@/router'
import { sync } from 'vuex-router-sync'

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
  route: RouteState;
}

export const store = new Vuex.Store<RootState>({
  strict: true
})

sync(store, router)
