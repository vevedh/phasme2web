<template>
  <div class="q-px-sm q-form-time q-form-builder-element" ><!--row q-col-gutter-sm -->
    <div class="col-12 col-md-6">
      <q-input v-model="innerValue" mask="time" label-slot :debounce="debounce" :rules="getRules()" :ref="id" :name="id" v-bind="field_options" >
      <template v-slot:label>
          <div class="row items-center all-pointer-events text-h6">
            {{getLabel}}
          </div>
        </template>
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy>
              <q-time v-model="innerValue" >
              <q-btn v-close-popup label="Fermer" color="primary" flat />
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <p v-if="hint" class="text-caption  text-italic q-pa-none" v-html="hint"></p>
    </div>
  </div>
</template>

<script>
import FormElement from './FormElement'
import { QInput, QIcon, QPopupProxy, QTime , date } from 'quasar'
export default {
  name: 'TimeElement',
  extends: FormElement,
  components: { QInput, QIcon, QPopupProxy, QTime },
  data() {
    return {
      initTime: date.formatDate(Date.now(), 'HH:mm')
    }
  },
  computed: {
    rules () {
      return ['time']
    }
  },
  mounted() {

    if (!this.innerValue) {
      this.innerValue = this.initTime
    }
  }
}
</script>
