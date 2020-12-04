<template>
  <p style="margin-top: 200px">Bla:{{ $t('hello') }}</p>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class HelloI18n extends Vue {
}
</script>

<i18n>
{
  "en": {
    "hello": "EN: Hello i18n in SFC!"
  },
  "de": {
    "hello": "DE: Hello i18n in SFC!"
  },
  "fr": {
    "hello": "FR: Hello i18n in SFC!"
  },
  "it": {
    "hello": "IT: Hello i18n in SFC!"
  }
}
</i18n>
