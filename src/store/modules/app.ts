import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { store } from '@/store'
import i18n from '@/i18n'

export interface AppState {
  locale: string;
  showLocaleSelector: boolean;
}

@Module({ dynamic: true, store, name: 'app' })
export class App extends VuexModule implements AppState {
  private lang = i18n.locale
  private localeSelector = false

  @Mutation
  public SET_LOCALE (locale: string) {
    i18n.locale = locale.toLowerCase()
    this.lang = locale
  }

  @Action({ commit: 'SET_LOCALE' })
  public SetLocale (locale: string) {
    return locale
  }

  public get locale (): string {
    return this.lang
  }

  @Mutation
  public SET_SHOW_LOCALE_SELECTOR (show: boolean) {
    this.localeSelector = show
  }

  @Action({ commit: 'SET_SHOW_LOCALE_SELECTOR' })
  public SetShowLocaleSelector (show: boolean) {
    return show
  }

  public get showLocaleSelector (): boolean {
    return this.localeSelector
  }
}

export const AppModule = getModule(App)
