import {
  START_STEP_START,
  START_STEP_FINISH,
  UPDATE_REVISIONS,
  UPDATE_SCHEDULE
} from "../actionconstant";
const step = {
  data: null,
  revisions: [],
  schedules: []
};
export default (state = step, action) => {
  switch (action.type) {
    case START_STEP_START:
      return { ...state, data: null, revisions: [], schedules: [] };
    case START_STEP_FINISH:
      return {
        ...state,
        data: action.data,
        revisions: action.data.revision.map((x,idx)=>{
          x.index=idx+1
          return x;
        }),
        schedules: action.data.schedule
      };
    case UPDATE_REVISIONS:
      return { ...state, revisions: action.revisions.map((x,idx)=>{
        x.index=idx+1
        return x;
      }) };
    case UPDATE_SCHEDULE:
      return { ...state, schedules: action.schedules };
    default:
      return state;
  }
};
