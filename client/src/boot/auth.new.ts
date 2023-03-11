import { LoadingBar, LocalStorage, Notify, Dialog, Quasar } from "quasar";
import { boot } from "quasar/wrappers";

import axios from 'axios';

import jwt_decode from "jwt-decode";

import feathersClient from "./feathers-client";

export default boot(async ({ router, store }) => {
  router.beforeEach(async (to, from, next) => {


    LoadingBar.start()

    console.log("Mode :", process.env.NODE_ENV)
    /*let confPath;
    let apiUrl
    if (process.env.NODE_ENV === 'production') {
      apiUrl = window.location.origin
    } else {
      //confPath = window.location.origin+'/cacem.config.json' // http://localhost:3030 https://svrdevweb.agglo.local
      apiUrl = (window.location.origin.split(':')[2] == "8080") ? "https://webapps.agglo.local": window.location.origin

    }*/

    try {
      //
      //console.log('Auth  localstorage :', LocalStorage.remove("feathers-jwt"));
      //let authenticated = await feathersClient.reAuthenticate();
      let authenticated = await store.dispatch('auth/authenticate');
      console.log('ReAuthenticated :',authenticated)
      if (authenticated.accessToken) {
        next()
      }
    } catch (error) {
      console.log('Echec ReAuthenticated !')
      console.log('STorage navigateur :',feathersClient.authentication);
    }
    console.log('Store :', store.state)
    console.log('STorage navigateur :',LocalStorage.getItem("feathers-jwt"));

    if (LocalStorage.getItem("feathers-jwt")!=null) {
      console.log('Decode jwt :',jwt_decode(LocalStorage.getItem('feathers-jwt') as string) )
      
    }

    //let authenticated = await store.dispatch('auth/authenticate');
    //console.log('Authenticated :',authenticated)

    if (Object(to).meta && Object(to).meta.requiresAuth ) {
      console.log('Demande une authentification vers chemin:', to)

      // check sso

      //console.log("Verification sso")
      

      if (store.state.auth.accessToken) {
        next();
      }
        

      let presso = { data: '' }

      try {
        if (!store.state.auth.user) {
          console.log("Verification sso api :",process.env.API)
          presso = await axios.get(`${process.env.API}/auth/sso`, {
            withCredentials: true,
          })
          console.log("Presso infos :", presso);
          //await store.dispatch('auth/authenticate', { strategy: 'ldap', data: presso.data });
          let authenticated = await store.dispatch('auth/authenticate', { strategy: 'sso2', data: presso.data  });
          //let authenticated = await store.dispatch('auth/authenticate');
          console.log('Authenticated :',authenticated)
        }
      } catch (error) {
        /*Notify.create({
          message: `Echec d'accès sso !`,
          color: "negative"
        });*/
        Dialog.create({
          title: `Echec - Vérification SSO.`,
          message: `Erreur d'authentification automatique !`
        }).onOk(() => {
          // console.log('OK')
        }).onCancel(() => {
          // console.log('Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
        if (store.state.auth.user) {
          next();
        } else {
          next('/login')
        }
      }


      if (store.state.auth.user!=null) {
        Notify.create({
          message: `Vous avez été identifié avec succès.`,
          color: "positive"
        });
       

        console.log('Utilisateur authentifié')

          // recupreation du role de l'utilisateur depuis infos du fichier config du serveur feathers
          await store.dispatch('adinfos/getRole', store.state.auth.user)
          //await store.dispatch('adinfos/getSiteRole')
          console.log('User groupes :',store.state.adinfos.userGrpes)
          
          console.log('Vers :',to.path)
          if (LoadingBar) {
            LoadingBar.stop()
          }
          
          next()
          
          
          
          



      } else {
        /*Notify.create({
          message: `Une identification manuelle est nécessaire !`,
          color: "negative"
        });*/
        Dialog.create({
          title: `Echec - Vérification SSO.`,
          message: `Erreur d'authentification automatique !`
        }).onOk(() => {
          // console.log('OK')
        }).onCancel(() => {
          // console.log('Cancel')
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
        if (to.path !== "/login") {
          next("/login");
        }
        if (LoadingBar) {
          LoadingBar.stop()
        }
      }

      //console.log('SSo infos :',sso)


    } else {
      /*Notify.create({
        message: `Vérification SSo impossible`,
        color: "negative"
      });*/
      Dialog.create({
        title: `Echec - Vérification SSO.`,
        message: `Erreur d'authentification automatique !`
      }).onOk(() => {
        // console.log('OK')
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })

      next();
      if (LoadingBar) {
        LoadingBar.stop()
      }

    }
    //next();
  });

  router.afterEach( route => {
    //Loading.hide()
    LoadingBar.stop()
  })
});
