<template>
  <div id="decisionRequest">
    <template>
      <h1>{{ $t('decisionRequest') }}</h1>
      <p>{{ $t('decisionRequestText') }}</p>
      <b-form class="form" @submit="onSubmit">
        <b-form-input
          id="salutation"
          class="w-15"
          v-model="form.salutation"
          type="text"
          :placeholder="$t('salutation')"
          required
          :oninvalid="this.customErrorMessage()"
          oninput="this.setCustomValidity('')"
        ></b-form-input>
        <b-form-input
          id="firstName"
          class="inline w-30 mt-12"
          v-model="form.firstName"
          :placeholder="$t('firstName')"
          required
          :oninvalid="this.customErrorMessage()"
          oninput="this.setCustomValidity('')"
        ></b-form-input>
        <b-form-input
          id="lastName"
          class="inline w-30 mt-12"
          v-model="form.lastName"
          :placeholder="$t('lastName')"
          required
          :oninvalid="this.customErrorMessage()"
          oninput="this.setCustomValidity('')"
        ></b-form-input>
        <b-form-input
          id="email"
          class="mt-12"
          v-model="form.email"
          type="email"
          :placeholder="$t('email')"
          required
          :oninvalid="this.customErrorMessage()"
          oninput="this.setCustomValidity('')"
        ></b-form-input>
        <b-form-input
          id="tel"
          class="mt-12"
          v-model="form.tel"
          type="tel"
          :placeholder="$t('tel')"
          required
          :oninvalid="this.customErrorMessage()"
          oninput="this.setCustomValidity('')"
        ></b-form-input>
        <b-form-input
          id="street"
          class="mt-12"
          v-model="form.street"
          type="text"
          :placeholder="$t('street')"
        ></b-form-input>
        <b-form-input
          id="streetSecond"
          class="mt-12"
          v-model="form.streetSecond"
          type="text"
          :placeholder="$t('streetSecond')"
        ></b-form-input>
        <b-form-input
          id="postCode"
          class="inline mt-12 w-15"
          v-model="form.postCode"
          type="text"
          :placeholder="$t('postCode')"
        ></b-form-input>
        <b-form-input
          id="city"
          class="inline mt-12 w-45"
          v-model="form.city"
          type="text"
          :placeholder="$t('city')"
        ></b-form-input>
        <b-form-select
          id="country"
          class="mt-12"
          v-model="form.country"
          :options="countries"
          required
          :oninvalid="this.customErrorMessage()"
          oninput="this.setCustomValidity('')"
        ></b-form-select>
        <b-form-group id="canton-group" class="mt-16" :label="$t('stateOrCantonLabel')" label-for="select-canton">
          <b-form-select
            id="select-canton"
            v-model="form.canton"
            :options="cantons"
            required
            :oninvalid="this.customErrorMessage()"
            oninput="this.setCustomValidity('')"
          ></b-form-select>
        </b-form-group>
        <b-form-group id="court-group" :label="$t('courtLabel')" label-for="court">
          <b-form-select
            id="court"
            v-model="form.court"
            :options="courts"
            required
            :oninvalid="this.customErrorMessage()"
            oninput="this.setCustomValidity('')"
          ></b-form-select>
        </b-form-group>
        <div v-if="form.court === 'other'">
          <b-form-input
            id="courtName"
            v-model="form.courtName"
            type="text"
            :placeholder="$t('courtName')"
            required
            :oninvalid="this.customErrorMessage()"
            oninput="this.setCustomValidity('')"
          ></b-form-input>
          <b-form-textarea
            id="courtAddress"
            class="mt-12"
            v-model="form.courtAddress"
            :placeholder="$t('courtAddress')"
          ></b-form-textarea>
        </div>
        <b-form-group id="date-group" class="mt-16" :label="$t('decisionDateLabel')" label-for="date-form">
          <b-form-datepicker id="date-form" v-model="form.date" placeholder="" :hide-header="true" :locale="locale"></b-form-datepicker>
        </b-form-group>
        <b-form-group id="businessNumber-group" label="Kennen Sie die Geschäftsnummer?" label-for="businessNumber">
          <b-form-input
            id="businessNumber"
            v-model="form.businessNumber"
            type="text"
            :placeholder="$t('businessNumber')"
          ></b-form-input>
        </b-form-group>
        <b-form-checkbox v-model="form.checkFirst" name="check-first" value="firstCheck" required :oninvalid="this.customErrorMessage()" oninput="this.setCustomValidity('')">
          {{ $t('firstCheckConfirmation') }}
        </b-form-checkbox>
        <b-form-checkbox v-model="form.checkSecond" name="check-second" value="secondCheck" required :oninvalid="this.customErrorMessage()" oninput="this.setCustomValidity('')">
          {{ $t('secondCheckConfirmation') }}
        </b-form-checkbox>
        <p class="mt-16">{{ $t('aargauWebsites') }}
          <br><b-link href="https://agve.weblaw.ch" target="_blank">- https://agve.weblaw.ch</b-link>
          <br><b-link href="https://www.ag.ch/de/gerichte/gesetze_entscheide/gesetze_entscheide.jsp" target="_blank">- https://www.ag.ch/de/gerichte/gesetze_entscheide</b-link>
        </p>
        <b-form-radio-group class="custom-radio mb-16" v-model="form.contactType" required stacked checked="autoContact">
          <b-form-radio value="customContact">{{ $t('customContact') }}</b-form-radio>
          <b-form-radio value="autoContact">{{ $t('autoContact') }}</b-form-radio>
        </b-form-radio-group>
        <b-button v-if="form.contactType === 'customContact'" id="createPdf" class="mb-16" variant="primary" @click="$router.push('generatedDecisionRequest')">{{ $t('requestDecisionCustom') }}</b-button>
        <div v-if="form.contactType === 'autoContact'">
          <b-form-textarea
            id="comment"
            v-model="form.comment"
            :placeholder="$t('comment')"
          ></b-form-textarea>
          <b-form-radio-group class="custom-radio mt-16 mb-16" v-model="form.membershipType" required stacked>
            <b-form-radio value="member">{{ $t('member') }}</b-form-radio>
            <b-form-radio value="becomeMember">{{ $t('becomeMember') }}</b-form-radio>
            <b-form-radio value="notMember">{{ $t('notMember') }}</b-form-radio>
          </b-form-radio-group>
          <!-- TODO: CAPTCHA-->
          <b-form-checkbox-group required>
            <b-form-checkbox
              id="policyAgreement"
              class="custom-checkbox"
              v-model="form.policyAgreement"
              :oninvalid="this.customErrorMessage()"
              oninput="this.setCustomValidity('')">
                {{ $t('policyAgreement') }}
            </b-form-checkbox>
          </b-form-checkbox-group>
          <p class="mt-16">{{ $t('privacyAgreementPartOne') }}<br>{{ $t('privacyAgreementPartTwo') }}<b-link href='https://entscheidsuche.ch/datenschutz' target='_blank'>{{ $t('privacyAgreementPartThree') }}</b-link></p>
          <b-button type="submit" variant="primary">{{ $t('requestDecision') }}</b-button>
        </div>
      </b-form>
    </template>
  </div>
</template>

<style lang="scss">
#decisionRequest {
  .form {
    text-align: left;

    input, select, textarea {
      width: 60%;

      @media (max-width: 534px) {
        width:100%
      }
    }

    #date-group {
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

    .w-45 {
      width: calc(45% - 12px);

      @media (max-width: 534px) {
        width:100%
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
  name: 'DecisionRequest'
})
export default class DecisionRequest extends Vue {
  data () {
    return {
      selected: '',
      countries: [
        { text: this.$t('country').toString(), value: null, disabled: true },
        { text: 'Land1', value: 'Land1' },
        { text: 'Land2', value: 'Land2' },
        { text: 'Land3', value: 'Land3' }
      ],
      cantons: [
        { text: this.$t('stateOrCanton').toString(), value: null, disabled: true },
        { text: 'Kanton1', value: 'Kanton1' },
        { text: 'Kanton2', value: 'Kanton2' },
        { text: 'Kanton3', value: 'Kanton3' }
      ],
      courts: [
        { text: this.$t('supremeCourt').toString(), value: 'Obergericht' },
        { text: 'Gericht2', value: 'Gericht2' },
        { text: this.$t('otherCourt').toString(), value: 'other' }
      ]
    }
  }

  private form: object = {
    salutation: '',
    firstName: '',
    lastName: '',
    email: '',
    tel: '',
    street: '',
    streetSecond: '',
    postCode: '',
    city: '',
    country: null,
    canton: null,
    court: 'Obergericht',
    courtName: '',
    courtAddress: '',
    date: '',
    businessNumber: '',
    checkFirst: '',
    checkSecond: '',
    contactType: 'autoContact',
    comment: '',
    membershipType: '',
    policyAgreement: ''
  }

  private localeChangeSelected = 'de'

  public get locale () {
    return AppModule.locale
  }

  public generateRequest (): void {
    window.console.log('Generating request')
  }

  public customErrorMessage () {
    const errorMessage = this.locale === 'de' ? 'Bitte füllen Sie dieses Feld aus' : this.locale === 'fr' ? 'fr' : 'it'
    const returnValue = 'this.setCustomValidity(' + "'" + errorMessage + "'" + ')'
    return returnValue
  }

  public onSubmit (event) {
    event.preventDefault()
    window.console.log(this.form)
  }
}
</script>
