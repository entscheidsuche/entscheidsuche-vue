  <template>
    <div id="decisionRequest">
      <h1>{{ $t('decisionRequest') }}</h1>
      <p>{{ $t('decisionRequestText') }}</p>
      <b-form class="form" @submit.prevent="onSubmit">
        <b-form-input
          id="salutation"
          class="w-15"
          v-model="form.salutation"
          type="text"
          :placeholder="$t('salutation')"
        ></b-form-input>
        <b-form-input
          id="firstName"
          class="inline w-30 mt-12"
          v-model="form.firstName"
          :placeholder="$t('firstName')+'*'"
          required
        ></b-form-input>
        <b-form-input
          id="lastName"
          class="inline w-30 mt-12"
          v-model="form.lastName"
          :placeholder="$t('lastName')+'*'"
          required
        ></b-form-input>
        <b-form-input
          id="email"
          class="mt-12"
          v-model="form.email"
          type="email"
          :placeholder="$t('email')+'*'"
          required
          @blur="checkError($event)"
        ></b-form-input>
        <b-form-input
          id="tel"
          class="mt-12"
          v-model="form.tel"
          type="tel"
          :placeholder="$t('tel')"
        ></b-form-input>
        <b-form-input
          id="street"
          class="mt-12"
          v-model="form.street"
          type="text"
          :placeholder="$t('street')+'*'"
          required
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
          :placeholder="$t('postCode')+'*'"
          required
        ></b-form-input>
        <b-form-input
          id="city"
          class="inline mt-12 w-45"
          v-model="form.city"
          type="text"
          :placeholder="$t('city')+'*'"
          required
        ></b-form-input>
        <b-form-input
          id="country"
          class="mt-12 w-45"
          v-model="form.country"
          type="text"
          :placeholder="$t('country')"
        ></b-form-input>
        <b-form-group id="canton-group" class="mt-16" :label="$t('stateOrCantonLabel')" label-for="select-canton">
          <b-form-select
            id="select-canton"
            v-model="form.canton"
            :options="cantons"
            required
          ></b-form-select>
        </b-form-group>
        <b-form-group id="court-group" :label="$t('courtLabel')" label-for="court">
          <b-form-input
            id="courtName"
            v-model="form.courtName"
            type="text"
            :placeholder="$t('courtName')"
            required
          ></b-form-input>
          <b-form-textarea
            id="courtAddress"
            class="mt-12"
            v-model="form.courtAddress"
            :placeholder="$t('courtAddress')"
          ></b-form-textarea>
        </b-form-group>
        <b-form-group id="date-group" class="mt-16" :label="$t('decisionDateLabel')" label-for="date-form">
          <b-form-datepicker id="date-form" v-model="form.date" :placeholder="$t('date')"></b-form-datepicker>
        </b-form-group>
        <b-form-group id="fileNumber-group" label="Kennen Sie die Geschäftsnummer?" label-for="fileNumber">
          <b-form-input
            id="fileNumber"
            v-model="form.fileNumber"
            type="text"
            :placeholder="$t('fileNumber')"
          ></b-form-input>
        </b-form-group>
        <b-form-checkbox v-model="form.checkFirst" name="check-first" value="firstCheck" required>
          {{ $t('firstCheckConfirmation') }}
        </b-form-checkbox>
        <b-form-checkbox v-model="form.checkSecond" name="check-second" value="secondCheck" required>
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
          <b-form-checkbox-group value="dataPolicy" required>
            <b-form-checkbox
              id="policyAgreement"
              class="custom-checkbox"
              v-model="form.policyAgreement"
              required>
                {{ $t('policyAgreement') }}*
            </b-form-checkbox>
          </b-form-checkbox-group>
          <p class="mt-16">{{ $t('privacyAgreementPartOne') }}<br>{{ $t('privacyAgreementPartTwo') }}<b-link href='https://entscheidsuche.ch/datenschutz' target='_blank'>{{ $t('privacyAgreementPartThree') }}</b-link></p>
          <b-button type="submit" v-on:click="onSubmit($event)" variant="primary">{{ $t('requestDecision') }}</b-button>
<!--          <b-button type="submit" v-on:click="onRequest($event)" variant="primary">{{ $t('requestDecision') }}</b-button> -->
        </div>
      </b-form>
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

    .input-error {
       border: 2px solid red;
       border-radius: 4px; /* Für Checkboxen nützlich */
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
  email: string,
  tel: string,
  street: string,
  streetSecond: string,
  postCode: string,
  city: string,
  country: string,
  canton: string,
  courtName: string,
  courtAddress: string,
  date: string,
  fileNumber: string,
  checkFirst: string,
  checkSecond: string,
  contactType: string,
  comment: string,
  membershipType: string,
  policyAgreement: string
}

@Component({
  name: 'DecisionRequest'
})
export default class DecisionRequest extends Vue {
  data () {
    return {
      selected: '',
      cantons: [
        { text: this.$t('stateOrCanton').toString() + '*', value: null, disabled: true },
        { text: this.$t('Bund').toString(), value: 'CH' },
        { text: this.$t('Kanton_AG').toString(), value: 'AG' },
        { text: this.$t('Kanton_AI').toString(), value: 'AI' },
        { text: this.$t('Kanton_AR').toString(), value: 'AR' },
        { text: this.$t('Kanton_BE').toString(), value: 'BE' },
        { text: this.$t('Kanton_BL').toString(), value: 'BL' },
        { text: this.$t('Kanton_BS').toString(), value: 'BS' },
        { text: this.$t('Kanton_FR').toString(), value: 'FR' },
        { text: this.$t('Kanton_GE').toString(), value: 'GE' },
        { text: this.$t('Kanton_GL').toString(), value: 'GL' },
        { text: this.$t('Kanton_GR').toString(), value: 'GR' },
        { text: this.$t('Kanton_JU').toString(), value: 'JU' },
        { text: this.$t('Kanton_LU').toString(), value: 'LU' },
        { text: this.$t('Kanton_NW').toString(), value: 'NW' },
        { text: this.$t('Kanton_SG').toString(), value: 'SG' },
        { text: this.$t('Kanton_SH').toString(), value: 'SH' },
        { text: this.$t('Kanton_SO').toString(), value: 'SO' },
        { text: this.$t('Kanton_TG').toString(), value: 'TG' },
        { text: this.$t('Kanton_TI').toString(), value: 'TI' },
        { text: this.$t('Kanton_NE').toString(), value: 'NE' },
        { text: this.$t('Kanton_OW').toString(), value: 'OW' },
        { text: this.$t('Kanton_SZ').toString(), value: 'SZ' },
        { text: this.$t('Kanton_UR').toString(), value: 'UR' },
        { text: this.$t('Kanton_VD').toString(), value: 'VD' },
        { text: this.$t('Kanton_VS').toString(), value: 'VS' },
        { text: this.$t('Kanton_ZG').toString(), value: 'ZG' },
        { text: this.$t('Kanton_ZH').toString(), value: 'ZH' }
      ]
    }
  }

  private form: Form = {
    salutation: 'Herr',
    firstName: 'Jörn',
    lastName: 'Erbguth',
    email: 'joern@erbguth.net',
    tel: '+41787256027',
    street: 'Chemin du Champ dAnier 15',
    streetSecond: '',
    postCode: '1209',
    city: 'Genf',
    country: this.$t('Schweiz').toString(),
    canton: '',
    courtName: 'Obergericht',
    courtAddress: '',
    date: '',
    fileNumber: '',
    checkFirst: '',
    checkSecond: '',
    contactType: 'customContact',
    comment: '',
    membershipType: '',
    policyAgreement: ''
  }

  public get locale () {
    return AppModule.locale
  }

  public generateRequest (): void {
    window.console.log('Generating request')
  }

  private emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+(.[a-zA-Z]{2,})+$/

  public check (type, value) {
    let fehler = ''
    switch (type) {
      case 'email': {
        if (!this.emailPattern.test(value)) {
          fehler = 'Email falsch'
        }
      }
    }
    return fehler
  }

  public validate (element) {
    const check = this.check(element.id, element.value)
    if (check) {
      element.setCustomValidity(check)
      element.classList.add('input-error')
      element.reportValidity()
      return false
    } else {
      if (element.validity.valueMissing) {
        element.classList.add('input-error')
        return false
      } else {
        element.setCustomValidity('')
        if (element.classList.contains('input-error')) {
          element.classList.remove('input-error')
        }
      }
    }
    return true
  }

  public checkError (event: Event): void {
    const target = event.target as HTMLInputElement
    window.console.log('checkError ' + target.id)
    window.console.log('Feld ' + target.id + ' gesetzt auf ' + this.form[target.id as keyof typeof this.form])
    this.validate(target)
  }

  private getQuery (): Record<string, string> {
    const query: Record<string, string> = {}

    Object.entries(this.form).forEach(([key, value]) => {
      query[key] = value
    })
    window.console.log('Form as Query: ', JSON.stringify(query))
    return query
  }

  public onSubmit (event: Event): void {
    window.console.log('Teste nun das Formular mit den Formulardaten:', JSON.stringify(this.form))
    event.preventDefault() // Verhindert das Standard-Submit-Verhalten

    if (this.validateForm()) {
      window.console.log('Formulardaten:', JSON.stringify(this.form))
      if (this.form.contactType === 'customContact') {
        window.console.log('Hier nun der Aufruf der nächsten Formularseite:', JSON.stringify(this.form))
        this.$router.push({
          path: '/GeneratedDecisionRequest.vue',
          query: this.getQuery()
        })
      }
    } else {
      window.console.log('Formular ist ungültig.')
    }
  }

  private validateForm (): boolean {
    let isValid = true
    Object.entries(this.form).forEach(([id]) => {
      // Find the input element by ID (assuming it matches `id`)
      const inputElement = document.getElementById(id) as HTMLInputElement | null
      if (inputElement) {
        if (!this.validate(inputElement)) {
          isValid = false
          window.console.log('Formularauswertung: ' + id + 'fehlerhaft')
        }
      }
    })
    window.console.log('Formular ausgewertet:')
    return isValid // Returns true if all fields are valid, otherwise false
  }
}
</script>
