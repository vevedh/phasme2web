(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([[16],{"77bc":function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("q-page",{staticClass:"flex flex-center"},[n("div",{class:e.$q.dark.isActive?"dark_gradient":"normal_gradient",attrs:{id:"particles-js"}}),n("div",{staticClass:"column full-width justify-center full-height"},[n("div",{staticClass:"row full-width  full-height justify-center"},[n("q-card",{staticClass:"login-form",style:e.$q.platform.is.mobile?{width:"95%"}:{width:"95%",height:e.$q.screen.height-150+"px"}},[n("q-card-section",{staticClass:"row q-gutter-md q-pa-none "},[n("q-btn",{attrs:{color:"white","text-color":"black",icon:"home","no-caps":"",label:"Retour",to:{path:"nouveau",query:{type:"accueil"}}}}),n("q-file",{staticClass:"bg-white q-px-sm",staticStyle:{width:"100%","max-width":"320px"},attrs:{label:"Choisissez un fichier modèle docx",borderer:"",dense:"",filled:"",accept:".docx, application/*"},on:{input:e.convertAndDownload},scopedSlots:e._u([{key:"prepend",fn:function(){return[n("q-icon",{attrs:{name:"attach_file"}})]},proxy:!0}])},[n("q-tooltip",{attrs:{"content-class":"bg-white text-dark","content-style":"font-size: 1.2em"}},[n("div",[e._v('\n                  Sélectionner un fichier .docx , tous les noms "{nom colonne}" '),n("br"),e._v("\n                  seront remplacés par les données de la ligne sélectionnée "),n("br"),e._v("\n                  le document ainsi généré peut etre imprimé ou envoyé par mail\n                ")]),n("div",[e._v("Exemple :")]),n("div",[n("q-img",{attrs:{src:"CACEM Registre visiteurs.png"}})],1)])],1)],1),n("q-card-section",{staticClass:"q-pa-none full-height",staticStyle:{height:"100%","max-height":"100%"}},[n("FVvTable",{ref:"myTable",style:e.$q.platform.is.mobile?{width:"95%"}:{width:"100%"},attrs:{dbname:e.dbname,dbtype:"db_regvisiteurs",editable:!0,useAdmin:!0},on:{"row-click":e.onRowClick}})],1)],1)],1)])])},i=[],o=n("ed09"),s=n("2f62"),r=n("fbf9"),l=n.n(r),c=n("547c"),d=n.n(c),u=(n("fdb1"),n("21a6")),p=n("985a"),m=Object(o["d"])({name:"PageDonnees",components:{FVvTable:p["a"]},data(){return{dbname:"",selectedRow:{}}},computed:{...Object(s["e"])("auth",{currentUsername:e=>e.user.displayName}),displayName(){return this.currentUsername},othersMenu(){return this.plusMenu},docDatas(){return this.selectedRow}},methods:{...Object(s["c"])("admin",["getAllUsers"]),onRowClick(e,t){this.selectedRow=Object.assign({},t),console.log("row :",this.selectedRow),console.log("row :",t)},convertAndDownload(e){console.log(this.$refs);const t=Object.assign({},this.docDatas);var n=new FileReader;n.readAsBinaryString(e),n.onerror=function(e){console.log("Erreur de lecture du fichier docx",e),this.$q.notify({message:"error reading file"+e})},n.onload=function(e){const n=e.target.result;var a=new d.a(n);const i=new l.a(a,{paragraphLoop:!0,linebreaks:!0});console.log(t),i.render(t);const o=i.getZip().generate({type:"blob",mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});Object(u["saveAs"])(o,"output.docx")}}},beforeMount(){console.log("Données du formulaire :",this.$route.query.type),this.currentFormName=this.$route.query.type,""!=this.$route.query.type?this.dbname="dbf_"+this.currentFormName:this.dbname="dbf_vide"},async mounted(){particlesJS("particles-js",{particles:{number:{value:80,density:{enable:!0,value_area:800}},color:{value:"#ffffff"},shape:{type:"circle",stroke:{width:0,color:"#000000"},polygon:{nb_sides:5},image:{src:"img/github.svg",width:100,height:100}},opacity:{value:.5,random:!1,anim:{enable:!1,speed:1,opacity_min:.1,sync:!1}},size:{value:3,random:!0,anim:{enable:!1,speed:40,size_min:.1,sync:!1}},line_linked:{enable:!0,distance:150,color:"#ffffff",opacity:.4,width:1},move:{enable:!0,speed:6,direction:"none",random:!1,straight:!1,out_mode:"out",bounce:!1,attract:{enable:!1,rotateX:600,rotateY:1200}}},interactivity:{detect_on:"canvas",events:{onhover:{enable:!0,mode:"grab"},onclick:{enable:!0,mode:"push"},resize:!0},modes:{grab:{distance:140,line_linked:{opacity:1}},bubble:{distance:400,size:40,duration:2,opacity:8,speed:3},repulse:{distance:200,duration:.4},push:{particles_nb:4},remove:{particles_nb:2}}},retina_detect:!0}),await this.getAllUsers()}}),h=m,b=n("2877"),f=n("9989"),g=n("f09f"),v=n("a370"),y=n("9c40"),w=n("7d53"),_=n("0016"),q=n("05c0"),x=n("068f"),k=n("eebe"),C=n.n(k),j=Object(b["a"])(h,a,i,!1,null,null,null);t["default"]=j.exports;C()(j,"components",{QPage:f["a"],QCard:g["a"],QCardSection:v["a"],QBtn:y["a"],QFile:w["a"],QIcon:_["a"],QTooltip:q["a"],QImg:x["a"]})}}]);