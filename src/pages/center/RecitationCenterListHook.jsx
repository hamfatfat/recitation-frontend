import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { getAllCenters, deleteCenter } from "../../actions/centers";
import { connect } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import { recitationCentersById } from "../../util/APIUtils";
import StudentTable from "./StudentTable";
import DeleteCenterPopup from './DeleteCenterPopup';
import { Panel } from "primereact/panel";
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
    "aria-controls": `simple-tabpanel-${index}`,
    className: "tab-container"
  };
}
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    width: "100%"
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}));

function RecitationCenterListHook() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [value, setValue] = useState(null);
  const centers = useSelector(state => state.centerReducer.data);
  const dataLoaded = useSelector(state => state.centerReducer.dataLoaded);
  useEffect(() => {
    dispatch(getAllCenters());
  }, []);
  useEffect(() => {
    if (centers.length > 0) {
      recitationCentersById(centers[0].id).then(res => {
        setValue(res);
      });
    }
  }, [dataLoaded]);
  const handleChange = (event, newValue) => {
    recitationCentersById(centers[newValue].id).then(res => {
      setValue(res);
    });
  };
  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ width: "15%" }}>
        <Tabs
          orientation="vertical"
          className={classes.tabs}
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          {centers.map((item, idx) => (
            <Tab
              label={item.name}
              key={item.id}
              id={item.id}
              style={{borderRight:(value && item.id===value.id)?'5px solid #db2828':'5px solid transparent',color:'white', opacity:1  }} 
              {...a11yProps(item.id)}
            />
          ))}
        </Tabs>
      </AppBar>
      <TabPanel
        value={value}
        index={value}
        key={value ? value.id : ""}
        style={{ width: "100%", padding: "0 5px" }}
      >
          {value && value.id && <DeleteCenterPopup id={value ? value.id : ""}/>}
        <Panel header={value ? value.name : "0"} key={value ? value.id+""+value.users.length : ""}>      
          <StudentTable center={value} />  
        </Panel>
      </TabPanel>
    </div>
  );
}
const mapStateToProps = state => {
  return { centers: state.centerReducer.data };
};

export default connect(mapStateToProps, { getAllCenters })(
  RecitationCenterListHook
);
