import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  fetchAllTeachers,
  saveNewRecitationCenter,
  recitationTemplatesFetchAll,
  updateUser,
  saveUser,
  recitationCentersFetchAll,
  deleteUser
} from "../../util/APIUtils";
import Alert from "react-s-alert";
import { Table } from "antd";
import { PageHeader, Tabs, Statistic, Descriptions } from "antd";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import TagFacesIcon from "@material-ui/icons/TagFaces";
import { Panel } from "primereact/panel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import { quranchapter } from "../../constants";
import { setUsers, addUser, UpdateUserAction } from "../../actions/users";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";
import DeleteTeacherPopup from "./DeleteTeacherPopup";
import { connect } from "react-redux";
const MenuProps = {
  PaperProps: {
    style: {
      width: 250
    }
  }
};
const columns = [
  {
    title: "schoolName",
    dataIndex: "schoolName",

    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ["descend"]
  }
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder"
];

class TeacherPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      getRowNodeId: function(data) {
        return data.schoolId;
      },
      data: [],
      modelData: {
        schoolName: "",
        schoolId: null,
        classes: []
      },
      stepName: "",
      selectedClassesIds: [],
      centers: [],
      selectedCenters: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateStepAction = this.updateStepAction.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleDelete = chipToDelete => () => {
    //setChipData(chips => chips.filter(chip => chip.key !== chipToDelete.key));
  };
  saveNewStepAction() {
    const self = this;
    const name = this.state.stepName;
    saveNewRecitationCenter({
      name,
      recitationtemplate_id: this.state.selectedRecitationTemplate
    }).then(response => {
      const data = self.state.data;
      data.push(response);
      self.setState({ data });
    });
  }
  componentDidMount() {
    const self = this;

    recitationCentersFetchAll()
      .then(response => {
        self.setState({ centers: response });
        fetchAllTeachers()
          .then(response => {
            self.props.setUsers(response);
          })
          .catch(error => {
            Alert.error(
              (error && error.message) ||
                "Oops! Something went wrong. Please try again!"
            );
          });
      })
      .catch(error => {
        Alert.error(
          (error && error.message) ||
            "Oops! Something went wrong. Please try again!"
        );
      });
  }
  updateStepAction = item => {
    const self = this;
    let updateItem = this.props.users.find(x => x.id === item.id);
    updateItem.centers = updateItem.centers.map(x => x.id);
    updateUser({
      ...updateItem
    }).then(response => {
      self.props.UpdateUserAction(response);
      Alert.success("تم الحفظ", { position: "top-left" });
    });
  };
  handleChange = (item, value) => {
    this.setState({ [item.name]: value });
  };
  handleInputChange(event) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState({
      [inputName]: inputValue
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const self = this;
    saveUser({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      roles: "Teacher",
      centers: this.state.selectedCenters
    })
      .then(response => {
        self.props.addUser(response);        

        Alert.success("تم الحفظ", { position: "top-left" });
        //this.props.history.push("/login");
      })
      .catch(error => {
        Alert.error(
          (error && error.message) ||
            "Oops! Something went wrong. Please try again!"
        );
      });
  }

  render() {
    return (
      <div>
        <PageHeader
          onBack={() => window.history.back()}
          title="المشايخ"
          subTitle="إضافة وتعديل المشايخ"
        >
          <div className="profile-container">
            <div className="container">
              <div className="w3-row">
                <div className="w3-col m12 l12">
                  <div className="content-section implementation">
                    {this.props.users.map(item => (
                      <Panel
                        header={item.name}
                        className="w3-col m4 l4"
                        style={{ padding: "5px", float: "right" }}
                      >
                        <Paper>
                          <TextField
                            id="standard-basic"
                            name="name"
                            value={item.name}
                            onChange={e => {
                              const data = this.props.users.map(x => {
                                if (x.id === item.id) {
                                  x.name = e.target.value;
                                }
                                return x;
                              });
                              this.props.setUsers(data);
                            }}
                            label="اسم الشيخ"
                          />
                          <TextField
                            id="standard-basic"
                            name="email"
                            value={item.email}
                            onChange={e => {
                              const data = this.props.users.map(x => {
                                if (x.id === item.id) {
                                  x.email = e.target.value;
                                }
                                return x;
                              });
                              this.props.setUsers(data);
                            }}
                            label="البريد الالكتروني"
                          />
                          <TextField
                            id="standard-basic"
                            name="password"
                            value={item.password}
                            onChange={e => {
                              const data = this.props.users.map(x => {
                                if (x.id === item.id) {
                                  x.password = e.target.value;
                                }
                                return x;
                              });
                              this.props.setUsers(data);
                            }}
                            type="password"
                            label="كلمة السر"
                          />
                          <FormControl style={{ width: "100%" }}>
                            <InputLabel htmlFor="select-multiple-chip">
                              المجموعات
                            </InputLabel>
                            <Select
                              style={{ width: "100%" }}
                              multiple
                              value={item.centers.map(center => {
                                return center.id;
                              })}
                              onChange={e => {
                                const data = this.props.users.map(x => {
                                  if (x.id === item.id) {
                                    x.centers = e.target.value.map(y => {
                                      return this.state.centers.find(
                                        z => z.id === y || z.id === y.id
                                      );
                                    });
                                  }
                                  return x;
                                });
                                this.props.setUsers(data);
                              }}
                              input={<Input id="select-multiple-chip" />}
                              renderValue={selected => (
                                <div>
                                  {selected.map(value => {
                                    let center = this.state.centers.find(
                                      z => z.id === value
                                    );
                                    if (center === undefined) return null;
                                    return (
                                      <Chip
                                        key={center.id}
                                        label={center.name}
                                      />
                                    );
                                  })}
                                </div>
                              )}
                              MenuProps={MenuProps}
                            >
                              {this.state.centers.map(center => (
                                <MenuItem key={center.id} value={center.id}>
                                  {center.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Button
                            variant="contained"
                            onClick={() => {
                              this.updateStepAction(item);
                            }}
                          >
                            حفظ
                          </Button>
                          <DeleteTeacherPopup id={item.id} />
                        </Paper>
                      </Panel>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageHeader>
        <div className="container">
          <div className="w3-row">
            <div className="w3-col m12 l12">
              <Panel header={`إضافة  شيخ جديدة`}>
                <Paper>
                  <form onSubmit={this.handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <TextField
                          id="standard-basic"
                          name="name"
                          value={this.state.name}
                          onChange={this.handleInputChange}
                          label="اسم الشيخ"
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          id="standard-basic"
                          name="email"
                          value={this.state.email}
                          onChange={this.handleInputChange}
                          label="البريد الالكتروني"
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          id="standard-basic"
                          name="password"
                          value={this.state.password}
                          onChange={this.handleInputChange}
                          type="password"
                          label="كلمة السر"
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl style={{ width: "100%" }}>
                          <InputLabel htmlFor="select-multiple-chip">
                            المجموعات
                          </InputLabel>
                          <Select
                            style={{ width: "100%" }}
                            multiple
                            value={this.state.selectedCenters}
                            onChange={e => {
                              this.setState({
                                selectedCenters: e.target.value
                              });
                            }}
                            input={<Input id="select-multiple-chip" />}
                            renderValue={selected => (
                              <div>
                                {selected.map(value => {
                                  const center = this.state.centers.find(
                                    x => x.id === value
                                  );
                                  return (
                                    <Chip key={center.id} label={center.name} />
                                  );
                                })}
                              </div>
                            )}
                            MenuProps={MenuProps}
                          >
                            {this.state.centers.map(center => (
                              <MenuItem key={center.id} value={center.id}>
                                {center.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          style={{ marginTop: "10px" }}
                          variant="contained"
                          type="submit"
                        >
                          حفظ
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { users: state.userReducer.data };
};

export default connect(mapStateToProps, {
  setUsers,
  addUser,
  UpdateUserAction
})(TeacherPage);
