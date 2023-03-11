<template>
  <div class="row q-col-gutter-sm">
   <f-vv-form :title="'accueil'" :hiddenFields="[]"></f-vv-form>
    <q-dialog v-model="showUserInfos">
      <q-card>
        <q-toolbar class="text-primary">
          <div class="q-pt-xs">
            <img src="~assets/cacemx200.png">
          </div>
          <q-toolbar-title> Sélection de l'heure de sortie  </q-toolbar-title>
          <q-btn flat round dense icon="close" @click="showUserInfos = false" />
        </q-toolbar>

        <q-card-section>
          <div class="text-h6 text-center">Heure de Sortie du visiteur {{(Object(selectedUser).hasOwnProperty('prenom') && Object(selectedUser).hasOwnProperty('nom'))?`${selectedUser['prenom']} ${selectedUser['nom']}`:''}}</div>
        </q-card-section>
        <q-card-section class="text-center">
         <q-time
          v-model="selectedUser.heuresortie"
          format24h
          now-btn
           />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Memoriser" color="primary" v-close-popup @click="saveOutTime(selectedUser.heuresortie)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { defineComponent } from '@vue/composition-api';
import FAcceuilTable from './FAcceuilTable.vue';
import FVvForm from './FVvForm.vue';
import { QSpinnerClock } from 'quasar';
import feathersClient from '../boot/feathers-client';

export default defineComponent({
  components: {
    FAcceuilTable,
    FVvForm,
  },
  name: 'FAccueil',
  data() {
    return {
      tvue: 'formulaire',
      splitterModel: 15,
      showUserInfos: false,
      selectedUser: {},
    };
  },
  props: {
    title: {
      type: String,
      required: false,
    },
  },
  computed: {
    ...mapState('adinfos', {
      isAdmin: (state) => state.isAdmin,
      isSiteAdmin: (state) => state.isSiteAdmin,
    }),
  },
  methods: {

    initHFields() {
        console.log("Form init :",this)
    },
    onRowClick(evt, row) {
      console.log('Ligne sélectionnée : ', evt, row);
      if (row) {
        this.selectedUser = row;
        if (evt!='case à cocher') {
          this.showUserInfos = true;
        }
        //
        console.log('Table ref :',this.$refs.myTable)
      }
    },
    async saveOutTime(outtime) {
      this.$q.loading.show({
        spinner: QSpinnerClock,
        spinnerColor: 'primary',
        message:'Enregistrement de l\'heure de sortie..'
      })
      const updaterow = await feathersClient
          .service('tables')
          .update(this.selectedUser._id, this.selectedUser, {
            query: {
              tableDb: 'db_regvisiteurs',
              tableName: 'dbf_'+this.title,
            },
          });
      console.log('Données modifiées :', updaterow);
      await this.$refs.myTable.updateDatas();
      this.$q.loading.hide()
    }
  },
  watch: {
    tvue: {
      handler(val) {
        console.log('Changement de MENU :', val);
      },
    },
  },
});
</script>
<style lang="scss">
.compAccueil {
  .q-tab--active .q-tab__indicator {
    height: 100%;
    width: 5px;
    opacity: 1;
    transform-origin: left /* rtl:ignore */;

  }
  .q-tab--active .q-tab__bindicator {
    border-bottom: $negative solid 5px;
  }
  .q-tab__indicator:after,
  .q-tab__indicator:before {
    left: 100%;
    top: 50%;
    border: solid transparent;
    content: '';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }

  .q-tab__indicator:after {
    border-color: rgba(191, 2, 2, 0);
    border-left-color: $negative;
    border-width: 8px;
    margin-top: -8px;
  }
  .q-tab__indicator:before {
    border-color: rgba(47, 146, 245, 0);
    border-left-color: $primary;
    border-width: 10px;
    margin-top: -10px;
  }

  .mnreg_border {
    border-left: solid 5px $negative;
  }
  .mnreg_select {
    width: 0px;
    background: transparent;
    border-left: 5px solid $negative;
    transform-origin: left;
  }

  .mnreg_select:after,
  .mnreg_select:before {
    left: 0%;
    top: 50%;
    border: solid $negative;
    content: '';
    height: 0;
    width: 0;
    border-width: 10px;
    position: absolute;
    pointer-events: none;
  }

  .mnreg_select:after {
    border-color: rgba(191, 2, 2, 0);
    border-left-color: $negative;
    border-width: 8px;
    margin-top: -8px;
  }
  .mnreg_select:before {
    border-color: rgba(47, 146, 245, 0);
    border-left-color: $primary;
    border-width: 10px;
    margin-top: -10px;
  }
}
</style>
