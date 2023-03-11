<template>
  <div class="q-px-sm q-form-dropdown q-form-builder-element" >
    <!--row q-col-gutter-sm -->
    <div class="col-12 col-md-6 col-lg-3">

      <q-select

        :value="innerValue"
        :options="uoptions"
        :label-slot="true"
        :rules="getRules()"
        :ref="`${id}_cacemuser`"
        clearable

        options-selected-class="text-deep-orange"
        @clear="innerValue=''"
        @input="changeModel"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        @filter="filterFn"
        :options-sanitize="false"
        :option-value="item => (item ===null)?null:item"
        :option-label="item => (item ===null)?null:`${item}`"
        emit-value
        map-options
        :filled="field_options.filled"

      >
        <template v-slot:prepend="scope">
          <q-avatar  icon="person" class="shadow-1"></q-avatar>

        </template>
        <template v-slot:label >
          <div class="text-h6" >{{ getLabel }}</div>
        </template>

        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps" v-on="scope.itemEvents" >
            <q-item-section avatar>
              <img :src="scope.opt.ThumbnailPhoto"  style="height: 40px; max-width: 80px" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.Name }}</q-item-label>
              <q-item-label caption>{{ scope.opt.mail }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>



        <template v-slot:selected-item="scope">
            <q-avatar>
              <img :src="scope.opt.ThumbnailPhoto"
      style="height: 50px; max-width: 80px" />
            </q-avatar>
            {{scope.opt.DisplayName}}
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
export default {
  name: 'CacemusersElement',
  extends: FormElement,
  /*props: {
    value: {
      type: Object,
      default: () => {
        return { utilisateur: null }
      }
    }
  },*/
  data() {
    //const users = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdbdemo', tableName: 'ad-users', query: JSON.stringify({query:{} }) } })
    return {
      users: null,
      model: null,
      uoptions: [],
    };
  },

  components: { QSelect },
  methods: {
    abortFilterFn () {
        // console.log('delayed filter aborted')
      },
    filterFn(val, update, abort) {
      update(() => {
        /* map(option => ({
            label: option.Name,
            value: option.mail
          }))*/
        const needle = val.toLocaleLowerCase();
        console.log(
          'Ref :',
          this.users.filter(
            (v) => v.Name.toLocaleLowerCase().indexOf(needle) > -1
          )
        );
        this.uoptions = this.users.filter(
          (v) => v.Name.toLocaleLowerCase().indexOf(needle) > -1
        );
      },
      /*ref => {
              if (val !== '' && ref.options.length > 0 && ref.optionIndex!= -1) {
                console.log('Select filter :',ref)
                console.log('Select filter index :',ref.optionIndex )
                ref.moveOptionSelection(ref.optionIndex, true) // focus the first selectable option and do not update the input-value
                ref.toggleOption(ref.options[ ref.optionIndex ], true) // toggle the focused option
                //abort()
              }
      }*/);
    },
    selectOption(evt) {
        console.log('Option :',evt)
        this.model = evt.opt.mail;
    },
    setModel(val) {
      console.log('Model :', val);
        this.innerValue = val
    },
    changeModel(value) {
      console.log('Display val :',this.innerValue)
      console.log('Model val ', value)
      console.log('Comp :',this.$refs[`${this.id}_cacemuser`])
      const customLabel = value
      if (Object(value).hasOwnProperty('DisplayName')) {
        this.innerValue = `${value.DisplayName} [poste: ${customLabel.IPPhone}] (${String(customLabel.mail).toLowerCase()})`
      }

    },
    getNewModel(val,done) {
      console.log('Model val :',val)
      done(val, 'add-unique')
    }
  },
  async beforeMount() {
    if (process.env.NODE_ENV === 'production') {
      const preusers = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'ad-users', query: JSON.stringify({query:{} }) } })
      this.users = (preusers)?preusers.filter(o => o.Enabled=="true"):null
      //this.users = await feathersClient.service('adUsers').find();
    } else {
      //this.users = await feathersClient.service('adUsers').find();
      const preusers = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdb', tableName: 'ad-users', query: JSON.stringify({query:{} }) } })
      this.users = (Array.isArray(preusers))?preusers.filter(o => o.Enabled=="true"):null
    }

    if ( this.users) {
      console.log('Liste des utilisateurs :', this.users.length);
    this.uoptions = this.users/*.map((option) => ({
      label: option.Name + '|' + option.mail,
      value: option.mail,
    }));*/
    }

  },
};
</script>
