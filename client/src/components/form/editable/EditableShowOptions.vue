<template>
  <div class="q-px-none q-pt-md">
    <q-list class="q-px-none">
      <!--<q-item-label header>Options</q-item-label>-->
      <q-expansion-item dense label="Conditions (visibilité)" header-class="bg-blue-3 full-width text-bold">
      <q-item class="bg-blue-1 q-pr-none"  v-for="(option, index) in value.show_options" :key="index" dense>
        <q-item-section>


        <q-select
            ref="foption"
            dense
            round
            :value="option.id_field.id"
            v-model="option.id_field"
            option-value="id"
            option-label="label"
            emit-value
            map-options
            :options="fieldsList"
            label="Visible si"
          />
          <q-input v-if="option.id_field" dense round v-model="option.valcalc" label="valeur" />
        </q-item-section>
        <q-item-section side class="q-pa-none no-padding">
          <q-btn  class="no-padding" round flat size="md" icon="remove_circle" color="negative" @click="deleteItem(index)"><q-tooltip>Effacer cette option</q-tooltip></q-btn>
        </q-item-section>
      </q-item>
      <q-item dense class="bg-amber-1 q-pr-none">

        <q-item-section>
          <q-select
              ref="foption"
              dense
              round
              v-model="newItem.id_field"
              :options="fieldsList"
              label="Visible si"
            />
          <q-input v-if="newItem.id_field" dense round v-model="newItem.valcalc" label="valeur" />
        </q-item-section>
        <q-item-section side class="q-pa-none no-padding">
          <q-btn   round flat size="md" icon="add_circle" color="primary" @click="addNewItem"><q-tooltip>Ajouter l' option</q-tooltip></q-btn>
        </q-item-section>
      </q-item>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script>
import {
  QList,
  QItem,
  QSelect,
  QItemLabel,
  QItemSection,
  QCheckbox,
  QInput,
  QBtn,
  QTooltip
} from 'quasar'

const defaultNewItem = () => ({
  id_field: null,
  valcalc: ''
})

export default {
  name: 'EditableShowOptions',
  components: { QList, QItem, QSelect, QItemLabel, QItemSection, QCheckbox, QInput, QBtn, QTooltip },
  props: ['value','fieldsList'],
  data: () => ({
    newItem: defaultNewItem()
  }),
  methods: {
    addNewItem: function () {
    if (Object(this.newItem.id_field).hasOwnProperty('id')) {
     this.value.show_options.push({
        id_field: this.newItem.id_field.id,
        valcalc: this.newItem.valcalc
      })
    } else {
      this.value.show_options.push({
        id_field: this.newItem.id_field,
        valcalc: this.newItem.valcalc
      })
    }

      this.newItem = defaultNewItem()
    },
    deleteItem: function (index) {
      this.value.show_options.splice(index, 1)
    },

  }
}

</script>
