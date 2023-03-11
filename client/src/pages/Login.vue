<template>
  <q-page  class="fit row justify-center ">
    <!-- content -->

    <div class="column justify-center self-center q-pb-xl q-px-md" style="width: 400px">
      <div class="row justify-center self-center rounded-borders q-pb-md" style="width: 200px">
        <q-img :src="url" spinner-color="white" class="rounded-borders" />
      </div>
     <q-card class="my-card" bordered>

        <q-card-section style="width: 100%" class="text-center bg-primary text-white text-h5 q-py-xs" >
          Identification
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pb-none">
          <q-form class="q-px-xl ">
            <q-input filled bottom-slots v-model="email" label="*Utilisateur :"  :dense="dense"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Utilisateur du domaine obligatoire!']">
            </q-input>
            <q-input  filled bottom-slots type="password" v-model="password" label="Mot de passe :"  :dense="dense">
            </q-input>
          </q-form>
        </q-card-section>
        <q-card-actions class="row items-center justify-center q-mt-md q-pt-none"  >
          <div  :hidden="!loading" ><div class="col items-center justify-center"><div><q-spinner
        color="primary"
        size="3em"
        :thickness="10"

      /></div><div class="text-h6">Vérifications en cours...</div></div></div>
        </q-card-actions>
        <q-card-actions class="row items-center justify-center q-mt-md q-pt-none">
          <div class="q-gutter-xl">
            <q-btn color="primary" icon="lock" text-color="white" label="Connexion" @click="onSubmit(email,password)" :disable="(email=='')||(password=='')"/>
           <!--<q-btn color="primary" text-color="white" label="S'inscrire" @click="onRegister(email,password)" :disable="(email=='')&&(password=='')"/>-->
          </div>
        </q-card-actions>
        <!--<q-card-section class="col text-center"  separator>
          Entrez votre email et mot de passe pour vous inscrire ou vous connecter
        </q-card-section>-->
     </q-card>

    </div>
  </q-page>
</template>

<script>
import { LoadingBar, LocalStorage, Notify, Dialog, Quasar } from "quasar";
import { mapGetters,mapState } from 'vuex'

export default {
  name: 'LoginPage',
  data () {
    return {
      email: '',
      password: '',
      url: 'cacem.png',
      error: '',
      dense: true,
      showParticules: true,
      loading: false
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
    async checkIsAuthenticated() {
      console.log("Init")
      let auth = await this.$store.dispatch('auth/authenticate').catch((err)=>{ console.log('Non authentifié!')})
      console.log("Auth :",auth)

      if (auth.user) {
       // this.user = auth.user;

        try {
          //&& this.$q.platform.mobile
           if (this.grpUser.includes('Application WEB PARKING') && this.$q.platform.is.mobile) {
            this.$router.replace('/gardien')
          } else {
            this.$router.replace('/')
          }
        } catch (error) {

        }

      }
    }
  },
  mounted() {

      if (this.showParticules) {
            particlesJS('particles-js', {
                particles: {
                    number: {
                        value: 80,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: '#ffffff'
                    },
                    shape: {
                        type: 'circle',
                        stroke: {
                            width: 0,
                            color: '#000000'
                        },
                        polygon: {
                            nb_sides: 5
                        },
                        image: {
                            src: 'img/github.svg',
                            width: 100,
                            height: 100
                        }
                    },
                    opacity: {
                        value: 0.5,
                        random: false,
                        anim: {
                            enable: false,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: {
                            enable: false,
                            speed: 20,
                            size_min: 0.1,
                            sync: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#ffffff',
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 6,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false,
                        attract: {
                            enable: false,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: {
                            enable: false,
                            mode: 'grab'
                        },
                        onclick: {
                            enable: false,
                            mode: 'push'
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            line_linked: {
                                opacity: 1
                            }
                        },
                        bubble: {
                            distance: 400,
                            size: 40,
                            duration: 2,
                            opacity: 8,
                            speed: 3
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4
                        },
                        push: {
                            particles_nb: 4
                        },
                        remove: {
                            particles_nb: 2
                        }
                    }
                },
                retina_detect: false
            });
        }
  },
  methods: {
    onSubmit(email, password)  {
      console.log('Click')
      this.loading = true;
      this.$store
        .dispatch('auth/authenticate', { strategy: 'ldap', username:email, password:password })
        .then((res)=>{
          console.log("Result :",res)
          console.log('Result auth:', this.$store.state.auth);
          console.log('Result localstorage jwt:',LocalStorage.getAll());
            console.log('Result localstorage jwt:',LocalStorage.getItem("feathers-jwt"));
          this.loading = false;
          if (this.grpUser.includes('Application WEB PARKING') && this.$q.platform.mobile) {
            console.log('Utilisateur parking')
            this.$router.replace('/gardien')
          } else {
            this.$router.replace('/')
          }
        })
        // Just use the returned error instead of mapping it from the store.
        .catch(err => {
          // Convert the error to a plain object and add a message.
          this.loading = false;
          console.log("Erreur fatale :",err)
          /*let type = err.className
          err = Object.assign({}, err)
          err.message =
            type === 'not-authenticated'
              ? 'Incorrect email or password.'
              : 'An error prevented login.'*/

          this.error = err
          this.alert(this.error)
        })
    },
    alert (err) {
      this.$q.dialog({
        title: 'Erreur d\'authentification !!',
        message: 'authentification impossible pour l\'instant'
      }).onOk(() => {
        // console.log('OK')
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    onRegister(email, password) {
      this.$router.push('/login/register')
    }
  }
}
</script>

<style lang="scss">

.my-card {
  width: 100%;

  max-width: 400px;

}

.mymy {
  background-color: #ff0000;
  //background: url('https://cdn.quasar.dev/img/parallax2.jpg');
}
</style>
