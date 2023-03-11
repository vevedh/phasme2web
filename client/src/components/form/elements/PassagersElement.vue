<template>
  <div class="q-px-sm q-form-passagers q-form-builder-element">
    <div
      class="row"
      v-if="getLabel"
    >
      <div class="col-12 all-pointer-events text-h6">
        <label>{{ getLabel }}</label>
        <q-tooltip v-if="labelToolTip && labelToolTip!=''"
            content-class="bg-amber text-dark text-h5"
            content-style="text-h5"
            anchor="top left"
            self="bottom left"
            :offset="[0, 8]"
          >
            {{ labelToolTip }}
          </q-tooltip>
      </div>
    </div>
    <div
      class="row q-col-gutter-sm"
      v-for="(valelt, index) in innerValue"
      :key="index"
    >
      <div class="col-12 col-md-3">
        <q-input
          class="q-pb-md text-h6"
          v-model="valelt.nom"
          placeholder="Nom "
          :debounce="debounce"
          :rules="getRules('passager_nom', required)"
          :ref="`${id}_passager_nom`"
          v-bind="field_options"
        >
        </q-input>
      </div>
      <div class="col-12 col-md-3">
        <q-input
          class="q-pb-md text-h6"
          v-model="valelt.prenom"
          placeholder="Prenom "
          :debounce="debounce"
          :rules="getRules('passager_prenom', required)"
          :ref="`${id}_passager_prenom`"
          v-bind="field_options"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          class="q-pb-md text-h6"
          v-model="valelt.societe"
          placeholder="Société "
          :debounce="debounce"
          :rules="getRules('passager_societe', required)"
          :ref="`${id}_passager_societe`"
          v-bind="field_options"
        />
      </div>
      <div class="col-12 col-md-2">
        <div class="q-pa-sm row q-gutter-sm items-center">
          <div class="col self-center justify-center">
            <q-btn
              flat
              icon="add"
              @click="addElt(valelt)"
            ></q-btn>
          </div>
          <div class="col self-center">
            <q-btn
              flat
              icon="remove"
              v-if="(index>=0) && (index!=innerValue.length)"
              @click="delElt(index)"
            ></q-btn>
          </div>
        </div>
      </div>
    </div>
    <div
      class="row"
      v-if="hint"
    >
      <div
        class="col-12 text-caption"
        v-html="hint"
      ></div>
    </div>
  </div>
</template>

<script>
import FormElement from './FormElement'
import { QInput, QTooltip  } from 'quasar'

const removeItem = (items, i) =>
  items.slice(0, i - 1).concat(items.slice(i, items.length))

export default {
  name: 'PassagersElement',
  extends: FormElement,
  components: { QInput, QTooltip  },
  props: {
    value: {
      type: Array,
      default: () => [{ nom: null, prenom: null, societe: null }]

    }
  },
  methods: {
    addElt (val) {
      this.innerValue.push({ nom: val.nom, prenom: val.prenom, societe: val.societe })
    },
    delElt (i) {
      if (i==0) {
        this.innerValue = Object.assign([],[{ nom: null, prenom: null, societe: null }])
      } else {
        this.innerValue.splice(i, 1)
      }
      
    }
  }
}
</script>
