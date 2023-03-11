<template>
  <q-card>
    <q-card-section>

      <form
        v-if="value"
        v-on:submit.prevent
      >
        <div
          v-for="(f,idx) in value"
          :key="`hidden_${idx}`"
        >
          <div class="text-right">
            <q-chip
              square
              dense
              :icon="typeIcon"
              class="text-uppercase"
            >{{ typeName }}
            </q-chip>
          </div>
          <q-input
            dense
            v-model="f.label"
            placeholder="nom du champ"
            label="Nom du champ"
            v-if="ifNotTypes(['image'])"
          />
          <q-input
            dense
            v-model="f.id"
            placeholder="id du champ"
            label="ID du champ"
            v-if="ifNotTypes(['image'])"
            label-color="negative"
          />
          <q-input
            dense
            v-model="f.innerValue"
            placeholder="Valeur par défaut"
            label="Valeur par défaut"
            class="q-px-sm"
            v-if="ifNotTypes(['image'])"
            label-color="positive"
          />
          <div class="full-width text-right">
            <q-btn  flat dense color="red" icon="delete" @click="value.splice(idx,1)" />
          </div>
          <hr>
          <!-- <div class="text-caption q-pt-sm text-weight-light">A longer description to display</div> -->
          <!-- <q-editor dense v-model="value.field_options.description" :toolbar="[
                                  ['bold', 'italic', 'underline'],
                                  ['unordered', 'ordered', 'link', 'hr']
                                ]" /> -->

        </div>
      </form>

    </q-card-section>
  </q-card>

</template>

<script>
import { QInput, QToggle, QChip, QFile, QCardSection, QCard } from 'quasar';

export default {
  name: 'EditableHiddenElementOptions',
  components: {
    QInput,
    QToggle,
    QChip,
    QFile,
    QCard,
    QCardSection,

  },
  props: ['value', 'typeInfo', 'fieldsList', 'submitOptions'],
  data () {
    return {
      imgFile: null,
      foption: null,
      fcalc: '',
      useShowOption: false,
      expandVisible: false
    };
  },
  methods: {
    ifType (type) {
      return this.value[0].field_type === type;
    },
    ifNotTypes (types) {
      if (!Array.isArray(types)) {
        types = [types];
      }
      return types.indexOf(this.value[0].field_type) < 0;
    },
    getTypeInfo () {
      for (const i in this.typeInfo) {
        if (this.typeInfo[i].type === this.value[0].field_type) {
          return this.typeInfo[i];
        }
      }
      return false;
    },

  },
  computed: {
    typeName () {
      return this.getTypeInfo().label;
    },
    typeIcon () {
      return this.getTypeInfo().icon;
    }
  },
  watch: {
    value: {
      handler (val) {
        console.log('Hidden Proprietes change :', val);
      }
    },
    /*fcalc: {
      handler(val) {
        //this.expandVisible = !this.expandVisible
        if (val && this.expandVisible) {
          this.value.show_options = [
            { id_field: this.foption.id, op: 'eq', valcalc: val }
          ];
          console.log('Visible Options :', this.value);
        }
      }
    }*/
  }
};
</script>
