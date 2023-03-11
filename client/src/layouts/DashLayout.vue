<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      elevated
      style="background: linear-gradient(145deg, #023064 15%, #711104 70%)"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          class="q-mx-md"
        />

        <q-toolbar-title
          v-if="$q.screen.gt.sm"
          shrink
          class="row items-center no-wrap"
          >Tableau de bord utilisateur de la CACEM</q-toolbar-title
        >

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <!--<a style="font-size: 30px;" class="float-right" href="https://github.com/sponsors/mayank091193"
             target="_blank" title="Donate"><i class="fas fa-heart" style="color: #eb5daa"></i></a>-->
          <q-btn round dense flat icon="home" to="/">
            <q-tooltip>Accueil</q-tooltip>
          </q-btn>
          <q-btn round dense flat icon="notifications">
            <q-badge color="red" text-color="white" floating>{{(symOpenTickets)?sOpenTickets:0}}</q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round flat class="q-pa-none" to="/user/profil">
            <q-avatar
            :icon="currentAvatar"
            size="45px"
            
          ></q-avatar>
            <q-tooltip>Profil</q-tooltip>
          </q-btn>
          <q-btn round dense flat icon="fas fa-sign-out-alt" to="/">
            <q-tooltip>Déconnexion</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay
      bordered
      content-class="bg-grey-3"
    >
      <q-list>
        <q-item
          active-class="tab-active"
          to="/"
          exact
          class="q-ma-none navigation-item"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>

          <q-item-section> Accueil </q-item-section>
        </q-item>
        <q-item
          active-class="tab-active"
          to="/dashboard-grid"
          exact
          class="q-ma-none navigation-item"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>

          <q-item-section> Dashboard - Grid </q-item-section>
        </q-item>
        <q-item
          active-class="tab-active"
          to="/dashboard-list"
          exact
          class="q-ma-none navigation-item"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon name="view_headline" />
          </q-item-section>

          <q-item-section> Dashboard - List </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container style="background-color: #f4f4f4" class="flex flex-top justify-center items-start full-width">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from '@vue/composition-api';
import { mapState,mapGetters,mapActions } from 'vuex';
import { date, QSpinnerGears , QBtn, QTooltip} from 'quasar';
export default defineComponent({
  name: 'DashLayout',
  data() {
    return {
      leftDrawerOpen: false,
      miniState: true,
    };
  },
  computed: {
    ...mapState('SimplyDesk', {
      symUsers: (state) => state.users,
      symOpenTickets: (state) => state.openTickets,
      symClosedTickets: (state) => state.closedTickets,
    }),
    sOpenTickets() {
      if (this.symOpenTickets) {
        return this.symOpenTickets.length;
      }
    },
    sClosedTickets() {
      if (this.symClosedTickets) {
        return this.symClosedTickets.length;
      }
    },
    currentAvatar () {
      return this.$store.state.auth.user.img64 ? 'img:data:image/jpeg;base64,' + this.$store.state.auth.user.img64 : 'account_box';//'https://cdn.quasar.dev/img/boy-avatar.png';
    }
  },
  methods: {
    ...mapActions('admin', [
      'getForm',
      'saveForm',
      'updateForm',
      'getAllForms',
      'getConfig',
      'writeConfig',
    ]),
    ...mapActions('adinfos', ['getAllDatabases', 'getTables', 'getTableDatas']),
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
    this.$q.loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'red',
      message: 'Chargement en cours...',
    });
    const forms = await this.getAllForms();
    await this.getSimplyOpenTickets()
    await this.getSimplyClosedTickets()
    this.$q.loading.hide();
  }
});
</script>

<style>
.tab-active {
  background-color: rgb(128, 4, 0);
  color: white;
}
</style>
