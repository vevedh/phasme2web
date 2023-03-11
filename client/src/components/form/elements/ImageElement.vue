<template>
  <div :class="`q-px-sm q-form-text q-form-builder-element row justify-${field_options.img_position}`">
    <!--<label v-if="label">{{ label }}</label>-->
    <q-img
      v-if="img64"
      :src="img64"
      spinner-color="white"
      :style="`width: ${iwidth}px;height: ${iheight}px`"
    />
    <!--<img :src="field_options.img_src" />


     :style="`height: ${field_options.img_height}px; max-width: ${field_options.img_width}px`" -->
    <p v-if="hint" class="text-caption  text-italic q-pa-none" v-html="hint"></p>
  </div>
</template>

<script>
import { QImg } from 'quasar'
import * as utils from '../utils'

export default {
  name: 'ImageElement',
  components: { QImg },
  props: {
    span: {
      type: Number,
      required: false,
      default: 5
    },
    label: {
      type: String,
      default: ''
    },
    field_options: {
      type: Object,
      required: false,
      default: () => ({
        description: false
      })
    },
    cid: {},
    id: {}
  },
  computed: {
    hint: function () {
      return this.field_options && this.field_options.description ? utils.nl2br(this.field_options.description) : ''
    },
    iwidth() {
       return this.field_options && this.field_options.img_width ?this.field_options.img_width: 100;
    },
    iheight() {
      return this.field_options && this.field_options.img_height ?this.field_options.img_height: 100;
    },
    img64() {

       if (this.field_options.img_src) {
           return this.field_options.img_src;
       }

    }
  },
  methods: {
    validate () {
      return true
    }
  }
}
</script>
