import React from "react";
import { Button, Grid, Popup } from "semantic-ui-react";
import { deleteRecitationTemplatesById } from "../../util/APIUtils";
import { deleteRecitationTemplate } from "../../actions/recitationTemplate";
import { connect, useDispatch } from 'react-redux'
import Alert from "react-s-alert";

function DeleteRecitationPopup({ id }) {
    
  const dispatch = useDispatch();
  const deleteTemplate = id => {
    deleteRecitationTemplatesById(id).then(res => {
        dispatch(deleteRecitationTemplate(id));
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
                  deleteTemplate(id);
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

connect(null, { deleteRecitationTemplate })(DeleteRecitationPopup);

export default DeleteRecitationPopup;
