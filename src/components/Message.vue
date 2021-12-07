<template>
  <b-collapse visible id="optional-bar" v-if="showMessage">
    <span v-html="$t('message')"></span>
    <b-button variant="primary" v-on:click="onCloseMessageBar()" id="close-bar-btn">
      <b-icon id="close-optional-bar"></b-icon>
    </b-button>
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

  #close-bar-btn{
    position: absolute;
    top:10px;
    right:20px;
    height:20px;
    width:20px;
    padding:0;
    #close-optional-bar{
      background: url('../assets/bootstrap-close-medium-white.svg') no-repeat center;
      height:16px;
      width:16px;
      position:absolute;
      top:1px;
      left:1px;
    }
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
