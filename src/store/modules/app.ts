import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { store } from '@/store'
import i18n from '@/i18n'

export enum MessageState {
  VISIBLE, EMPTY, CLOSED
}

export interface AppState {
  locale: string;
  showLocaleSelector: boolean;
  showMessage: MessageState;
}

@Module({ dynamic: true, store, name: 'app' })
export class App extends VuexModule implements AppState {
  private lang = i18n.locale
  private localeSelector = false
  private message = MessageState.VISIBLE

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

  @Mutation
  public SET_SHOW_MESSAGE (show: MessageState) {
    this.message = show
  }

  @Action({ commit: 'SET_SHOW_MESSAGE' })
  public SetShowMessage (show: MessageState) {
    return show
  }

  public get showMessage (): MessageState {
    return this.message
  }
}

export const AppModule = getModule(App)
