import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import RecitationHook from './RecitationHook';
import { getSteps } from '../../actions/steps';
import RevisionHook from './RevisionHook';

import { isEmpty, each, filter } from "lodash";
import { connect } from "react-redux";
import { useSelector, useDispatch } from 'react-redux'

const unflatten = (array, parent, tree) => {
  tree = typeof tree !== "undefined" ? tree : [];
  parent = typeof parent !== "undefined" ? parent : { id: null };

  var children = filter(array, child => {
    return child.step_rev_id == parent.id;
  });

  if (!isEmpty(children)) {
    if (parent.id == null) {
      tree = children;
    } else {
      parent["children"] = children;
    }
    each(children, child => {
      unflatten(array, child);
    });
  }

  return tree;
};
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
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    width:'100%'
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

function StepTabPanel({steps, initialSelectedStep}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(initialSelectedStep!==null?initialSelectedStep.id:null);
  const [selectedStep, setSelectedStep] = useState(initialSelectedStep!==null?initialSelectedStep.id:null)
  const [relatedStepState, setRelatedStepState] = React.useState();
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelectedStep(event.currentTarget.id);
    dispatch(getSteps(event.currentTarget.id))
  
  };
  useEffect(()=>{
    const treeStep = unflatten(steps);
    const relatedStep =[];
    let nextStep = treeStep[0];
    while (nextStep && nextStep.id <= selectedStep) {
      relatedStep.push(nextStep)
      nextStep =
        nextStep.children !== undefined && nextStep.children.length > 0
          ? nextStep.children[0]
          : null;
    }
    setRelatedStepState(relatedStep)
  },[selectedStep])
  return (
    <div className={classes.root}>
      <AppBar position="static" style={{width:'15%'}}>
        <Tabs orientation="vertical"      className={classes.tabs}

        variant="scrollable" value={value} onChange={handleChange} aria-label="simple tabs example">
          {steps.map((item,idx) =><Tab label={item.name} key={item.id} style={{borderRight:item.id===selectedStep?'5px solid #db2828':'5px solid transparent',color:'white', opacity:1  }} {...a11yProps(item.id)} />)}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={value} key={value? value.id:""} style={{width:'100%'}}>
          <RevisionHook step={value} steps={steps} relatedStep={relatedStepState}/>
      </TabPanel>
    </div>
  );
}
const mapStateToProps = ({ state }) => ({
  state
});

export default connect(
  mapStateToProps,
  { getSteps }
)(StepTabPanel);