(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([[14],{"4c4e":function(e,t,n){"use strict";n("97dd")},6015:function(e,t,n){"use strict";n.r(t);var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("q-layout",[n("div",{class:e.$q.dark.isActive?"dark_gradient":"normal_gradient",attrs:{id:"particles-js"}}),n("q-page-container",{staticClass:"flex flex-top q-pt-xs"},[n("router-view")],1)],1)},s=[],r=n("c973"),c=n.n(r),a=n("ded3"),o=n.n(a),l=(n("96cf"),n("caad"),n("2532"),n("ed09")),u=n("2f62"),d=Object(l["d"])({name:"Empty",computed:o()(o()(o()({},Object(u["d"])("adinfos",{isAdmin:function(e){return e.isAdmin},isSiteAdmin:function(e){return e.isSiteAdmin},grpUser:function(e){return e.userGrpes},users:function(e){return e.users}})),Object(u["d"])("SimplyDesk",{symUsers:function(e){return e.users},symOpenTickets:function(e){return e.openTickets},symClosedTickets:function(e){return e.closedTickets}})),{},{allowRegistre:function(){return!!this.grpUser&&this.grpUser.includes("Application WEB REGISTRE")},sOpenTickets:function(){if(this.symOpenTickets)return this.symOpenTickets.length},sClosedTickets:function(){if(this.symClosedTickets)return this.symClosedTickets.length},showDev:function(){return!1}}),methods:o()({},Object(u["b"])("SimplyDesk",["getSimplyUsers","getSimplyServices","getSimplyAgents","getSimplyIncidents","getSimplyTypes","getSimplyTickets","getSimplyCategories","getSimplyOpenTickets","getSimplyClosedTickets"])),mounted:function(){var e=this;return c()(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return particlesJS("particles-js",{particles:{number:{value:160,density:{enable:!0,value_area:800}},color:{value:"#ffffff"},shape:{type:"circle",stroke:{width:0,color:"#000000"},polygon:{nb_sides:5},image:{src:"img/github.svg",width:100,height:100}},opacity:{value:1,random:!0,anim:{enable:!0,speed:1,opacity_min:0,sync:!1}},size:{value:3,random:!0,anim:{enable:!1,speed:4,size_min:.3,sync:!1}},line_linked:{enable:!1,distance:150,color:"#ffffff",opacity:.4,width:1},move:{enable:!0,speed:1,direction:"none",random:!0,straight:!1,out_mode:"out",bounce:!1,attract:{enable:!1,rotateX:600,rotateY:600}}},interactivity:{detect_on:"canvas",events:{onhover:{enable:!0,mode:"bubble"},onclick:{enable:!0,mode:"repulse"},resize:!0},modes:{grab:{distance:400,line_linked:{opacity:1}},bubble:{distance:250,size:0,duration:2,opacity:0,speed:5},repulse:{distance:400,duration:.4},push:{particles_nb:4},remove:{particles_nb:2}}},retina_detect:!0}),t.next=3,e.$store.dispatch("adinfos/getRole",e.$store.state.auth.user);case 3:return t.next=5,e.$store.dispatch("adinfos/getSiteRole");case 5:console.log("Path :",e.$router.currentRoute.path),e.$q.fullscreen.request().then((function(){console.log("Plein ecran")}))["catch"]((function(e){}));case 7:case"end":return t.stop()}}),t)})))()}}),p=d,m=(n("4c4e"),n("2877")),f=n("4d5a"),g=n("09e3"),h=n("eebe"),y=n.n(h),b=Object(m["a"])(p,i,s,!1,null,null,null);t["default"]=b.exports;y()(b,"components",{QLayout:f["a"],QPageContainer:g["a"]})},"97dd":function(e,t,n){}}]);