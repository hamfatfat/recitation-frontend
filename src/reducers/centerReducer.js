import {
    START_CENTER_START,
    START_CENTER_FINISH
  } from "../actionconstant";
  const center = {
    data: [],
    dataLoaded: false
  };
  export default (state = center, action) => {
    switch (action.type) {
      case START_CENTER_START:
        return { ...state, data: [], dataLoaded: action.dataLoaded };
      case START_CENTER_FINISH:
        return {
          ...state,
          data: action.data, dataLoaded: action.dataLoaded
        };
      default:
        return state;
    }
  };
  