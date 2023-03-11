<template>
  <div class="q-px-sm q-form-date q-form-builder-element" ><!--row q-col-gutter-sm :label="getLabel"-->
    <div class="col-12 col-md-6">
      <q-input v-model="innerValue" mask="##/##/####" label-slot :debounce="debounce" :rules="getRules()" :ref="id" :name="id" v-bind="field_options">
        <template v-slot:label>
          <div class="row items-center all-pointer-events text-h6">
            {{getLabel}}
          </div>
        </template>
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy>
              <q-date v-model="innerValue" mask="DD/MM/YYYY" >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Fermer" color="primary" flat />
              </div>
              </q-date>
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
import { QInput, QIcon, QPopupProxy, QDate  } from 'quasar'
import {date} from 'quasar'
export default {
  name: 'DateElement',
  extends: FormElement,
  components: { QInput, QIcon, QPopupProxy, QDate },
  data() {
    return {
      initDate: date.formatDate(Date.now(), 'DD/MM/YYYY'),
    }
  },
  computed: {
    rules () {
      return ['DD/MM/YYYY']
    }
  },
  mounted() {
    if (!this.innerValue) {
      this.innerValue = this.initDate
    }

  }
}
</script>
