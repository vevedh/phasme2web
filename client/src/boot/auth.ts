import { LoadingBar, LocalStorage, Notify, Quasar } from "quasar";
import { boot } from "quasar/wrappers";

import axios from 'axios';
import Vue from 'vue'
//import LoadingBar from '../components/LoadingBar.vue'
//Vue.component('loading-bar', LoadingBar)


export default boot(async ({ router, store }) => {
  router.beforeEach(async (to, from, next) => {

    /*Loading.show({
      spinner: new QSpinnerPuff,
      spinnerColor: 'blue',
      message: 'chargement...'
    })*/
    LoadingBar.start()

    console.log("Mode :", process.env.NODE_ENV)
    let confPath;
    let apiUrl
    if (process.env.NODE_ENV === 'production') {
      apiUrl = window.location.origin
    } else {
      //confPath = window.location.origin+'/cacem.config.json'
      apiUrl = (window.location.origin.split(':')[2] == "8080") ? "https://localhost:3030" : window.location.origin



      //(await axios.get(confPath)).data.apiUrl
    }


    //console.log('to :',to)
    console.log('Store :', store.state)
    //let authenticated = await store.dispatch('auth/authenticate');
    //console.log('Authenticated :',authenticated)
    if (Object(to).meta && Object(to).meta.requiresAuth && !store.state.auth.user) {
      console.log('Demande une authentification :', to)

      // check sso
      console.log("Verification sso")
      Notify.create({
        message: `Vérification SSO.`,
        color: "negative"
      });

      let presso = { data: '' }

      try {
        if (!store.state.auth.user) {
          console.log("Verification sso api :", apiUrl)
          presso = await axios.get(`${apiUrl}/auth/sso`, {
            withCredentials: true,
          })
          console.log("Presso infos :", presso.data);
          await store.dispatch('auth/authenticate', { strategy: 'sso', sso: presso.data });

        }
      } catch (error) {
        Notify.create({
          message: `Echec d'accès sso !`,
          color: "negative"
        });
        if (store.state.auth.user) {
          next();
        } else {
          next('/login')
        }
      }


      try {
        console.log('Store before sso :', store.state)
        if (store.state.auth.user) {
          //let sso = await store.dispatch('auth/authenticate', { strategy: 'sso', sso: presso.data.sso });
          //await feathersClient.authenticate({ strategy:'sso' , sso: presso.data});//store.dispatch('auth/authenticate', { strategy:'sso' , sso: presso.data});

          console.log("Utilisateur :", store.state.auth.user)
        }
      } catch (error) {

        Notify.create({
          message: `Une identification manuelle est nécessaire !`,
          color: "negative"
        });
        if (to.path !== "/login") {
          next("/login");
        } else {
          next();
        }
      }

      //console.log('SSo infos :',sso)
      if (store.state.auth.user) {
        Notify.create({
          message: `Vous avez été identifié avec succès.`,
          color: "negative"
        });
        // recupreation du role de l'utilisateur depuis infos du fichier config du serveur feathers
        await store.dispatch('adinfos/getRole', store.state.auth.user)
        await store.dispatch('adinfos/getSiteRole')
        
        next()
      } else {
        Notify.create({
          message: `Une identification manuelle est nécessaire !`,
          color: "negative"
        });
        if (to.path !== "/login") {
          next("/login");
        } else {
          next();
        }
      }
      
    } else {
      next();
    }
    //next();
  });

  router.afterEach( route => {
    //Loading.hide()
    LoadingBar.stop()

  })
});
