/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.conf.js > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/

import lang from 'quasar/lang/fr'

import iconSet from 'quasar/icon-set/material-icons'


import Vue from 'vue'

import {Quasar,ClosePopup,Scroll,Ripple,Morph,TouchHold,TouchPan,TouchRepeat,TouchSwipe,ScrollFire,GoBack,Intersection,AppVisibility,Meta,Screen,Notify,LocalStorage,Loading,LoadingBar,Cookies,AddressbarColor,AppFullscreen,Dialog,Dark} from 'quasar'


Vue.use(Quasar, { config: {},lang: lang,iconSet: iconSet,directives: {ClosePopup,Scroll,Ripple,Morph,TouchHold,TouchPan,TouchRepeat,TouchSwipe,ScrollFire,GoBack,Intersection},plugins: {AppVisibility,Meta,Screen,Notify,LocalStorage,Loading,LoadingBar,Cookies,AddressbarColor,AppFullscreen,Dialog,Dark} })
