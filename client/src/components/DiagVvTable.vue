<template>
  <q-dialog ref="dialog" @hide="onDialogHide" class="q-pa-none">

    <q-card class="q-dialog-plugin q-px-none"  :style="`width:${twidth}; max-width:100%`">
     <q-card-section class="full-width q-pa-none overflow-hidden-y hide-scrollbar">
 <q-bar class="bg-primary text-white full-width">
        <q-space />
        <q-btn dense flat icon="close" @click="hide()" />
      </q-bar>
      </q-card-section>
      <q-card-section style="max-height: 50vh" class="scroll col-12 q-py-md">
        <f-vv-table
          :dbname="dbname"
          :dbtype="dbtype"
          @row-dblclick="onRowClick"
          :useSelection="true"
          :editable="false"
          :columns="['uid','nom','type']"
          class="q-pa-xs"
        ></f-vv-table>
      </q-card-section>

      <!-- buttons example :labelsColumns="[{id:'nom',label:'Nom'},{id:'puser',label:'Utilisateur'}]"-->
      <!--<q-card-actions align="right">
        <q-btn color="secondary" label="Valider" @click="onOKClick" />
        <q-btn color="secondary" label="Annuler" @click="onCancelClick" />
      </q-card-actions>-->
    </q-card>
  </q-dialog>
</template>

<script>
import {
  FeathersVuexFind,
  FeathersVuexGet,
  FeathersVuexCount,
} from 'feathers-vuex';
import { mapState, mapActions } from 'vuex';
import { defineComponent } from '@vue/composition-api';

import FVvTable from './FVvTable.vue';
export default defineComponent({
  name: 'DiagVvTable',
  components: {
    FVvTable

  },
  data() {
    return {
      data: [],
      columns: [],
      selected: [],
      filter: '',
    };
  },
  props: {
    dbname: {
      type: String,
      required: true,
    },
    dbtype: {
      type: String,
      required: true,
    },
    twidth: {
      type: String,
      default: '90%',
      required: false,
    },
  },
  methods: {
    ...mapActions('tables', { getDatas: 'getTableQuery' }),
    onRowClick(evt, row) {
      console.log('Row :', row);
      this.$emit('ok', row);

      // then hiding dialog
      this.hide();
    },
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      this.$refs.dialog.show();
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide');
    },

    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit('ok');
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide();
    },

    onCancelClick() {
      // we just need to hide dialog
      this.hide();
    },
  },
  async mounted() {
    console.log('Store context', this);
    console.log('DbName :', this.dbname);
    console.log('DbType :', this.dbtype);
    //const dbdatas = await this.$store.dispatch('tables/find',{query:{tableDb:this.dbtype,tableName:this.dbname,query:JSON.stringify({})}});//this.getDatas([this.dbtype,this.dbname,{}])
    //console.log("Datas :",dbdatas);
    //this.data = dbdatas;
  },
});
</script>
