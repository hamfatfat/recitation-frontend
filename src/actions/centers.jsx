import { START_CENTER_START, START_CENTER_FINISH } from "../actionconstant";
import { recitationCentersFetchAll } from "../util/APIUtils";

const getAllCenters = () => {
  return (dispatch, state) => {
    dispatch({ type: START_CENTER_START });
    recitationCentersFetchAll().then(res => {
      dispatch(setCenters(res));
      console.log(res);
    });
  };
};

const setCenters = centers => {
  return (dispatch, state) => {
    dispatch({ type: START_CENTER_FINISH, data: centers, dataLoaded: true });
  };
};
const addCenter = center => {
  return (dispatch, getState) => {
    let centers = getState().centerReducer.data;
    centers.push(center);
    centers = centers.map(x => x);
    dispatch({ type: START_CENTER_FINISH, data: centers, dataLoaded: false });
  };
};
const updateCenter = center => {
  return (dispatch, getState) => {
    let centers = getState().centerReducer.data;
    centers = centers.map(cente => {
      if (cente.id === center.id) {
        return center;
      } else return cente;
    });
    centers = centers.map(x => x);
    dispatch({ type: START_CENTER_FINISH, data: centers, dataLoaded: false });
  };
};

const deleteCenter = id => {
  return (dispatch, getState) => {
    let centers = getState().centerReducer.data;
    centers = centers.filter(x => x.id !== id);

    dispatch({ type: START_CENTER_FINISH, data: centers, dataLoaded: false });
  };
};
export { getAllCenters, updateCenter, addCenter, deleteCenter };
