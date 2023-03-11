<template>
  <q-page class="container full-width q-pt-xl" padding>
    <div class="full-width q-pa-xl"></div>
    <f-vv-grid-parking :dbname="'db_regvisiteurs'" :tablename="'dbf_accueil'" :titre="'Gestion Véhicules Parking'"  :query="query" :columns_filter="true" :allowexport="true"></f-vv-grid-parking>
  </q-page>
</template>

<script>

import { mapState, mapActions } from 'vuex';

import { QSpinnerGears, QBtn, QTooltip, uid, date } from 'quasar';

import feathersClient from '../boot/feathers-client';
import FVvGridParking from '../components/FVvGridParking';
//import FVvGrid from '../components/FVvGrid.vue';


export default {
  data() {
    return {
      datas: null,
      query:'',
      formFields: null,
      queryObj: null,
      visibleColumns: [],
      show_AddDialog: false,
      show_EditDialog: false,
      newColumns: [],
      editRow: {},
      selected: [],
      selectedRow: {},
      filter: '',
      filters: {},
      filtersParams: {},
      filtersOperator: {},
      filter_data: {},
      column_options: {},
      column_options_selected: {},
      datesFields: [],
      customFilter: null,
      datedujour: date.formatDate(Date.now(), 'DD/MM/YYYY'),
    };
  },
  components: {
    FVvGridParking
  },
  computed: {
     ...mapState('adinfos', {
      isAdmin: (state) => state.isAdmin,
      grpUser: (state) => state.userGrpes,
      siteRole: (state) => state.siteRole,
      isSiteAdmin: (state) => state.isSiteAdmin,
      users: (state) => state.users,
     }),
    /*...mapState('admin',{
      appLinks: state => state.applinks,
    })*/
  },
  beforeMount() {
    console.log('Parms ID :', this.$route.params.id);
    this.query = JSON.stringify({ typeacces:'PARKING'})
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
    },
    /**
     *  Mise a jour des donnees depuis la base de donnees
     */
    async updateDatas() {
      this.$q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red',
        message: 'Chargement en cours...',
      });
      let tmpdatas = Object.assign([], this.datas);
      console.log('Table result :', tmpdatas);
      this.$q.loading.hide();
      this.ldata = Object.assign([], tmpdatas);
      if (this.ldata.length > 0) {
        const countkeys = this.ldata.map((o) => `${Object.keys(o).length}`);
        console.log('Count keys :', countkeys);
        const maxlen = Math.max(...countkeys);
        const minlen = Math.min(...countkeys);
        console.log('Nb max props :', maxlen);
        console.log('Nb min props :', minlen);
        const maxCols = countkeys.findIndex(
          (item) => Number(item) == Number(maxlen)
        );
        console.log('Nb maxCols props :', maxCols);
        const dbdata = Object.assign([], this.ldata);

        console.log('Data max :', dbdata[maxCols]);

        const minCols = countkeys.findIndex(
          (item) => Number(item) == Number(minlen)
        );
        console.log('Data :', this.ldata);
        let uniquevals = [...new Set(countkeys)];

        console.log('Data min :', dbdata[minCols]);
        const fusionObj = Object.assign(dbdata[maxCols], dbdata[minCols]);

        console.log('Fusion Obj :', fusionObj);
        var cols = Object.keys(fusionObj);
        console.log('Columns :', cols);

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
          header: col,
          filter: { type: 'text', showApplyBtn: true, showClearBtn: true },
        }));

        console.log('NEw Columns :', this.newColumns);

        console.log('COLONNES  COMP : ', compCols);

        // colonnes à afficher
      }
    },
  },
  async mount() {
    //const { Table } = this.$FeathersVuex.api;
    this.formData = await feathersClient.service('tables').find({
      query: {
        tableDb: 'cacemdb',
        tableName: 'formulaires',
        query: JSON.stringify({
          query: { nom: 'Demande Parking', _id: '6228b167028bec05c21cc1f8' },
        }),
      },
    });

    console.log('Formulaire :', this.formData);
    this.formFields = this.formData[0].data
      .filter((elt) => Object(elt).hasOwnProperty('id'))
      .map((elt) => ({ type: elt.field_type, name: elt.id }));
    console.log('Formulaire fields :', this.formFields);

    if (this.formData[0].dbname != '' && this.formData[0].tablename != '') {
      this.datas = await feathersClient.service('tables').find({
        query: {
          tableDb: this.formData[0].dbname,
          tableName: this.formData[0].tablename,
          query: this.queryObj
            ? JSON.stringify(this.queryObj)
            : JSON.stringify({}),
        },
      });
    }

    console.log('Table :', this.datas);
    await this.updateDatas();
  },
  created() {},
};
</script>

<style>
</style>