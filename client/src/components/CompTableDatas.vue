<template>
  <div class="full-width">
    <FVvTable
          
          :titre="'Liste des données de la table'"
          :datas="lstDatas"
          :editable="isAdmin"
          :selectable="isAdmin"
          :readonly="!isAdmin"
          style="width: 100%; height: 100%"
          :dbtype="database"
          :dbname="table"
          @row-click="dbRowClick"
     
        />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { date, QSpinnerGears, QBtn, QTooltip } from 'quasar';
import FVvTable from './FVvTable.vue';
export default {
  name: "Test",
  components: {
    FVvTable
  },
  data() {
    return {
      donnees:[]
    };
  },
  props: {
    database: {
      type: String
    },
    table: {
      type: String
    }
  },
  computed: {
     ...mapState('adinfos', {
      isAdmin: (state) => state.isAdmin,
      isSiteAdmin: (state) => state.isSiteAdmin,
      grpUser: (state) => state.userGrpes,  
      users: (state) => state.users,
    }),
    lstDatas() {
      if (!this.$store.state.adinfos.currentDatas)
        return
      return this.$store.state.adinfos.currentDatas;
    }
  },
  methods: {
     //...mapActions('adinfos', ['getAllDatabases', 'getTables', 'getTableDatas']),
    dbRowClick(evt, row, index) {
      let currentData = row.name;
      
      /*this.$q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red',
        message: 'Chargement en cours...',
      });
      await this.$store.dispatch('adinfos/getTables',currentDatabase)
      //await this.getTables(this.currentDatabase);
      this.$q.loading.hide();
      console.log('Tables :', this.$store.state.adinfos.currentTables);
      this.$emit('onClick',{ db:currentDatabase,tables:this.$store.state.adinfos.currentTables})*/
    },

  },
  mounted() {
    
    this.$q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red',
        message: 'Chargement en cours...',
      });
    this.$store.dispatch('adinfos/getTableDatas',[this.database,this.table]).then(()=>{
      this.$q.loading.hide();
      console.log('Les Données :', this.$store.state.adinfos.currentDatas)
    })
    

    
  },
  
  watch: {
    'database': (value) => {
      console.log('database change :',value)
    },
    'table': (value) => {
      console.log('table change :',value)
    }
  }
};
</script>

<style lang="scss" scoped></style>