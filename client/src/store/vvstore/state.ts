

export interface VvStoreStateInterface {
  layoutNeeded: Boolean,
  isLoginPage: Boolean,
  mobileMode: Boolean,
  menuCollapse: Boolean,
  posts:Array<any> | Object,
  database: String,
  query: Array<any> | Object,
  queryresult: Array<any> | Object,
  lastresult: Array<any> | Object,
  tables: Array<{ dbType: string; dbName: string; datas: any }>;
}

function state (): VvStoreStateInterface {



  return {
    layoutNeeded: true,
  isLoginPage: false,
  mobileMode: false,
  menuCollapse: true,

  posts: [],
    database: '',
    query: '',
    queryresult: '',
    lastresult: '',
    tables: [{
      dbType: '',
      dbName: '',
      datas: '',

    }]
  };
}

export default state;



