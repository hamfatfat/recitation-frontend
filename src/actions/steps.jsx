import {
  START_STEP_START,
  START_STEP_FINISH,
  UPDATE_REVISIONS,
  UPDATE_SCHEDULE
} from "../actionconstant";
import { stepsById } from "../util/APIUtils";

const getSteps = stepId => {
  return (dispatch, state) => {
    dispatch({ type: START_STEP_START, data: [] });
    stepsById(stepId).then(res => {
    
      dispatch({ type: START_STEP_FINISH, data: res });
      dispatch({ type: UPDATE_REVISIONS, revisions: res.revision });
      dispatch({ type: UPDATE_SCHEDULE, schedules: res.schedule });
    });
  };
};

const setRevisions = revisions => {
  return (dispatch, state) => {
    dispatch({ type: UPDATE_REVISIONS, revisions });
  };
};
const setSchedules = schedules => {
  return (dispatch, state) => {
    dispatch({ type: UPDATE_SCHEDULE, schedules });
  };
};
const deleteStepAction = id => {
  return (dispatch, getState) => {
    let steps = getState().stepReducer.data;
    steps = steps.filter(x => x.id !== id);
    
    dispatch({ type: START_STEP_FINISH, data: steps });
  };
};

export { getSteps, setRevisions, setSchedules, deleteStepAction };
