<template>
  <b-card>
    <div class="card-img-wapper">
      <a :href="this.link" target="_blank">
        <b-card-img :src="getCardImgUrl()" alt="Image" top></b-card-img>
      </a>
    </div>
    <div class="card-footer" v-b-tooltip.hover :title="getTooltipText()">
      <div class="card-text-wrapper">
        <b-card-text v-html="this.text"></b-card-text>
      </div>
    </div>
  </b-card>
</template>

<style lang="scss">
.card {
  .card-body {
    padding: 0;

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
export default {
  name: 'sponsor-card',
  props: {
    logo: String,
    link: String,
    text: String,
    tooltip: String,
    active: Boolean
  },
  methods: {
    getCardImgUrl () {
      return require('@/assets/sponsors/' + this.logo)
    },
    getTooltipText () {
      return this.tooltip !== '' ? this.tooltip.replace('&amp;', '&') : this.text.replace('&amp;', '&')
    }
  }
}
</script>
