<template>
  <div id="decisionSuggestion">
    <template>
      <h1>{{ $t('decisionSuggestion') }}</h1>
      <p>{{ $t('decisionSuggestionText') }}</p>
      <b-form class="form" @submit="onSubmit">
        <b-form-group id="canton-group" class="mt-16" :label="$t('stateOrCantonLabel')" label-for="select-canton">
          <b-form-select
            id="select-canton"
            v-model="suggestForm.canton"
            :options="cantons"
            required
            :oninvalid="this.customErrorMessage()"
            oninput="this.setCustomValidity('')"
          ></b-form-select>
        </b-form-group>
        <b-form-group id="court-group" :label="$t('courtLabel')" label-for="court">
          <b-form-input
            id="court"
            v-model="suggestForm.courtName"
            type="text"
            :placeholder="$t('nameOfCourt')"
            required
            :oninvalid="this.customErrorMessage()"
            oninput="this.setCustomValidity('')"
          ></b-form-input>
        </b-form-group>
        <b-form-input
          id="url"
          v-model="suggestForm.url"
          type="url"
          :placeholder="$t('url')"
          required
          :oninvalid="this.customErrorMessage()"
          oninput="this.setCustomValidity('')"
        ></b-form-input>
        <b-form-textarea
          id="decisionComment"
          class="mt-12"
          v-model="suggestForm.decisionComment"
          :placeholder="$t('noteAndComment')"
        ></b-form-textarea>
        <b-form-input
          id="salutation"
          class="w-15 mt-12"
          v-model="suggestForm.salutation"
          type="text"
          :placeholder="$t('salutation')"
          required
          :oninvalid="this.customErrorMessage()"
          oninput="this.setCustomValidity('')"
        ></b-form-input>
        <b-form-input
          id="firstName"
          class="inline w-30 mt-12"
          v-model="suggestForm.firstName"
          :placeholder="$t('firstName')"
          required
          :oninvalid="this.customErrorMessage()"
          oninput="this.setCustomValidity('')"
          ></b-form-input>
          <b-form-input
          id="lastName"
          class="inline w-30 mt-12"
          v-model="suggestForm.lastName"
          :placeholder="$t('lastName')"
          required
          :oninvalid="this.customErrorMessage()"
          oninput="this.setCustomValidity('')"
        ></b-form-input>
        <b-form-input
          id="email"
          class="mt-12"
          v-model="suggestForm.email"
          type="email"
          :placeholder="$t('email')"
          required
          :oninvalid="this.customErrorMessage()"
          oninput="this.setCustomValidity('')"
        ></b-form-input>
        <b-form-input
          id="tel"
          class="mt-12"
          v-model="suggestForm.tel"
          type="tel"
          :placeholder="$t('tel')"
          required
          :oninvalid="this.customErrorMessage()"
          oninput="this.setCustomValidity('')"
        ></b-form-input>
        <b-form-radio-group class="custom-radio mt-16 mb-16" v-model="suggestForm.membershipType" required stacked>
          <b-form-radio value="member">{{ $t('member') }}</b-form-radio>
          <b-form-radio value="becomeMember">{{ $t('becomeMember') }}</b-form-radio>
          <b-form-radio value="notMember">{{ $t('notMember') }}</b-form-radio>
        </b-form-radio-group>
        <!-- TODO: CAPTCHA-->
        <b-form-checkbox-group required>
          <b-form-checkbox
            id="policyAgreement"
            class="custom-checkbox"
            v-model="suggestForm.policyAgreement"
            :oninvalid="this.customErrorMessage()"
            oninput="this.setCustomValidity('')">
            {{ $t('policyAgreement') }}
          </b-form-checkbox>
        </b-form-checkbox-group>
        <p class="mt-16">{{ $t('privacyAgreementPartOne') }}<br>{{ $t('privacyAgreementPartTwo') }}<b-link href='https://entscheidsuche.ch/datenschutz' target='_blank'>{{ $t('privacyAgreementPartThree') }}</b-link></p>
        <b-button id="toggle-submit" type="submit" variant="primary">{{ $t('startScraping') }}</b-button>
      </b-form>
    </template>
  </div>
</template>

<style lang="scss">
#decisionSuggestion {
  .form {
    text-align: left;

    input, select, textarea {
      width: 60%;

      @media (max-width: 534px) {
        width:100%
      }
    }

    .inline {
      display: inline-flex;
      margin-right: 12px;

      @media (max-width: 534px) {
        display: block;
        margin-right: 0px;
      }
    }

    .custom-radio, .custom-checkbox {
      width: 100%;

      label {
        width: 100%;
      }
    }

    .w-30 {
      width: calc(30% - 6px);

      @media (max-width: 534px) {
        width: 100%;
      }
    }

    .w-15 {
      width: 15%;

      @media (max-width: 534px) {
        width: 25%;
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
  name: 'DecisionSuggestion'
})
export default class DecisionSuggestion extends Vue {
  data () {
    return {
      cantons: [
        { text: this.$t('stateOrCanton').toString(), value: null, disabled: true },
        { text: 'Kanton1', value: 'Kanton1' },
        { text: 'Kanton2', value: 'Kanton2' },
        { text: 'Kanton3', value: 'Kanton3' }
      ]
    }
  }

  private suggestForm: object = {
    salutation: '',
    firstName: '',
    lastName: '',
    email: '',
    tel: '',
    canton: null,
    courtName: '',
    url: '',
    decisionComment: '',
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
    window.console.log(this.suggestForm)
  }
}
</script>
