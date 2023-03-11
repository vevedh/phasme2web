<template>
<q-page class="container row full-width" padding>
    <q-vv-grid class="full-width" :data="rdata" :columns="newColumns" :header_filter="true" ></q-vv-grid>
</q-page>
  
</template>

<script>
import { defineComponent } from '@vue/composition-api';
import { mapState, mapActions, mapGetters } from 'vuex';
import { date, QSpinnerGears, QBtn, QTooltip } from 'quasar';
import FVvTable from '../components/FVvTable.vue'
import QVvGrid from '../components/QVvGrid.vue';
import feathersClient from '../boot/feathers-client';
export default {
  components: { FVvTable, QVvGrid },
  data() {
      return {
          rdata:[]
      }
  },
  methods: {
    objectsNotIn(fobj, lobj) {
      var arnotin = [];
      Object.keys(fobj).forEach((val) => {
        //console.log('val :',val)
        if (!Object.keys(lobj).includes(val)) {
          arnotin.push(val);
        }
      });
      arnotin.splice(arnotin.indexOf('_id'), 1);
      return arnotin;
    }
  },
    computed: {
        ...mapState('adinfos', {
      isAdmin: (state) => state.isAdmin,
      isSiteAdmin: (state) => state.isSiteAdmin,
       grpUser: (state) => state.userGrpes,
      siteRole: (state) => state.siteRole
    }),
    ...mapGetters('auth',['isAuthenticated','user']),
    },
    beforeMount() {
      //if (this.dbname && this.tablename) {
          console.log('initialisation base de donnée...')
          feathersClient.service('tables').find({
        query: {
          tableDb: 'cacemdb',
          tableName: 'imprimantes',
          query: JSON.stringify({ query: {} }),
        },
      }).then((resDatas)=>{
          console.log('Données du tableau :',resDatas)
          this.rdata = Object.assign([],resDatas);
          let tmpdatas= Object.assign([],resDatas);
          /**************************** */
          const countkeys = this.rdata.map((o) => `${Object.keys(o).length}`);
        console.log('Count keys :', countkeys);
        const maxlen = Math.max(...countkeys);
        const minlen = Math.min(...countkeys);
        console.log('Nb max props :', maxlen);
        console.log('Nb min props :', minlen);
        const maxCols = countkeys.findIndex(
          (item) => Number(item) == Number(maxlen)
        );
        console.log('Nb maxCols props :', maxCols);
        const dbdata = Object.assign([], this.rdata);

        console.log('Data max :', dbdata[maxCols]);

        const minCols = countkeys.findIndex(
          (item) => Number(item) == Number(minlen)
        );
        console.log('Data :', this.rdata);
        let uniquevals = [...new Set(countkeys)];

        console.log('Data min :', dbdata[minCols]);
        const fusionObj = Object.assign(dbdata[maxCols], dbdata[minCols]);

        console.log('Fusion Obj :', fusionObj);
        var cols = Object.keys(fusionObj);
        console.log('Columns :', cols);
        /************************************* */
        //  transform ['nom','prenom'] en { nom:'',prenom:''}
        this.editRow = cols.reduce(
          (column, key) => ((column[key] = ''), column),
          {}
        );

        /**
         * prise en compte de tous les champs possible des données de la table
         */
        let compCols = [];

        tmpdatas.forEach((val, index) => {
          compCols.push({
            orig: Object.keys(val).length,
            col: Object.keys(this.editRow).length,
            obbj: this.objectsNotIn(val, this.editRow),
          });
          if (this.objectsNotIn(val, this.editRow).length > 0) {
            let newrow = this.objectsNotIn(val, this.editRow).reduce(
              (column, key) => ((column[key] = ''), column),
              {}
            );
            this.editRow = Object.assign(this.editRow, newrow);
          }
        });
        console.log('New edit row :', this.editRow);
        cols = Object.keys(this.editRow);

        this.newColumns = cols.map((col) => ({
          name: col,
          align: 'center',
          label: col,
          field: col,
          filter_type:'select',
          sortable: true,
        }));


      })
      //}
  },

}
</script>

<style>

</style>