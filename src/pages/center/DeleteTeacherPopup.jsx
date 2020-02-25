import React from "react";
import { Button, Grid, Popup } from "semantic-ui-react";
import { deleteUserById} from "../../actions/users";
import { connect, useDispatch } from 'react-redux'
import { deleteUser } from "../../util/APIUtils";

import Alert from "react-s-alert";
function DeleteTeacherPopup({ id }) {
    
  const dispatch = useDispatch();
  const deleteTeacher = id => {
    deleteUser(id).then((res)=>{
      dispatch(deleteUserById(id));
      
      Alert.success("تم الحفظ",{position: 'top-left'});
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
                  deleteTeacher(id);
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

connect(null, { deleteUserById })(DeleteTeacherPopup);

export default DeleteTeacherPopup;
