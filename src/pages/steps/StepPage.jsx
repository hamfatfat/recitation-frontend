import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  stepsFetchAll,
  saveNewStep,
  getAllRevisions,
  recitationTemplatesFetchAll,
  deleteStep
} from "../../util/APIUtils";
import Alert from "react-s-alert";
import { Table } from "antd";
import { PageHeader, Tabs, Statistic, Descriptions } from "antd";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TagFacesIcon from "@material-ui/icons/TagFaces";
import { Panel } from "primereact/panel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import { quranchapter } from "../../constants";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Menu, Icon } from "antd";
import DeleteStepPopup from "./DeleteStepPopup";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}
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
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};
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

class StepPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          headerName: "School Name",
          field: "schoolName",
          sort: "asc"
        }
      ],
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
      recitationTemplate: [],
      selectedClassesIds: [],
      value: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateStepAction = this.updateStepAction.bind(this);
  }

  handleDelete = chipToDelete => () => {
    //setChipData(chips => chips.filter(chip => chip.key !== chipToDelete.key));
  };
  saveNewStepAction() {
    const self = this;
    const name = this.state.stepName;
    const recitationtemplate_id = this.state.selectedTemplate;
    saveNewStep({ name, recitationtemplate_id }).then(response => {
      const data = self.state.data;
      data.push(response);
      self.setState({ data }, () => {
        Alert.success("تم الحفظ", { position: "top-left" });
      });
    });
  }
  componentDidMount() {
    const self = this;
    recitationTemplatesFetchAll()
      .then(response => {
        self.setState(
          { recitationTemplate: response, value: response[0] },
          () => {
            if (response.length > 0) {
              self.stepsByRecitation(response[0].id);
            }
          }
        );
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
    saveNewStep({
      id: item.id,
      name: item.name,
      chapters: JSON.stringify(this.state[item.id]),
      recitationtemplate_id: this.state.selectedTemplate,
      step_rev_id:item.step_rev_id
    }).then(response => {
      const data = self.state.data.map(x => {
        if (x.id === item.id) {
          return response;
        } else {
          return x;
        }
      });
      self.setState({ data }, () => {
        Alert.success("تم الحفظ", { position: "top-left" });
      });
    });
  };
  handleTabChange = (event, newValue) => {};
  handleChange = (item, value) => {
    this.setState({ [item.id]: value });
  };
  onTabClick = ({ item, key, keyPath, domEvent }) => {
    this.stepsByRecitation(key);
  };

  stepsByRecitation(key) {
    const self = this;
    this.setState({ selectedTemplate: key });
    this.state.data.forEach(item => {
      if (this.state[item.id] !== undefined && this.state[item.id] !== null)
        delete this.state[item.id];
    });
    stepsFetchAll(key)
      .then(response => {
        response = response.map(x => {
          x.chapters = JSON.parse(x.chapters);
          return x;
        });
        getAllRevisions().then(revResponse => {
          let obj = {};
          response.map(item => {
            obj[item.id] = item.chapters;
          });
          obj.data = response;
          self.setState(obj);
        });
      })
      .catch(error => {
        Alert.error(
          (error && error.message) ||
            "Oops! Something went wrong. Please try again!"
        );
      });
  }
  deleteStepAction = id => {
    const self = this;
    deleteStep(id).then(res => {
      const data = self.state.data.filter(x => x.id !== id);
      self.setState({ data });
    });
  };
  render() {
    const allSelected = [];
    this.state.data.forEach(item => {
      if (this.state[item.id] !== undefined && this.state[item.id] !== null)
        !Array.isArray(this.state[item.id])
          ? JSON.parse(this.state[item.id]).forEach(x => allSelected.push(x))
          : this.state[item.id].forEach(x => allSelected.push(x));
    });
    return (
      <PageHeader
        onBack={() => window.history.back()}
        title="المراحل"
        subTitle="إضافة وتعديل المراحل"
      >
        <div className="profile-container">
          <div className="container">
            <div className="w3-row">
              <div className="w3-col m12 l12">
                <div className="content-section implementation">
                  <Menu
                    defaultSelectedKeys={["1"]}
                    selectable={true}
                    defaultOpenKeys={["sub1"]}
                    mode="horizontal"
                    theme="dark"
                    inlineCollapsed={this.state.collapsed}
                    onClick={this.onTabClick.bind(this)}
                  >
                    {this.state.recitationTemplate.map(item => (
                      <Menu.Item key={item.id}>
                        <Icon type="hdd" style={{ paddingLeft: "5px" }} />
                        <span>{item.name}</span>
                      </Menu.Item>
                    ))}
                  </Menu>
                  <div style={{ margin: "20px 20px" }}>
                    <Grid container spacing={3}>
                      {this.state.data.map(item => (
                        <Grid xs={4}>
                          <Panel
                            key={item.id}
                            header={item.name}
                            style={{ margin: "10px" }}
                          >
                            <Paper>
                              <TextField
                                id="standard-basic"
                                value={item.name}
                                onChange={event => {
                                  const stepName = event.target.value;
                                  const data = this.state.data.map(x => {
                                    if (x.id === item.id) {
                                      x.name = stepName;
                                    }
                                    return x;
                                  });
                                  this.setState({
                                    data
                                  });
                                }}
                                label="اسم المرحلة"
                              />
                              <FormControl style={{ width: "100%" }}>
                                <InputLabel htmlFor="select-multiple-chip">
                                  الأجزاء
                                </InputLabel>
                                <Select
                                  style={{ width: "100%" }}
                                  multiple
                                  value={
                                    this.state[item.id] !== undefined &&
                                    this.state[item.id] !== null
                                      ? Array.isArray(this.state[item.id])
                                        ? this.state[item.id]
                                        : JSON.parse(this.state[item.id])
                                      : []
                                  }
                                  onChange={e => {
                                    this.handleChange(item, e.target.value);
                                  }}
                                  input={<Input id="select-multiple-chip" />}
                                  renderValue={selected => (
                                    <div>
                                      {(Array.isArray(selected)
                                        ? selected
                                        : JSON.parse(selected)
                                      )
                                        .sort((x, y) => x - y > 0)
                                        .map(value => (
                                          <Chip key={value} label={value} />
                                        ))}
                                    </div>
                                  )}
                                  MenuProps={MenuProps}
                                >
                                  {quranchapter
                                    .sort((x, y) => x - y > 0)
                                    .map(name => (
                                      <MenuItem key={name} value={name}>
                                        {name}
                                      </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                              <FormControl style={{ width: "100%" }}>
                                <InputLabel htmlFor="select-multiple-chip">
                                  المرحلة السابقة
                                </InputLabel>
                                <Select
                                  style={{ width: "100%" }}
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={item.step_rev_id}
                                  onChange={e => {
                                    const step_prev_id = e.target.value;
                                    const data = this.state.data.map(x => {
                                      if (x.id === item.id) {
                                        x.step_rev_id = step_prev_id;
                                      }
                                      return x;
                                    });
                                    this.setState({
                                      data
                                    });
                                   // setValue(e.target.value);
                                  }}
                                >
                                 {this.state.data.map(stepItem => <MenuItem key={stepItem.id} value={stepItem.id}>
                                        {stepItem.name}
                                      </MenuItem>
                                      )}
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
                              <DeleteStepPopup
                                id={item.id}
                                deleteStepAction={this.deleteStepAction.bind(
                                  this
                                )}
                              />
                            </Paper>
                          </Panel>
                        </Grid>
                      ))}
                    </Grid>
                    <Panel header={`إضافة مرحلة جديدة`}>
                      <Paper>
                        <TextField
                          id="standard-basic"
                          value={this.state.stepName}
                          onChange={event => {
                            this.setState({ stepName: event.target.value });
                          }}
                          label="اسم المرحلة"
                        />
                        <Button
                          style={{ marginTop: "10px" }}
                          variant="contained"
                          onClick={this.saveNewStepAction.bind(this)}
                        >
                          حفظ
                        </Button>
                      </Paper>
                    </Panel>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageHeader>
    );
  }
}
export default StepPage;
