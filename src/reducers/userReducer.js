import {
    START_USER_START,
    START_USER_FINISH
  } from "../actionconstant";
  const user={ 
    data: []
  };
  export default (state = user, action) => {
    switch (action.type) {
      case START_USER_START:
        return { ...state, data: []};
      case START_USER_FINISH:
        return {
          ...state,
          data: action.data
        };
      default:
        return state;
    }
  };
  