<template>
  <div class="q-px-sm q-form-dropdown q-form-builder-element" >
    <!--row q-col-gutter-sm -->
    <div class="col-12 col-md-6 col-lg-3">
      <q-select
        :value="innerValue"
        :options="coptions"
        :label-slot="true"
        :rules="getRules()"
        :ref="`${id}_commune`"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        @filter="filterFn"
        @input-value="setModel"
        :options-sanitize="false"
        :option-label="item => (item === null)?null:item"
        :option-value="item => (item === null)?null:item"
        emit-value
        options-dense
        v-bind="field_options"
      >
      <template v-slot:prepend>
          <q-avatar icon="home" class="shadow-1"></q-avatar>

        </template>
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
import feathersClient from '../../../boot/feathers-client';
import FormElement from './FormElement';
import { QSelect } from 'quasar';
import communes from '../srcdata/fr-esr-referentiel-martinique.json'
export default {
  name: 'CommunesElement',
  extends: FormElement,
 /* props: {
    value: {
      type: Object,
      default: () => {
        return { }
      }
    }
  },*/
  data() {
    //const users = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdbdemo', tableName: 'ad-users', query: JSON.stringify({query:{} }) } })
    return {
      communes: communes.map(o => (`${o.fields.com_nom}`)),
      coptions: [],
    };
  },

  components: { QSelect },
  methods: {
    filterFn(val, update, abort) {
      update(() => {
        /* map(option => ({
            label: option.Name,
            value: option.mail
          }))*/
          console.log('Val filter :',val)
        const needle = val.toLocaleLowerCase();

        this.coptions = this.communes.filter(
          (v) => v.toLocaleLowerCase().indexOf(needle) > -1
        );
        console.log('Ref :',this.coptions);
      });
    },

    setModel(val) {
      console.log('Model :', val);
      this.innerValue = val;
      //this.value.utilisateur = val
    },
  },
  async beforeMount() {
    /*if (process.env.NODE_ENV === 'production') {
      this.users = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'ad-users', query: JSON.stringify({query:{} }) } })
      //this.users = await feathersClient.service('adUsers').find();
    } else {
      //this.users = await feathersClient.service('adUsers').find();
      this.users = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdbdemo', tableName: 'ad-users', query: JSON.stringify({query:{} }) } })
    }*/

    console.log('Liste des communes :', this.communes);
    this.coptions = this.communes;/*.map((option) => ({
      label: option.fields.uucr_nom,
      value: option.fields.uucr_nom,
    }));*/
  },
};
</script>
