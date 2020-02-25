import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  recitationCentersFetchAll,
  saveNewRecitationCenter,
  recitationTemplatesFetchAll
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
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";
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

class StudentPage extends Component {
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
      recitationTemplates: [],
      selectedRecitationTemplate: null,
      modelData: {
        schoolName: "",
        schoolId: null,
        classes: []
      },
      stepName: "",
      selectedClassesIds: []
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
    saveNewRecitationCenter({ name ,  recitationtemplate_id: this.state.selectedRecitationTemplate}).then(response => {
      const data = self.state.data;
      data.push(response);
      self.setState({ data });
    });
  }
  componentDidMount() {
    const self = this;
    recitationCentersFetchAll()
      .then(response => {
        self.setState({ data: response });
      })
      .catch(error => {
        Alert.error(
          (error && error.message) ||
            "Oops! Something went wrong. Please try again!"
        );
      });
    recitationTemplatesFetchAll()
      .then(response => {
        self.setState({ recitationTemplates: response });
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
    saveNewRecitationCenter({ id: item.id, name: item.name, recitationtemplate_id: this.state.selectedRecitationTemplate }).then(response => {
      const data = self.state.data.map(x => {
        if (x.id === item.id) {
          return response;
        } else {
          return x;
        }
      });
      self.setState({ data });
    });
  };
  handleChange = (item, value) => {
    this.setState({ [item.name]: value });
  };

  render() {
    return (
      <PageHeader
        onBack={() => window.history.back()}
        title="مراكز التحفيظ"
        subTitle="إضافة وتعديل مراكز التحفيظ"
      >
        <div className="profile-container">
          <div className="container">
            <div className="w3-row">
              <div className="w3-col m12 l12">
                <div className="content-section implementation">
                  {this.state.data.map(item => (
                    <Panel header={item.name}> <Button
                          variant="contained"
                          onClick={() => {
                            this.updateStepAction(item);
                          }}
                        >
                          حفظ
                        </Button>
                      <Paper>
                       
                      </Paper>
                    </Panel>
                  ))}
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      <TextField
                        id="standard-basic"
                        value={this.state.stepName}
                        onChange={event => {
                          this.setState({ stepName: event.target.value });
                        }}
                        label="اسم المركز"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl style={{ width: "100%" }}>
                        <InputLabel id="demo-simple-select-label">
                          المنهج
                        </InputLabel>

                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          style={{ width: "100%", height: "100%" }}
                          value={this.state.selectedRecitationTemplate}
                          onChange={e =>
                            this.setState({
                              selectedRecitationTemplate: e.target.value
                            })
                          }
                        >
                          {this.state.recitationTemplates.map(item => (
                            <MenuItem value={item.id}>{item.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <Button
                        style={{ marginTop: "10px" }}
                        variant="contained"
                        onClick={this.saveNewStepAction.bind(this)}
                      >
                        حفظ
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageHeader>
    );
  }
}
export default StudentPage;
