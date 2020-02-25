import { START_REVISION_START, START_REVISION_FINISH } from "../actionconstant";
const revision = {
  data: []
};
export default (state = revision, action) => {
  switch (action.type) {
    case START_REVISION_START:
      return {...state, data: []};
    case START_REVISION_FINISH:
      return {...state,  data: action.data};
    default:
      return state;
  }
};
