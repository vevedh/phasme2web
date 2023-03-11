
export interface adInfosStateInterface {
  bases: [],
  isAdmin: boolean,
  currentDb:String,
  isSiteAdmin: boolean,
  currentTables:[],
  currentDatas:[],
  siteRole: String,
  users:[],
  userGrpes:[]
}

function state (): adInfosStateInterface {
  return {
    bases: [],
    isAdmin: false,
    currentDb:'',
    isSiteAdmin: false,
    siteRole: 'invite',
    currentTables:[],
    currentDatas:[],
    users:[],
    userGrpes:[]
  };
}

export default state;
