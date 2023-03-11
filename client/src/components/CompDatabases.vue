<template>
  <div class="full-width">
    <FVvTable
          
          :titre="'Liste des bases'"
          :datas="lstDbs"
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
  created() {},
  data() {
    return {};
  },
  props: {},
  computed: {
    lstDbs() {
      
      if (!this.$store.state.allDatabases)
        return 
      return this.$store.state.allDatabases;
    }
  },
  methods: {
    async dbRowClick(evt, row, index) {
      let currentDatabase = row.name;
      
      this.$q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red',
        message: 'Chargement en cours...',
      });
      await this.$store.dispatch('adinfos/getTables',currentDatabase)
      //await this.getTables(this.currentDatabase);
      this.$q.loading.hide();
      console.log('Tables :', this.$store.state.adinfos.currentTables);
      this.$emit('onClick',{ db:currentDatabase,tables:this.$store.state.adinfos.currentTables})
    },
  },
};
</script>

<style lang="scss" scoped></style>