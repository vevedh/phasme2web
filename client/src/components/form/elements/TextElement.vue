<template>
  <div class="q-px-sm  q-form-text q-form-builder-element" >
    <!--q-col-gutter-sm :label="getLabel"-->
    <!--<div class="col">-->
    <q-input
      v-model="innerValue"
      class="q-pb-md"
      label-slot
      :debounce="debounce"
      :rules="getRules()"
      :ref="id"
      :name="id"
      :mask="mask"
      v-bind="field_options"
    >
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
    <div v-if="hint" class="text-caption text-italic q-pa-none" v-html="hint" ></div>
    <!--</div>-->
  </div>
</template>

<script>
import FormElement from './FormElement';
import { QInput, QTooltip } from 'quasar';
export default {
  name: 'TextElement',
  extends: FormElement,
  components: { QInput, QTooltip }
};
</script>
