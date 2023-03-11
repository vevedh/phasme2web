<template>
  <div class="full-width">
    <FVvTable
          
          :titre="'Liste des Tables'"
          :datas="lstTables"
          :editable="false"
          style="width: 100%; height: 100%"
          
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
      locTables:[]
    };
  },
  props: {
    database: {
      type: String
    },
    tables: {
      type: Array
    }
  },
  computed: {
    lstTables() {
      return this.$store.state.adinfos.currentTables;
    }
  },
  methods: {
     //...mapActions('adinfos', ['getAllDatabases', 'getTables', 'getTableDatas']),
    async dbRowClick(evt, row, index) {
      let currentTable = row.name;
      
      
      this.$emit('onClick',{ db:this.database,table:currentTable})
    },

  },
  async mounted() {
    console.log('Les Tables :', this.$store.state.adinfos.currentTables);
    await this.$store.dispatch('adinfos/getTables',this.database)
    //this.locTables = Object.assign([],this.$store.state.adinfos.currentTables)
  },
  
  watch: {
    'database': (value) => {
      console.log('database change :',value)
    }
  }
};
</script>

<style lang="scss" scoped></style>