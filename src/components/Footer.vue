<template>
  <div id="footer">
    <footer>
      <a class="logo" href="#" onclick=""></a> <a class="twitter" title="entscheidsuche.ch on Twitter" href="https://twitter.com/entscheidsuche"></a>  powered by <a href="https://pansoft.de"><img src="~/../assets/sponsors/sponsor15.png" height="35px"></a>
    </footer>
  </div>
</template>

<style lang="scss">
#footer{
  clear: both;
  position: relative;
  height: 50px;
  margin-top: -50px;
  footer{
    position:absolute;
    bottom: 0;
    left:0;
    height:50px;
    width:100%;
    background-color: #e5e9f1;
    display: flex;
    align-items: center;
    justify-content: center;

    .logo{
      width: 200px;
      height: 20px;
      background: url('../assets/logo.png') no-repeat center;
      color:#fff;
      background-size: contain;
      flex-shrink: 0;
    }

    .twitter{
      width: 200px;
      height: 20px;
      background: url('../assets/twitter.svg') no-repeat center;
      color:#fff;
      background-size: contain;
      flex-shrink: 0;
    }

  }
}
</style>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component({
  name: 'Footer'
})

export default class Footer extends Vue {}
</script>
