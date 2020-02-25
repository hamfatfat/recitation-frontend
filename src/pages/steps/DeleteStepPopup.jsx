import React from "react";
import { Button, Grid, Popup } from "semantic-ui-react";
import { deleteStep } from "../../util/APIUtils";

import Alert from "react-s-alert";
function DeleteStepPopup({ id, deleteStepAction }) {
    
  const deleteStepClickEvent = id => {
    deleteStep(id).then(res => {
        deleteStepAction(id);
        
        Alert.success("تم الحذف",{position: 'top-left'});
    });
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
                  deleteStepClickEvent(id);
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

export default DeleteStepPopup;
