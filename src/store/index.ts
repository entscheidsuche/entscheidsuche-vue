import Vue from 'vue'
import Vuex from 'vuex'
import { AppState } from '@/store/modules/app'

Vue.use(Vuex)

export interface RootState {
  app: AppState;
}

export const store = new Vuex.Store<RootState>({
  strict: true
})
