(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([[3],{"14a2":function(t,e,a){"use strict";a("c457")},b8fa:function(t,a,r){"use strict";r.r(a);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("q-page",{staticClass:"container full-width"},[a("q-pull-to-refresh",{attrs:{color:"yellow-9",icon:"lightbulb"},on:{refresh:t.refresh}},[a("div",{staticClass:"row q-px-sm q-py-xs full-width"},[a("div",{staticClass:"col-12 bg-white rounded-borders q-pa-none"},[a("q-btn",{staticClass:"q-mt-sm q-ml-sm q-pr-sm bg-white",attrs:{color:"secondary",outline:"",dense:"","no-wrap":"",icon:t.$q.fullscreen.isActive?"fullscreen_exit":"fullscreen"},on:{click:function(e){return t.$q.fullscreen.toggle()}}}),t.$q.screen.gt.xs?a("q-btn",{staticClass:"q-mt-sm q-ml-sm q-pr-sm bg-white",attrs:{outline:"",dense:"","no-wrap":"",icon:"add","no-caps":"",color:"green",label:"Ajouter au parking"},on:{click:function(e){t.showNewParking=!0}}}):t._e(),a("q-btn-dropdown",{staticClass:"q-mt-sm q-ml-sm bg-white",attrs:{outline:"",dense:"",color:"primary",icon:"filter_list",label:"Selectionner un filtre"}},[a("q-list",[a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{clickable:""},on:{"!click":function(e){return t.filtreDateDuJour()}}},[a("q-item-section",{attrs:{avatar:""}},[a("q-icon",{attrs:{name:"done",color:t.isFilterDatejour?"green":"grey-3"}})],1),a("q-item-section",[a("q-item-label",[t._v("Pour le\n                  "),a("span",{staticClass:"text-bold"},[t._v(t._s(t.datedujour))])])],1)],1),a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{clickable:""},on:{"!click":function(e){return t.filtreDateAll()}}},[a("q-item-section",{attrs:{avatar:""}},[a("q-icon",{attrs:{name:"done",color:t.isFilterDateAll?"green":"grey-3"}})],1),a("q-item-section",[a("q-item-label",[t._v("Tout")])],1)],1)],1)],1),a("q-btn",{staticClass:"q-mt-sm q-ml-sm q-pr-sm bg-white text-bold",attrs:{outline:"",dense:"","no-wrap":"",icon:"today","no-caps":"",color:"primary",label:t.datedujour,disabled:""}}),t.showDev?a("q-btn",{staticClass:"q-text-bold q-pa-xs",attrs:{flat:"",outline:"",dense:"",color:"blue-8"}},[t._v("** DEV **")]):t._e(),a("q-input",{staticClass:"float-right items-center justify-center q-pa-xs bg-white",staticStyle:{width:"35%"},attrs:{label:"Rechercher ici",outlined:"",dense:""},on:{input:t.doSearch},scopedSlots:t._u([{key:"append",fn:function(){return[""!==t.searchValue?a("q-icon",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"cursor-pointer",attrs:{clickable:"",name:"close"},on:{click:function(e){t.searchValue=""}}}):t._e(),a("q-icon",{attrs:{name:"search"}})]},proxy:!0}]),model:{value:t.searchValue,callback:function(e){t.searchValue=e},expression:"searchValue"}})],1)]),a("div",{staticClass:"row q-mt-xs bg-transparent rounded-borders full-width"},[a("div",{staticClass:"col-4 q-px-xs"},[a("div",{staticClass:"q-pa-xs column-background"},[a("q-item",{staticClass:"q-pa-none text-white q-pa-sm to-do-title"},[a("q-item-section",{staticStyle:{"min-width":"25px"},attrs:{avatar:""}},[a("q-icon",{staticClass:"q-pa-none q-ma-none",attrs:{name:"taxi_alert"}})],1),a("q-item-section",{staticClass:"text-h6 text-bold"},[a("span",[a("q-avatar",{attrs:{size:"33px",color:"red","text-color":"white"}},[t._v(t._s(t.visiteursParking_en_attente.length))]),t._v("\n                En attentes")],1)]),a("q-item-section",{attrs:{avatar:""}},[a("q-icon",{staticClass:"cursor-pointer",attrs:{name:"more_vert"}},[a("q-menu",{attrs:{"transition-show":"rotate","transition-hide":"rotate"}},[a("q-list",{staticStyle:{"min-width":"100px"}},[a("q-item",{attrs:{clickable:""}},[a("q-item-section",[t._v("Aujoud'hui")])],1),a("q-item",{attrs:{clickable:""}},[a("q-item-section",[t._v("A la date du")])],1),a("q-item",{attrs:{clickable:""}},[a("q-item-section",[t._v("Toutes")])],1)],1)],1)],1)],1)],1),t._l(t.visiteursParking_en_attente,(function(e,r){return a("q-card",{key:r,staticClass:"box-shadow bg-white q-mt-xs list-group-item border-todo",style:"attente"==e.etat?"border-left: 5px solid red !important":"",attrs:{flat:"",bordered:""}},[a("q-toolbar",{staticClass:"bg-transparent text-dark q-pa-none",staticStyle:{"min-height":"10px"}},[a("q-btn",{attrs:{flat:"",round:"",dense:"",icon:"event"}}),a("q-separator",{attrs:{dark:"",vertical:"",inset:""}}),a("q-toolbar-title",{staticClass:"text-caption"},[a("span",{staticClass:"text-bold"},[t._v("Visite prévue le : ")]),a("span",{staticClass:"text-h6"},[t._v(t._s(e.datevisite)+" à "+t._s(e.heurevisite))])]),a("q-btn",{attrs:{flat:"",round:"",dense:"",icon:"close"},on:{click:function(e){return t.deleteDemande("visiteursParking_en_attente",r)}}})],1),a("q-card-section",{staticClass:"q-pt-xs"},[a("div",{staticClass:"row items-center no-wrap"},[a("div",{staticClass:"col"},[a("div",{staticClass:"text-center text-caption"},[a("span",{staticClass:"text-bold"},[t._v("Contact principal : ")]),t._v(t._s(e.prenom)+" "+t._s(e.nom)+"\n                  ")]),a("div",{staticClass:"text-caption"},[a("q-icon",{attrs:{name:"assignment_ind",size:"2vh"}}),a("span",{staticClass:"text-bold"},[t._v("Demandeur :")]),a("span",[t._v("\n                      "+t._s(e.contactinterne)+"\n                    ")])],1),a("div",[a("span",{staticClass:"text-bold"},[t._v("Occupants : ")]),t._v(t._s(t.getNbPassagers(e.passagers))+"\n                  ")])])])]),a("q-card-actions",{staticClass:"q-pa-none",attrs:{align:"right"}},[a("q-btn",{attrs:{size:"md",flat:"",round:"",color:"blue",icon:"speaker_notes"},on:{click:function(a){return t.showDiagDetail(e)}}},[a("q-tooltip",[t._v("Commentaires")])],1),a("q-btn",{attrs:{size:"md",flat:"",color:"primary",icon:"arrow_forward_ios"},on:{click:function(a){t.immatriculation="",t.currentCarIndex=r,t.carToAdd=Object.assign({},e),t.showAddParking=!0}}},[a("q-tooltip",[t._v(" Ajouter au parking ")])],1)],1)],1)}))],2)]),a("div",{staticClass:"col-4 q-px-xs"},[a("div",{staticClass:"q-pa-xs column-background"},[a("q-item",{staticClass:"q-pa-none text-white q-pa-sm test-title"},[a("q-item-section",{staticStyle:{"min-width":"25px"},attrs:{avatar:""}},[a("q-icon",{staticClass:"q-pa-none q-ma-none",attrs:{name:"drive_eta"}})],1),a("q-item-section",{staticClass:"text-h6"},[a("span",[a("q-avatar",{attrs:{size:"33px",color:"teal-7","text-color":"white"}},[t._v(t._s(t.visiteursParking_au_parking.length))]),t._v("\n                Au parking")],1)]),a("q-item-section",{attrs:{avatar:""}},[a("q-icon",{staticClass:"cursor-pointer",attrs:{name:"more_vert"}},[a("q-menu",{attrs:{"transition-show":"rotate","transition-hide":"rotate"}},[a("q-list",{staticStyle:{"min-width":"100px"}},[a("q-item",{attrs:{clickable:""}},[a("q-item-section",[t._v("Aujoud'hui")])],1),a("q-item",{attrs:{clickable:""}},[a("q-item-section",[t._v("A la date du")])],1),a("q-item",{attrs:{clickable:""}},[a("q-item-section",[t._v("Toutes")])],1)],1)],1)],1)],1)],1),t._l(t.visiteursParking_au_parking,(function(e,r){return a("q-card",{key:r,staticClass:"box-shadow bg-white q-mt-xs list-group-item border-test",style:"parking"==e.etat?"border-left: 5px solid green !important":"",attrs:{square:"",flat:"",bordered:""}},[a("q-toolbar",{staticClass:"bg-transparent text-dark q-pa-none",staticStyle:{"min-height":"10px"}},[a("q-btn",{attrs:{flat:"",round:"",dense:"",icon:"event",color:"green"}}),a("q-separator",{attrs:{dark:"",vertical:"",inset:""}}),a("q-toolbar-title",{staticClass:"text-caption"},[a("span",{staticClass:"text-bold"},[t._v("Le : ")]),a("span",{staticClass:"text-h6"},[a("span",{staticClass:"text-green text-bold text-h5"},[t._v(t._s(e.dateparking))]),t._v("\n                  à\n                  "),a("span",{staticClass:"text-red text-bold text-h5"},[t._v(t._s(e.heureparking))])])]),a("q-btn",{attrs:{flat:"",round:"",dense:"",icon:"close"},on:{click:function(e){return t.deleteDemande("visiteursParking_au_parking",r)}}})],1),a("q-card-section",{staticClass:"q-pt-xs"},[a("div",{staticClass:"row items-center no-wrap"},[a("div",{staticClass:"col"},[a("div",{staticClass:"text-center"},[a("span",{staticClass:"text-bold"},[t._v("Immatriculation : ")]),a("span",{staticClass:"text-bold text-h5"},[t._v(t._s(e.immatriculation.toUpperCase()))])]),a("div",{staticClass:"text-center text-caption"},[a("span",{staticClass:"text-bold"},[t._v("Contact principal : ")]),t._v(t._s(e.prenom)+" "+t._s(e.nom)+"\n                  ")]),a("div",{staticClass:"text-caption"},[a("q-icon",{attrs:{name:"assignment_ind",size:"3vh"}}),a("span",{staticClass:"text-bold"},[t._v("Demandeur :")]),a("span",[t._v("\n                      "+t._s(e.contactinterne)+"\n                    ")])],1),a("div",[a("span",{staticClass:"text-bold"},[t._v("Occupants : ")]),t._v(t._s(t.getNbPassagers(e.passagers))+"\n                  ")]),t._l(e.passagers,(function(e,r){return a("q-chip",{key:"at_passager_"+r,attrs:{dense:"",color:"primary","text-color":"white",icon:"directions_car",Ice:"",cream:""}},[a("q-separator",{staticClass:"q-my-none q-mx-sm",attrs:{dark:"",vertical:"",inset:""}}),t._v(" \n                    "),a("span",[t._v("\n                      "+t._s(e.nom)+" "+t._s(e.prenom)+"   ")]),a("q-separator",{staticClass:"q-my-none q-mx-sm",attrs:{dark:"",vertical:"",inset:""}}),t._v(" \n                    "),a("span",[t._v(" Société : "+t._s(e.societe))])],1)}))],2)])]),a("q-card-actions",{staticClass:"q-pa-none",attrs:{align:"left"}},[a("q-btn",{attrs:{round:"",dense:"",color:"accent",icon:"minor_crash"},on:{click:function(a){t.immatriculation="",t.currentCarIndex=r,t.carToAddV=Object.assign({},e),t.showAddVehiculeParking=!0}}},[a("q-badge",{attrs:{color:"dark",floating:""}},[t._v("+")]),a("q-tooltip",[t._v("Nouveau Véhicule")])],1),a("q-space"),a("q-btn",{attrs:{size:"md",flat:"",round:"",color:"blue",icon:"speaker_notes"},on:{click:function(a){return t.showDiagDetail(e)}}},[a("q-tooltip",[t._v("Commentaires")])],1),a("q-btn",{attrs:{size:"md",flat:"",color:"primary",icon:"logout"},on:{click:function(e){return t.sortieParking("visiteursParking_au_parking",r)}}},[a("q-tooltip",[t._v(" Quitte le parking ")])],1)],1)],1)}))],2)]),a("div",{staticClass:"col-4 q-px-xs"},[a("div",{staticClass:"q-pa-xs column-background"},[a("q-item",{staticClass:"q-pa-none text-white q-pa-sm done-title"},[a("q-item-section",{staticStyle:{"min-width":"25px"},attrs:{avatar:""}},[a("q-icon",{staticClass:"q-pa-none q-ma-none",attrs:{name:"exit_to_app"}})],1),a("q-item-section",{staticClass:"text-h6 text-weight-bolder"},[t._v("Sont Partis")]),a("q-item-section",{attrs:{avatar:""}},[a("q-icon",{staticClass:"cursor-pointer",attrs:{name:"more_vert"}},[a("q-menu",{attrs:{"transition-show":"rotate","transition-hide":"rotate"}},[a("q-list",{staticStyle:{"min-width":"100px"}},[a("q-item",{attrs:{clickable:""}},[a("q-item-section",[t._v("Aujoud'hui")])],1),a("q-item",{attrs:{clickable:""}},[a("q-item-section",[t._v("A la date du")])],1),a("q-item",{attrs:{clickable:""}},[a("q-item-section",[t._v("Toutes")])],1)],1)],1)],1)],1)],1),t._l(t.visiteursParking_sortis,(function(e,r){return a("q-card",{key:r,staticClass:"box-shadow bg-white q-mt-xs list-group-item border-test",style:"sortie"==e.etat?"border-left: 5px solid red !important":"",attrs:{square:"",flat:"",bordered:""}},[a("q-toolbar",{staticClass:"bg-transparent text-dark q-pa-none",staticStyle:{"min-height":"10px"}},[a("q-btn",{attrs:{flat:"",round:"",dense:"",icon:"event",color:"green"}}),a("q-separator",{attrs:{dark:"",vertical:"",inset:""}}),a("q-toolbar-title",{staticClass:"text-caption"},[a("span",{staticClass:"text-bold"},[t._v("Le : ")]),a("span",{staticClass:"text-h6"},[a("span",{staticClass:"text-green text-bold text-h5"},[t._v(t._s(e.datesortie))]),t._v("\n                  à\n                  "),a("span",{staticClass:"text-red text-bold text-h5"},[t._v(t._s(e.heuresortie))])])]),a("q-btn",{attrs:{flat:"",round:"",dense:"",icon:"close"},on:{click:function(e){return t.deleteDemande("visiteursParking_sortis",r)}}})],1),a("q-card-section",{staticClass:"q-pt-xs"},[a("div",{staticClass:"row items-center no-wrap"},[a("div",{staticClass:"col"},[a("div",{staticClass:"text-center"},[a("span",{staticClass:"text-bold"},[t._v("Immatriculation : ")]),a("span",{staticClass:"text-bold text-h5"},[t._v(t._s(e.immatriculation))])]),a("div",{staticClass:"text-caption"},[a("q-icon",{attrs:{name:"assignment_ind",size:"3vh"}}),a("span",{staticClass:"text-bold"},[t._v("Demandeur :")]),a("span",[t._v("\n                      "+t._s(e.contactinterne)+"\n                    ")])],1),a("div",[a("span",{staticClass:"text-bold"},[t._v("Occupants : ")]),t._v(t._s(t.getNbPassagers(e.passagers))+"\n                  ")]),t._l(e.passagers,(function(e,r){return a("q-chip",{key:"at_passager_"+r,attrs:{color:"primary","text-color":"white",icon:"directions_car",Ice:"",cream:""}},[a("q-separator",{staticClass:"q-my-none q-mx-sm",attrs:{dark:"",vertical:"",inset:""}}),t._v(" \n                    "),a("span",[t._v("\n                      "+t._s(e.nom)+" "+t._s(e.prenom)+"   ")]),a("q-separator",{staticClass:"q-my-none q-mx-sm",attrs:{dark:"",vertical:"",inset:""}}),t._v(" \n                    "),a("span",[t._v(" Société : "+t._s(e.societe))])],1)}))],2)])]),a("q-card-actions",{staticClass:"q-pa-none",attrs:{align:"right"}},[a("q-btn",{attrs:{size:"md",flat:"",round:"",color:"blue",icon:"speaker_notes"},on:{click:function(a){return t.showDiagDetail(e)}}},[a("q-tooltip",[t._v("Commentaires")])],1)],1)],1)}))],2)])]),a("q-dialog",{attrs:{position:"left"},model:{value:t.showAddParking,callback:function(e){t.showAddParking=e},expression:"showAddParking"}},[a("q-card",{staticStyle:{width:"300px"}},[a("q-card-section",[a("div",{staticClass:"text-h6"},[t._v("Arrive au parking")])]),a("q-separator"),a("q-card-section",{staticClass:"row items-center no-wrap"},[a("q-form",{staticClass:"q-gutter-md full-width"},[a("q-input",{staticClass:"q-ml-none",attrs:{filled:"",mask:"XX-XXX-XX",rules:[function(t){return new RegExp(/^[A-Z]{2} ?- ?\d{3} ?- ?[A-Z]{2}$/).test(t)||"Immatriculation non valide"}],"fill-mask":"",label:"Immatriculation"},model:{value:t.immatriculation,callback:function(e){t.immatriculation=e},expression:"immatriculation"}}),a("div",{staticClass:"text-right"},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{label:"Annuler",color:"primary"}}),a("q-btn",{staticClass:"q-ml-sm",staticStyle:{width:"90px"},attrs:{label:"Ajouter",color:"green"},on:{click:t.addParkingChanges}})],1)],1)],1)],1)],1),a("q-dialog",{attrs:{position:"left"},model:{value:t.showAddVehiculeParking,callback:function(e){t.showAddVehiculeParking=e},expression:"showAddVehiculeParking"}},[a("q-card",{staticStyle:{width:"300px"}},[a("q-card-section",[a("div",{staticClass:"text-h6"},[t._v("Nouveau Véhicule au parking")])]),a("q-separator"),a("q-card-section",{staticClass:"row items-center no-wrap"},[a("q-form",{staticClass:"q-gutter-md full-width"},[a("q-input",{staticClass:"q-ml-none",attrs:{filled:"",mask:"XX-XXX-XX",rules:[function(t){return new RegExp(/^[A-Z]{2} ?- ?\d{3} ?- ?[A-Z]{2}$/).test(t)||"Immatriculation non valide"}],"fill-mask":"",label:"Immatriculation"},model:{value:t.immatriculation,callback:function(e){t.immatriculation=e},expression:"immatriculation"}}),a("div",{staticClass:"text-right"},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{label:"Annuler",color:"primary"}}),a("q-btn",{staticClass:"q-ml-sm",staticStyle:{width:"90px"},attrs:{label:"Ajouter",color:"green"},on:{click:t.addVehiculeParkingChanges}})],1)],1)],1)],1)],1),a("q-dialog",{attrs:{position:"top"},model:{value:t.showDelete,callback:function(e){t.showDelete=e},expression:"showDelete"}},[a("q-card",{staticStyle:{width:"300px"}},[a("q-card-section",[a("div",{staticClass:"text-h6 text-center"},[t._v("\n            Confirmer vous cette suppression ?\n          ")])]),a("q-separator"),a("q-card-section",{staticClass:"row items-center no-wrap"},[a("q-form",{staticClass:"q-gutter-md full-width"},[a("div",{staticClass:"text-right q-gutter-md"},[a("q-btn",{attrs:{label:"NON",color:"primary",icon:"cancel"},on:{click:function(e){t.showDelete=!1}}}),a("q-btn",{attrs:{label:"OUI",icon:"done",color:"green"},on:{click:t.confirmDelete}})],1)])],1)],1)],1),a("q-dialog",{attrs:{position:"top"},model:{value:t.showSortie,callback:function(e){t.showSortie=e},expression:"showSortie"}},[a("q-card",{staticStyle:{width:"300px"}},[a("q-card-section",[a("div",{staticClass:"text-h6 text-center"},[t._v("\n            Confirmer vous cette sortie de véhicule ?\n          ")])]),a("q-separator"),a("q-card-section",{staticClass:"row items-center no-wrap"},[a("q-form",{staticClass:"q-gutter-md full-width"},[a("div",{staticClass:"text-right q-gutter-md"},[a("q-btn",{attrs:{label:"NON",color:"primary",icon:"cancel"},on:{click:function(e){t.showSortie=!1}}}),a("q-btn",{attrs:{label:"OUI",icon:"done",color:"green"},on:{click:t.confirmSortie}})],1)])],1)],1)],1),a("q-dialog",{attrs:{persistent:"","transition-show":"flip-down","transition-hide":"flip-up"},model:{value:t.showDetails,callback:function(e){t.showDetails=e},expression:"showDetails"}},[a("q-card",{staticClass:"container row full-width"},[a("q-toolbar",[a("q-img",{staticStyle:{height:"35px","max-width":"120px"},attrs:{rounded:"",src:r("ec0d")}}),a("q-toolbar-title",[a("span",{staticClass:"text-weight-bold"},[t._v("\n              Détails de la demande parking")])]),a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",round:"",dense:"",icon:"close"}})],1),a("q-separator"),a("q-card-section",{staticClass:"row items-center no-wrap"},[a("f-vv-form-by-name",{attrs:{fieldsmodel:t.currentDemande,nameForm:"Demande Parking",showSave:!0,saveLabel:"Modifier"},on:{onFormAdded:t.editFormDatas}})],1)],1)],1),a("q-dialog",{attrs:{persistent:"","transition-show":"flip-down","transition-hide":"flip-up"},model:{value:t.showNewParking,callback:function(e){t.showNewParking=e},expression:"showNewParking"}},[a("q-card",{staticClass:"container row full-width"},[a("q-toolbar",[a("q-img",{staticStyle:{height:"35px","max-width":"120px"},attrs:{rounded:"",src:r("ec0d")}}),a("q-toolbar-title",[a("span",{staticClass:"text-weight-bold"},[t._v("Ajouter au parking")])]),a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",round:"",dense:"",icon:"close"}})],1),a("q-separator"),a("q-card-section",{staticClass:"row items-center no-wrap"},[a("f-vv-form-by-name",{attrs:{fieldsmodel:{chargeaccueil:t.currentUsername,typeacces:"PARKING",etat:"attente"},nameForm:"Demande Parking",showSave:!0,saveLabel:"Ajouter"},on:{onFormAdded:t.editFormDatas}})],1)],1)],1),a("q-dialog",{attrs:{persistent:""},model:{value:t.showSendMail,callback:function(e){t.showSendMail=e},expression:"showSendMail"}},[a("q-card",[a("q-card-section",{staticClass:"row items-center"},[a("q-icon",{attrs:{size:"5vh",name:"done",color:"secondary"}}),a("span",{staticClass:"q-ml-sm"},[t._v("Un E-mail de confirmation à été envoyé aux administrateurs")])],1),a("q-card-actions",{attrs:{align:"right"}},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{label:"Fermer",color:"primary"},on:{click:function(e){t.showSendMail=!1}}})],1)],1)],1)],1)],1)},s=[],n=r("c973"),o=r.n(n),c=r("278c"),l=r.n(c),u=r("7037"),d=r.n(u),m=r("ded3"),p=r.n(m),h=r("9523"),g=r.n(h),f=(r("96cf"),r("ac1f"),r("1276"),r("4de4"),r("d3b7"),r("4e82"),r("45fc"),r("b64b"),r("caad"),r("2532"),r("498a"),r("e9c4"),r("cca6"),r("a623"),r("4160"),r("159b"),r("7db0"),r("c975"),r("d81d"),r("4fadc"),r("a15b"),r("99af"),r("61cc")),v=r.n(f),b=r("2b0e"),q=r("2f62"),k=(r("bc78"),r("cf57")),w=(r("163c"),r("b76a")),_=r.n(w),x=(r("2a19"),r("bd4c")),C=(r("3e5c"),r("9ef0")),y=r("985a");b["default"].component("draggable",_.a);var A={components:{FVvFormByName:C["a"],FVvTable:y["a"]},name:"ReservationsParking",data:function(){var t,e={days:"Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi".split("_"),daysShort:"Dim_Lun_Mar_Mer_Jeu_Ven_Sam".split("_"),months:"Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Aôut_Septembre_Octobre_Novembre_Décembre".split("_"),monthsShort:"Jan_Fév_Mar_Avr_Mai_Jun_Jui_Aou_Sep_Oct_Nov_Déc".split("_"),firstDayOfWeek:0};return t={search:"",searchValue:"",filters:{},fromCol:null,toCol:null,carToAdd:null,carToAddV:null,fSelect:"",vparking:[],sparking:[],demandeType:"",deleteObj:{},sortieObj:{},getValue:function(t){return"string"===typeof t?t.toUpperCase():t},datevisiteFiltre:!1,isFilterDatejour:!1,isFilterDateAll:!1,filteredParking:[],showAddParking:!1,showAddVehiculeParking:!1,showNewParking:!1,showSortie:!1,showDelete:!1,showDetails:!1,showPassagers:!1,showSendMail:!1,currentDemande:{},currentCarIndex:null},g()(t,"filters",{}),g()(t,"customFilter",null),g()(t,"changes",[]),g()(t,"deleteCar",[]),g()(t,"deleteCarIndex",null),g()(t,"deleteCarId",null),g()(t,"immatriculation",""),g()(t,"datedujour",x["b"].formatDate(Date.now(),"DD/MM/YYYY")),g()(t,"heuredujour",x["b"].formatDate(Date.now(),"HH:mm")),g()(t,"myLocale",e),g()(t,"add_new",!1),g()(t,"drag",!1),t},computed:p()(p()({currentUsername:function(){return console.log("Root :",this.$store),this.$store.state.auth.user.sAMAccountName},usermail:function(){if(this.$store.state.auth.user.mail)return this.$store.state.auth.user.mail},dragOptions:function(){return{animation:200,group:"description",disabled:!1,ghostClass:"ghost"}}},Object(q["d"])("admin",{formData:function(t){return t.getform},fconfig:function(t){return t.config},visiteurs:function(t){return t.visiteurs},vParking:function(t){return t.visiteursParking}})),{},{getFilters:function(){return this.filters},totalVisiteurs:function(){var t=this;if(this.visiteursParking&&Array.isArray(this.visiteursParking))return this.visiteursParking.filter((function(e){return e.datevisite==t.datedujour&&"parking"==e.etat})).length},totalRdcVisiteurs:function(){var t=this;if(this.visiteurs&&Array.isArray(this.visiteurs))return this.visiteurs.filter((function(e){return e.datevisite==t.datedujour&&"RDC"==e.typeacces})).length},totalParkingVisiteurs:function(){var t=this;if(this.visiteursParking&&Array.isArray(this.visiteursParking))return this.visiteursParking.filter((function(e){return e.datevisite==t.datedujour&&"PARKING"==e.typeacces&&"parking"==e.etat})).length},visiteursParking_en_attente:function(){if(this.visiteursParking&&Array.isArray(this.visiteursParking))return console.log("Visiteurs en attente :",this.visiteursParking),this.visiteursParking.filter((function(t){return"attente"==t.etat})).sort((function(t,e){var a=t.heurevisite,r=e.heurevisite;return a<r?-1:1}))},visiteursParking_reserve:function(){if(this.visiteursParking&&Array.isArray(this.visiteursParking))return this.visiteursParking.filter((function(t){return"PARKING"==t.typeacces&&"reserve"==t.etat}))},visiteursParking_sortis:function(){if(this.visiteursParking&&Array.isArray(this.visiteursParking))return this.visiteursParking.filter((function(t){return"PARKING"==t.typeacces&&"sortie"==t.etat})).sort((function(t,e){var a=t.heuresortie,r=e.heuresortie;return a<r?-1:1}))},visiteursParking_au_parking:function(){if(this.visiteursParking&&Array.isArray(this.visiteursParking))return this.visiteursParking.filter((function(t){return"PARKING"==t.typeacces&&"parking"==t.etat}))},visiteursParking:function(){return this.customFilter?this.customFilter:this.vParking},showDev:function(){return!1}}),methods:p()(p()({},Object(q["b"])("admin",["getAllVisiteurs","addVisiteur","addDatasForm","updateDatasForm","deleteDatasForm","getForm","getFormByName","saveForm","getConfig","writeConfig","sendMail"])),{},{globalSearch:function(t,e){var a=t.filter((function(t){return Object.keys(t).some((function(a){return console.log("filtrer :",d()(t[a])),JSON.stringify(t[a]).toLocaleLowerCase().trim().includes(e)}))}));return console.log("Recherche v:",a),a},doSearch:function(t){var e=this.filterArray(this.vParking,this.filters);String(t).trim().length>0?(console.log("Nb filtres :",Object.keys(this.filters).length),this.customFilter=Object.assign([],v()({data:e,keys:["nom","prenom","contactinterne","societe","motif","motifautre","commentaires"],input:t})),console.log("Recherche result:",this.customFilter)):this.refresh()},filterArray:function(t,e){var a=Object.keys(e);return t.filter((function(t){return a.every((function(a){return"function"!==typeof e[a]||e[a](t[a])}))}))},multiFilter:function(t,e,a){var r=t.filter((function(t){var r="";return e.forEach((function(e){r+=t.hasOwnProperty(e)&&t[e].toLowerCase().trim()+" "})),Object.keys(t).some((function(e){return void 0!==t[e]&&null!==t[e]&&JSON.stringify(t[e]).toLowerCase().trim().includes(a)||r.trim().includes(a)}))}));return r},filterPlainArray:function(t,e){var a=this,r=Object.keys(e);return t.filter((function(t){return r.every((function(r){return!e[r].length||e[r].find((function(e){return a.getValue(e)===a.getValue(t[r])}))}))}))},doFind:function(t,e){var a=t.filter((function(t){return filters.some((function(e){return t[e.type]===e.name}))}));return a},ifJSON:function(t){try{return!("[object Object]"!==Object.prototype.toString.call(t)&&!Array.isArray(t))}catch(e){return!1}},whereDateYearEq:function(t){return function(e){return e.split("/")[2]===t}},whereDateMonthrEq:function(t){return function(e){return e.split("/")[1]===t}},whereDateDayEq:function(t){return function(e){return e.split("/")[0]===t}},whereContain:function(t){return function(e){return String(e).toLowerCase().includes(t.toLowerCase())}},whereValue:function(t){return function(e){return JSON.stringify(e).toLowerCase().trim().includes(t)}},whereDateBetween:function(t,e){return function(a){return x["b"].isBetweenDates(new Date(a.split("/")[2],a.split("/")[1],a.split("/")[0]),new Date(t.split("/")[2],t.split("/")[1],t.split("/")[0]),new Date(e.split("/")[2],e.split("/")[1],e.split("/")[0]),{onlyDate:!0,inclusiveFrom:!0,inclusiveTo:!0})}},whereDateDuJour:function(t){var e=new Date(t.split("/")[2],t.split("/")[1],t.split("/")[0]);return function(t){return x["b"].isSameDate(new Date(t.split("/")[2],t.split("/")[1],t.split("/")[0]),e)}},whereTypeAcces:function(t){return function(e){return String(e).trim()==t}},filterColumn:function(t){var e=this;console.log("Filter data :",["contactinterne","nom"]),console.log("Value :",t),console.log("Donnees :",this.vParking.filter((function(e){return-1!=String(e[Object.keys(["contactinterne","nom"])[0]]).indexOf(t)})));var a=Object.entries(["contactinterne","nom"]).map((function(t){var e=l()(t,2),a=e[0],r=e[1];return{key:a,value:r}}));console.log("Donnees :",a),a.forEach((function(t){e.filters[t.key]=e.whereContain(t.value)})),this.customFilter=this.filterArray(this.vParking,this.filters)},deleteFilters:function(t,e){this.filters["".concat(e)]="",this.customFilter=this.filterArray(this.vParking,this.filters),this.filtersParams["".concat(e)].value="",t.set()},addParkingChanges:function(){var t=this;return o()(regeneratorRuntime.mark((function e(){var a,r,i,s,n,o,c;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(""==t.immatriculation){e.next=38;break}return console.log("Parking Liste :",t.visiteursParking),console.log("Element Index :",t.currentCarIndex),t.changes=[],t.carToAdd.immatriculation=t.immatriculation,t.carToAdd.etat="parking",t.carToAdd.heureparking=t.heuredujour,t.carToAdd.dateparking=t.datedujour,t.carToAdd.typeacces="PARKING",t.$q.loading.show({spinner:k["a"],spinnerColor:"red",message:"Chargement en cours..."}),a="db_regvisiteurs",r="dbf_accueil",e.next=14,t.updateDatasForm({fields:t.carToAdd,dbname:a,tablename:r});case 14:return console.log("Mise à jour effectuée"),e.next=17,t.getFormByName("Demande d'accès Parking");case 17:return console.log("Champs du formulaire :",t.formData),i=t.formData[0].data.filter((function(t){return Object(t).hasOwnProperty("id")&&Object(t).hasOwnProperty("label")})).map((function(e){return t.carToAdd[e.id]?Array.isArray(t.carToAdd[e.id])?"<b>".concat(e.label," : </b><br>")+t.carToAdd[e.id].map((function(t){return Object.entries(t).map((function(t){var e=l()(t,2),a=e[0],r=e[1];return"<b>".concat(a," :</b>").concat(r,"<br>")})).join("")})).join(""):"<b>".concat(e.label," : </b>").concat(t.carToAdd[e.id],"<br>"):"<br>"})).join(""),i+="<br><b>Immatriculation : </b>".concat(t.carToAdd["immatriculation"],"<br>"),i+="<br><b>Date au parking : </b>".concat(t.carToAdd["dateparking"],"<br>"),i+="<br><b>Heure au parking : </b>".concat(t.carToAdd["heureparking"],"<br>"),s=t.$store.state.auth.user.mail,n=/\((.*)\)/gm,o=n.exec(t.carToAdd["contactinterne"])[1],console.log("Envoi au contact interne :",o),console.log("Envoi au utilisateur :",s),c={to:"pascal.deleray@cacem-mq.com,,parcauto@cacem.fr,alex.hibade@cacem-mq.com,admindsi@cacem-mq.com,".concat(s,",").concat(o),subject:"Nouveau Véhicule au Parking",message:"".concat(i)},e.next=31,t.sendMail(c);case 31:return t.$q.loading.hide(),t.showConfirm=!1,t.showSendMail=!0,e.next=36,t.refresh();case 36:t.showAddParking=!1,t.immatriculation="";case 38:case"end":return e.stop()}}),e)})))()},addVehiculeParkingChanges:function(){var t=this;return o()(regeneratorRuntime.mark((function e(){var a,r,i,s,n,o,c;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(""==t.immatriculation){e.next=40;break}return console.log("Parking Liste :",t.visiteursParking),console.log("Element Index :",t.currentCarIndex),t.changes=[],t.carToAddV.immatriculation=t.immatriculation,t.carToAddV.etat="parking",t.carToAddV.heureparking=t.heuredujour,t.carToAddV.dateparking=t.datedujour,t.carToAddV.typeacces="PARKING",t.$q.loading.show({spinner:k["a"],spinnerColor:"red",message:"Chargement en cours..."}),a="db_regvisiteurs",r="dbf_accueil",delete t.carToAddV._id,console.log("Fields to add :",t.carToAddV),e.next=16,t.addDatasForm({fields:t.carToAddV,dbname:a,tablename:r});case 16:return console.log("Mise à jour effectuée"),e.next=19,t.getFormByName("Demande d'accès Parking");case 19:return console.log("Champs du formulaire :",t.formData),i=t.formData[0].data.filter((function(t){return Object(t).hasOwnProperty("id")&&Object(t).hasOwnProperty("label")})).map((function(e){return t.carToAddV[e.id]?Array.isArray(t.carToAddV[e.id])?"<b>".concat(e.label," : </b><br>")+t.carToAdd[e.id].map((function(t){return Object.entries(t).map((function(t){var e=l()(t,2),a=e[0],r=e[1];return"<b>".concat(a," :</b>").concat(r,"<br>")})).join("")})).join(""):"<b>".concat(e.label," : </b>").concat(t.carToAddV[e.id],"<br>"):"<br>"})).join(""),i+="<br><b>Immatriculation : </b>".concat(t.carToAddV["immatriculation"],"<br>"),i+="<br><b>Date au parking : </b>".concat(t.carToAddV["dateparking"],"<br>"),i+="<br><b>Heure au parking : </b>".concat(t.carToAddV["heureparking"],"<br>"),s=t.$store.state.auth.user.mail,n=/\((.*)\)/gm,o=n.exec(t.carToAddV["contactinterne"])[1],console.log("Envoi au contact interne :",o),console.log("Envoi au utilisateur :",s),c={to:"pascal.deleray@cacem-mq.com,,parcauto@cacem.fr,alex.hibade@cacem-mq.com,admindsi@cacem-mq.com,".concat(s,",").concat(o),subject:"Nouveau Véhicule au Parking",message:"".concat(i)},e.next=33,t.sendMail(c);case 33:return t.$q.loading.hide(),t.showConfirm=!1,t.showSendMail=!0,e.next=38,t.refresh();case 38:t.showAddVehiculeParking=!1,t.immatriculation="";case 40:case"end":return e.stop()}}),e)})))()},getNbPassagers:function(t){return t&&Array.isArray(t)?t.length:0},getPassagers:function(t){for(var e=[],a=0;Array(t).length;a++){var r=t[a];e.push({nom:r.nom,prenom:r.prenom})}return console.log("Passagers :",e),e},deleteDemande:function(t,e){console.log("Demande parking à supprimer type :",t),this.demandeType=t,console.log("demande reelle à supprimer id :",this[t][e]._id),this.deleteCarId=this[t][e]._id,this.deleteObj=Object.assign({},this[t][e]),console.log("Demande parking à annuler :",this.deleteObj),this.showDelete=!0,this.deleteCar=this[t],this.deleteCarIndex=e},confirmDelete:function(){var t=this;return o()(regeneratorRuntime.mark((function e(){var a,r,i,s,n,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if("visiteursParking_en_attente"!=t.demandeType){e.next=9;break}return t.$q.loading.show({spinner:k["a"],spinnerColor:"red",message:"Chargement en cours..."}),a="db_regvisiteurs",r="dbf_accueil",e.next=6,t.deleteDatasForm({id:t.deleteObj._id,dbname:a,tablename:r});case 6:return e.next=8,t.refresh();case 8:t.$q.loading.hide();case 9:if("visiteursParking_au_parking"!=t.demandeType){e.next=20;break}return console.log("Au parking A supprimer :",t.deleteObj),t.$q.loading.show({spinner:k["a"],spinnerColor:"red",message:"Chargement en cours..."}),i="db_regvisiteurs",s="dbf_accueil",t.deleteObj.etat="attente",e.next=17,t.updateDatasForm({fields:t.deleteObj,dbname:i,tablename:s});case 17:return e.next=19,t.refresh();case 19:t.$q.loading.hide();case 20:if("visiteursParking_sortis"!=t.demandeType){e.next=33;break}return console.log("A supprimer :",t.deleteObj),t.$q.loading.show({spinner:k["a"],spinnerColor:"red",message:"Chargement en cours..."}),n="db_regvisiteurs",o="dbf_accueil",t.deleteObj.etat="efface",t.deleteObj.heuredelete=t.heuredujour,t.deleteObj.datedelete=t.datedujour,e.next=30,t.updateDatasForm({fields:t.deleteObj,dbname:n,tablename:o});case 30:return e.next=32,t.refresh();case 32:t.$q.loading.hide();case 33:t.showDelete=!1;case 34:case"end":return e.stop()}}),e)})))()},sortieParking:function(t,e){console.log("Demande parking à supprimer type :",t),this.demandeType=t,console.log("demande  à supprimer id :",this[t][e]._id),this.deleteCarId=this[t][e]._id,this.sortieObj=Object.assign({},this[t][e]),this.showSortie=!0,this.deleteCar=this[t],this.deleteCarIndex=e},confirmSortie:function(){var t=this;return o()(regeneratorRuntime.mark((function e(){var a,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if("visiteursParking_au_parking"!=t.demandeType){e.next=13;break}return console.log("A sortir du parking :",t.sortieObj),t.sortieObj.etat="sortie",t.sortieObj.heuresortie=t.heuredujour,t.sortieObj.datesortie=t.datedujour,t.$q.loading.show({spinner:k["a"],spinnerColor:"red",message:"Chargement en cours..."}),a="db_regvisiteurs",r="dbf_accueil",e.next=10,t.updateDatasForm({fields:t.sortieObj,dbname:a,tablename:r});case 10:return e.next=12,t.refresh();case 12:t.$q.loading.hide();case 13:t.showSortie=!1;case 14:case"end":return e.stop()}}),e)})))()},showDiagDetail:function(t){this.currentDemande=Object.assign({},t),this.showDetails=!0},showDiagVehicule:function(t){this.currentDemande=Object.assign({},t),this.showAddVehiculeParking=!0},showDiagPassagers:function(t){this.currentPassagers=Object.assign({},t),this.showPassagers=!0},editFormDatas:function(t){console.log("Données à modifier :",t),this.showDetails=!1},refresh:function(t){var e=this;return o()(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return e.$q.loading.show({spinner:k["a"],spinnerColor:"red",message:"Chargement en cours..."}),a.next=3,e.getAllVisiteurs();case 3:e.customFilter=e.filterArray(e.vParking,e.filters),e.$q.loading.hide();try{t()}catch(r){}case 6:case"end":return a.stop()}}),a)})))()},toggle:function(){var t=e.target;this.$q.fullscreen.toggle(t).then((function(){}))["catch"]((function(t){alert(t)}))},filtreDateDuJour:function(){this.searchValue="",this.filters["datevisite"]=this.whereDateDuJour(this.datedujour),this.customFilter=this.filterArray(this.vParking,this.filters),console.log("Filtres ".concat(this.datedujour,":"),this.filters),this.isFilterDatejour=!0,this.isFilterDateAll=!1},filtreDateAll:function(){this.searchValue="",this.filters["datevisite"]="",this.customFilter=this.filterArray(this.vParking,this.filters),console.log("Filtres tout :",this.filters),this.isFilterDateAll=!0,this.isFilterDatejour=!1}}),mount:function(){var t=this;return o()(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:console.log("Les visiteurs parking:",t.visiteursParking),console.log("Search value :",t.searchValue);case 2:case"end":return e.stop()}}),e)})))()},beforeMount:function(){var t=this;return o()(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.$q.loading.show({spinner:k["a"],spinnerColor:"red",message:"Chargement en cours..."}),e.next=3,t.getAllVisiteurs();case 3:t.filters["datevisite"]=t.whereDateDuJour(t.datedujour),t.customFilter=t.filterArray(t.vParking,t.filters),console.log("Filtres :",t.filters),t.datevisiteFiltre=Object.keys(t.filters).includes("datevisite"),console.log("Filters properties :",t.datevisiteFiltre),console.log("Filtre custom result :",t.customFilter),t.isFilterDatejour=!0,t.$q.loading.hide();case 11:case"end":return e.stop()}}),e)})))()}},D=A,P=(r("14a2"),r("2877")),j=r("9989"),O=r("59d7"),S=r("9c40"),F=r("f20b"),V=r("1c1c"),T=r("66e5"),N=r("4074"),I=r("0016"),R=r("8f8e"),$=r("0170"),M=r("27f9"),Q=r("cb32"),J=r("4e73"),L=r("f09f"),E=r("65c6"),X=r("eb85"),z=r("6ac5"),B=r("a370"),G=r("4b7e"),K=r("05c0"),U=r("b0476"),Y=r("58a81"),H=r("2c91"),Z=r("24e8"),W=r("0378"),tt=r("068f"),et=r("714f"),at=r("7f67"),rt=r("eebe"),it=r.n(rt),st=Object(P["a"])(D,i,s,!1,null,"499d735c",null);a["default"]=st.exports;it()(st,"components",{QPage:j["a"],QPullToRefresh:O["a"],QBtn:S["a"],QBtnDropdown:F["a"],QList:V["a"],QItem:T["a"],QItemSection:N["a"],QIcon:I["a"],QCheckbox:R["a"],QItemLabel:$["a"],QInput:M["a"],QAvatar:Q["a"],QMenu:J["a"],QCard:L["a"],QToolbar:E["a"],QSeparator:X["a"],QToolbarTitle:z["a"],QCardSection:B["a"],QCardActions:G["a"],QTooltip:K["a"],QChip:U["a"],QBadge:Y["a"],QSpace:H["a"],QDialog:Z["a"],QForm:W["a"],QImg:tt["a"]}),it()(st,"directives",{Ripple:et["a"],ClosePopup:at["a"]})},c457:function(t,e,a){},ec0d:function(t,e,a){t.exports=a.p+"img/cacem.e92d40b2.png"}}]);