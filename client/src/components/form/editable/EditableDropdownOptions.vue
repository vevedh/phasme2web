<template>
  <div class="q-px-none q-pt-md">
    <q-list class="q-px-none">
      <!--<q-item-label header>Options</q-item-label>-->
      <q-expansion-item dense label="Liste" header-class="bg-blue-2 full-width">
      <q-item v-for="(option, index) in value.options" :key="index" dense>

        <q-item-section>
          <q-input dense v-model="option.label" />
        </q-item-section>
        <q-item-section side>
          <q-btn round flat size="xs" color="negative" icon="delete" @click="deleteItem(index)"><q-tooltip>Effacer cette option</q-tooltip></q-btn>
        </q-item-section>
      </q-item>
      <q-item dense>

        <q-item-section>
          <q-input dense filled v-model="newItem.label" />
        </q-item-section>
        <q-item-section side>
          <q-btn round size="xs" icon="add" color="teal" @click="addNewItem"><q-tooltip>Ajouter l' option</q-tooltip></q-btn>
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
  QItemLabel,
  QItemSection,
  QCheckbox,
  QInput,
  QBtn,
  QTooltip
} from 'quasar'

const defaultNewItem = () => ({
  label: ''
})

export default {
  name: 'EditableDropdownOptions',
  components: { QList, QItem, QItemLabel, QItemSection, QCheckbox, QInput, QBtn, QTooltip },
  props: ['value'],
  data: () => ({
    newItem: defaultNewItem()
  }),
  methods: {
    addNewItem: function () {
      this.value.options.push({
        label: this.newItem.label
      })
      this.newItem = defaultNewItem()
    },
    deleteItem: function (index) {
      this.value.options.splice(index, 1)
    },
    changeSelected: function (label) {
      this.newItem.label === label

    }
  }
}

</script>
