<template>
  <q-layout>
    <!-- Be sure to play with the Layout demo on docs -->

    <q-header>
      <div class="absolute-top-right q-gutter-sm row q-pt-md">
        <span v-if="showDev" class="q-pa-md"><div class="q-text-bold">***DEVELOPPEMENT***</div></span>
        <q-btn
          ref="btnAccHome"
          color="white"
          flat
          round
          icon="home"
          to="/"
          v-if="$router.currentRoute.path!='/'"
        ><q-tooltip
            content-class="bg-amber text-black"
            content-style="font-size: 16px"
            anchor="bottom middle"
          >
            Accueil
          </q-tooltip></q-btn>
           <q-btn
          ref="btnAccHome"
          color="white"
          flat
          round
          icon="person"
          to="/user/profil"
        ><q-tooltip
            content-class="bg-amber text-black"
            content-style="font-size: 16px"
            anchor="bottom middle"
          >
            Accueil utilisateur ...
          </q-tooltip></q-btn>
         <q-btn ref="btnactu"
          color="white"
          flat
          round 
          to="/actus"
          icon="newspaper">
          <q-tooltip  content-class="bg-amber text-black"
            content-style="font-size: 16px"
            anchor="bottom middle">
            Actualités
          </q-tooltip>
         </q-btn>
        
       
        <q-btn
          ref="btnAccCams"
          color="white"
          flat
          round
          icon="assignment"
          to="/formulaires"
        >
          <q-tooltip
            content-class="bg-amber text-black"
            content-style="font-size: 16px"
            anchor="bottom middle"
          >
            Créer un formulaire ...
          </q-tooltip> </q-btn
        ><!--type="a" href="https://svrdevweb.agglo.local:3050/visiocacem" target="_blank"-->
        <q-btn
          ref="btnDbs"
          size="0.7em"
          color="white"
          flat
          round
          icon="fas fa-database"
          v-if="isAdmin"
          to="/admin/main"
        ><q-tooltip
            content-class="bg-amber text-black"
            content-style="font-size: 16px"
            anchor="bottom middle"
          >
            Bases/Tables ...
          </q-tooltip></q-btn>
        <q-btn
          ref="btnUsers"
          size="0.7em"
          color="white"
          flat
          round
          icon="fas fa-users"
          v-if="isAdmin"
          to="/padusers"
        ><q-tooltip
            content-class="bg-amber text-black"
            content-style="font-size: 16px"
            anchor="bottom middle"
          >
            Admin DSI ...
          </q-tooltip></q-btn>
        <q-btn
          ref="btnPrint"
          color="white"
          flat
          round
          icon="print"
          v-if="isAdmin"
          to="/admin/imprimantes"
        ><q-tooltip
            content-class="bg-amber text-black"
            content-style="font-size: 16px"
            anchor="bottom middle"
          >
            Les Imprimantes ...
          </q-tooltip></q-btn>
        <q-btn
          ref="btnSmart"
          color="white"
          flat
          round
          icon="smartphone"
          v-if="isAdmin"
          to="/smartphones"
        ><q-tooltip
            content-class="bg-amber text-black"
            content-style="font-size: 16px"
            anchor="bottom middle"
          >
            Les Smartphones ...
          </q-tooltip></q-btn>
        <q-btn
          ref="btnApps"
          color="white"
          flat
          round
          icon="apps"
          to="/applications"
          ><!--@click="flip(true)"-->
          <q-tooltip content-class="bg-white text-black text-caption shadow-8">
            Les applications CACEM
          </q-tooltip>
        </q-btn>
        <q-btn dense color="white" flat round icon="notifications" v-if="isAdmin" type="a" href="http://svrsimplydesk:7000/IncidentManagement/Ticket" target="_blank">
          <q-badge
            color="yellow"
            text-color="black"
            :label="(symOpenTickets)?sOpenTickets:0"
            dense
            floating
            transparent
          />
        </q-btn>
        <q-btn
          color="white"
          flat
          round
          @click="$q.dark.toggle()"
          :icon="$q.dark.isActive ? 'nights_stay' : 'wb_sunny'"
        />
      </div>
    </q-header>
    <div
      id="particles-js"
      :class="$q.dark.isActive ? 'dark_gradient' : 'normal_gradient'"
    ></div>
    <q-page-container class="flex flex-top q-pt-xl">
      <!-- This is where pages get injected -->

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api';

import { mapState, mapActions } from 'vuex';
export default defineComponent({
  name: 'Empty',
  data() {
    return {

    }
  },
  computed: {
    ...mapState('adinfos', {
      isAdmin: (state) => state.isAdmin,
      isSiteAdmin: (state) => state.isSiteAdmin,
      grpUser: (state) => state.userGrpes,
      users: (state) => state.users,
    }),
    ...mapState('SimplyDesk', {
      symUsers: (state) => state.users,
      symOpenTickets: (state) => state.openTickets,
      symClosedTickets: (state) => state.closedTickets,
    }),
    allowRegistre(){
      if (this.grpUser) {
        return this.grpUser.includes('Application WEB REGISTRE');
      } else {
        return false //WebApps - ADM PARKING
      }
    },
    allowParking(){
      if (this.grpUser) {
        return this.grpUser.includes('WebApps - ADM PARKING');
      } else {
        return false //WebApps - ADM PARKING
      }
    },
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
    showDev() {
      return process.env.NODE_ENV!='production'
    }
  },
  methods: {
    ...mapActions('adinofs', ['getRole']),
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
    particlesJS('particles-js', {
      particles: {
        number: { value: 160, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: {
          type: 'circle',
          stroke: { width: 0, color: '#000000' },
          polygon: { nb_sides: 5 },
          image: { src: 'img/github.svg', width: 100, height: 100 },
        },
        opacity: {
          value: 1,
          random: true,
          anim: { enable: true, speed: 1, opacity_min: 0, sync: false },
        },
        size: {
          value: 3,
          random: true,
          anim: { enable: false, speed: 4, size_min: 0.3, sync: false },
        },
        line_linked: {
          enable: false,
          distance: 150,
          color: '#ffffff',
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: { enable: false, rotateX: 600, rotateY: 600 },
        },
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'bubble' },
          onclick: { enable: true, mode: 'repulse' },
          resize: true,
        },
        modes: {
          grab: { distance: 400, line_linked: { opacity: 1 } },
          bubble: { distance: 250, size: 0, duration: 2, opacity: 0, speed: 5 },
          repulse: { distance: 400, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 },
        },
      },
      retina_detect: true,
    });
    await this.getRole()
    await this.getSimplyOpenTickets()
    await this.getSimplyClosedTickets()
    console.log('Path :',this.$router.currentRoute.path);
  },
});
</script>
<style>
#particles-js {
  position: absolute;

  width: 100%;
  height: 100%;

  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;

  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
}

/* ---- particles.js container ---- */

.normal_gradient {
  background: linear-gradient(145deg, rgb(2, 107, 148) 15%, #9c0c02 70%);
}

.dark_gradient {
  background: linear-gradient(145deg, rgb(11, 26, 61) 15%, #4c1014 70%);
}
</style>
