<template>
  <div class="q-px-sm q-form-paragraph q-form-builder-element">
    <q-input  v-model="innerValue" label-slot  type="textarea" :debounce="debounce" :rules="getRules()" :ref="id" v-bind="field_options">
      <template v-slot:label>
        <div class="row items-center all-pointer-events text-h6">
          {{ getLabel }}

         <q-tooltip v-if="labelToolTip && labelToolTip!=''"
            content-class="bg-amber text-dark"
            content-style="text-15"
            anchor="top left"
            self="bottom left"
            :offset="[0, 8]"
          >
            {{ labelToolTip }}
          </q-tooltip>
        </div>
      </template>
    </q-input>
    <p v-if="hint" class="text-caption" v-html="hint"></p>
  </div>
</template>

<script>
import FormElement from './FormElement'
import { QInput } from 'quasar'
export default {
  name: 'ParagraphElement',
  extends: FormElement,
  components: { QInput }
}
</script>
