<template>
  <div class="q-pa-xs">
    <q-list>
      <q-item-label dense header>Liste</q-item-label>
      <q-item v-for="(option, index) in value.options" :key="index" dense>
        <q-item-section side>
          <q-radio v-model="option.checked" :val="true" @input="changeSelected(option.label)" />
        </q-item-section>
        <q-item-section>
          <q-input dense v-model="option.label" />
        </q-item-section>
        <q-item-section side>
          <q-btn round flat size="xs" icon="delete" @click="deleteItem(index)"><q-tooltip>Effacer cette option</q-tooltip></q-btn>
        </q-item-section>
      </q-item>
      <q-item dense>
        <q-item-section side>
          <q-radio v-model="newItem.checked" :val="true" @input="changeSelected(newItem.label)" />
        </q-item-section>
        <q-item-section>
          <q-input dense filled v-model="newItem.label" />
        </q-item-section>
        <q-item-section side>
          <q-btn round size="xs" icon="add" @click="addNewItem"><q-tooltip>Ajouter l'option</q-tooltip></q-btn>
        </q-item-section>
      </q-item>
      <q-item dense>
        <q-checkbox v-model="value.include_other_option" label="Inclut &quot;Autre&quot; option" />
      </q-item>
    </q-list>
  </div>
</template>

<script>
import {
  QList,
  QItem,
  QItemLabel,
  QItemSection,
  QRadio,
  QCheckbox,
  QInput,
  QBtn,
  QTooltip
} from 'quasar'

const defaultNewItem = () => ({
  checked: false,
  label: ''
})

export default {
  name: 'EditableRadioOptions',
  components: { QList, QItem, QItemLabel, QItemSection, QRadio, QCheckbox, QInput, QBtn, QTooltip },
  props: ['value'],
  data: () => ({
    newItem: defaultNewItem()
  }),
  methods: {
    addNewItem: function () {
      if (!this.value.options) this.value.options = []
      this.value.options.push({
        label: this.newItem.label,
        checked: this.newItem.checked
      })
      this.newItem = defaultNewItem()
    },
    deleteItem: function (index) {
      this.value.options.splice(index, 1)
    },
    changeSelected: function (label) {
      this.newItem.checked = this.newItem.label === label
      for (const option of this.value.options) {
        option.checked = option.label === label
      }
    }
  }
}

</script>
