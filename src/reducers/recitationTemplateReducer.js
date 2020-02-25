import {
    START_RECITATION_TEMPLATE_START,
    START_RECITATION_TEMPLATE_FINISH
  } from "../actionconstant";
  const recitationTemplate = {
    data: []
  };
  export default (state = recitationTemplate, action) => {
    switch (action.type) {
      case START_RECITATION_TEMPLATE_START:
        return { ...state, data: [] };
      case START_RECITATION_TEMPLATE_FINISH:
        return {
          ...state,
          data: action.data
        };
      default:
        return state;
    }
  };
  