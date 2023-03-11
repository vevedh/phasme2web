export interface AdminStateInterface {
  title: string;
  config: {};
  leftMenu: boolean;
  mailsend: boolean;
  visiteurs: Array<any>;
  visiteursParking: Array<any>;
  utilisateurs: Array<any>;
  status: Array<any>;
  motifs: Array<any>;
  etages: Array<any>;
  contacts: Array<any>;
  pcs: Array<any>;
  ous: Array<any>;
  chgaccueils: Array<any>;
  savedform:{};
  getform: Array<any>;
  allForms: Array<any>;
  ftemplates: Array<any>;
  template: {},
  applinks: Array<any>;
}

function state (): AdminStateInterface {
  return {
    title: 'default title',
    config: {},
    leftMenu: false,
    mailsend: false,
    visiteurs: [],
    visiteursParking: [],
    utilisateurs: [],
    status: [],
    motifs: [],
    etages: [],
    contacts: [],
    pcs:[],
    ous:[],
    chgaccueils: [],
    savedform: {},
    getform:[],
    allForms:[],
    ftemplates:[],
    template:{},
    applinks: []
  };
}

export default state;
