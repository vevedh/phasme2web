<template>
  <div :id="`hidden_${cid}`" class="q-px-sm q-form-time q-form-builder-element" :show="visible">
    <label v-if="label && visible"><strong>Hidden: </strong>{{ label }}</label>
    <q-separator spaced color="primary" />
    <p v-if="hint" class="text-caption" v-html="hint"></p>
  </div>
</template>

<script>
import { QSeparator } from 'quasar'

export default {
  name: 'HiddenElement',
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
    visible: function () {
      return this.field_type=='hidden'
    },
    hint: function () {
      return this.field_options.description
    }
  },
  methods: {
    validate () {
      return true
    }
  }
}
</script>
