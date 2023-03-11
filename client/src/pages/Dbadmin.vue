<template>
  <q-page class="container q-pa-md full-width">
    <!-- content -->
    <q-card class="full-width q-pa-none" v-if="!showTables">
      <q-banner class="bg-secondary text-white q-pb-none">
        Liste de toutes les bases
        <template v-slot:action>
          <!--<q-btn flat color="white" label="Dismiss" />
        <q-btn flat glossy color="white" label="Retour" @click="hasTables=false"/>-->
        </template>
      </q-banner>

      <q-card-section class="row full-width q-pa-none">
        <comp-databases @onClick="onDbSelect"></comp-databases>
        
      </q-card-section>
    </q-card>

    <q-card class="full-width q-pa-none" v-if="showTables && !showDatas">
      <q-banner class="bg-secondary text-white q-pb-none">
        Liste de toutes les tables de la base
        <span class="text-bold">{{ currentDatabase }}</span>
        <template v-slot:action>
          <!--<q-btn flat color="white" label="Dismiss" />-->
          <div class="q-pb-sm">
            <q-btn
              icon="arrow_back"
              flat
              glossy
              color="white"
              label="Retour"
              @click="hasTables = false"
            />
          </div>
        </template>
      </q-banner>

      <q-card-section class="full-width q-pa-none">
        <!--<select-tables :table="showSelectTable" id="df" ref="dfg" />-->
        <comp-tables :database="currentDatabase" @onClick="dbRowDatas"></comp-tables>
      </q-card-section>
    </q-card>

    <q-card class="full-width q-pa-none" v-if="showDatas">
      <q-banner class="bg-secondary text-white q-pb-none">
        Liste de toutes les tables de la base
        <span class="text-bold">{{ selectTableData }}</span>
        <template v-slot:action>
          <!--<q-btn flat color="white" label="Dismiss" /> :vuexActions="[{action:'adinfos/getTables',params:[selSelectTable]}]"-->
          <div class="q-pb-sm">
            <q-btn
             icon="arrow_back"
              flat
              glossy
              color="white"
              label="Retour"
              @click="hasDatas = false"
            />
          </div>
        </template>
      </q-banner>

      <q-card-section class="full-width q-pa-none">
        <comp-table-datas :database="currentDatabase" :table="selectTableData"></comp-table-datas>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api';

import { mapState, mapGetters, mapActions } from 'vuex';

import { date, QSpinnerGears, QBtn, QTooltip } from 'quasar';

import feathersClient from '../boot/feathers-client';
import FVvTable from '../components/FVvTable.vue';
import SelectTables from '../components/SelectTables.vue';
import CompDatabases from '../components/CompDatabases.vue';
import CompTables from '../components/CompTables.vue';
import CompTableDatas from '../components/CompTableDatas.vue';

export default {
  name: 'PageDbadmin',
  components: {
    FVvTable,
    CompDatabases,
    CompTables,
    CompTableDatas
  },
  data() {
    return {
      currentDatabase: '',
      selectTableData: '',
      selectTable: '',
      selectTables: [],
      hasTables: false,
      hasDatas: false,
    };
  },
  computed: {
    ...mapState('adinfos', {
      dbs: (state) => state.bases,
      currentTables: (state) => state.currentTables,
      currentDatas: (state) => state.currentDatas,
    }),
    ...mapGetters('adinfos',['getDatabases', 'getCurrentTables']),
    lstDbs() {
      
      if (!this.$store.state.allDatabases)
        return 
      return this.$store.state.allDatabases;
    },
    lstTables() {
      
        return this.selectTables
      
    },
    lstDatas() {
      if (Array.isArray(this.currentDatas)) {
        return Object.assign([],this.currentDatas)
      }
    },
    showTables() {
      return this.hasTables;
    },
    showDatas() {
      return this.hasDatas;
    },
    selSelectTable() {
      return this.selectTable;
    },
    
  },
  methods: {
    ...mapActions('adinfos', ['getAllDatabases', 'getTables', 'getTableDatas']),

    onDbSelect(evt) {
      console.log('Get tables :',evt.tables)
      console.log('Get db :',evt.db)
      this.currentDatabase = evt.db;
      this.selectTables = evt.tables;
      this.hasTables = true;
      this.hasDatas = false;

    },
   dbRowDatas(evt) {
     console.log('Get table :',evt.table)
      console.log('Get db :',evt.db)
      this.selectTableData = evt.table;
      console.log('Table :', this.selectTableData);
      this.$store.dispatch('adinfos/getTableDatas',[evt.db,evt.table]).then(()=>{
      
      console.log('Les Données :', this.$store.state.adinfos.currentDatas);
      if (this.$store.state.adinfos.currentDatas) {
        //this.hasTables = true;
      this.hasDatas = true;
      }
    })
      
      
      /*this.$q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red',
        message: 'Chargement en cours...',
      });
      await this.getTableDatas([this.selectTable, this.selectTableData]);
      this.$q.loading.hide();
      console.log('Databases :', this.currentDatas);*/
    },
    
  },
  async mounted() {
    this.$q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red',
        message: 'Chargement en cours...',
      });
    //setTimeout(async() => {
      await this.$store.dispatch('adinfos/getAllDatabases')
    //}, 5000);
    
    console.log('Databases :', this.$store.state.adinfos.bases);
    console.log('CurrentDB :', this.$store.state.selectDataBase);
    console.log('CurrentTable :', this.$store.state.adinfos.currentTables);
    
    this.$q.loading.hide();
    
  },
 
  
};
</script>
