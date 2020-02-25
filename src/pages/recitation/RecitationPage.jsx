import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import { stepsFetchAll, getAllRevisions, recitationTemplatesFetchAll } from "../../util/APIUtils";
import Alert from "react-s-alert";
import { Table } from "antd";
import { PageHeader, Tabs, Button, Statistic, Descriptions } from "antd";
import RevisionHook from "./RevisionHook";
import RecitationHook from "./RecitationHook";
import { Panel } from "primereact/panel";
import StepTabPanel from "./StepTabPanel";

import { Menu , Icon} from "antd";
import { setRevisions, setSchedules, getSteps } from "../../actions/steps";

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

class RecitationPage extends Component {
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
      selectedTemplate:null,
      recitationTemplate: [],
      selectedClassesIds: [],
      value: null
    };
  }
  onSelectionChanged() {
    var selectedRows = this.grid.api.getSelectedRows();
    if (selectedRows.length > 0) {
      const modelData = this.state.modelData;
      modelData.schoolName = selectedRows[0].schoolName;
      modelData.schoolId = selectedRows[0].schoolId;
      modelData.classes = selectedRows[0].classSectionList.map(
        x => x.classSectionId
      );
      this.setState({
        modelData
      });
    }
  }
  handleInputChange(event) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;
    const modelData = this.state.modelData;
    modelData[inputName] = inputValue;
    this.setState({
      modelData
    });
  }
  handleSubmit(event) {
    event.preventDefault();

    const saveRequest = Object.assign({}, this.state.modelData);
  }
  addSchool(event) {
    let modelData = {
      schoolName: "",
      schoolId: null,
      classes: []
    };
    this.setState({ modelData });
    this.grid.api.forEachNode(node => node.setSelected(false));
  }
  onSelectClasses(ids) {
    let modelData = this.state.modelData;
    modelData.classes = ids;
    this.setState({
      modelData
    });
  }
  onChange(pagination, filters, sorter) {
    console.log("params", pagination, filters, sorter);
  }
  componentDidMount() {
    const self = this;
    recitationTemplatesFetchAll()
    .then(response => {
      self.setState({ recitationTemplate: response, value: response[0].id },()=>{
        response.length>0 && self.fetchStepById(response[0].id)
      });
    })
    .catch(error => {
      Alert.error(
        (error && error.message) ||
          "Oops! Something went wrong. Please try again!"
      );
    });    
  }
  onTabClick = ({ item, key, keyPath, domEvent }) => {
    this.fetchStepById(key)
  }

  fetchStepById =(key)=>{
    const self = this;
    this.setState({selectedTemplate: key})
    this.props.setRevisions([])
    this.props.setSchedules([])
    stepsFetchAll(key)
      .then(response => {    
          let obj = {};
          response.map(item => {
            obj[item.name] = item.chapters;
          });
          obj.data = response;
          self.setState(obj);
          if(response.length>0){
            this.props.getSteps(response[0].id)
          }
        });
  }

  render() {
    return (
   //   <PageHeader
    //    onBack={() => window.history.back()}
      //  title="المدارس"
     //   subTitle="إضافة وتعديل المدارس"
     // >
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
                   {this.state.recitationTemplate.map(item=>
                      <Menu.Item key={item.id}>
                      <Icon type="hdd"  style={{paddingLeft: '5px'}}/>
                      <span>{item.name}</span>
                    </Menu.Item>
                   )}
                  </Menu>
                    <Panel  key={this.props.selectedStep} header={`المراحل`} style={{  minHeight: '100vh;'}}>
                      <StepTabPanel steps={this.state.data} key={this.props.selectedStep} initialSelectedStep={this.props.selectedStep}/>
                    
                    </Panel>
                
                </div>
              </div>
            </div>
          </div>
        </div>
   //   </PageHeader>
    );
  }
}

const mapStateToProps = state => {
  return {
  selectedStep: state.stepReducer.data
}}
export default connect(
  mapStateToProps,
  { setRevisions ,setSchedules, getSteps}
)(RecitationPage);