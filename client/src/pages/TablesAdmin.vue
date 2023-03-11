<template>
  <q-page class="flex flex-center q-pt-xl" >
    <!-- content -->



    <q-card class="my-card q-pa-none"   style="width:80%; height:75%">

        <q-banner class="bg-secondary text-white q-pb-none">
        Liste de toutes les tables de la base <span class="text-bold">{{currentDatabase}}</span>
        <template  v-slot:action >
        <!--<q-btn flat color="white" label="Dismiss" />-->
        <div class="q-pb-sm">
        <q-btn flat glossy color="white" label="Retour" to="tablesAdmin" />
        </div>
        </template>
        </q-banner>


      <q-card-section class="full-width q-pa-none">
        <FVvTable  :titre="`Liste des tables `"  :datas="tables" :editable="false" style="width:100%; height:100%" ref="tb2"/>
      </q-card-section>
    </q-card>





  </q-page>
</template>

<script>

import { mapState,mapGetters,mapActions } from 'vuex'
import { defineComponent } from '@vue/composition-api'
import FVvTable from '../components/FVvTable.vue'
import feathersClient from "../boot/feathers-client";

export default defineComponent({
  name: 'PageDbadmin',
  components: {
    FVvTable
  },
  data() {
    return {
      hasTables:false,
      currentDatabase:null,
      //tables:[]
    }
  },
  computed: {
    ...mapState('adinfos', {
      dbs: state => state.bases,
      currentTables: state => state.currentTables,
    }),
    ...mapGetters('adinfos', {
      datasDb: 'getDatabases',
    }),
    ...mapGetters('adinfos', ['getCurrentTables']),
    showTables() {
      return this.hasTables
    },
    tables() {
      return this.getCurrentTables
    }

  },
  methods: {
    ...mapActions('adinfos', ['getAllDatabases','getTables']),

    async dbRowClick(evt,row,index) {
      this.hasTables = true;
      this.currentDatabase = row.name
      console.log(`Event : ${index}`,row)
      await this.getTables(row.name)
      console.log('Les tables :',this.currentTables)
      //this.updateTable(this.tables)

    }
  },
  async mounted() {

    await this.getAllDatabases()
    console.log('Databases :',this.datasDb)
  }
})
</script>
