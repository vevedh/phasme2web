(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([[2],{"4a3f":function(t,e,n){},"98aa":function(t,e,n){"use strict";n.r(e);var s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("q-layout",[n("q-header",[n("div",{staticClass:"absolute-top-right q-gutter-sm row q-pt-md"},[t.showDev?n("span",{staticClass:"q-pa-md"},[n("div",{staticClass:"q-text-bold"},[t._v("***DEVELOPPEMENT***")])]):t._e(),"/"!=t.$router.currentRoute.path?n("q-btn",{ref:"btnAccHome",attrs:{color:"white",flat:"",round:"",icon:"home",to:"/"}},[n("q-tooltip",{attrs:{"content-class":"bg-amber text-black","content-style":"font-size: 16px",anchor:"bottom middle"}},[t._v("\n          Accueil\n        ")])],1):t._e(),n("q-btn",{ref:"btnAccHome",attrs:{color:"white",flat:"",round:"",icon:"person",to:"/user/profil"}},[n("q-tooltip",{attrs:{"content-class":"bg-amber text-black","content-style":"font-size: 16px",anchor:"bottom middle"}},[t._v("\n          Accueil utilisateur ...\n        ")])],1),n("q-btn",{ref:"btnactu",attrs:{color:"white",flat:"",round:"",to:"/actus",icon:"newspaper"}},[n("q-tooltip",{attrs:{"content-class":"bg-amber text-black","content-style":"font-size: 16px",anchor:"bottom middle"}},[t._v("\n          Actualités\n        ")])],1),n("q-btn",{ref:"btnAccCams",attrs:{color:"white",flat:"",round:"",icon:"assignment",to:"/formulaires"}},[n("q-tooltip",{attrs:{"content-class":"bg-amber text-black","content-style":"font-size: 16px",anchor:"bottom middle"}},[t._v("\n          Créer un formulaire ...\n        ")])],1),t.isAdmin?n("q-btn",{ref:"btnDbs",attrs:{size:"0.7em",color:"white",flat:"",round:"",icon:"fas fa-database",to:"/admin/main"}},[n("q-tooltip",{attrs:{"content-class":"bg-amber text-black","content-style":"font-size: 16px",anchor:"bottom middle"}},[t._v("\n          Bases/Tables ...\n        ")])],1):t._e(),t.isAdmin?n("q-btn",{ref:"btnUsers",attrs:{size:"0.7em",color:"white",flat:"",round:"",icon:"fas fa-users",to:"/padusers"}},[n("q-tooltip",{attrs:{"content-class":"bg-amber text-black","content-style":"font-size: 16px",anchor:"bottom middle"}},[t._v("\n          Admin DSI ...\n        ")])],1):t._e(),t.isAdmin?n("q-btn",{ref:"btnPrint",attrs:{color:"white",flat:"",round:"",icon:"print",to:"/admin/imprimantes"}},[n("q-tooltip",{attrs:{"content-class":"bg-amber text-black","content-style":"font-size: 16px",anchor:"bottom middle"}},[t._v("\n          Les Imprimantes ...\n        ")])],1):t._e(),t.isAdmin?n("q-btn",{ref:"btnSmart",attrs:{color:"white",flat:"",round:"",icon:"smartphone",to:"/smartphones"}},[n("q-tooltip",{attrs:{"content-class":"bg-amber text-black","content-style":"font-size: 16px",anchor:"bottom middle"}},[t._v("\n          Les Smartphones ...\n        ")])],1):t._e(),n("q-btn",{ref:"btnApps",attrs:{color:"white",flat:"",round:"",icon:"apps",to:"/applications"}},[n("q-tooltip",{attrs:{"content-class":"bg-white text-black text-caption shadow-8"}},[t._v("\n          Les applications CACEM\n        ")])],1),t.isAdmin?n("q-btn",{attrs:{dense:"",color:"white",flat:"",round:"",icon:"notifications",type:"a",href:"http://svrsimplydesk:7000/IncidentManagement/Ticket",target:"_blank"}},[n("q-badge",{attrs:{color:"yellow","text-color":"black",label:t.symOpenTickets?t.sOpenTickets:0,dense:"",floating:"",transparent:""}})],1):t._e(),n("q-btn",{attrs:{color:"white",flat:"",round:"",icon:t.$q.dark.isActive?"nights_stay":"wb_sunny"},on:{click:function(e){return t.$q.dark.toggle()}}})],1)]),n("div",{class:t.$q.dark.isActive?"dark_gradient":"normal_gradient",attrs:{id:"particles-js"}}),n("q-page-container",{staticClass:"flex flex-top q-pt-xl"},[n("router-view")],1)],1)},i=[],o=n("c973"),a=n.n(o),r=n("ded3"),c=n.n(r),l=(n("96cf"),n("caad"),n("2532"),n("ed09")),p=n("2f62"),d=Object(l["d"])({name:"Empty",data:function(){return{}},computed:c()(c()(c()({},Object(p["d"])("adinfos",{isAdmin:function(t){return t.isAdmin},isSiteAdmin:function(t){return t.isSiteAdmin},grpUser:function(t){return t.userGrpes},users:function(t){return t.users}})),Object(p["d"])("SimplyDesk",{symUsers:function(t){return t.users},symOpenTickets:function(t){return t.openTickets},symClosedTickets:function(t){return t.closedTickets}})),{},{allowRegistre:function(){return!!this.grpUser&&this.grpUser.includes("Application WEB REGISTRE")},allowParking:function(){return!!this.grpUser&&this.grpUser.includes("WebApps - ADM PARKING")},sOpenTickets:function(){if(this.symOpenTickets)return this.symOpenTickets.length},sClosedTickets:function(){if(this.symClosedTickets)return this.symClosedTickets.length},showDev:function(){return!1}}),methods:c()(c()({},Object(p["b"])("adinofs",["getRole"])),Object(p["b"])("SimplyDesk",["getSimplyUsers","getSimplyServices","getSimplyAgents","getSimplyIncidents","getSimplyTypes","getSimplyTickets","getSimplyCategories","getSimplyOpenTickets","getSimplyClosedTickets"])),mounted:function(){var t=this;return a()(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return particlesJS("particles-js",{particles:{number:{value:160,density:{enable:!0,value_area:800}},color:{value:"#ffffff"},shape:{type:"circle",stroke:{width:0,color:"#000000"},polygon:{nb_sides:5},image:{src:"img/github.svg",width:100,height:100}},opacity:{value:1,random:!0,anim:{enable:!0,speed:1,opacity_min:0,sync:!1}},size:{value:3,random:!0,anim:{enable:!1,speed:4,size_min:.3,sync:!1}},line_linked:{enable:!1,distance:150,color:"#ffffff",opacity:.4,width:1},move:{enable:!0,speed:1,direction:"none",random:!0,straight:!1,out_mode:"out",bounce:!1,attract:{enable:!1,rotateX:600,rotateY:600}}},interactivity:{detect_on:"canvas",events:{onhover:{enable:!0,mode:"bubble"},onclick:{enable:!0,mode:"repulse"},resize:!0},modes:{grab:{distance:400,line_linked:{opacity:1}},bubble:{distance:250,size:0,duration:2,opacity:0,speed:5},repulse:{distance:400,duration:.4},push:{particles_nb:4},remove:{particles_nb:2}}},retina_detect:!0}),e.next=3,t.getRole();case 3:return e.next=5,t.getSimplyOpenTickets();case 5:return e.next=7,t.getSimplyClosedTickets();case 7:console.log("Path :",t.$router.currentRoute.path);case 8:case"end":return e.stop()}}),e)})))()}}),u=d,m=(n("f531"),n("2877")),b=n("4d5a"),f=n("e359"),h=n("9c40"),g=n("05c0"),y=n("58a81"),k=n("09e3"),v=n("eebe"),_=n.n(v),q=Object(m["a"])(u,s,i,!1,null,null,null);e["default"]=q.exports;_()(q,"components",{QLayout:b["a"],QHeader:f["a"],QBtn:h["a"],QTooltip:g["a"],QBadge:y["a"],QPageContainer:k["a"]})},f531:function(t,e,n){"use strict";n("4a3f")}}]);