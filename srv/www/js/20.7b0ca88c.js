(this["webpackJsonp"]=this["webpackJsonp"]||[]).push([[20],{f0bf:function(e,t,i){"use strict";i.r(t);var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("q-page",{staticClass:"fit row items-center justify-center q-pa-md q-pt-md"},[i("div",{staticClass:"column justify-center self-center",staticStyle:{width:"75%"}},[i("div",{staticClass:"row justify-center self-center rounded-borders q-pa-xs q-ma-sm",staticStyle:{width:"200px"}},[i("q-img",{staticClass:"rounded-borders",attrs:{src:e.url,"spinner-color":"white"}})],1),i("div",{staticClass:"row justify-center text-center text-white q-py-none"},[i("h3",[e._v("Actualités de la DSI")])]),i("div",{staticClass:"row justify-center q-px-md full-width"},[i("q-carousel",{staticClass:"rounded-borders full-width",attrs:{animated:"",navigation:"",infinite:"",autoplay:e.autoplay,arrows:"","transition-prev":"slide-right","transition-next":"slide-left"},on:{mouseenter:function(t){e.autoplay=!1},mouseleave:function(t){e.autoplay=!0}},model:{value:e.slide,callback:function(t){e.slide=t},expression:"slide"}},e._l(e.actus,(function(t,n){return i("q-carousel-slide",{key:"slide_"+n,staticClass:"column no-wrap flex-center self-start items-start q-pt-none",attrs:{name:n}},[i("q-icon",{attrs:{name:t.icon,size:"56px"}}),i("div",{staticClass:"q-mt-md text-center"},[i("q-editor",{staticClass:"no-border",attrs:{dense:e.$q.screen.lt.md,toolbar:e.isAdmin?[[{label:e.$q.lang.editor.align,icon:e.$q.iconSet.editor.align,fixedLabel:!0,list:"only-icons",options:["left","center","right","justify"]}],["bold","italic","strike","underline","subscript","superscript"],["token","hr","link","custom_btn"],["print","fullscreen"],[{label:e.$q.lang.editor.formatting,icon:e.$q.iconSet.editor.formatting,list:"no-icons",options:["p","h1","h2","h3","h4","h5","h6","code"]},{label:e.$q.lang.editor.fontSize,icon:e.$q.iconSet.editor.fontSize,fixedLabel:!0,fixedIcon:!0,list:"no-icons",options:["size-1","size-2","size-3","size-4","size-5","size-6","size-7"]},{label:e.$q.lang.editor.defaultFont,icon:e.$q.iconSet.editor.font,fixedIcon:!0,list:"no-icons",options:["default_font","arial","arial_black","comic_sans","courier_new","impact","lucida_grande","times_new_roman","verdana"]},"removeFormat"],["quote","unordered","ordered","outdent","indent"],["undo","redo"],["viewsource"]]:[],fonts:{arial:"Arial",arial_black:"Arial Black",comic_sans:"Comic Sans MS",courier_new:"Courier New",impact:"Impact",lucida_grande:"Lucida Grande",times_new_roman:"Times New Roman",verdana:"Verdana"}},model:{value:t.detail,callback:function(i){e.$set(t,"detail",i)},expression:"info.detail"}})],1)],1)})),1)],1)])])},s=[],a=i("ded3"),o=i.n(a),r=i("2f62"),l={data:function(){return{slide:1,autoplay:!0,url:"cacem.png",linfos:[{icon:"home",detail:"info 1"},{icon:"unsubscribe",detail:"info 2"},{icon:"feed",detail:"info 3"}]}},computed:o()(o()({},Object(r["d"])("adinfos",{isAdmin:function(e){return e.isAdmin},isSiteAdmin:function(e){return e.isSiteAdmin},users:function(e){return e.users}})),{},{actus:function(){return this.linfos}}),methods:{}},c=l,d=i("2877"),u=i("9989"),f=i("068f"),m=i("880c"),p=i("62cd"),b=i("0016"),q=i("d66b"),h=i("eebe"),w=i.n(h),_=Object(d["a"])(c,n,s,!1,null,null,null);t["default"]=_.exports;w()(_,"components",{QPage:u["a"],QImg:f["a"],QCarousel:m["a"],QCarouselSlide:p["a"],QIcon:b["a"],QEditor:q["a"]})}}]);