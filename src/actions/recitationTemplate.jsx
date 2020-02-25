import { START_RECITATION_TEMPLATE_START, START_RECITATION_TEMPLATE_FINISH } from "../actionconstant";
import { recitationTemplatesFetchAll } from "../util/APIUtils";

const getAllRecitationTemplates = () => {
  return (dispatch, state) => {
    dispatch({ type: START_RECITATION_TEMPLATE_START });
    recitationTemplatesFetchAll().then(res => {
      dispatch(setRecitationTemplates(res));
      console.log(res);
    });
  };
};

const setRecitationTemplates = recitationTemplates => {
  return (dispatch, state) => {
    dispatch({ type: START_RECITATION_TEMPLATE_FINISH, data: recitationTemplates });
  };
};
const addRecitationTemplate = recitationTemplate => {
  return (dispatch, getState) => {
    let recitationTemplates =  getState().recitationTemplateReducer.data;
    recitationTemplates.push(recitationTemplate);
    recitationTemplates=recitationTemplates.map(x=>x)
    dispatch({ type: START_RECITATION_TEMPLATE_FINISH, data: recitationTemplates });
  };
};
const updateRecitationTemplate = recitationTemplate => {
  return (dispatch, getState) => {
    let recitationTemplates = getState().recitationTemplateReducer.data;
    recitationTemplates = recitationTemplates.map(cente => {
      if (cente.id === recitationTemplate.id) {
        return recitationTemplate;
      }else
      return cente;
    });
    recitationTemplates=recitationTemplates.map(x=>x)
    dispatch({ type: START_RECITATION_TEMPLATE_FINISH, data: recitationTemplates });
  };
};

const deleteRecitationTemplate = id =>{
  return (dispatch, getState) => {
    let recitationTemplates = getState().recitationTemplateReducer.data;
    recitationTemplates = recitationTemplates.filter(x=>x.id !== id)
    
    dispatch({ type: START_RECITATION_TEMPLATE_FINISH, data: recitationTemplates });
}
}
export { getAllRecitationTemplates, updateRecitationTemplate, addRecitationTemplate,deleteRecitationTemplate };
