<template>
  <div id="language-overlay" v-if="showLocaleSelector">
    <div class="language-wrapper">
      <b-button v-on:click="onCancelLocaleChange()" variant="primary" id="close-language-overlay">
        <b-icon id="close-menu"></b-icon>
      </b-button>
      <div class="language-body">
        <div class="dialog">
          <h3 id="language-title">{{ $t('question') }}</h3>
          <b-form-group>
            <b-form-radio v-model="localeChangeSelected" name="some-radios" value="de">{{ $t('german') }}</b-form-radio>
            <b-form-radio v-model="localeChangeSelected" name="some-radios" value="fr">{{ $t('french') }}</b-form-radio>
            <b-form-radio v-model="localeChangeSelected" name="some-radios" value="it">{{ $t('italian') }}</b-form-radio>
          </b-form-group>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#language-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 1000;
  cursor: pointer;

  .language-wrapper{
    width:400px;
    height:auto;
    background-color: #fff;
    position: fixed;
    top: 50%;
    left: 50% ;
    margin-top: -180px;
    margin-left: -200px;
    border-radius: 4px;

    #close-language-overlay{
      position: absolute;
      top:10px;
      right:10px;
      background-size: 20px;
      transition: all .2s ease-in-out;
      height:30px;
      width:30px;

      #close-menu {
        background: url('../assets/bootstrap-close-big-white.svg') no-repeat center;
        position:absolute;
        height:28px;
        width:28px;
        top:0;
        left:0;
      }
    }
    .language-body{
      margin:40px;
      position:relative;

      #language-title{
        font-weight: bold;
      }

      .form-group{
        text-align:left;
        font-size:18px;
        margin-left:40px;
        margin-top:20px;
      }
      .language-buttons{
        position:absolute;
        bottom:0;
        display:flex;
        justify-content: space-between;

        button{
          width:150px;
        }
        #left{
          margin-right: 20px;
        }
      }
    }
  }
}

//smartphone
@media (max-width: 534px){
  #language-overlay {
    background-color: #fff;
    .language-wrapper{
      width:100vw;
      min-height: -webkit-fill-available;
      top: 0;
      left: 50%;
      margin-top: 0;
      margin-left: -50%;

      .language-body{
        top:10px;
        height: calc(100% - 60px);
        margin-top:40px;
        width: calc(100vw - 40px);
        padding-top: 60px;
        margin-left: 20px;
        margin-right: 20px;
        display: flex;

        .dialog{
          position:relative;
          top:-76px;
          .form-group{
            .custom-radio{
              padding-top:10px;
            }
          }
        }
      }
      #close-language-overlay{
        top:20px;
        right:20px;
      }
      .language-buttons{
        width: 100%;
        position:absolute;
        bottom:0;

        button{
          flex-basis: 150px;
          flex-grow: 1;
        }
      }
    }
  }
}
</style>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component
export default class LocaleSelector extends Vue {
  private localeChangeSelected = 'de'

  public created () {
    this.localeChangeSelected = this.locale
  }

  public get locale () {
    return AppModule.locale
  }

  public get showLocaleSelector () {
    return AppModule.showLocaleSelector
  }

  @Watch('locale')
  public onLocaleChange (locale: string) {
    if (this.localeChangeSelected !== locale) {
      this.localeChangeSelected = locale
    }
  }

  @Watch('localeChangeSelected')
  public onShowLocaleSelectorChange (selectedLoale: string) {
    if (this.locale !== selectedLoale) {
      AppModule.SetLocale(selectedLoale)
      AppModule.SetShowLocaleSelector(false)
    }
  }

  public onCancelLocaleChange (): void {
    AppModule.SetShowLocaleSelector(false)
  }
}
</script>
