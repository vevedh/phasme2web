
<template>
  <q-page class="q-pa-sm">
    <div>
      <q-card class="bg-transparent no-shadow no-border">
        <q-card-section class="q-pa-none">
          <div class="row q-col-gutter-sm">
            <div class="col-md-4 col-sm-12 col-xs-12">
              <q-item
                style="background-color: #4fbb91"
                class="q-pa-none q-ml-xs"
              >
                <q-item-section
                  side
                  style="background-color: #419e7a"
                  class="q-pa-lg q-mr-none text-white"
                >
                  <q-icon name="people" color="white" size="44px"></q-icon>
                </q-item-section>
                <q-item-section class="q-pa-md q-ml-none text-white">
                  <q-item-label class="text-white text-h3 text-weight-bolder">{{
                    nbUsers
                  }}</q-item-label>
                  <q-item-label>Total utilisateurs</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-md-4 col-sm-12 col-xs-12">
              <q-item
                style="background-color: #ee9835"
                class="q-pa-none q-ml-xs"
              >
                <q-item-section
                  side
                  style="background-color: #d3862d"
                  class="q-pa-lg q-mr-none text-white"
                >
                  <q-icon name="people" size="44px"></q-icon>
                </q-item-section>
                <q-item-section class="q-pa-md q-ml-none text-white">
                  <q-item-label class="text-white text-h3 text-weight-bolder">{{
                    nbDisableUsers
                  }}</q-item-label>
                  <q-item-label>Utilisateurs Inactifs</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-md-4 col-sm-12 col-xs-12">
              <q-item
                style="background-color: #8f64e3"
                class="q-pa-none q-ml-xs"
              >
                <q-item-section
                  side
                  style="background-color: #6d46bb"
                  class="q-pa-lg q-mr-none text-white"
                >
                  <q-icon name="compare_arrows" size="44px"></q-icon>
                </q-item-section>
                <q-item-section class="q-pa-md q-ml-none text-white">
                  <q-item-label class="text-white text-h3 text-weight-bolder">{{
                    nbExpireUsers
                  }}</q-item-label>
                  <q-item-label>Utilisateurs avec date de fin</q-item-label>
                </q-item-section>
              </q-item>
            </div>
           
          </div>
        </q-card-section>
        <q-card-section class="q-pa-none q-mt-sm">
          <div class="row text-center q-ma-xs bg-white q-pa-sm">
            <!--<q-linear-progress class="q-my-xs q-mb-sm" rounded color="green" stripe size="12px" :value="progress"/>-->
             <div class="col-md-3 col-sm-12 col-xs-12">
              <q-item
                style="background-color: #3d8117"
                class="q-pa-none q-ml-xs q-mr-xs"
              >
                <q-item-section
                  side
                  style="background-color: #376a1a"
                  class="q-pa-lg q-mr-none text-white"
                >
                  <q-icon name="las la-check-circle" size="44px"></q-icon>
                </q-item-section>
                <q-item-section class="q-pa-md q-ml-none text-white">
                  <q-item-label class="text-white text-h3 text-weight-bolder"
                    >{{(symOpenTickets)?sOpenTickets:0}}</q-item-label
                  >
                  <q-item-label>Tickets Ouverts</q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <div class="col-md-3 col-sm-12 col-xs-12">
              <q-item
                style="background-color: #3d8117"
                class="q-pa-none q-ml-xs q-mr-xs"
              >
                <q-item-section
                  side
                  style="background-color: #376a1a"
                  class="q-pa-lg q-mr-none text-white"
                >
                  <q-icon name="las la-check-circle" size="44px"></q-icon>
                </q-item-section>
                <q-item-section class="q-pa-md q-ml-none text-white">
                  <q-item-label class="text-white text-h3 text-weight-bolder"
                    >{{(symClosedTickets)?sClosedTickets:0}}</q-item-label
                  >
                  <q-item-label>Tickets Fermés</q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <!--<div class="col-md-3 col-sm-12 col-xs-12">
              <h5 class="q-pa-none q-ma-none text-grey-9">Development</h5>
              <q-circular-progress
                show-value
                font-size="12px"
                :value="75"
                size="90px"
                :thickness="0.22"
                color="green"
                track-color="grey-3"
                class="q-ma-none"
              >
                75%
              </q-circular-progress>
              <br />
              <span class="text-grey-9" style="font-size: 16px"
                >{{nbIncidents}}</span
              >
            </div>
            <div
              class="col-md-3 col-sm-12 col-xs-12"
              style="background-color: #b4dfc3; border-radius: 7px"
            >
              <h5 class="q-pa-none q-ma-none text-grey-9">Project</h5>
              <h5 class="q-pa-none q-ma-none text-grey-9">Launch Date</h5>
              <q-icon
                size="56px"
                color="green"
                name="fas fa-flag-checkered"
                class="q-pa-none q-ma-none"
              />
              <span class="text-h6 text-grey-9" style="vertical-align: bottom"
                >80 Days</span
              >
              <br />
              <span class="text-grey-9" style="font-size: 16px"
                >Friday, May 29</span
              >
            </div>-->
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="row q-pa-xs q-col-gutter-sm">
      <!--<div
        class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
        style="max-height: 500px"
      >
        <q-card flat bordered class="">
          <q-card-section class="row">
            <div class="text-h6 col-12">Ordinateurs Portables</div>
          </q-card-section>

          <q-separator inset></q-separator>

          <q-card-section style="height: 282px !important">
            <div class="row">
              <div class="col-5">
                --<IEcharts
                  :option="barChartOption"
                  ref="bar"
                  :resizable="true"
                  style="height: 250px; width: 260px"
                />--
              </div>
              <div class="col-7" style="margin-top: 54px">
                <span class="text-h6 text-grey-9">
                  <q-icon
                    filled
                    size="xs"
                    name="fas fa-square"
                    style="vertical-align: baseline; color: #2f3333"
                    class="q-mr-sm"
                  />
                  Total Budget:
                </span>
                <span class="text-h5 text-weight-bolder text-grey-9"
                  >$30,000</span
                >
                <br />
                <br />
                <span class="text-h6 text-grey-9">
                  <q-icon
                    filled
                    size="xs"
                    name="fas fa-square"
                    style="vertical-align: baseline; color: #52af50"
                    class="q-mr-sm"
                  />
                  Budget Amount Used:
                </span>
                <span class="text-h5 text-weight-bolder text-grey-9"
                  >$21,000</span
                >
                <br />
                <br />
                <span class="text-h6 text-grey-9">
                  <q-icon
                    filled
                    size="xs"
                    color=""
                    name="fas fa-square"
                    style="vertical-align: baseline; color: #b3b3b3"
                    class="q-mr-sm"
                  />
                  Budget Remaining:
                </span>
                <span class="text-h5 text-weight-bolder text-grey-9"
                  >$9,000</span
                >
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>-->
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <q-card flat bordered >
          <q-card-section class="row">
            <div class="text-h6 col-12">Utilisateurs</div>
          </q-card-section>

          <q-separator inset></q-separator>

          <q-card-section >
            <f-vv-table
              v-if="(Array.isArray(adUsers)&&(adUsers.length>0))"
              :datas="lstUsers"
              :editable="false"
              :columns_filter="true"
            />

          </q-card-section>
        </q-card>
      </div>
      <!--<div
        class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
        style="max-height: 500px"
      >
        <q-card flat bordered class="">
          <q-card-section class="row">
            <div class="text-h6 col-12">Workload</div>
          </q-card-section>

          <q-separator inset></q-separator>

          <q-card-section style="height: 282px !important">
            <div class="row">
              <IEcharts
                :option="workLoadChartOption"
                ref="bar"
                :resizable="true"
                style="height: 250px"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-card flat bordered>
          <q-card-section class="row">
            <div class="text-h6 col-12">Deadlines</div>
          </q-card-section>

          <q-separator inset></q-separator>

          <q-card-section style="height: 282px !important">
            <q-table
              :data="overdue_data"
              :columns="overdue_columns"
              row-key="name"
              :filter="filter"
              :pagination.sync="pagination"
            >
              <template v-slot:body-cell-overdue="props">
                <q-td :props="props">
                  <div class="my-table-details">
                    <span
                      v-if="props.value > 5"
                      class="text-weight-bolder"
                      style="color: red"
                      >{{ props.value }} Days</span
                    >
                    <span
                      v-else
                      class="text-weight-bolder"
                      style="color: yellow"
                      >{{ props.value }} Days</span
                    >
                  </div>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>-->
    </div>
  </q-page>
</template>

<script>
import Vue from "vue";
import { defineComponent } from '@vue/composition-api';
import { mapState, mapGetters, mapActions } from 'vuex';
import { colors, QSpinnerGears, QSpinnerPie } from 'quasar';
const { lighten, setBrand } = colors;
import { date, openURL } from 'quasar';
import axios from 'axios';
import draggable from 'vuedraggable';
import { Notify } from 'quasar';
import IEcharts from 'vue-echarts-v3/src/full.js';
import FVvTable from '../components/FVvTable.vue';
Vue.component('draggable', draggable);
Vue.component('IEcharts', IEcharts);
export default defineComponent({
  components: { FVvTable },
  name: 'AdUsersPage',
  data() {
    return {
      
    };
  },
  computed: {
    ...mapState('SimplyDesk',{
      symUsers: (state) => state.users,
      symOpenTickets: (state) => state.openTickets,
      symClosedTickets: (state) => state.closedTickets,
    }),
    ...mapState('admin',{
      adUsers: (state) => state.utilisateurs
    }),
    sOpenTickets() {
      if (this.symOpenTickets) {
        return this.symOpenTickets.length
      }
    },
    sClosedTickets() {
      if (this.symClosedTickets) {
        return this.symClosedTickets.length
      }
    },
    lstUsers() {
      if (!this.adUsers)
        return
      return this.adUsers;
    },
    nbUsers() {
      if (!this.lstUsers) 
        return
      return this.lstUsers.length;
    },
    nbDisableUsers() {
      if (!this.lstUsers) 
        return
      return this.lstUsers.filter((u) => u.Enabled == 'false').length;
    },
    nbExpireUsers() {
      if (!this.lstUsers) 
        return
      return this.lstUsers.filter(
        (u) => u.AccountExpirationDate && u.AccountExpirationDate != null
      ).length;
    },
    lstSdTicketsTypes() {
      if (!this.$root.$store.state.SimplyDesk.types)
        return
      return this.$root.$store.state.SimplyDesk.types
    },
    nbIncidents() {
      if (!this.$root.$store.state.SimplyDesk.incidents) 
        return
      return this.$root.$store.state.SimplyDesk.incidents.length
    }
  },
  methods: {
    ...mapActions('admin', [
      'getForm',
      'saveForm',
      'updateForm',
      'getAllForms',
      'updateAllUsers',
      'updateAllPCs',
      'updateAllOUs',
      'getConfig',
      'writeConfig',
    ]),
    ...mapActions('SimplyDesk', [
      'getSimplyUsers',
      'getSimplyServices',
      'getSimplyAgents',
      'getSimplyIncidents',
      'getSimplyTypes',
      'getSimplyTickets',
      'getSimplyCategories',
      'getSimplyOpenTickets',
      'getSimplyClosedTickets'
    ]),
    
  },
  async mounted() {
    /*this.$q.loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'red',
      message: 'Chargement en cours...',
    });*/
      await this.getSimplyIncidents()
      await this.getSimplyOpenTickets()
      await this.getSimplyClosedTickets()
      //this.$q.loading.hide();

  }
  
});
</script>

<style>
</style>