<template>
  <q-page class="fit row justify-center bg-white">
    <!-- content -->

    <div
      class="column justify-center self-center q-pb-xl q-px-md"
      style="width: 400px"
    >
      <div class="row justify-center self-center" style="width: 200px">
        <q-img :src="url" spinner-color="white" />
      </div>
      <q-card class="my-card" bordered>
        <q-card-section
          style="width: 100%"
          class="text-center bg-primary text-white text-h5 q-py-xs"
        >
          Identification
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pb-none">
          <q-form class="q-px-xl">
            <q-input
              filled
              bottom-slots
              v-model="email"
              label="*Utilisateur :"
              :dense="dense"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Utilisateur du domaine obligatoire!',
              ]"
            >
            </q-input>
            <q-input
              filled
              bottom-slots
              type="password"
              v-model="password"
              label="Mot de passe :"
              :dense="dense"
            >
            </q-input>
          </q-form>
        </q-card-section>
        <q-card-actions
          class="row items-center justify-center q-mt-md q-pt-none"
        >
          <div :hidden="!loading">
            <div class="col items-center justify-center">
              <div class="row text-center items-center justify-center">
                <q-spinner color="primary" size="3em" :thickness="10" />
              </div>
              <div class="text-h6">Vérifications en cours patientez...</div>
            </div>
          </div>
        </q-card-actions>
        <q-card-actions
          class="row items-center justify-center q-mt-md q-pt-none"
        >
          <div class="q-gutter-xl">
            <q-btn
              color="primary"
              icon="lock"
              text-color="white"
              label="Connexion"
              @click="onSubmit(email, password)"
              :disable="email == '' || password == ''"
            />
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
import { mapGetters } from 'vuex';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      url: 'cacem.png',
      error: '',
      dense: true,
      loading: false,
    };
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'user']),
    async checkIsAuthenticated() {
      console.log('Init');
      let auth = await this.$store
        .dispatch('auth/authenticate')
        .catch((err) => {
          console.log('Non authentifié!');
        });
      console.log('Auth :', auth);

      if (auth.user) {
        // this.user = auth.user;
        await store.dispatch('adinfos/getRole', this.$store.state.auth.user);
        await store.dispatch('adinfos/getSiteRole');

        try {
          
            this.$router.replace('/');
          
        } catch (error) {}
      }
    },
  },
  setup(props, context) {
    console.log('Propriétées :', props);
    console.log('Context :', context);
  },
  methods: {
    onSubmit(email, password) {
      console.log('Click');
      this.loading = true;
      this.$store
        .dispatch('auth/authenticate', {
          strategy: 'ldap',
          username: email,
          password: password,
        })
        .then(async (res) => {
          console.log('Result :', res);
          console.log('Result auth:', this.$store.state.auth);
           console.log('Result localstorage jwt:',LocalStorage.getItem("feathers-jwt"));

          await this.$store.dispatch('adinfos/getRole', res.user);
          await this.$store.dispatch('adinfos/getSiteRole');
          this.loading = false;
          
            this.$router.replace('/');
          
        })
        // Just use the returned error instead of mapping it from the store.
        .catch((err) => {
          // Convert the error to a plain object and add a message.
          this.loading = false;
          console.log('Erreur fatale :', err);
          /*let type = err.className
            err = Object.assign({}, err)
            err.message =
              type === 'not-authenticated'
                ? 'Incorrect email or password.'
                : 'An error prevented login.'*/

          this.error = err;
          this.alert(this.error);
        });
    },
    alert(err) {
      this.$q
        .dialog({
          title: "Erreur d'authentification !!",
          message: "authentification impossible pour l'instant",
        })
        .onOk(() => {
          // console.log('OK')
        })
        .onCancel(() => {
          // console.log('Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    onRegister(email, password) {
      this.$router.push('/login/register');
    },
  },
};
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
