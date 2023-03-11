<template>
  <div class="q-px-sm q-form-section-break q-form-builder-element" >
    <div v-if="label" class="q-pl-none q-form-section-break-title q-py-none q-mb-none text-bold text-primary"><q-icon name="arrow_right" color="primary" size="40px" class="q-pa-none"></q-icon>{{ label }}</div>
    <q-separator spaced color="primary" class="q-py-xs"/>
    <p v-if="hint" class="text-caption" v-html="hint"></p>
  </div>
</template>

<script>
import { QSeparator } from 'quasar'
import * as utils from '../utils'

export default {
  name: 'SectionBreakElement',
  components: { QSeparator },
  props: {
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
    }
  },
  methods: {
    validate () {
      return true
    }
  }
}
</script>
