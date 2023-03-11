<template>
  <q-layout view="hHh LpR fFf">
    <q-header
      elevated
      style="background: linear-gradient(145deg, #15503e 15%, #133154 70%)"
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
          >Administration du SI de la CACEM</q-toolbar-title
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
          <q-btn round flat>
            <q-avatar
            :icon="currentAvatar"
            size="45px"
            class="inline-block q-pa-none"
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
      
      content-class="bg-grey-3"
    >
      <div
        id="profile"
        class="row  bg-blue no-pointer-events"
      >
        <div class="col-3 q-pa-none">
          <q-avatar
            :icon="currentAvatar"
            size="65px"
            style="position: relative !important;left:-5px"
            class="inline-block q-pa-none"
          ></q-avatar>
        </div>
        <div
          class="col-9 q-gutter-sm q-pt-xs q-pb-md"
          v-if="!miniState"
        >
          <!--img src="../img/avatar-1.svg" id="avatar" class="inline-block"-->
          <div class="row q-gutter-xs">
            <span class="text-white"> {{ displayName }} </span>
            <br>
            <span class="text-white"> {{ email }} </span>

          </div>

          <!--<div class="row q-gutter-sm q-pt-sm q-pl-none ">
            <div class="text-white">{{siteRole}}</div>
            <q-space />
            <q-btn
              v-if="isAdmin"
              class="bordered bg-blue small all-pointer-events"
              dense
              icon="person"
              color="white"
            ></q-btn>
            <q-btn
              v-if="isAdmin"
              class="bordered bg-blue small all-pointer-events"
              dense
              icon="lock"
              color="white"
            ></q-btn>
            <q-btn
              class="bordered bg-blue small all-pointer-events"
              dense
              icon="home"
              color="white"
              to="/"
            ></q-btn>
            <--<q-btn
              class="bordered bg-blue small"
              dense
              icon="exit_to_app"
              color="white"
              @click="exitApp()"
            ></q-btn>--
          </div>-->
        </div>
      </div>
      <!--  -->
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

    <q-page-container style="background-color: #f4f4f4">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from '@vue/composition-api';
import { date, QSpinnerGears , QBtn, QTooltip} from 'quasar';
import { mapState,mapGetters,mapActions } from 'vuex';
export default defineComponent({
  name: 'AdminLayout',
  data() {
    return {
      leftDrawerOpen: false,
      left: false,
      miniState: false,
    };
  },
  computed: {
    ...mapState('adinfos', {
      isAdmin: (state) => state.isAdmin,
      isSiteAdmin: (state) => state.isSiteAdmin,
      siteRole: (state) => state.siteRole
    }),
    ...mapState('admin', {
      formData: (state) => state.getform,
      fconfig: (state) => state.config,
      visiteurs: (state) => state.visiteurs
    }),
    ...mapState('auth', {
      currentUsername: (state) => state.user.displayName,
    }),
    displayName () {
      return this.currentUsername;
    },
    email () {
      return this.$store.state.auth.user.mail ? this.$store.state.auth.user.mail : null
    },
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
      'getAllUsers',
      'getAllPCs',
      'getAllOUs',
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
    this.$q.loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'red',
      message: 'Chargement en cours...',
    });
    await this.getAllUsers();
    await this.getAllPCs();
    await this.getAllOUs();
    this.$q.loading.hide();
    await this.getSimplyUsers();
    await this.getSimplyTypes();
    await this.getSimplyIncidents();
    await this.getSimplyAgents();
    await this.getSimplyCategories();
    await this.getSimplyServices();
    
  }
});
</script>

<style>


.tab-active {
  background-color: green;
  color: white;
}
</style>
