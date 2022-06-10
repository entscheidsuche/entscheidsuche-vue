<template>
  <div id="decisionRequest">
    <template>
      <h1>{{ $t('decisionRequest') }}</h1>
      <p>{{ $t('generatedDecisionRequestText') }}</p>
      <b-form class="decisionRequestForm" @submit="onSubmit">
        <div v-html="generatedForm.sender1" class="readonly"></div>
        <div v-html="generatedForm.sender2" class="readonly"></div>
        <div v-html="generatedForm.sender3" class="readonly"></div>
        <div v-html="generatedForm.sender4" class="readonly"></div>
        <div v-html="generatedForm.sender5" class="readonly"></div>
        <div v-html="generatedForm.email" class="readonly"></div>
        <div v-html="generatedForm.gerName" class="readonly right"></div>
        <div v-html="generatedForm.gerStrasse" class="readonly right"></div>
        <div v-html="generatedForm.gerPostfach" class="readonly right"></div>
        <div v-html="generatedForm.gerStadt" class="readonly right mb-16"></div>
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
        text-align: right;
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

const requestUrl = 'http://v2202109132150164038.luckysrv.de/pdf/index.py'

@Component({
  name: 'GeneratedDecisionRequest'
})
export default class GeneratedDecisionRequest extends Vue {
  data () {
    return {
    }
  }

  private generatedForm: object = {
    sender1: 'Rechtsanwältin',
    sender2: 'Dagmar Immerrecht',
    sender3: 'Gerichtsstrasse 42',
    sender4: '1205 Genf',
    sender5: '',
    email: 'dagmar@immerrecht.ch',
    gerName: 'Bundesgericht',
    gerStrasse: 'Avenue du Tribunal 29',
    gerPostfach: '',
    gerStadt: '1005 Lausanne',
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
    const xhr = new XMLHttpRequest()
    const url = requestUrl
    xhr.open('POST', url, true)
    // xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
    // window.alert("Sende Suchanfrage für "+se.id+" mit Data:\n" + data);
    xhr.send(JSON.stringify(this.generatedForm))
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        window.alert('Antwort: ' + xhr.responseText)
        // var result=JSON.parse(xhr.responseText);
        // se.hits=result.hits;
        // window.alert("Antwort für "+se.id+": " + result.hits);
        // this.searchEngines_result.result=result;
        // document.getElementById("tab-content-"+se.id).title="XY";
      }
    }
  }
}
</script>
