import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { store } from '@/store'
import i18n from '@/i18n'

export interface AppState {
  language: string;
}

@Module({ dynamic: true, store, name: 'app' })
export class App extends VuexModule implements AppState {
  private lang = i18n.locale

  @Mutation
  public SET_LANGUAGE (language: string) {
    i18n.locale = language.toLowerCase()
    this.lang = language
  }

  @Action({ commit: 'SET_LANGUAGE' })
  public SetLanguage (language: string) {
    return language
  }

  public get language (): string {
    return this.lang
  }
}

export const AppModule = getModule(App)
