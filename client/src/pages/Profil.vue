<template>
  <q-page class="container row  justify-center profil full-width items-start q-pa-none">
    <q-card  style="width: 90%; max-width: 100%">
      <q-card-section class="text-h4">
        <div class="row full-width">
          Informations de profil
         <q-space />
          <q-btn @click="doLogout()" >
            <q-icon name="logout" />
          </q-btn>

        </div>


      </q-card-section>
      <q-card-section>
        <div class="row q-px-md">
          <div class="col-12 col-md-6 q-pr-md">
            <div class="row items-start  q-px-md">
              <div class="col-3 col-md-3 q-gutter-md q-pa-none ">
                <q-avatar
                  :icon="currentAvatar"
                  size="120px"
                  style="position: relative !important;left:-20px !important;top:-20px !important"
                ></q-avatar>
              </div>
              <div class="col-9 col-md-9 q-gutter-md q-pa-md justify-left items-start">
                  <div class="row q-gutter-md items-start">
                    Bienvenue, {{currentUser.displayName}}
                  </div>
                  <div class="row items-center justify-left">
                      <q-icon name="mail" /> {{currentUser.mail}}
                  </div>
              </div>
            </div>
            <div class="row items-center q-px-md "></div>
            <div class="row items-center q-px-sm">
              <div class="col-12 q-pa-sm" style="width:500px">
              <q-card class="full-width q-pa-xs" >
                <q-tabs
                  v-model="tab"
                  dense
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="justify"
                  narrow-indicator
                >
                  <!--<q-tab name="mails" label="Mails" />-->
                  <q-tab name="lists" label="Listes de distributions" />
                  <q-tab name="groupes" label="Groupes" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="tab" animated class="q-pa-md" >
                  <q-tab-panel name="mails">
                    <div class="text-h6">Mails</div>
                    liste des mails.
                  </q-tab-panel>

                  <q-tab-panel name="lists" class="q-pa-md">
                    <div class="text-h6">Listes de distributions</div>
                    Les listes de distributions
                    <ul>
                      <li v-for="(list,idx) in listesDistrib" :key="idx" >{{list}}</li>
                    </ul>
                  </q-tab-panel>

                  <q-tab-panel name="groupes" class="q-pa-md">
                    <div class="text-h6">Groupes</div>
                    Les groupes
                    <ul>
                      <li v-for="(grpe,idx) in lesGroupes" :key="idx" >{{grpe}}</li>
                    </ul>
                  </q-tab-panel>
                </q-tab-panels>
              </q-card>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 self-start">

            <div class="row items-center q-pa-xs">
            <div class="col">
              <div class="row q-pt-sm">Société : <span class="q-px-md">{{currentUser.company}}</span></div>
              <div class="row q-pt-sm">Organisation : <span class="q-px-md">{{currentUser.department}}</span></div>
              <div class="row q-pt-sm">Fonction : <span class="q-px-md">{{currentUser.title}}</span></div>
              <div class="row q-pt-sm">Crée le : <span class="q-px-md">{{currentUser.whenCreated}}</span></div>
              <div class="row q-pt-sm">Responsable : <span class="q-px-md">{{currentUserManager}}</span></div>
            </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
import { defineComponent } from '@vue/composition-api';
import { mapState, mapActions } from 'vuex';
import { colors, QSpinnerGears, QSpinnerPie } from 'quasar';

export default defineComponent({
  data() {
    return {
      currentUser: {},
      tab: 'lists',
    };
  },
  computed: {
    currentAvatar () {
      return Object(this.$store.state.auth.user).hasOwnProperty('img64') ? 'img:data:image/jpeg;base64,' + this.$store.state.auth.user.img64 : 'account_box';
    },
    currentUserManager() {
      if (!Object(this.$store.state.auth.user).hasOwnProperty('manager'))
        return
      return this.$store.state.auth.user.manager.split(',').filter(val => String(val).substring(0,2)=='CN')[0].replace('CN=','')
    },
    listesDistrib() {
      if (Object(this.$store.state.auth.user).hasOwnProperty('showInAddressBook') && Array.isArray(this.$store.state.auth.user.showInAddressBook)) {
        return this.$store.state.auth.user.showInAddressBook.map(val => String(val).split(',')[0].replace('CN=',''))
      } else if (Object(this.$store.state.auth.user).hasOwnProperty('showInAddressBook')) {
        return this.$store.state.auth.user.showInAddressBook.split(',').filter(val => String(val).substring(0,2)=='CN').map(obj => String(obj).replace('CN=',''))
      } else {
        return []
      }

    },
    lesGroupes() {
       if (Object(this.$store.state.auth.user).hasOwnProperty('memberOf') && Array.isArray(this.$store.state.auth.user.memberOf)) {
      return this.$store.state.auth.user.memberOf.map(elt => elt.split(',').filter(val => String(val).substring(0,2)=='CN')[0].replace('CN=',''))
       } else if (Object(this.$store.state.auth.user).hasOwnProperty('memberOf')) {
        return this.$store.state.auth.user.memberOf.split(',').filter(val => String(val).substring(0,2)=='CN').map(obj => String(obj).replace('CN=',''))
       } else {
         return []
       }
    }
  },
  methods: {
    async doLogout() {
      await this.$store.dispatch('auth/logout');
      this.$router.push('/login')
    }
  },
  beforeMount() {

  },
  mounted() {
    if (this.$store.state.auth.user) {
      this.currentUser = this.$store.state.auth.user;
    }
    console.log('Profil :', this.currentUser);
  },
});
</script>
<style lang="scss">
.profil {
  padding-top: 50px;
}
</style>
