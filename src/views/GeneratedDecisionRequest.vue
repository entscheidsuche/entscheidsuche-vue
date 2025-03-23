<template>
  <div id="generatedDecisionRequest">
    <h1>{{ $t('decisionRequest') }}</h1>
    <p>{{ $t('generatedDecisionRequestText') }}</p>
    <b-form class="decisionRequestForm" @submit="onSubmit">
      <div v-html="generatedForm.salutation" class="readonly"></div>
      <div v-html="generatedForm.firstName" class="readonly"></div>
      <div v-html="generatedForm.lastName" class="readonly"></div>
      <div v-html="generatedForm.street" class="readonly"></div>
      <div v-html="generatedForm.streetSecond" class="readonly"></div>
      <div v-html="generatedForm.postCode" class="readonly"></div>
      <div v-html="generatedForm.city" class="readonly"></div>
      <div v-html="generatedForm.country" class="readonly"></div>
      <div v-html="generatedForm.email" class="readonly"></div>
      <div v-html="generatedForm.courtName" class="readonly right"></div>
      <div v-html="generatedForm.courtAddress" class="readonly right"></div>
      <b-form-textarea
        id="letterText"
        v-model="generatedForm.letterText"
        rows="20"
        placeholder=""
        required
        :oninvalid="this.customErrorMessage()"
        oninput="this.setCustomValidity('')"
      ></b-form-textarea>
      <b-button id="generate-pdf" type="submit" variant="primary">{{ $t('generatePdf') }}</b-button>
    </b-form>
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

interface Form {
  salutation: string,
  firstName: string,
  lastName: string,
  street: string,
  streetSecond: string,
  postCode: string,
  city: string,
  country: string,
  email: string,
  courtName: string,
  courtAdress: string,
  letterText: string
}

const requestUrl = 'http://v2202109132150164038.luckysrv.de/pdf/index.py'

@Component({
  name: 'GeneratedDecisionRequest'
})
export default class GeneratedDecisionRequest extends Vue {
  data () {
    return {
    }
  }

  private generatedForm: Form = {
    salutation: '',
    firstName: '',
    lastName: '',
    street: '',
    streetSecond: '',
    postCode: '',
    city: '',
    country: '',
    email: '',
    courtName: '',
    courtAdress: '',
    letterText: ''
  }

  mounted () {
    const queryData = this.$route.query
    window.console.log('Habe folgende Formulardaten erhalten:', JSON.stringify(queryData))
    for (const key in this.generatedForm) {
      if (Object.prototype.hasOwnProperty.call(queryData, key)) {
        this.generatedForm[key] = queryData[key] // Überschreiben, wenn der Schlüssel existiert
      }
    }
    console.log('Komponente wurde gemountet und initialisiert')
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
