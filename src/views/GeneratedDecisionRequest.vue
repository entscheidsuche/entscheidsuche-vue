<template>
  <div id="decisionRequest">
    <template>
      <h1>{{ $t('decisionRequest') }}</h1>
      <p>{{ $t('generatedDecisionRequestText') }}</p>
      <b-form class="decisionRequestForm" @submit="onSubmit">
        <div v-html="generatedForm.sender" class="readonly"></div>
        <div v-html="generatedForm.recipient" class="readonly right mb-16"></div>
        <b-form-textarea
          id="letterText"
          v-model="generatedForm.letterText"
          rows="20"
          placeholder=""
          required
          :oninvalid="this.customErrorMessage()"
          oninput="this.setCustomValidity('')"
        ></b-form-textarea>
        <b-form-radio-group class="custom-radio mt-16 mb-16" v-model="generatedForm.membershipType" required stacked>
            <b-form-radio value="member">{{ $t('member') }}</b-form-radio>
            <b-form-radio value="becomeMember">{{ $t('becomeMember') }}</b-form-radio>
            <b-form-radio value="notMember">{{ $t('notMember') }}</b-form-radio>
          </b-form-radio-group>
        <!-- TODO: CAPTCHA-->
        <b-form-checkbox-group required>
          <b-form-checkbox
            id="policyAgreement"
            class="custom-checkbox"
            v-model="generatedForm  .policyAgreement"
            :oninvalid="this.customErrorMessage()"
            oninput="this.setCustomValidity('')">
              {{ $t('policyAgreement') }}
          </b-form-checkbox>
        </b-form-checkbox-group>
        <p class="mt-16">{{ $t('privacyAgreementPartOne') }}<br>{{ $t('privacyAgreementPartTwo') }}<b-link href='https://entscheidsuche.ch/datenschutz' target='_blank'>{{ $t('privacyAgreementPartThree') }}</b-link></p>
        <b-button id="generate-pdf" type="submit" variant="primary">{{ $t('generatePdf') }}</b-button>
      </b-form>
    </template>
  </div>
</template>

<style lang="scss">
#decisionRequest {
  .decisionRequestForm {
    text-align: left;
    width: 80%;

    @media (max-width: 534px) {
      width:100%
    }

    .readonly {
      font-style: italic;

      &.right {
        float: right;
      }
    }

    .mt-12 {
      margin-top: 12px;
    }

    .mt-16 {
      margin-top: 16px;
    }

    .mb-16 {
      margin-bottom: 16px;
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'GeneratedDecisionRequest'
})
export default class GeneratedDecisionRequest extends Vue {
  data () {
    return {
    }
  }

  private generatedForm: object = {
    sender: 'Rechtsanwältin<br>Dagmar Immerrecht<br>Gerichtsstrasse 42<br>1205 Genf<br>dagmar@immerrecht.ch',
    recipient: 'Bundesgericht<br>Avenue du Tribunal 29<br>1005 Lausanne<br><br>5.12.2021',
    letterText: 'Sehr geehrte Damen und Herren,\n\nGerne möchte ich Sie bitten, mir eine Kopie des Urteils 12T 3/2021 des ' +
     'Bundesgeichts vom 1.12.2021 vorzugsweise per E-Mail an die oben genannte Adresse zu schicken.\n\nGemäss Urteil des ' +
     'Bundesgerichts 1C_194/2020 vom 27. Juli 2021...\n\nMit freundlichen Grüßen\nDagmar Immerrecht',
    membershipType: '',
    policyAgreement: ''
  }

  public get locale () {
    return AppModule.locale
  }

  public customErrorMessage () {
    const errorMessage = this.locale === 'de' ? 'Bitte füllen Sie dieses Feld aus' : this.locale === 'fr' ? 'fr' : 'it'
    const returnValue = 'this.setCustomValidity(' + "'" + errorMessage + "'" + ')'
    return returnValue
  }

  public onSubmit (event) {
    event.preventDefault()
    window.console.log(this.generatedForm)
  }
}
</script>
