(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([[13],{d8de:function(e,t,i){"use strict";i.r(t);var s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("q-page",{staticClass:"flex flex-center"},[i("transition",{attrs:{appear:"","enter-active-class":"animated  fadeIn","leave-active-class":"animated  fadeOut"}},[i("q-card",{ref:"refApps",staticClass:"apps-form",style:e.$q.platform.is.mobile?{width:"90%",height:"75%"}:{width:"75%",height:"75%"},attrs:{"transition-show":"jump-down","transition-hide":"jump-up"}},[i("q-card-section",{staticClass:"q-pa-none",attrs:{round:""}},[i("div",{staticClass:"row items-center q-py-sm text-bold bg-amber-6"},[i("div",{staticClass:"col"},[i("div",{staticClass:"row  justify-start q-px-sm"},[e.isAdmin?i("q-btn",{staticClass:"shadow-6",attrs:{glossy:"",icon:"add",color:"white","text-color":"dark",round:"",dense:""},on:{click:function(t){return e.testAddAppLink()}}}):e._e()],1)]),i("div",{staticClass:"col items-center text-center no-wrap"},[i("span",[e._v(" Applications CACEM ")])]),i("div",{staticClass:"col"},[i("div",{staticClass:"row  justify-end q-pr-sm"},[i("q-btn",{attrs:{dense:"",icon:"home",label:"Accueil",glossy:"",color:"white","text-color":"dark",to:"/"}})],1)])])]),i("q-card-section",[i("div",{staticClass:"row items-start q-gutter-md full-width full-height"},e._l(e.appLinks,(function(t){return i("q-card",{key:"card_"+t._id,staticClass:"my-card shadow-6",attrs:{bordered:""}},[i("q-card-section",{staticClass:"bg-primary text-white q-py-xs"},[i("div",{staticClass:"text-subtitle1"},[e._v(e._s(t.nom))])]),i("q-separator"),i("q-card-section",{attrs:{align:"center"}},[i("div",{staticClass:"col"},[i("div",{staticClass:"row justify-center"},[i("q-btn",{attrs:{round:"",type:"a",href:t.url,target:"_blank"}},[""==t.img?i("q-avatar",{staticClass:"shadow-8",attrs:{icon:"home",size:"100px"}}):e._e(),""!=t.img?i("q-avatar",{staticClass:"shadow-8",attrs:{icon:"img:"+t.img,size:"100px"}}):e._e()],1)],1)])]),i("q-card-actions",{attrs:{align:"right"}},[e.isAdmin?i("q-btn",{attrs:{dense:"",glossy:"",color:"primary"},on:{click:function(i){return e.editAppLink(t)}}},[e._v("Modifier..")]):e._e()],1)],1)})),1)])],1)],1)],1)},a=[],n=i("2f62"),o=i("ed09"),l=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("q-dialog",{ref:"dialog",on:{hide:e.onDialogHide}},[i("q-card",[i("q-card-section",{staticClass:"row no-wrap justify-center items-center q-py-xs  bg-primary text-white",attrs:{dense:""}},[i("div",{staticClass:"text-h6 full-width"},[e._v(e._s(e.labelAction))]),i("q-space"),i("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{icon:"close",flat:"",round:"",dense:""}})],1),i("q-card-section",[i("f-vv-form",{ref:"form",attrs:{fields:e.fields,edit:!1,readOnly:!1,fieldsModel:e.fieldsModel}})],1),i("q-card-actions",{attrs:{align:"right"}},[i("q-btn",{attrs:{color:"negative",label:"Annuler"},on:{click:e.onCancelClick}}),i("q-btn",{attrs:{color:"primary",label:"Valider"},on:{click:e.onOKClick}})],1)],1)],1)},r=[],d=i("7596"),c=function(e,t,i,s){function a(e){return e instanceof i?e:new i((function(t){t(e)}))}return new(i||(i=Promise))((function(i,n){function o(e){try{r(s.next(e))}catch(t){n(t)}}function l(e){try{r(s["throw"](e))}catch(t){n(t)}}function r(e){e.done?i(e.value):a(e.value).then(o,l)}r((s=s.apply(e,t||[])).next())}))},p=Object(o["d"])({name:"AddAppLink",components:{FVvForm:d["a"]},data(){return{model:{},formFields:Array||{}}},props:{fields:{type:Array},fieldsModel:{type:Object||null},id:{type:String||null},labelAction:{type:String,required:!1}},mounted(){this.model=Object.assign({},this.fieldsModel)},methods:{show(){this.$refs.dialog.show()},hide(){this.$refs.dialog.hide()},onDialogHide(){this.$emit("hide")},onInput(e){console.log("Model :",e)},onOKClick(){return c(this,void 0,void 0,(function*(){let e=yield this.$refs.form.$refs.myForm.validate();if(e){console.log("Save :",this.$refs.form.model,this.id);let e=Object.assign({},this.$refs.form.model),t=this.id,i=Object.assign({},Object.assign({_id:t},e));this.$emit("ok",{result:i}),this.hide()}else this.$q.notify({message:"Vous devez remplir tous les champs obligatoires",color:"negative"})}))},onCancelClick(){this.hide()}},watch:{model:{handler(e){console.log("Model :",e,this.id)}}}}),u=p,m=i("2877"),h=i("24e8"),f=i("f09f"),g=i("a370"),b=i("2c91"),q=i("9c40"),y=i("4b7e"),A=i("7f67"),C=i("eebe"),v=i.n(C),w=Object(m["a"])(u,l,r,!1,null,null,null),k=w.exports;v()(w,"components",{QDialog:h["a"],QCard:f["a"],QCardSection:g["a"],QSpace:b["a"],QBtn:q["a"],QCardActions:y["a"]}),v()(w,"directives",{ClosePopup:A["a"]});var x=Object(o["d"])({name:"AppsPage",components:{AddAppLink:k},computed:{...Object(n["e"])("adinfos",{isAdmin:e=>e.isAdmin,isSiteAdmin:e=>e.isSiteAdmin,users:e=>e.users}),...Object(n["e"])("admin",{appLinks:e=>e.applinks})},methods:{...Object(n["c"])("adinfos",["getRole","getAllUsers"]),...Object(n["c"])("admin",["getAllAppLinks","addAppLink","updateAppLink"]),flip(e){this.showBtnAccueil=e},async testAddAppLink(){this.$q.dialog({component:k,parent:this,width:"20%",fields:[{id:"nom",type:"text",span:12,label:"Nom de l'application ",required:!1,options:{filled:!0,rules:[e=>e&&e.length>0||"Nom obligatoire"]}},{id:"desc",span:12,type:"textarea",label:"Description ",required:!1,options:{filled:!0}},{id:"img",span:4,type:"file",label:"Fichier image",description:"Image icon",required:!1,options:{}},{id:"url",span:8,type:"text",label:"Lien ",required:!1,options:{filled:!0,rules:[e=>e&&e.length>0||"Lien obligatoire"]}}],fieldsModel:{nom:"",desc:"",img:"",url:""},labelAction:"Ajouter"}).onOk((async e=>{console.log("OK :",e.result),await this.addAppLink(e.result)})).onCancel((()=>{console.log("Cancel")})).onDismiss((()=>{console.log("Called on OK or Cancel")}))},async editAppLink(e){this.$q.dialog({component:k,parent:this,width:"20%",fields:[{id:"nom",type:"text",span:12,label:"Nom de l'application ",required:!1,options:{filled:!0,rules:[e=>e&&e.length>0||"Nom obligatoire"]}},{id:"desc",span:12,type:"textarea",label:"Description ",required:!1,options:{filled:!0}},{id:"img",span:4,type:"file",label:"Fichier image",description:"Image icon",required:!1,options:{}},{id:"url",span:8,type:"text",label:"Lien ",required:!1,options:{filled:!0,rules:[e=>e&&e.length>0||"Lien obligatoire"]}}],fieldsModel:e,id:e._id,labelAction:"Modifier"}).onOk((async e=>{console.log("OK :",e.result),await this.updateAppLink(e.result)})).onCancel((()=>{console.log("Cancel")})).onDismiss((()=>{console.log("Called on OK or Cancel")}))}},async mounted(){await this.getAllAppLinks(),console.log("App links :",this.appLinks)}}),O=x,j=i("9989"),_=i("eb85"),L=i("cb32"),$=Object(m["a"])(O,s,a,!1,null,null,null);t["default"]=$.exports;v()($,"components",{QPage:j["a"],QCard:f["a"],QCardSection:g["a"],QBtn:q["a"],QSeparator:_["a"],QAvatar:L["a"],QCardActions:y["a"]})}}]);