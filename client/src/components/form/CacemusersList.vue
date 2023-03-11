<template>
  <div class="col-12 q-px-xs q-py-sm">
    <!--row q-col-gutter-sm -->
    <div class="row justify-center items-center">
      <div class="col-10 q-pl-sm">
        <q-select
          dense
          :value="selectUser"
          :options="uoptions"
          :label-slot="true"
          :ref="`q-form-cacemuser`"
          clearable
          options-selected-class="text-deep-orange"
          @clear="selectUser = ''"
          @input="changeModel"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          @filter="filterFn"
          :options-sanitize="false"
          :option-value="(item) => (item === null ? null : item)"
          :option-label="(item) => (item === null ? null : `${item}`)"
          emit-value
          map-options
        >
          <template v-slot:prepend="scope">
            <q-avatar icon="person" class="shadow-1"></q-avatar>
          </template>
          <template v-slot:label>
            <div class="text-h6">Utilisateur</div>
          </template>

          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
              <q-item-section avatar>
                <img
                  :src="scope.opt.ThumbnailPhoto"
                  style="height: 40px; max-width: 80px"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ scope.opt.Name }}</q-item-label>
                <q-item-label caption>{{ scope.opt.mail }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>

          <template v-slot:selected-item="scope">
            <q-avatar>
              <img
                :src="scope.opt.ThumbnailPhoto"
                style="height: 50px; max-width: 80px"
              />
            </q-avatar>
            {{ scope.opt.DisplayName }}
          </template>
        </q-select>
      </div>
      <div class="col-2">
        <div class="row items-center justify-center">
          <q-btn
            dense
            color="primary"
            icon="add"
            flat
            @click="sUsers.push(selectUser);$emit('update',sUsers);"
          />
        </div>
      </div>
    </div>
    <div class="row justify-center items-center q-px-none q-py-none full-width">
      <q-list dense bordered separator class="dense full-width q-px-none ">
        <q-item
          dense
          clickable
          v-ripple
          v-for="(u, idx) in rUsers"
          :key="`acc-user-${idx}`"
          class="dense q-py-none"
        >
          <q-item-section class="q-py-none q-ma-none">
            <div class="row full-width q-gutter-xs q-pa-none items-center justify-center">
              <div class="q-pa-none">{{ u }} </div>
              <q-space />
              <q-btn flat icon="remove" class="text-red q-pa-none" @click="sUsers.splice(idx,1);$emit('update',sUsers);"/>
          </div></q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import feathersClient from '../../boot/feathers-client';
import { mapState, mapActions } from 'vuex';
import { defineComponent } from '@vue/composition-api';
import { QSelect } from 'quasar';
export default defineComponent({
  name: 'CacemusersElement',
  props: {
    value: {
      type: Array,
    },
  },
  data() {
    //const users = await feathersClient.service('tables').find({ query: { tableDb: 'cacemdbdemo', tableName: 'ad-users', query: JSON.stringify({query:{} }) } })
    return {
      selectUser: null,
      selectedUsers: [],
      sUsers:this.value,
      users: null,
      model: null,
      uoptions: [],
    };
  },
  computed: {
      rUsers() {
        if (this.value) {
          console.log('Option value:', this.value);
          this.sUsers = Object.assign([],this.value)
        }
        return this.sUsers
      }
  },
  methods: {
    abortFilterFn() {
      // console.log('delayed filter aborted')
    },
    filterFn(val, update, abort) {
      update(
        () => {
          /* map(option => ({
            label: option.Name,
            value: option.mail
          }))*/
           const needle = val.toLocaleLowerCase();
          if (this.users.length>0) {
            console.log(
            'Ref :',
            this.users.filter(
              (v) => v.Name.toLocaleLowerCase().indexOf(needle) > -1
            )
          );
          this.uoptions = this.users.filter(
            (v) => v.Name.toLocaleLowerCase().indexOf(needle) > -1
          );
          }


        }
        /*ref => {
              if (val !== '' && ref.options.length > 0 && ref.optionIndex!= -1) {
                console.log('Select filter :',ref)
                console.log('Select filter index :',ref.optionIndex )
                ref.moveOptionSelection(ref.optionIndex, true) // focus the first selectable option and do not update the input-value
                ref.toggleOption(ref.options[ ref.optionIndex ], true) // toggle the focused option
                //abort()
              }
      }*/
      );
    },
    selectOption(evt) {
      console.log('Option :', evt);
      this.model = evt.opt.mail;
    },
    setModel(val) {
      console.log('Model :', val);
      this.selectUser = val;
    },
    changeModel(value) {
      console.log('Display val :', this.selectUser);
      console.log('Model val ', value);
      console.log('Comp :', this.$refs[`q-form-cacemuser`]);
      const customLabel = value;
      if (Object(value).hasOwnProperty('DisplayName')) {
        this.selectUser = `${value.DisplayName}`;
      }
    },
    getNewModel(val, done) {
      console.log('Model val :', val);
      done(val, 'add-unique');
    },
  },
  beforeMount() {

    if (this.value) {
      this.sUsers = Object.assign([],this.value)
      //this.selectedUsers=Object.assign([],this.value)

    }
  },
  async mounted() {
    console.log('Model val :', this.value);
    if (this.value) {
      this.sUsers = Object.assign([],this.value)
      //this.selectedUsers=Object.assign([],this.value)

    }
    if (process.env.NODE_ENV === 'production') {
      const preusers = await feathersClient.service('tables').find({
        query: {
          tableDb: 'cacemdb',
          tableName: 'ad-users',
          query: JSON.stringify({ query: {} }),
        },
      });
      this.users = preusers
        ? preusers.filter((o) => o.Enabled == 'true')
        : null;
      //this.users = await feathersClient.service('adUsers').find();
    } else {
      //this.users = await feathersClient.service('adUsers').find();
      const preusers = await feathersClient.service('tables').find({
        query: {
          tableDb: 'cacemdb',
          tableName: 'ad-users',
          query: JSON.stringify({ query: {} }),
        },
      });
      this.users = preusers
        ? preusers.filter((o) => o.Enabled == 'true')
        : null;
    }

    if (this.users) {
      console.log('Liste des utilisateurs :', this.users.length);
      this.uoptions = this.users;
    }

    /*if (this.selectedUsers.length>0) {
      this.sUsers = Object.assign([],this.selectedUsers)
    }*/
  },
  watch: {
    value(val) {
      //const newval = Object.assign([],val)
      console.log('Users :', val);
      this.sUsers = Object.assign([],val)
      this.$emit('update',val);
    }
  }
});
</script>
