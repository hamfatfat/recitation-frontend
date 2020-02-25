import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  recitationTemplatesFetchAll,
  saveNewRecitationTemplate
} from "../../util/APIUtils";
import {
  getAllRecitationTemplates,
  addRecitationTemplate,
  updateRecitationTemplate
} from "../../actions/recitationTemplate";
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
import DeleteRecitationPopup from "./DeleteRecitationPopup";
import { connect } from "react-redux";

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

class RecitationTemplatePage extends Component {
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
    saveNewRecitationTemplate({ name }).then(response => {
      self.props.addRecitationTemplate(response);
    });
  }

  componentDidMount() {
    const self = this;
    this.props.getAllRecitationTemplates();
  }
  updateStepAction = item => {
    const self = this;
    saveNewRecitationTemplate({ id: item.id, name: item.name }).then(
      response => {
        self.props.updateRecitationTemplate(response);
      }
    );
  };
  handleChange = (item, value) => {
    this.setState({ [item.name]: value });
  };

  render() {
    return (
      <PageHeader
        onBack={() => window.history.back()}
        title="المناهج"
        subTitle="إضافة وتعديل المناهج"
      >
        <div className="profile-container">
          <div className="container">
            <div className="w3-row">
              {this.props.data.map(item => (
                <div className="w3-col m4 l4">
                  <div className="content-section implementation">
                    <Panel header={item.name}>
                      <Paper>
                        <TextField
                          id="standard-basic"
                          value={item.name}
                          onChange={event => {
                            item.name = event.target.value;
                            this.props.updateRecitationTemplate(item);
                          }}
                          label="اسم المنهج"
                        />
                        <Button
                          variant="contained"
                          onClick={() => {
                            this.updateStepAction(item);
                          }}
                        >
                          حفظ
                        </Button>
                        <DeleteRecitationPopup id={item.id} />
                      </Paper>
                    </Panel>
                  </div>
                </div>
              ))}
  <div className="w3-col m12 l12">
                  <div className="content-section implementation">
              <Panel header={`إضافة منهج جديد`}>
                <Paper>
                  <TextField
                    id="standard-basic"
                    value={this.state.stepName}
                    onChange={event => {
                      this.setState({ stepName: event.target.value });
                    }}
                    label="اسم المنهج"
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
      </PageHeader>
    );
  }
}
const mapStateToProps = state => {
  return { data: state.recitationTemplateReducer.data };
};

export default connect(mapStateToProps, {
  getAllRecitationTemplates,
  addRecitationTemplate,
  updateRecitationTemplate
})(RecitationTemplatePage);
