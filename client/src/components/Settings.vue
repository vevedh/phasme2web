<template>
  <q-dialog ref="dialog" @hide="onDialogHide" class="q-pa-none">
    <q-card
      class="q-dialog-plugin q-pa-none"
      :style="`width:${twidth}; max-width:100%`"
    >
      <q-card-section class="q-pa-none">
        <q-bar class="bg-primary text-white">
          <q-space />
          <q-btn dense flat icon="close" @click="hide()" />
        </q-bar>
      </q-card-section>
      <q-card-section class="q-pa-none">

        <q-input
        filled
        label="Couleur du fond"
        v-model="config.bgright"

      >
        <template v-slot:append>
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-color v-model="config.bgright" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
        <!--<FVvTable :dbname="dbname" :dbtype="dbtype" :editable="false" @row-click="onRowClick"  :labelsColumns="[{id:'nom',label:'Nom'},{id:'puser',label:'Utilisateur'}]"></FVvTable>-->
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn color="secondary" label="Valider" @click="onOKClick" />
        <q-btn color="secondary" label="Annuler" @click="onCancelClick" />
      </q-card-actions>
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
import FVvTable from 'components/FVvTable.vue';
export default defineComponent({
  name: 'DiagSettings',
  components: {
    //FVvTable,
  },
  data() {
    return {
      data: [],
      columns: [],
      selected: [],
      filter: '',
      bgright:''
    };
  },
  props: {
    config: {
      type: Object,
      required: true
    },
    twidth: {
      type: String,
      default: '90%',
      required: false,
    },
  },
  /*computed: {
    ...mapState('admin', {
      //formData: state => state.getform,
      fconfig: (state) => state.config,
    }),
  },*/
  methods: {

    ...mapActions('admin', ['getConfig', 'writeConfig']),

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
      this.$emit('ok',this.config);
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide();
    },

    onCancelClick() {
      // we just need to hide dialog
      this.hide();
    },
  },
  beforeMount() {
    console.log("Config  :",this.config)
    this.bgright = this.config.bgright
  },
  async mounted() {
     //await this.getConfig();

     //this.bgright = this.props.config.bgright


    //const dbdatas = await this.$store.dispatch('tables/find',{query:{tableDb:this.dbtype,tableName:this.dbname,query:JSON.stringify({})}});//this.getDatas([this.dbtype,this.dbname,{}])
    //console.log("Datas :",dbdatas);
    //this.data = dbdatas;
  },
});
</script>
