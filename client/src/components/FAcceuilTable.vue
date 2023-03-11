<template>
  <div class="">
    <div
      class="row fit q-pb-md items-right justify-right full-width"
      v-if="show_ExcelImport"
    >
      <q-uploader
        ref="uploader"
        :multiple="false"
        :hide-upload-btn="true"
        square
        outlined
        label="Sélectionner un fichier excel"
        type="file"
        @added="onChange"
        class="full-width q-px-none"
      />
      <q-btn
        color="primary"
        text-color="white"
        label="Utiliser comme base de donnée"
        v-if="currentFile.name"
        @click="saveToDatabase()"
      />
    </div>
    <q-table
      id="myTable"
      ref="myTable"
      :title="setTitle"
      :data="datas ? datas : liveDatas"
      :row-key="(row) => (row._id ? row._id : row[Object.keys(row)[0]])"
      :selection="useSelection"
      :columns="newColumns"
      :filter="filter"
      @row-click="rowSelect"
      no-data-label="pas de données pour l'instant..."
      no-results-label="Aucun résultat trouvé"
      :selected.sync="useSelected"
      :visible-columns="visibleColumns"
      :pagination="initialPagination"
      :separator="'cell'"
    >
      <!--:selected.sync="useSelected"  :selection="useSelection"-->
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-if="selectable || editable"
            class="text-bold text-primary bg-blue-1"
          ></q-th>
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-bold text-primary bg-blue-1"
          >
            <q-btn
              v-if="selectable || editable"
              flat
              dense
              round
              aria-label="Filtre"
              icon="filter_alt"
            >
              <!--<q-menu anchor="bottom end" self="top end">--><!--v-model="colFilter[col.name]"-->
              <q-popup-edit
                :ref="`filter_${col.name}`"
                v-model="filtersParams[col.name]"
                :cover="false"
                :offset="[0, 2]"
                v-slot="scope"
              >
                <div
                  v-if="datesFields.includes(col.name)"
                  class="q-pa-none"
                  style="width: 180px"
                >
                  <div class="text-body2 text-grey q-mb-md">
                    Critère de filtre [{{ col.name }}]
                  </div>
                  <!--<json-viewer :value="scope"></json-viewer>-->
                  <div class="row items-center">
                    <div class="q-pa-none text-caption text-dark full-width">
                      <q-select
                        dense
                        filled
                        v-model="filtersParams[col.name].option"
                        :options="['annee', 'mois', 'jour']"
                        label="Date par"
                      />
                    </div>
                    <div class="col-12 q-pa-none">
                      <q-input
                        dense
                        v-model="filtersParams[col.name].value"
                      /><!--v-model="exactPhrase"-->
                    </div>

                    <div class="q-pa-sm q-gutter-md">
                      <q-btn
                        dense
                        no-caps
                        color="primary"
                        size="sm"
                        style="min-width: 68px"
                        label="Filtrer"
                        @click="updateFilters(scope, col.name)"
                      />
                      <q-btn
                        dense
                        no-caps
                        color="grey-7"
                        size="sm"
                        style="min-width: 68px"
                        label="Effacer"
                        @click="deleteFilters(scope, col.name)"
                      />
                    </div>
                  </div>
                </div>
              </q-popup-edit> </q-btn
            >{{ String(col.label).toUpperCase() }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body-cell="props">
        <q-td :props="props" class="q-pa-none">
          <json-viewer
            v-if="ifJSON(props.value)"
            :value="props.value"
          ></json-viewer>
          <div class="q-pa-none inline cursor-pointer" v-else>
            <div
              class="
                q-pa-none
                fit
                flex flex-center
                text-center
                non-selectable
                q-pa-md
              "
            >
              {{ props.value }}
            </div>
            <!--<q-tooltip>Cliquez pour sélectionner</q-tooltip>-->
          </div>
        </q-td>
      </template>
      <!------------------------------------------>
      <template v-slot:top-left="props">
        <div class="text-h6">{{ (currentAcces!='')?`${setTitle} [${currentAcces}]`:`${setTitle}`}}</div>
        <div class="row q-gutter-sm q-py-md">
          <q-btn
            color="primary"
            dense
            no-caps
            @click="show_ExcelImport = true"
            class="q-px-sm"
            v-if="useAdmin && !hideexcel"
            >
            <q-icon  size="0.9em" name="far fa-file-excel" />
            <q-icon  size="0.9em" name="fas fa-arrow-right"/>
            <q-icon  size="0.9em" name="fas fa-database" />

            <div class="q-px-sm">Excel Init</div>
            </q-btn>
          <q-btn
            color="primary"
            dense
            no-caps
            @click="show_AddDialog = true"
            class="q-px-sm"
            v-if="newColumns.length != 0 && showAdd"
            >Ajouter</q-btn
          >

          <q-dialog v-model="show_AddDialog">
            <q-card>
              <q-card-section>
                <div class="text-h6">Ajouter un element!</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div
                    class="col-12"
                    v-for="(item, index) in newColumns"
                    :key="`key-${index}`"
                  >
                    <q-input
                      v-model="editRow[`${item.name}`]"
                      :label="item.name"
                    ></q-input>
                  </div>
                </div>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn
                  flat
                  label="Annuler"
                  color="primary"
                  v-close-popup
                  @click="show_AddDialog = false"
                ></q-btn>
                <q-btn
                  flat
                  label="Valider"
                  color="primary"
                  v-close-popup
                  @click="addRow"
                ></q-btn
                ><!-- -->
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
        <!--   SPECIFIQUE REGVISITEUR   ACCEUIL  RECHERCHE PLAGE DATE ET TYPE ACCESS (RDC,PARKING,GPU,GCD) --->
        <div class="row q-gutter-md q-pb-md">
          <q-btn
            dense
            no-caps
            outline
            class="q-px-md text-subtitle2 text-bold text-primary"
          >
            Les visites entre le
            {{
              Object(dateRange).hasOwnProperty('from') ? dateRange.from : null
            }}
            et le
            {{ Object(dateRange).hasOwnProperty('to') ? dateRange.to : null }}
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date
                v-model="dateRange"
                :locale="myLocale"
                mask="DD/MM/YYYY"
                range
                minimal
                @range-end="filterRangeDate(dateRange)"

              ><!--v-close-popup="Object(dateRange).hasOwnProperty('to')"-->
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Fermer" color="primary" flat />
              </div>
              </q-date>
            </q-popup-proxy>
            <q-tooltip
              content-class="text-dark text-subtitle2 text-center bg-amber"
            >
              Cliquez-ici pour voir les visites entre 2 dates
            </q-tooltip>
          </q-btn>

          <q-btn
            dense
            no-caps
            outline
            label="Visites pour la date (cliquez-ici)"
            class="q-px-md text-subtitle2 text-bold text-primary"

          >
          <q-popup-proxy ref="btnDatej" transition-show="scale" transition-hide="scale">
              <q-date
                v-model="dateSelected"
                :locale="myLocale"
                mask="DD/MM/YYYY"
                minimal
                @input="filterDateVisite(dateSelected),$refs.btnDatej.hide()"

              >
              </q-date>
            </q-popup-proxy>
            <q-tooltip
              content-class="text-dark text-subtitle2 text-center bg-amber"
            >
              Cliquez-ici pour voir les visites pour une date précise
            </q-tooltip>
          </q-btn>

          <q-btn
            dense
            color="primary"
            no-caps
            label="Effacer les filtres"
            @click="currentAcces='',customFilter = ''"
          >
          <q-tooltip
              content-class="text-dark text-subtitle2 text-center bg-amber"
            >
              Cliquez-ici pour effacer les filtres
            </q-tooltip>
          </q-btn>
        </div>
        <div class="row q-gutter-md q-pb-md">
          <q-btn-dropdown  dense color="primary" label="Lieu">
            <q-list v-for="lieu in lieuAcces" :key="`lieu-${lieu}`">
              <q-item clickable v-close-popup @click="filterTypeAcces(lieu)">
                <q-item-section>
                  <q-item-label>{{lieu}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

        </div>
        <!----------------------------------------------------------------------------------------------------->
        <div v-if="!hideexcel" class="row q-gutter-md q-pb-md">
          <q-btn
            dense
            flat
            no-caps
            class="bg-primary"
            text-color="white"
            icon="far fa-file-excel"
            label=".xlsx"
            @click="exportDatasExcel()"
          />
          <q-btn
            dense
            no-caps
            flat
            class="bg-primary"
            text-color="white"
            icon="fas fa-file-csv"
            label=".csv"
            @click="exportCsvTable()"
          />
          <q-btn
            dense
            no-caps
            flat
            filled
            class="bg-primary"
            text-color="white"
            icon="far fa-file-pdf"
            label=".pdf"
            @click="exportDatasPdf()"
          />
        </div>
      </template>

      <template v-slot:top-right="props">
        <div class="row q-gutter-sm">
          <q-input
            dense
            debounce="300"
            v-model="filter"
            placeholder="Recherche"
            label-color="text-dark"
          >
            <q-icon slot="append" name="search" />
          </q-input>
          <!---->
          <q-select
            v-model="visibleColumns"
            multiple
            outlined
            dense
            options-dense
            :display-value="$q.lang.table.columns"
            emit-value
            map-options
            :options="newColumns"
            option-value="name"
            options-cover
            style="min-width: 150px"
          />
          <q-btn
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            class="q-ml-md"
          />
          <!---->
        </div>
      </template>

      <template v-slot:bottom-row v-if="selected && selected.length > 0">
        <q-tr>
          <q-td colspan="100%" class="q-pa-md">
            <q-btn
              color="red"
              dense
              no-caps
              v-if="selected && selected.length > 0 && editable"
              class="q-px-md q-mx-sm"
              @click="supPrevBtn"
              >Supprimer</q-btn
            >
            <q-btn
              color="grey-8"
              dense
              no-caps
              v-if="selected && selected.length > 0 && editable"
              class="q-px-md q-mx-sm"
              @click="show_EditDialog = true"
              >Modifier</q-btn
            >
            <q-dialog v-model="show_EditDialog">
              <q-card style="width:80%;max-width:100%">
                <q-toolbar class="text-white  full-width bg-blue">
                  <q-toolbar-title class="text-h5"> Modification ! </q-toolbar-title>
                  <q-btn flat round dense icon="close" v-close-popup />
                </q-toolbar>

                <q-card-section class="q-pa-md" style="width:100%;max-width:100%">
                  <f-vv-form
                    ref="editForm"
                    :title="`${dbname.split('dbf_')[1]}`"
                    :fieldsmodel="selectedRow"
                    class="q-pa-sm"
                  ></f-vv-form>
                  <!--  <div class="row">
                    <div
                      class="col-12"
                      v-for="(item, index) in newColumns"
                      :key="`key-${index}`"
                    >
                      <q-input
                        v-model.sync="selectedRow[`${item.name}`]"
                        :label="item.name"
                      ></q-input>
                    </div>
                  </div>-->
                </q-card-section>
                <q-card-actions align="center" class="q-px-xl q-py-md">
                  <q-btn
                    flat
                    label="Annuler"
                    color="primary"
                    v-close-popup
                    @click="show_EditDialog = false"
                  ></q-btn>
                  <q-btn
                    flat
                    label="Valider"
                    color="primary"
                    v-close-popup
                    @click="updateRow"
                  ></q-btn>
                </q-card-actions>
              </q-card>
            </q-dialog>
          </q-td>
        </q-tr>
      </template>

      <!--<template v-slot:bottom>
    <q-btn flat>
        Graphs</q-btn>
    <q-btn flat>Excel</q-btn>
    <q-btn flat>Pdf</q-btn>
</template>-->
    </q-table>
    <!--<div class="q-mt-md" v-if="useAdmin">Selected: {{ JSON.stringify(selected) }}</div>-->
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { mapState, mapActions } from 'vuex';
import { defineComponent } from '@vue/composition-api';
import feathersClient from '../boot/feathers-client';
import { exportFile } from 'quasar';
import FVvForm from './FVvForm.vue';
import { date, openURL } from 'quasar';

export default defineComponent({
  components: { FVvForm },
  name: 'FAcceuilTable',
  data() {
    const myLocale = {
      /* starting with Sunday */
      days: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
      daysShort: 'Dim_Lun_Mar_Mer_Jeu_Ven_Sam'.split('_'),
      months:
        'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Aôut_Septembre_Octobre_Novembre_Décembre'.split(
          '_'
        ),
      monthsShort: 'Jan_Fév_Mar_Avr_Mai_Jun_Jui_Aou_Sep_Oct_Nov_Déc'.split('_'),
      firstDayOfWeek: 0,
    };
    return {
      myLocale: myLocale,
      dateSelected:'',
      currentAcces:'',
      lieuAcces:[],
      data: [],
      currentFile: {},
      show_ExcelImport: false,
      initialPagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 5,
        // rowsNumber: xx if getting data from a server
      },
      visibleColumns: [],
      show_AddDialog: false,
      show_EditDialog: false,
      newColumns: [],
      editRow: {},
      selected: [],
      selectedRow: {},
      dateRange: {},
      filter: '',
      filters: {},
      filtersParams: {},
      filtersOperator: {},
      datesFields: [],
      customFilter: null,
    };
  },
  props: {
    dbname: {
      type: String,
      required: false,
    },
    dbtype: {
      type: String,
      default: 'mongodb',
      required: false,
    },
    datas: {
      type: Array,
      required: false,
    },
    columns: {
      type: Array,
      required: false,
    },
    labelsColumns: {
      type: Array,
      default: null,
      required: false,
    },
    editable: {
      type: Boolean,
      default: true,
      required: false,
    },
    hideid: {
      type: Boolean,
      default: true,
      required: false,
    },
    hideexcel: {
      type: Boolean,
      default: true,
      required: false,
    },
    titre: {
      type: String,
      default: '',
      required: false,
    },
    useAdmin: {
      type: Boolean,
      default: false,
      required: false,
    },
    selectable: {
      type: Boolean,
      default: false,
      required: false,
    },
    showAdd: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    setTitle() {
      if (this.titre == '') {
        return this.dbname;
      } else {
        return this.titre;
      }
    },
    liveDatas() {
      if (!this.dbtype && !this.dbname) {
        return [...this.datas];
      }

      if (Array.isArray(this.customFilter)) {
        return this.customFilter; //
      } else {
        return [...this.data];
      }
    },
    useSelection() {
      if (this.editable || this.selectable) {
        return 'single';
      } else {
        return 'none';
      }
    },
    useSelected: {
      get() {
        if (this.editable || this.selectable) {
          return this.selected;
        } else {
          return [];
        }
      },
      set(val) {
        this.selected = val;
      },
    },
  },
  methods: {
    /**
     * Filters an array of objects using custom predicates.
     *
     * @param  {Array}  array: the array to filter
     * @param  {Object} filters: an object with the filter criteria
     * @return {Array}
     */
    filterArray(array, filters) {
      const filterKeys = Object.keys(filters);
      return array.filter((item) => {
        // validates all filter criteria
        return filterKeys.every((key) => {
          // ignores non-function predicates
          if (typeof filters[key] !== 'function') return true;
          return filters[key](item[key]);
        });
      });
    },
    /**
     *Myr!(Object(dateRange).hasOwnProperty('from'))?dateRange.from:nul
     */
    ifJSON(field) {
      try {
        if (
          Object.prototype.toString.call(field) === '[object Object]' ||
          Array.isArray(field)
        ) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    },
    /**
     *  Chargement de données depuis un fichier excel
     */
    onChange(files) {
      let file = files ? files[0] : null;
      console.log('File :', file);
      this.currentFile = file;
      const target = file;
      console.log('Files data :', target);
      const reader = new FileReader();
      reader.onload = (e) => {
        // read workbook //
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, {
          type: 'binary',
          cellDates: true,
        });
        /*  grab first sheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        if (this.data) {
          /* save data */
          this.data = XLSX.utils.sheet_to_json(ws, {
            header: 0,
            raw: true,
          });
        }
        console.log('Datas :', this.data);
        let dataHeader = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          raw: true,
        });
        console.log('Datas headers :', dataHeader);
        //if (this.data.length>0) {
        // this.showInitTable = true;
        //}
        console.log('Datas with header :', dataHeader.length);
        //this.idatas = data; //this.data;//this.route.snapshot.paramMap.get('datas');
        if (Array.isArray(dataHeader) && dataHeader.length > 0) {
          this.newColumns = [];
          //this.selectedCols = [];
          //this.memColumns = [];
          console.log(
            'Keys headers :',
            JSON.parse(JSON.stringify(dataHeader[0]))
          );
          //this.headerKey= dataHeader[0][1];
          let headers = JSON.parse(JSON.stringify(dataHeader[0]));
          let cheaders = headers.map((elt) => `${String(elt).trim()}`);
          console.log('Keys headers :', cheaders);
          this.visibleColumns = cheaders;
          headers.forEach((val) => {
            if (typeof val == 'string') {
              //const row = { name: val, field: val, label: val ,sortable: true};
              //this.selectedCols.push(val);
              this.newColumns.push({
                name: val,
                field: val,
                label: val,
                sortable: true,
              });
              //this.memColumns.push({ name: val, field: val, label: val ,sortable: true});
            }
          });
          //console.log("Mem Champs :",this.memColumns);
        }
      };
      reader.readAsBinaryString(file);
    },
    async saveToDatabase() {
      let datas = Object.assign([], this.data);
      let emptyArr = [];
      this.data = Object.assign([], emptyArr);
      if (!Array.isArray(datas)) {
        return;
      }
      datas.forEach(async (data) => {
        await feathersClient
          .service('tables')
          .create(JSON.parse(JSON.stringify(data)), {
            query: {
              tableDb: this.dbtype, //'db_visiocacem',
              tableName: this.dbname, //'salles',
            },
          });
      });
      if (datas.length > 0) {
        const cols = Object.keys(datas[0]);
        console.log('Columns :', cols);
        //  transform ['nom','prenom'] en { nom:'',prenom:''}
        this.editRow = cols.reduce(
          (column, key) => ((column[key] = ''), column),
          {}
        );
        this.newColumns = cols.map((col) => ({
          name: col,
          align: 'center',
          label: col,
          field: col,
          sortable: true,
        }));
      }
      this.visibleColumns = Object.assign([], this.newColumns);
      if (this.hideid) {
        this.visibleColumns = Object.assign(
          [],
          this.visibleColumns
            .filter((col) => col.field != '_id')
            .map((o) => `${o.field.trim()}`)
        );
        console.log('Visible columns :', this.visibleColumns);
      }
      setTimeout(async () => {
        await this.updateDatas();
        this.show_ExcelImport = false;
      }, 1000);
    },
    exportDatasExcel() {
      import('xlsx').then((xlsx) => {
        let columns;
        let body;
        let exportdatas;
        /*if ( Array.isArray(this.selectedLines) && this.selectedLines.length>0) {
                  exportdatas = this.selectedLines;
                } else {
                  exportdatas = this.rdatas;
                }*/
        exportdatas = this.data;
        if (this.newColumns.length > 0) {
          const expDatas = [];
          exportdatas.forEach((elt, elti, eltarr) => {
            let obj = {};
            this.newColumns.forEach((val, index, arr) => {
              obj[val.name] = elt[val.field];
            });
            console.log('données exportables:', obj);
            expDatas.push(obj);
          });

          columns = this.newColumns; //this.exportDatasColumns;
          body = expDatas;
        } else {
          //columns = this.exportDatasColumns;
          //columns = this.exportDatasColumns;
          let newexp = [];
          this.newColumns.forEach((col) => {
            let obj = {
              title: col.name,
              dataKey: col.field,
            };
            if (col.name != 'Actions') {
              newexp.push(obj);
            }
          });
          console.log('Columns :', newexp);
          columns = newexp;
          const expDatas = [];
          exportdatas.forEach((elt, elti, eltarr) => {
            let obj = {};
            this.newColumns.forEach((val, index, arr) => {
              obj[val.name] = elt[val.field];
            });
            console.log('données exportables:', obj);
            expDatas.push(obj);
          });
          body = expDatas; //this.rdatas;
        }

        body.map((x) => {
          delete x._id;
          return x;
        });

        let Heading = [
          columns
            .filter((o) => o.name != '_id')
            .map((x) => {
              return x.name;
            }),
        ];

        const ws = XLSX.utils.book_new();
        xlsx.utils.sheet_add_aoa(ws, Heading);

        //Starting in the second row to avoid overriding and skipping headers
        const worksheet = xlsx.utils.sheet_add_json(ws, body, {
          origin: 'A2',
          skipHeader: true,
        });

        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };

        const excelBuffer = xlsx.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        });

        // to csv
        //const csvcontent = xlsx.utils.sheet_to_csv(worksheet, { FS: ';' })

        //this.saveAsExcelFile(excelBuffer, "datas");
        const status = exportFile(
          'table-export.xlsx',
          excelBuffer,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        );

        if (status !== true) {
          this.$q.notify({
            message: 'Browser denied file download...',
            color: 'negative',
            icon: 'warning',
          });
        }
      });
    },
    exportDatasPdf() {
      import('jspdf-autotable').then((objdoc) => {
        const doc = new jsPDF();
        let columns;
        let body;
        if (this.newColumns.length > 0) {
          const expDatas = [];
          this.data.forEach((elt, elti, eltarr) => {
            let obj = [];
            this.newColumns.forEach((val, index, arr) => {
              if (val.field != '_id') {
                obj.push(elt[val.field]);
              }
            });
            console.log('données exportables:', obj);
            expDatas.push(obj);
          });
          let tmpcols = Object.assign([], this.newColumns);
          delete tmpcols._id;
          columns = [
            tmpcols
              .filter((o) => o.name != '_id')
              .map((x) => {
                return x.name;
              }),
          ];

          body = expDatas;
        }
        //

        console.log('Columns :', columns);
        console.log('Body :', body);

        doc.autoTable({ head: columns, body: body }); //.autoTable((this.exportVisiblesCols.length==0)?this.exportDatasColumns:this.exportVisiblesCols, this.rdatas);
        doc.save('export-table.pdf');
      });
    },
    exportCsvTable() {
      import('xlsx').then((xlsx) => {
        let columns;
        let body;
        let exportdatas;

        exportdatas = this.data;
        if (this.newColumns.length > 0) {
          const expDatas = [];
          exportdatas.forEach((elt, elti, eltarr) => {
            let obj = {};
            this.newColumns.forEach((val, index, arr) => {
              obj[val.name] = elt[val.field];
            });
            console.log('données exportables:', obj);
            expDatas.push(obj);
          });

          columns = this.newColumns; //this.exportDatasColumns;
          body = expDatas;
        } else {
          //columns = this.exportDatasColumns;
          //columns = this.exportDatasColumns;
          let newexp = [];
          this.newColumns.forEach((col) => {
            let obj = {
              title: col.name,
              dataKey: col.field,
            };
            if (col.name != 'Actions') {
              newexp.push(obj);
            }
          });
          console.log('Columns :', newexp);
          columns = newexp;
          const expDatas = [];
          exportdatas.forEach((elt, elti, eltarr) => {
            let obj = {};
            this.newColumns.forEach((val, index, arr) => {
              obj[val.name] = elt[val.field];
            });
            console.log('données exportables:', obj);
            expDatas.push(obj);
          });
          body = expDatas; //this.rdatas;
        }

        body.map((x) => {
          delete x._id;
          return x;
        });

        let Heading = [
          columns
            .filter((o) => o.name != '_id')
            .map((x) => {
              return x.name;
            }),
        ];
        const ws = XLSX.utils.book_new();
        xlsx.utils.sheet_add_aoa(ws, Heading);

        //Starting in the second row to avoid overriding and skipping headers
        const worksheet = xlsx.utils.sheet_add_json(ws, body, {
          origin: 'A2',
          skipHeader: true,
        });

        // to csv
        const csvcontent = xlsx.utils.sheet_to_csv(worksheet, { FS: ',' });

        //this.saveAsExcelFile(excelBuffer, "datas");
        const status = exportFile('table-export.csv', csvcontent, 'text/csv');

        if (status !== true) {
          this.$q.notify({
            message: 'Browser denied file download...',
            color: 'negative',
            icon: 'warning',
          });
        }
      });
    },
    rowSelect(evt, row, index) {
      this.$emit('row-click', evt, row, index);
    },
    ...mapActions('tables', {
      getDatas: 'getTableQuery',
    }),
    whereDateYearEq(annee) {
      return (item) => item.split('/')[2] === annee;
    },
    whereDateMonthrEq(annee) {
      return (item) => item.split('/')[2] === annee;
    },
    whereDateDayEq(annee) {
      return (item) => item.split('/')[2] === annee;
    },
    whereContain(search) {
      return (item) => String(item).indexOf(search) != -1;
    },
    whereDateBetween(date1, date2) {
      return (item) =>
        date.isBetweenDates(
          new Date(item.split('/')[2], item.split('/')[1], item.split('/')[0]),
          new Date(
            date1.split('/')[2],
            date1.split('/')[1],
            date1.split('/')[0]
          ),
          new Date(
            date2.split('/')[2],
            date2.split('/')[1],
            date2.split('/')[0]
          ),
          { onlyDate: true, inclusiveFrom: true, inclusiveTo: true }
        );
    },
    whereDateDuJour(datej) {
      let cdate = new Date(datej.split('/')[2],datej.split('/')[1],datej.split('/')[0])
      return (item) => date.isSameDate(new Date(item.split('/')[2], item.split('/')[1], item.split('/')[0]), cdate)
    },
    whereTypeAcces(acces) {
      return (item) => String(item).trim() == acces
    },
    filterRangeDate(datesel) {
      console.log('test datesel', datesel);
      if (
        datesel &&
        Object(datesel).hasOwnProperty('from') &&
        Object(datesel).hasOwnProperty('to')
      ) {
        console.log('test datesel 1 :', datesel);
        if (datesel.from && datesel.to) {
          this.filters['datevisite'] = this.whereDateBetween(
            datesel.from,
            datesel.to
          );
          console.log('filtre :', this.filters['datevisite']);
          this.customFilter = this.filterArray(this.data, this.filters);
        }
      }
    },
    filterDateVisite(sdate) {
      if ( sdate ) {
        this.filters['datevisite'] = this.whereDateDuJour(sdate)
        this.customFilter = this.filterArray(this.data, this.filters);
      }

    },
    filterTypeAcces(val) {
    if ( val ) {
        this.currentAcces=val
        this.filters['typeacces'] = this.whereTypeAcces(val)
        this.customFilter = this.filterArray(this.data, this.filters);
      }
    },
    /**
     *   MIse à jour des données pour filtrer
     */
    updateFilters(objScope, headerToFiltre) {
      console.log('Object SCOPE :', objScope);

      if (Object(objScope.value).hasOwnProperty('option')) {
        if (objScope.value.option && objScope.value.option === 'annee') {
          this.filters[`${headerToFiltre}`] =
            objScope.value.value != ''
              ? this.whereDateYearEq(objScope.value.value)
              : '';
        }
        if (objScope.value.option && objScope.value.option === 'mois') {
          this.filters[`${headerToFiltre}`] =
            objScope.value.value != ''
              ? this.whereDateMonthEq(objScope.value.value)
              : '';
        }
        if (objScope.value.option && objScope.value.option === 'jour') {
          this.filters[`${headerToFiltre}`] =
            objScope.value.value != ''
              ? this.whereDateDayEq(objScope.value.value)
              : '';
        }
      }
      console.log('Filters :', this.filters);
      console.log('Filters Params:', this.filtersParams);
      console.log('Colonne filtre update :', headerToFiltre);
      //this.filters['dateentree'] = this.whereDateYearEq('2021')//(item) => item.split('/')[2] === '2020'
      //this.filters['usercacem'] = this.whereContain('Herve')
      this.customFilter = this.filterArray(this.data, this.filters);
      objScope.set();
    },
    /**
     *  delete filter
     */
    deleteFilters(objScope, headerToFiltre) {
      this.filters[`${headerToFiltre}`] = '';
      this.customFilter = this.filterArray(this.data, this.filters);
      this.filtersParams[`${headerToFiltre}`].value = '';
      //this.$refs[`filter_${headerToFiltre}`].cancel()
      objScope.set();
    },
    async addRow() {
      if (this.newColumns.length == 0) {
        return;
      }
      console.log('Edit rows :', this.editRow);
      //this.data.push(this.editRow)
      const addrow = await this.$store.dispatch('tables/create', [
        this.editRow,
        {
          query: {
            tableDb: this.dbtype,
            tableName: this.dbname,
          },
        },
      ]);
      console.log('Added row :', addrow);
      await this.updateDatas();
    },
    async updateRow() {
      console.log('Edit rows :', this.selectedRow);
      delete this.$refs['editForm'].fieldData._id;
      console.log('Form datas :', this.$refs['editForm'].fieldData);
      if (this.selectedRow) {
        const updaterow = await feathersClient
          .service('tables')
          .update(this.selectedRow._id, this.$refs['editForm'].fieldData, {
            query: {
              tableDb: this.dbtype,
              tableName: this.dbname,
            },
          });
        console.log('Données modifiées :', updaterow);
        await this.updateDatas();
      }
    },
    /**
     *  Mise a jour des donnees depuis la base de donnees
     */
    async updateDatas() {
      let tmpFormDatas;
      let formFields;
      let tmpdatas = await feathersClient.service('tables').find({
        query: {
          tableDb: this.dbtype,
          tableName: this.dbname,
          query: JSON.stringify({ query: {} }),
        },
      });
      console.log('Table result :', tmpdatas);
      this.data = Object.assign([], tmpdatas);
      if (this.data.length > 0) {
        let countkeys = tmpdatas.map((o) => `${Object.keys(o).length}`);
        console.log('Count keys :', countkeys);
        let maxlen = Math.max(...countkeys);
        console.log('Nb max props :', maxlen);
        let maxCols = countkeys.findIndex(
          (item) => Number(item) == Number(maxlen)
        );
        var cols = Object.keys(this.data[maxCols]);
        console.log('Columns :', cols);

        /**
         *  recupération des infos du formulaire associé spécifique pour mode
         *  avec formulaire associé
         */
        tmpFormDatas = await feathersClient.service('tables').find({
          query: {
            tableDb: this.dbtype,
            tableName: 'formulaires',
            query: JSON.stringify({
              query: { nom: `${this.dbname.split('dbf_')[1]}` },
            }),
          },
        });
        console.log(
          `INFOS Formulaire associé ${this.dbname.split('dbf_')[1]}:`,
          tmpFormDatas
        );
        if (tmpFormDatas && tmpFormDatas.length == 1) {
          if (Array.isArray(tmpFormDatas[0].data)) {
            formFields = tmpFormDatas[0].data;
            cols = formFields.map((o) => `${o.id}`);
            this.lieuAcces = formFields.filter(o => o.id=='typeacces')[0].field_options.options.map(n=>(`${n.label}`))
          }
        }

        //  transform ['nom','prenom'] en { nom:'',prenom:''}
        this.editRow = cols.reduce(
          (column, key) => ((column[key] = ''), column),
          {}
        );
        this.newColumns = cols.map((col) => ({
          name: col,
          align: 'center',
          label: col,
          field: col,
          sortable: true,
        }));

        if (this.labelsColumns && this.labelsColumns.length > 0) {
          console.log('Label :', this.labelsColumns);
          console.log('Columns :', this.newColumns);
          this.labelsColumns.forEach((val, index) => {
            if (val.id && val.label) {
              let i = this.newColumns.findIndex((o) => o.name == val.id);
              console.log('Index :', i);
              if (i != -1) {
                this.newColumns[i].label = val.label;
              }
            }
          });
        } else {
          if (tmpFormDatas && tmpFormDatas.length == 1 && formFields) {
            //let formFields = tmpFormDatas[0].data;
            this.datesFields = [];
            formFields.forEach((val, index) => {
              if (this.newColumns.findIndex((o) => o.name == val.id) != -1) {
                let i = this.newColumns.findIndex((o) => o.name == val.id);
                this.newColumns[i].label = String(val.label)
                  .trim()
                  .replace(':', '');
                if (val.field_type == 'date') {
                  this.datesFields.push(val.id);
                }
              }
            });

            console.log('Champs types date :', this.datesFields);
            console.log(' Form Columns :', this.newColumns);
          } else {
            const labels = Object.assign(
              [],
              this.newColumns.map((o) => ({ id: o.name, label: o.name }))
            );
            labels.forEach((val, index) => {
              if (val.id && val.label) {
                let i = this.newColumns.findIndex((o) => o.name == val.id);

                this.newColumns[i].label = val.label;
              }
            });
            console.log('Columns :', this.newColumns);
          }
        }
      }
      this.visibleColumns = Object.assign([], this.newColumns);
      console.log('Visible columns :', this.visibleColumns);
      if (this.hideid && (!this.editable || !this.selectable)) {
        let tmp = Object.assign(
          [],
          this.visibleColumns
            .filter((col) => col.field != '_id')
            .map((o) => `${o.field.trim()}`)
        );
        this.visibleColumns = Object.assign([], tmp);
        console.log('Visible columns :', this.visibleColumns);
      } else {
        let tmp = Object.assign(
          [],
          this.visibleColumns.map((o) => `${o.field.trim()}`)
        );
        this.visibleColumns = Object.assign([], tmp);
        console.log('Visible columns :', this.visibleColumns);
      }

      //-----------------------------------------------

      this.filters = this.visibleColumns.reduce(
        (column, key) => ((column[key] = ''), column),
        {}
      );

      this.filtersParams = this.visibleColumns.reduce(
        (column, key) => ((column[key] = {}), column),
        {}
      );

      console.log('Filters :', this.filters);
      console.log('Filters Params:', this.filtersParams);
      //this.filters['dateentree'] = this.whereDateYearEq('2021')//(item) => item.split('/')[2] === '2020'
      //this.filters['usercacem'] = this.whereContain('Herve')
      this.customFilter = this.filterArray(this.data, this.filters);

      //-----------------------------------------------
      console.log('Custom filter :', this.customFilter);
    },
    async deletedRow() {
      if (this.selected.length == 1) {
        const delrow = await this.$store.dispatch('tables/remove', [
          this.selected[0]._id,
          {
            query: {
              tableDb: this.dbtype,
              tableName: this.dbname,
            },
          },
        ]);
        console.log('Deleted row :', delrow);
        await this.updateDatas();
      }
    },
    supPrevBtn() {
      this.$q
        .dialog({
          title: 'Confirmation',
          message: 'Vous allez supprimer définitivement cette ligne ?',
          ok: {
            push: true,
            label: 'Oui',
            color: 'negative',
          },
          cancel: {
            push: true,
            label: 'Non',
          },
          persistent: true,
        })
        .onOk(async () => {
          await this.deletedRow();
        })
        .onCancel(() => {
          return;
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
  },
  async beforeMount() {
    console.log('Store context', this.$store);
    const { Table } = this.$FeathersVuex.api;
    if (this.dbtype && this.dbname) {
      Table.find({
        query: {
          tableDb: this.dbtype,
          tableName: this.dbname,
          query: JSON.stringify({}),
        },
      }).then((res) => {
        console.log('Table :', res);
      });
      console.log('DbName :', this.dbname);
      await this.updateDatas();
    } else {
      this.data = Object.assign([], this.datas);
    }
  },
  async mounted() {
    console.log('Table :', this.data);
    this.$root.$on('changeDate',(newdate)=>{
      console.log('Selection de la date :',newdate)
    })
    if (Array.isArray(this.columns) && this.columns.length > 0) {
      //  transform ['nom','prenom'] en { nom:'',prenom:''}
      this.editRow = this.columns.reduce(
        (column, key) => ((column[key] = ''), column),
        {}
      );
      console.log('Edit rows :', this.editRow);
      this.newColumns = this.columns.map((col) => ({
        name: col,
        align: 'center',
        label: col,
        field: col,
        sortable: true,
      }));
      //this.columns = this.newColumns
    } else {
      if (this.data.length > 0) {
        const cols = Object.keys(this.data[0]);
        console.log('Columns :', cols);
        //  transform ['nom','prenom'] en { nom:'',prenom:''}
        this.editRow = cols.reduce(
          (column, key) => ((column[key] = ''), column),
          {}
        );
        this.newColumns = cols.map((col) => ({
          name: col,
          align: 'center',
          label: col,
          field: col,
          sortable: true,
        }));
      }
      this.visibleColumns = Object.assign([], this.newColumns);
      if (this.hideid) {
        this.visibleColumns = Object.assign(
          [],
          this.visibleColumns
            .filter((col) => col.field != '_id')
            .map((o) => `${o.field.trim()}`)
        );
        console.log('Visible columns :', this.visibleColumns);
      }
    }
  },
  watch: {
    scope: {
      handler(evt) {
        console.log('SCOPE EVENT :', evt);
      },
    },
    selected() {
      console.log('Selection :', this.selected);
      if (this.selected.length > 0) {
        Object.assign(this.selectedRow, this.selected[0]);

        this.$emit('row-click', 'case à cocher', this.selectedRow);
      }
    },
    data() {
      console.log('Table data:', this.data);
    },
    selectedRow() {
      console.log('Changement de données');
    },
  },
  errorCaptured(err, vm, info) {
    // err: error trace
    // vm: component in which error occured
    // info: Vue specific error information such as lifecycle hooks, events etc.
    // TODO: Perform any custom logic or log to server
    // return false to stop the propagation of errors further to parent or global error handler
    console.log('Error :', error);
    console.log('Vm component :', vm);
    console.log('Info :', info);
  },
});
</script>
<style></style>
