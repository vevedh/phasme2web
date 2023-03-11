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
      :data="liveDatas"
      :row-key="(row) => (row._id ? row._id : row[0])"
      :selection="useSelection"
      :columns="newColumns"
      :filter="filter"
      @row-click="rowSelect"
      no-data-label="pas de données pour l'instant..."
      no-results-label="Aucun résultat trouvé"
      :selected.sync="useSelected"
      :visible-columns="visibleColumns"
      :pagination="initialPagination"
    >
      <!--:selected.sync="useSelected"  :selection="useSelection"-->
      <template v-slot:top-left>
        <div class="text-h6">{{ setTitle }}</div>
        <div class="row q-gutter-sm q-pb-md">
          <q-btn
            color="primary"
            dense
            no-caps
            @click="show_ExcelImport = true"
            class="q-px-sm"
            v-if="useAdmin"
            >Excel Init</q-btn
          >
          <q-btn
            color="primary"
            dense
            no-caps
            @click="show_AddDialog = true"
            class="q-px-sm"
            v-if="newColumns.length != 0 && editable"
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
        <div class="row q-gutter-md q-pb-md">
          <q-btn
            dense
            no-caps
            color="primary"
            text-color="white"
            label="Export XLSX"
            @click="exportDatasExcel()"
          />
          <q-btn
            dense
            no-caps
            color="primary"
            text-color="white"
            label="Export CSV"
            @click="exportCsvTable()"
          />
          <q-btn
            dense
            no-caps
            color="primary"
            text-color="white"
            label="Export PDF"
            @click="exportDatasPdf()"
          />
        </div>
      </template>

      <template v-slot:top-right>
        <q-input
          dense
          debounce="300"
          v-model="filter"
          placeholder="Recherche"
          label-color="text-dark"
        >
          <q-icon slot="append" name="search" />
        </q-input>
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
              <q-card>
                <q-card-section>
                  <div class="text-h6">Modification !</div>
                </q-card-section>
                <q-card-section>
                  <div class="row">
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
                  </div>
                </q-card-section>
                <q-card-actions align="right">
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
                  <!-- -->
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
    <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div>
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

const wrapCsvValue = (val, formatFn) => {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? '' : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
};

export default defineComponent({
  name: 'FTable',
  data() {
    return {
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
      default: 'mongodb',
      required: true,
    },
    columns: {
      type: Array,
      require: false,
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
      return this.data;
    },
    useSelection() {
      if (this.editable) {
        return 'single';
      } else {
        return 'none';
      }
    },
    useSelected: {
      get() {
        if (this.editable) {
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
      console.log('Edit rows :', this.editRow);
      if (this.selectedRow) {
        const updaterow = await this.$store.dispatch('tables/update', [
          this.selectedRow._id,
          this.selectedRow,
          {
            query: {
              tableDb: this.dbtype,
              tableName: this.dbname,
            },
          },
        ]);
        console.log('Edited row :', updaterow);
        await this.updateDatas();
      }
    },
    async updateDatas() {
      let tmpdatas = await this.$store.dispatch('tables/find', {
        query: {
          tableDb: this.dbtype,
          tableName: this.dbname,
          query: JSON.stringify({}),
        },
      });
      this.data = Object.assign([], tmpdatas);
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
  async mounted() {
    console.log('Store context', this.$refs.uploader);
    const { Table } = this.$FeathersVuex.api;
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
    console.log('Table :', this.data);
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
    selected() {
      console.log('Selection :', this.selected);
      if (this.selected.length > 0) {
        Object.assign(this.selectedRow, this.selected[0]);
      }
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
