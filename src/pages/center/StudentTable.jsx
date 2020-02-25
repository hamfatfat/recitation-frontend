import React,{useState} from "react";
import {
  Icon,
  Label,
  Menu,
  Table,
  Button,
  Divider,
  Grid,
  Header,
  Input,
  Segment
} from "semantic-ui-react";
import TextField from "@material-ui/core/TextField";
import { setDisplayName } from "recompose";
import { saveUser, deleteUser } from "../../util/APIUtils";

import { connect, useDispatch } from 'react-redux'
import { updateCenter } from "../../actions/centers";
import Alert from "react-s-alert";
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
function StudentTable({ center }) {
  const [name, setName] = useState();
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
 const handleSubmit=(event)=>{
     
    event.preventDefault();
    saveUser({
        name,
        email: uuidv4()+"@recitation.com",
        password: "123",
        roles:"Student",
        centers: [center.id]
      })
        .then(response => {
            if(center.users=== undefined)
            center.users=[]
            const users = center.users
            users.push(response)
            dispatch(updateCenter(center))
        
            Alert.success("تم الحفظ",{position: 'top-left'});
          //this.props.history.push("/login");
        })
        .catch(error => {
          Alert.error(
            (error && error.message) ||
              "Oops! Something went wrong. Please try again!"
          );
        });
  }
  return (
    <div style={{paddingBottom:'1px'}}>
      <Segment placeholder>
        <Grid columns={2} stackable textAlign="center">
          <Divider vertical>أو</Divider>
          <Grid.Row verticalAlign="middle">
            <Grid.Column>
              <Header icon>
                <Icon name="search" />
                البحث عن طالب
              </Header>
              <Input icon='search' placeholder="البحث عن طالب..." onChange={(e, { value })=>{
                setSearch(value)
              }}
              />           
            </Grid.Column>
            <Grid.Column>
              <Header icon>
                <Icon name="world" />
                إضافة طالب جديد
              </Header>
              <form onSubmit={handleSubmit} style={{width: '50%', margin: '0 auto'}}>
                <Grid columns={2} stackable textAlign="center">
                  <Grid.Row verticalAlign="middle">
                    <Grid.Column>
                      <TextField
                        id="standard-basic"
                        name="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        label="اسم الطالب"
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Button primary type="submit">
                        إضافة
                      </Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Grid columns={2} stackable textAlign="right">
        <Grid.Row verticalAlign="top">
          <Grid.Column>
            <Table celled style={{ textAlign:'right'}}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>الطلاب</Table.HeaderCell>
                  <Table.HeaderCell>حذف</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {center && center.users && center.users
                  .filter(x => x.roles.includes("Student") && x.name.indexOf(search)>-1)
                  .map(x => (
                    <Table.Row>
                      <Table.Cell>{x.name}</Table.Cell>
                      <Table.Cell> <Button primary color="red"  onClick={()=>{ 
                        deleteUser(x.id).then((res)=>{
                           center.users= center.users.filter(y=>y.id !== x.id)
                          dispatch(updateCenter(center))
                          Alert.success("تم الحذف",{position: 'top-left'});
                        })
                       

                      }}>
                        x
                      </Button></Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </Grid.Column>
          <Grid.Column>
            <Table celled style={{ textAlign:'right'}}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>المشايخ</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {center && center.users !== undefined && center.users
                  .filter(x => x.roles.includes("Teacher"))
                  .map(x => (
                    <Table.Row>
                      <Table.Cell>{x.name}</Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default connect(null, { updateCenter })(StudentTable);
