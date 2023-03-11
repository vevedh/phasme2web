<template>
  <div class="q-px-sm q-form-dropdown q-form-builder-element" >
    <!--row q-col-gutter-sm -->
    <div class="col-12 col-md-6 col-lg-3">
      <q-select
        v-model="innerValue"
        :options="allOptions"
        :label="getLabel"
        :rules="getRules()"
        :ref="id"
        emit-value
        map-options
        v-bind="field_options"
      >
      <template v-slot:label>
          <div class="text-h6">{{ getLabel }}</div>
        </template>
      </q-select>
      <p
        v-if="hint"
        class="text-caption text-italic q-pa-none"
        v-html="hint"
      ></p>
    </div>
  </div>
</template>

<script>
import FormElement from './FormElement';
import { QSelect } from 'quasar';
export default {
  name: 'DropdownElement',
  extends: FormElement,
  components: { QSelect },

  computed: {
    allOptions: function () {
      return this.field_options.options.map((option) => ({
        label: option.label,
        value: option.label,
      }));
    },
  },
};
</script>
