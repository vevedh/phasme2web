<template>
  <q-page class="flex justify-center items-center q-pa-md full-width">
    <!-- content -->
    <transition
      appear
      enter-active-class="animated  fadeIn"
      leave-active-class="animated  fadeOut"
    >
      <q-card
        transition-show="jump-down"
        transition-hide="jump-up"
        ref="refApps"
        class="apps-form"
        v-bind:style="
          $q.platform.is.mobile
            ? { width: '90%', height: '75%' }
            : { width: '75%', height: '75%' }
        "
      >
        <q-card-section round class="q-pa-none">
          <div class="row items-center q-py-sm text-bold bg-amber-6">
            <div class="col">
              <div class="row justify-start q-px-sm">
                <q-btn
                  glossy
                  icon="add"
                  v-if="isAdmin"
                  class="shadow-6"
                  color="white"
                  text-color="dark"
                  round
                  dense
                  @click="testAddAppLink()"
                />
              </div>
            </div>
            <div class="col items-center text-center no-wrap">
              <span> Applications CACEM </span>
            </div>

            <div class="col">
              <div class="row justify-end q-pr-sm">
                <q-btn
                  dense
                  icon="home"
                  label="Accueil"
                  glossy
                  color="white"
                  text-color="dark"
                  to="/"
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row items-start q-gutter-md full-width full-height">
            <q-card
              class="my-card shadow-6"
              bordered
              v-for="applink in appLinks"
              :key="`card_${applink._id}`"
            >
              <q-card-section class="bg-primary text-white q-py-xs">
                <div class="text-subtitle1">{{ applink.nom }}</div>
                <!--<div class="text-subtitle2 text-center">by John Doe</div>-->
              </q-card-section>

              <q-separator />
              <q-card-section align="center">
                <div class="col">
                  <div class="row justify-center">
                    <q-btn round type="a" :href="applink.url" target="_blank">
                      <q-avatar
                        v-if="applink.img == ''"
                        icon="home"
                        size="100px"
                        class="shadow-8"
                      >
                      </q-avatar>
                      <q-avatar
                        v-if="applink.img != ''"
                        :icon="`img:${applink.img}`"
                        size="100px"
                        class="shadow-8"
                      >
                      </q-avatar>
                    </q-btn>
                  </div>
                </div>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn
                  dense
                  glossy
                  color="primary"
                  v-if="isAdmin"
                  @click="editAppLink(applink)"
                  >Modifier..</q-btn
                >
              </q-card-actions>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </transition>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { defineComponent } from '@vue/composition-api';
import AddAppLink from '../components/AddAppLink.vue';
export default defineComponent({
  name: 'AppsPage',
  components: {
    AddAppLink,
  },
  computed: {
    ...mapState('adinfos', {
      isAdmin: (state) => state.isAdmin,
      isSiteAdmin: (state) => state.isSiteAdmin,
      users: (state) => state.users,
    }),
    ...mapState('admin', {
      appLinks: (state) => state.applinks,
    }),
  },
  methods: {
    ...mapActions('adinfos', ['getRole', 'getAllUsers']),
    ...mapActions('admin', ['getAllAppLinks', 'addAppLink', 'updateAppLink']),
    flip(state) {
      this.showBtnAccueil = state;
    },
    async testAddAppLink() {
      //await this.addAppLink({ test:'toto'})
      this.$q
        .dialog({
          component: AddAppLink,
          parent: this,
          width: '20%',
          fields: [
  {
    label: 'Nom de l\'application',
    field_type: 'text',
    required: true,
    cid: '8f03d13b-e739-4097-b75d-4339c71497d7',
    id: 'nom',
    span: 12,
    show_options: [],
    field_options: {
      description: '',
      span: 12,
      filled: false,
      'stack-label': false,
    },
  },
  {
    label: 'Description',
    field_type: 'paragraph',
    required: true,
    cid: '18f3d583-7d84-44ca-b13b-001020dfeb55',
    id: 'desc',
    span: 12,
    show_options: [],
    field_options: {
      description: '',
      span: 12,
      filled: false,
      'stack-label': false,
    },
  },
  {
    label: 'Image',
    field_type: 'file',
    required: true,
    cid: '2f4a20a8-3066-4e97-962e-8b02c08b0e57',
    id: 'img',
    span: 12,
    show_options: [],
    field_options: {
      description: '',
      span: 12,
      filled: false,
      'stack-label': false,
    },
  },
  {
    label: 'URL',
    field_type: 'text',
    required: true,
    cid: 'b4effa45-e272-44e7-80f2-ac3b896dde42',
    id: 'url',
    span: 12,
    show_options: [],
    field_options: {
      description: '',
      span: 12,
      filled: false,
      'stack-label': false,
    },
  },
],
          fieldsModel: {
            nom: '',
            desc: '',
            img: '',
            url: '',
          },
          //id:''
          labelAction: 'Ajouter',
          // ...more.props...
        })
        .onOk(async (res) => {
          console.log('OK :', res.result);
          await this.addAppLink(res.result);
        })
        .onCancel(() => {
          console.log('Cancel');
        })
        .onDismiss(() => {
          console.log('Called on OK or Cancel');
        });
    },
    async editAppLink(objLink) {
      this.$q
        .dialog({
          component: AddAppLink,
          parent: this,
          width: '20%',
          fields: [
            {
              id: 'nom',
              type: 'text',
              span: 12,
              label: "Nom de l'application ",
              required: false,
              options: {
                filled: true,
                rules: [(val) => (val && val.length > 0) || 'Nom obligatoire'],
              },
            },

            {
              id: 'desc',
              span: 12,
              type: 'textarea',
              label: 'Description ',
              required: false,
              options: {
                filled: true,
              },
            },
            {
              id: 'img',
              span: 4,
              type: 'file',
              label: 'Fichier image',
              description: 'Image icon',
              required: false,
              options: {},
            },
            {
              id: 'url',
              span: 8,
              type: 'text',
              label: 'Lien ',
              required: false,
              options: {
                filled: true,
                rules: [(val) => (val && val.length > 0) || 'Lien obligatoire'],
              },
            },
          ],
          fieldsModel: objLink,
          id: objLink._id,
          labelAction: 'Modifier',
          // ...more.props...
        })
        .onOk(async (res) => {
          console.log('OK :', res.result);
          await this.updateAppLink(res.result);
        })
        .onCancel(() => {
          console.log('Cancel');
        })
        .onDismiss(() => {
          console.log('Called on OK or Cancel');
        });
    },
  },
  async mounted() {
    // liste des applications CACEM
    await this.getAllAppLinks();
    //await this.getAllAppLinks()
    console.log('App links :', this.appLinks);
  },
});
</script>
