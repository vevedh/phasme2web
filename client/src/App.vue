<template>

  <div id="q-app">

    <router-view />
  </div>
</template>
<script>

import { defineComponent } from '@vue/composition-api';


export default defineComponent({
  name: 'App',
});
</script>
<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
        'Droid Sans', 'Helvetica Neue', sans-serif;
}
.fade-enter-active, .fade-enter{
    -webkit-animation: moveFromRight .5s both ease;
    animation: moveFromRight .5s both ease;
  }
  .fade-leave-to, .fade-leave-active {
    -webkit-animation: moveToLeft 1s both ease;
    animation: moveToLeft 1s both ease;
  }
  .layout-padding {
    padding: 1em 4em;
  }
  @media screen and (max-width: 600px){
    .layout-padding {
      padding: 1.5em .5em;
    }
  }
  .menu-enter-active, .scale-enter{
    -webkit-animation: moveFromLeftFade .9s ease both;
    animation: moveFromLeftFade .9s ease both;
  }
  .menu-leave-to, .scale-leave-active {
    -webkit-animation: moveToLeft .9s ease both;
    animation: moveToLeft .9s ease both;
  }
  @-webkit-keyframes moveFromLeftFade {
    from { opacity: 0.3; -webkit-transform: translateX(-100%); }
  }
  @keyframes moveFromLeftFade {
    from { opacity: 0.3; -webkit-transform: translateX(-100%); transform: translateX(-100%); }
  }
  @-webkit-keyframes moveToRight {
    from { }
    to { -webkit-transform: translateX(100%); }
  }
  @keyframes cartOut {
    from {
      transform: translate(0px, 0px);
    }
    to {
      transform: translate(1200px, 0px);
      animation-timing-function: ease-out;
    }
  }
  @-webkit-keyframes moveToLeft {
    from { }
    to { opacity: .5; -webkit-transform: translateX(-100%); }
  }
  @keyframes moveToLeft {
    from { }
    to { opacity: .5; -webkit-transform: translateX(-100%); transform: translateX(-100%); }
  }
  @-webkit-keyframes moveFromRight {
    from { opacity: .7; -webkit-transform: translateX(100%); }
  }
  @keyframes moveFromRight {
    from {opacity: .7; -webkit-transform: translateX(100%); transform: translateX(100%); }
  }
  .drawer-closer .item-content {
    margin-left: 50px !important;
  }
  .drawer-content .list-label {
    line-height: 45px;
  }
  .drawer-content .item {
    height: 45px;
  }
  .router-link-active .item-primary{
    color: #027be3;
  }
  .q-picker-textfield .q-picker-textfield-label{
    color: inherit !important;
  }
  .label-success .q-picker-textfield-label {
    color: #4caf50 !important;
  }
  .label-error .q-picker-textfield-label {
    color: #f44336 !important;
  }
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    text-indent: 1px;
    text-overflow: '';
  }
  .label-success .q-picker-textfield:after, .label-error .q-picker-textfield:after{
    content: "" !important;
  }
  #android-preview {
    display: block;
    text-align: center;
    width: 467px;
    height: 800px;
    /*background: url('./statics/devices-sprite.jpg') 0 -800px no-repeat;*/
    background-size: 467px;
    margin: 5px auto 0;
  }
  #ios-preview {
    text-align: center;
    width: 467px;
    height: 800px;
    /*background: url('./statics/devices-sprite.jpg') center top no-repeat;*/
    background-size: 467px;
    margin: 5px auto 0;
  }
  #android-preview iframe {
    margin-top: 64px;
    width: 357px;
    height: 590px;
    background: #fff;
  }
  #ios-preview iframe {
    margin-top: 64px;
    width: 320px;
    height: 590px;
    background: #fff;
  }
  canvas {
    width: 270px !important;
  }
  @media only screen and (min-width: 601px){
    .adv-form-one .timeline-badge {
      right: auto !important;
      left: auto !important;
    }
    .adv-form-one .timeline-content {
      margin-left: 3.9rem;
    }
    .adv-form-one .timeline-item {
      width: 100% !important;
    }
    .adv-form-one .timeline-title {
      text-align: inherit !important;
      margin-left: 3.9rem;
    }
    .timeline:before {
      left: 1.6rem;
    }
  }
  .adv-form-one .timeline-content .group .primary {
    display: none !important;
  }
  .underline {
    text-decoration: underline;
  }
</style>
