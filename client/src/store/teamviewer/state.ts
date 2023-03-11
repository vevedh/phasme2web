export interface TeamViewerStateInterface {
  users: Array<any>;
}

function state(): TeamViewerStateInterface {
  return {
    users: [],
  };
}

export default state;
