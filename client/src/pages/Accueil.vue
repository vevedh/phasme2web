<template>
  <q-page class="container q-pa-md row items-center justify-center">
    <!-- content -->

    <transition
      appear
      enter-active-class="animated  fadeIn"
      leave-active-class="animated  fadeOut"
    >
      <!--   CARD  PAGE D'ACCUEIL -------------------->
      <q-card
        v-if="!showBtnAccueil"
        transition-show="jump-up"
        transition-hide="jump-down"
        ref="refCard"
        class="my-card-profil profil"
        v-bind:style="
          $q.platform.is.mobile
            ? { width: '90%', height: '90%' }
            : { width: '75%', height: '70%' }
        "
      >
        <q-card-section class="row q-pa-xs items-center">
          <div class="q-pa-none">
            <q-avatar
              rounded
              size="200px"
              style="position: absolute; top: -130px; left: 0px"
            >
              <div class="q-pa-none"><img src="~assets/cacemx200.png" /></div>
            </q-avatar>
          </div>
          <div class="col-auto">
            <q-btn
              v-if="isAdmin"
              color="white"
              flat
              :text-color="$q.dark.isActive ? 'white' : 'black'"
              dense
              no-caps
              label="Votre PDF en livre à feuilleter (test)"
              to="/flipbook"
              icon="menu_book"
            >
              <q-tooltip
                content-class="bg-amber text-black"
                content-style="font-size: 16px"
                anchor="bottom middle"
              >
                Convertir un document pdf en livre à feuilleter
              </q-tooltip>
            </q-btn>
          </div>
          <!--<div class="col-auto"></div>-->
          <q-space />
          <div class="col"></div>
          <!--<div class="col-auto justify-center">
            <div class="row">
               <q-btn
              ref="btnForms"
              color="white"
              :text-color="($q.dark.isActive)?'white':'black'"
              flat
              icon="list_alt"
              to="/formulaires"
              label="Formulaires"
            />
            <q-btn
              ref="btnApps"
              color="white"
              :text-color="($q.dark.isActive)?'white':'black'"
              flat
              icon="apps"
              to="applications"
              label="Applications"
            />
            </div>

          </div>light-blue-8-->
        </q-card-section>
        <q-card-section> </q-card-section>
        <q-card-section class="bg-light-blue-9 inset-shadow">
          <div class="row no-wrap items-center">
            <div class="col text-center">
              <div class="row full-width">
                <div class="col q-pt-xl">
                  <div class="col q-pt-xl">
                    <!--<div class="row items-center justify-center text-white">
                      Besoin d'une documentation<br />Cliquez-ici
                      :text-color="$q.dark.isActive ? 'white' : 'black'"
                    </div>-->
                    <div class="row items-center justify-center">
                      <q-btn
                        class="shadow-10 bg-green-7"
                        flat
                        :color="$q.dark.isActive ? 'white' : 'white'"
                        
                        dense
                        no-caps
                        stack
                        type="a"
                        href="http://svrsimplydesk:7000/KnowledgeManagement/KdbItem?AddReasonAsKdbSolution=False&ADDAttachementsFromTicket=False"
                        target="_blank"
                      >
                        <q-avatar size="80px" icon="quiz">
                          <!--<img src="~assets/faq.png" />-->
                        </q-avatar>
                        <div>
                          Guides ...
                        </div>
                        <q-tooltip
                          content-class="bg-amber text-black"
                          content-style="font-size: 16px"
                          anchor="bottom middle"
                        >
                          Une question ? suivez les guides ...
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div
                    class="row items-center justify-center text-white text-h6"
                  >
                    Direction du Système d'Information
                  </div>
                  <div class="row items-center justify-center q-pa-md bg-white rounded-borders ">
                    <q-img
                      src="~assets/logodsi.png"
                      style="width: 10vh"
                    ></q-img>
                  </div>
                </div>

                <div class="col q-pt-xl">
                  <div class="col q-pt-xl">
                    <!--<div class="row items-center justify-center text-white">
                      Votre Outils collaboratif<br />Cliquez-ici
                    </div>-->
                    <div class="row items-center justify-center">
                      <q-btn
                        class="shadow-10 bg-green-7"
                        flat
                        :color="$q.dark.isActive ? 'white' : 'white'"
                        
                        dense
                        no-caps
                        stack
                        type="a"
                        href="https://partage.cacem.fr"
                        target="_blank"
                      >
                        <q-avatar size="80px" icon="cloud_circle">
                          <!--<img src="~assets/faq.png" />-->
                        </q-avatar>
                        <div>NextCloud</div>
                        <q-tooltip
                          content-class="bg-amber text-black text-caption shadow-8"
                          content-style="font-size: 12px"
                          anchor="bottom left"
                          self="bottom right"
                          transition-show="flip-right"
                          transition-hide="flip-left"
                        >
                          <div class="text-left text-caption">
                            <div>
                              Nextcloud est un service cloud proposé par la
                              CACEM.
                            </div>
                            <p>
                              Il met à disposition un espace de stockage en
                              ligne sécurisé pour diffuser et partager des
                              documents et des ressources téléchargeables à
                              partir d'un poste de travail ou d'un appareil
                              mobile. Accessible après authentification par son
                              adresse professionnelle, ce service facilite le
                              travail collaboratif entre les personnels de la
                              CACEM. Il répond aux conditions préconisées dans
                              le cadre du règlement général de la protection des
                              données (RGPD).
                            </p>

                            <div>Ce service permet :</div>
                            <ul>
                              <li>
                                de stocker et de synchroniser les documents afin
                                de les maintenir à jour en temps réel ;
                              </li>
                              <li>
                                d'enregistrer et d'accéder aux données à tout
                                moment et en tout lieu ;
                              </li>
                              <li>
                                de travailler en toute sécurité en garantissant
                                la confidentialité des données. ;
                              </li>
                            </ul>

                            <div>
                              Chaque utilisateur disposera d'un espace de
                              stockage d'une taille de 10 Go sauf réglage
                              spécifique décidé par la DSI.
                            </div>
                          </div>
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row no-wrap items-center">
            <div class="col text-h6 text-center">
              <q-btn
                color="negative"
                text-color="white"
                glossy
                class="q-px-xs q-py-sm shadow-8"
                type="a"
                :href="'http://svrsimplydesk.agglo.local:9000'"
                target="_blank"
              >
                <q-tooltip
                  content-class="bg-white text-black text-caption shadow-8"
                  content-style="font-size: 8px"
                  anchor="bottom left"
                  self="bottom right"
                  transition-show="flip-right"
                  transition-hide="flip-left"
                >
                  <div class="text-left text-caption">
                    <div class="text-left text-caption">
                      <span class="text-bold">Eviter les généralités</span> du
                      type :
                    </div>
                    <ul>
                      <li>Mon ordinateur ne marche pas</li>
                      <li>L’application x ne veut pas se lancer</li>
                      <li>Je n'accède pas au serveur</li>
                      <li>etc...</li>
                    </ul>
                    <div class="text-left text-caption">
                      Être <span class="text-bold">factuel</span> en décrivant
                      précisément
                      <span class="text-bold">les symptômes observés</span>
                    </div>
                    <ul>
                      <li>
                        Quand j’effectue
                        <span class="text-bold">telle manipulation,</span>
                        j’observe
                        <span class="text-bold">tel comportement</span>
                      </li>
                    </ul>

                    <div>
                      <span class="text-bold">Eviter</span> les
                      <span class="text-bold">majuscules</span> et les
                      <span class="text-bold">points d’exclamation.</span>
                    </div>
                    <ul>
                      <li>
                        Utiliser les
                        <span class="text-bold"
                          >majuscules signifient crier</span
                        >
                        en communication informatique.<br />
                        C’est très désagréable pour la personne qui le lit.
                      </li>
                    </ul>

                    <div>Rester <span class="text-bold">courtois</span></div>
                    <div class="text-left text-caption">
                      <ul class="text-left">
                        <li>
                          Les marques
                          <span class="text-bold">d’agacement</span> et les
                          <span class="text-bold">paroles désobligeantes</span>
                          ne sont
                          <span class="text-bold">pas de nature à motiver</span>
                          une résolution plus rapide.<br />
                          Nous sommes
                          <span class="text-bold">parfaitement conscients</span>
                          de l’importance des problèmes informatiques et
                          <span class="text-bold"
                            >nous faisons déjà de notre mieux.</span
                          >
                        </li>
                      </ul>
                    </div>

                    <div class="text-left text-caption">
                      <span class="text-bold"
                        >Quand vous faites faire ouvrir l’incident par votre
                        assistante,</span
                      >
                      prenez le temps de lui
                      <span class="text-bold"
                        >décrire précisément le problème</span
                      >
                      <ul>
                        <li>
                          Les demandes du type « il faut venir voir Mr X parce
                          qu’il a un problème avec son ordinateur »<br />
                          ne sont pas de nature à aider une résolution rapide
                        </li>
                      </ul>
                    </div>
                  </div>
                </q-tooltip>
                <q-icon left size="2em" name="support_agent" class="q-px-sm" />
                Ouvrir un Ticket...
              </q-btn>

              <div class="text-white text-caption text-italic q-pt-sm">
                (Cliquez sur ce bouton pour signaler un incident et déclencher
                une demande d’assistance)
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pb-none">
          <div class="row no-wrap items-center q-pa-xs">
            <div class="col text-h3 text-center q-pb-none">
              Prise de contrôle à distance
            </div>
          </div>
          <div class="text-center text-caption text-italic">
            Cliquer sur le bouton correspondant à l’agent qui doit prendre la
            main sur votre poste. Cela lancera le téléchargement de l’outil de
            contrôle à distance. A la fin du téléchargement, il faudra lancer
            l’exécution du fichier téléchargé pour permettre à l’agent de
            prendre la main. Il faudra accepter toutes les demandes de
            validation que vous proposera l’outil afin d’autoriser l’agent à
            prendre la main.
          </div>
        </q-card-section>
        <q-card-section>
          <div
            class="
              text-white
              full-width
              text-center
              q-py-none q-my-none q-gutter-md
            "
            dense
          >
            <q-btn
              elevated
              dense
              v-for="(teamuser, idx) of teamviewerUsers"
              :key="`btn_team_${idx}`"
              target="_blank"
              type="a"
              :href="
                'https://get.teamviewer.com/' + teamuser.custom_quicksupport_id
              "
              color="primary"
              :label="teamuser.name"
              icon="img:teamviewer.svg"
            >
              <q-tooltip
                content-class="bg-amber text-black"
                content-style="font-size: 16px"
                anchor="bottom middle"
              >
                télécharge l'outils de contrôle distant (
                <q-icon name="far fa-eye"></q-icon>)
              </q-tooltip>
            </q-btn>
          </div>
          <div class="text-center full-width">
            <!--<q-btn color="white" text-color="black" label="Standard" to="/flipbook" />-->
          </div>
        </q-card-section>
      </q-card>
    </transition>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        :icon="!chatOpen ? 'chat' : 'expand_more'"
        color="blue-9"
        @click="chatOpen = !chatOpen"
      >
        <q-popup-proxy
          transition-show="flip-up"
          transition-hide="flip-down"
          content-style="width:350px"
        >
          <q-card class="my-card q-pa-none">
            <q-card-section class="bg-blue-12 q-pa-xs text-white text-bold">
              <div class="row">
                <span
                  ><q-icon name="chat" />
                  Une question ?
                </span>
              </div>
            </q-card-section>
            <q-card-section class="q-pa-xs">
              Chat hors-ligne
              <q-form class="q-gutter-xs">
                <q-input
                  filled
                  dense
                  v-model="enom"
                  label="Nom *"
                  hint="Votre nom"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Obligatoire']"
                />
                <q-input
                  filled
                  dense
                  v-model="eemail"
                  label="Email *"
                  hint="Votre email"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Obligatoire']"
                />
                <q-input
                  filled
                  dense
                  v-model="etel"
                  label="Téléphone *"
                  hint="Votre téléphone"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Obligatoire']"
                />
                <q-input
                  filled
                  dense
                  v-model="emsg"
                  label="Message"
                  type="textarea"
                />

                <div class="q-pa-none text-center">
                  <q-btn
                    label="Envoyer un message"
                    color="primary"
                    dense
                    class="q-pa-none"
                    @click="chatRequest"
                    v-close-popup
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-popup-proxy>
      </q-btn>
    </q-page-sticky>
    <q-page-sticky position="top-right" :offset="[30,50]">
      <q-btn
        fab
        class="shadow-5"
        :icon="'question_mark'"
        color="blue-4"
        @click="showHelp=true"
      ></q-btn>
    </q-page-sticky>
    <q-dialog v-model="showHelp" transition-show="flip-up"
          transition-hide="flip-down" class="flex flex-center justify-center items-center" >
    <q-card style="width: 100%;max-width:75vh" class="q-pa-md">
    <q-card-section>
    <div class="text-h6">Accès aux informations</div>
    </q-card-section>
    <q-card-section >
    <q-img src="~assets/cacem_splash.png" spinner-color="primary" style="width: 70vh"/>
    
    </q-card-section>
    <q-card-actions align="right">
    <q-btn flat label="OK" color="primary" v-close-popup />
    </q-card-actions>
    </q-card>
    </q-dialog>
    
  </q-page>
</template>

<script >
import { mapState, mapActions } from 'vuex';
import { defineComponent } from '@vue/composition-api';

import { date, QSpinnerGears, QBtn, QTooltip } from 'quasar';
//import AddAppLink from '../components/AddAppLink.vue'
import { morph } from 'quasar';
export default defineComponent({
  name: 'PageAcceuil',
  components: {
    // AddAppLink
  },
  data() {
    return {
      showBtnAccueil: false,
      chatOpen: false,
      showHelp:false,
      enom: '',
      eemail: '',
      etel: '',
      emsg: '',
      //morphGroupModel: 'accueil',
      teamviewerUsers: [
        {
          name: '',
          id: '',
          custom_quicksupport_id: '',
        },
      ],
    };
  },
  computed: {
    ...mapState('adinfos', {
      isAdmin: (state) => state.isAdmin,
      isSiteAdmin: (state) => state.isSiteAdmin,
      grpUser: (state) => state.userGrpes,  
      users: (state) => state.users,
    }),

    /*...mapState('admin',{
      appLinks: state => state.applinks,
    })*/
  },
  methods: {
    ...mapActions('adinfos', ['getRole']),
    ...mapActions('admin', [
      'getAllAppLinks',
      'addAppLink',
      'updateAppLink',
      'sendMail',
    ]),
    async chatRequest() {
      await this.sendMail({
        to: 'admindsi@cacem.fr',
        subject: `Message de l' Agent : ${this.ename} depuis le portail DSI - email: ${this.eemail}`,
        message: `<b>Message depuis le portail DSI</b><br><br><b>Objet :</b><br>${this.emsg}<br><br><b>Tél :</b>${this.etel}`,
      });
    },
  },
  created() {
    //&& this.$q.platform.is.mobile
      if (this.grpUser && this.grpUser.includes('Application WEB PARKING') && this.$q.platform.is.mobile) {
        this.$router.push('/gardien')
      }
  },
  async mounted() {
    this.$q.loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'red',
      message: 'Chargement en cours...',
    });
    // liste des Utilisateurs
    //await this.getAllUsers();

    //particlesJS("particles-js", { "particles": { "number": { "value": 160, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#ffffff" }, "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 }, "image": { "src": "img/github.svg", "width": 100, "height": 100 } }, "opacity": { "value": 1, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0, "sync": false } }, "size": { "value": 3, "random": true, "anim": { "enable": false, "speed": 4, "size_min": 0.3, "sync": false } }, "line_linked": { "enable": false, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 600 } } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "bubble" }, "onclick": { "enable": true, "mode": "repulse" }, "resize": true }, "modes": { "grab": { "distance": 400, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 250, "size": 0, "duration": 2, "opacity": 0, "speed": 5 }, "repulse": { "distance": 400, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } } }, "retina_detect": true });

    await this.$store.dispatch('teamviewer/getUsers');

    this.$q.loading.hide();
    this.teamviewerUsers = this.$store.state.teamviewer.users.filter(
      (elt) => elt?.custom_quicksupport_id
    );
    console.log('TeamViewer user:', this.$store.state.teamviewer.users);
  },
});
</script>

<style>
.profil {
  margin-top: 60px;
}
.apps-form {
  position: absolute;
}
</style>
