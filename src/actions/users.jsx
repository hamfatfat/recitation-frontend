import {START_USER_START,  START_USER_FINISH} from '../actionconstant';

const setUsers =(users) =>{
    return (dispatch, getState)=>{
        dispatch({type: START_USER_START, data: []})
        dispatch({type: START_USER_FINISH, data: users})
    }
}

const addUser = user => {
    return (dispatch, getState) => {
      let users = getState().userReducer.data;
      users.push(user);
      users = users.map(x => x);
      dispatch({ type: START_USER_FINISH, data: users });
    };
  };
  const UpdateUserAction = user => {
    return (dispatch, getState) => {
      let users = getState().userReducer.data;
      users = users.map(u => {
        if (u.id === user.id) {
          return user;
        } else return u;
      });
      users = users.map(x => x);
      dispatch({ type: START_USER_FINISH, data: users });
    };
  };
const deleteUserById = id => {
    return (dispatch, getState) => {
      let users = getState().userReducer.data;
      users = users.filter(x => x.id !== id);
  
      dispatch({ type: START_USER_FINISH, data: users });
    };
  };

export { setUsers,addUser, UpdateUserAction, deleteUserById}