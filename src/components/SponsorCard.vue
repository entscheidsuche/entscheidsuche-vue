<template>
  <b-card>
    <!-- Link und Tooltip umfassen Logo und Text gemeinsam -->
    <a class="tile-link" :href="link" target="_blank" v-b-tooltip.hover :title="tooltipText">
      <div class="card-img-wapper">
        <b-card-img :src="cardImgUrl" alt="Image" top></b-card-img>
      </div>
      <div class="card-footer">
        <div class="card-text-wrapper">
          <b-card-text v-html="text"></b-card-text>
        </div>
      </div>
    </a>
  </b-card>
</template>

<style lang="scss">
.card {
  .card-body {
    padding: 0;

    .tile-link {
      display: block;
      color: inherit;
      text-decoration: none;

      &:hover,
      &:focus {
        color: inherit;
        text-decoration: none;
      }
    }

    .card-img-wapper {
      height: 100px;
      position: relative;

      .card-img-top {
        max-height: calc(100% - 10px);
        max-width: calc(100% - 10px);
        transform: matrix(0.9, 0, 0, 0.9, 0, 0);
        object-fit: contain;
        position: absolute;
        margin: auto;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }

    .card-footer {
      height: 60px;
      width: 100%;
      color: #000;
      border-radius: 0 0 20px 0;
      border-top: 1px solid #e5e9f1;
      background-color: #fff;
      position: relative;
      padding: 0;

      .card-text-wrapper {
        height: 60px;
        position: absolute;
        top: 0;
        overflow: hidden;
        width: calc(100%);
        display: flex;
        justify-content: center;

        .card-text {
          line-height: 60px;
          font-size: 14px;
          white-space: nowrap;
          text-overflow: ellipsis;
          display: block;
          overflow: hidden;
          padding-left: 20px;
          padding-right: 20px;
        }
      }
    }
  }
}
</style>
<script>
// Reihenfolge fuer den Fallback, wenn fuer die aktive Sprache kein Wert gesetzt ist.
const LANGUAGES = ['de', 'fr', 'it']

/**
 * Liefert den ersten nicht leeren Wert aus:
 * <field>_<aktive Sprache>, <field>, <field>_de, <field>_fr, <field>_it
 */
function localizedField (sponsor, field, locale) {
  if (!sponsor) {
    return ''
  }
  const keys = [field + '_' + locale, field]
  LANGUAGES.forEach(lang => keys.push(field + '_' + lang))
  for (let i = 0; i < keys.length; i++) {
    const value = sponsor[keys[i]]
    if (typeof value === 'string' && value.trim() !== '') {
      return value
    }
  }
  return ''
}

export default {
  name: 'sponsor-card',
  props: {
    sponsor: {
      type: Object,
      required: true
    }
  },
  computed: {
    link () {
      return localizedField(this.sponsor, 'link', this.$i18n.locale)
    },
    cardImgUrl () {
      return require('@/assets/sponsors/' + this.sponsor.logo)
    },
    text () {
      return localizedField(this.sponsor, 'text', this.$i18n.locale)
    },
    tooltipText () {
      const tooltip = localizedField(this.sponsor, 'tooltip', this.$i18n.locale)
      return (tooltip !== '' ? tooltip : this.text).replace('&amp;', '&')
    }
  }
}
</script>
