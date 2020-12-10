<template>
  <b-collapse visible id="optional-bar" v-if="showMessage">
    {{ $t('message') }}
    <div id="close-optional-bar" v-on:click="onCloseMessageBar()"></div>
  </b-collapse>
</template>

<style lang="scss">
#optional-bar{
  height: 40px;
  padding-top:10px;
  color: #000;
  background-color: #e5e9f1;
  font-weight: bold;
  position:relative;

  #close-optional-bar{
    position: absolute;
    top:10px;
    right:20px;
    cursor:pointer;
    background: url('../assets/close.svg') no-repeat center;
    background-size: 20px;
    height:20px;
    width:20px;
    transition: all .2s ease-in-out;
  }
  #close-optional-bar:hover{
    transform: scale(1.1);
  }
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { AppModule, MessageState } from '@/store/modules/app'

@Component
export default class LocaleSelector extends Vue {
  public onCloseMessageBar (): void {
    AppModule.SetShowMessage(MessageState.CLOSED)
  }

  public mounted () {
    if (this.$t('message') === '') {
      AppModule.SetShowMessage(MessageState.EMPTY)
    }
  }

  public get locale () {
    return AppModule.locale
  }

  @Watch('locale')
  public onLocaleChange () {
    if (AppModule.showMessage === MessageState.VISIBLE && this.$t('message') === '') {
      AppModule.SetShowMessage(MessageState.EMPTY)
    } else if (AppModule.showMessage === MessageState.EMPTY && this.$t('message') !== '') {
      AppModule.SetShowMessage(MessageState.VISIBLE)
    }
  }

  public get showMessage () {
    return AppModule.showMessage === MessageState.VISIBLE
  }
}
</script>
