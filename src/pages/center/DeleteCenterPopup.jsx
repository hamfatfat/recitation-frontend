import React from "react";
import { Button, Grid, Popup } from "semantic-ui-react";
import { deleteCenter } from "../../actions/centers";
import { connect, useDispatch } from 'react-redux'
import { deleteRecitationCentersById } from "../../util/APIUtils";

import Alert from "react-s-alert";
function DeleteCenterPopup({ id }) {
    
  const dispatch = useDispatch();
  const deleteCenterAction = id => {
    deleteRecitationCentersById(id).then((res)=>{
      dispatch(deleteCenter(id));
      
      Alert.success("تم الحذف",{position: 'top-left'});
    })
   
  };
  return (
    <Popup wide trigger={<Button content="حذف"  color="red"/>} on="click">
      <Grid divided columns="equal">
        <Grid.Column>
          <Popup
            trigger={
              <Button
                color="red"
                content="نعم"
                fluid
                onClick={e => {
                  deleteCenterAction(id);
                }}
              />
            }
            content="اضغط نعم للحذف"
            position="top center"
            size="tiny"
            inverted
          />
        </Grid.Column>
      </Grid>
    </Popup>
  );
}

connect(null, { deleteRecitationCentersById})(DeleteCenterPopup);

export default DeleteCenterPopup;
