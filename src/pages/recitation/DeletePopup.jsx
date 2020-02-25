import React from "react";
import { Button, Grid, Popup } from "semantic-ui-react";
import Alert from "react-s-alert";

function DeletePopup({ id, deleteAction }) {
    
  const deleteStepClickEvent = id => {
    deleteAction(id)
    
    Alert.success("تم الحذف",{position: 'top-left'});
  };
  return (
    <Popup wide trigger={<Button content="حذف" color="red"/>} on="click">
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
            position="top center"
            size="tiny"
            content="اضغط نعم للحذف"
            inverted
          />
        </Grid.Column>
      </Grid>
    </Popup>
  );
}

export default DeletePopup;
