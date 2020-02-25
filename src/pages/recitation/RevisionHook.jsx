import React, { useState, useEffect } from "react";
import "./Form.css";
import {
  saveRevision,
  deleteRevision,
  updateRevision,
  getRecitationsByRevId
} from "../../util/APIUtils";
import RecitationHook from "./RecitationHook";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { TextField } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import { quranchapterpart } from "../../constants";
import { setRevisions } from "../../actions/steps";
import { cloneDeep } from "lodash";
import Alert from "react-s-alert";
import DeletePopup from "./DeletePopup";
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20
  },
  details: {
    alignItems: "center"
  },
  column: {
    flexBasis: "33.33%"
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline"
    }
  }
}));
function Todo({ rev, removeTodo, revisions, step }) {
  const [alias, setAlias] = useState(rev.alias_step_id);
  const [oneDividedByFourStep, setOneDividedByFourStep] = useState(rev.step);
  const buildMenu = () => {
    const result = [];

    const chapters = JSON.parse(step.chapters);
    chapters.forEach(item => {
      const quranchapter = quranchapterpart.filter(x => x.chapter === item);

      if (quranchapter !== undefined) {
        quranchapter.forEach(part => {
          const menu = <MenuItem value={part.key}>{part.label}</MenuItem>;
          result.push(menu);
        });
      }
    });
    return result;
  };
  const updateRevisionAction = () => {
    const quranchapter = quranchapterpart.filter(
      x => x.key === oneDividedByFourStep
    );
    updateRevision({
      name: quranchapter[0].label,
      step: oneDividedByFourStep,
      origin_step_id: rev.origin_step_id,
      step_id: rev.step_id,
      alias_step_id: alias,
      id: rev.id
    }).then(res => {
      revisions = revisions.map(x => {
        if (x.id === res.id) {
          x.step = res.step;
          x.origin_step_id = res.origin_step_id;
          x.alias_step_id = res.alias_step_id;
        }
        return x;
      });
      setRevisions(cloneDeep(revisions));
    });
  };
  return (
    <TableRow key={rev.id}>
      <TableCell>
        <TextField
          id={`filled-basic${rev.id}`}
          value={alias}
          onChange={e => {
            setAlias(e.target.value);
          }}
        />
      </TableCell>
      <TableCell component="th" scope="row">
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          style={{ width: "100%", height: "100%" }}
          value={oneDividedByFourStep}
          onChange={e => {
            setOneDividedByFourStep(e.target.value);
          }}
        >
          {step ? buildMenu() : ""}
        </Select>
      </TableCell>
      <TableCell>
        <Button
          variant="contained"
          type="submit"
          onClick={e => {
            updateRevisionAction();
          }}
        >
          حفظ
        </Button>
      </TableCell>
      <TableCell>
        <DeletePopup id={rev.id} deleteAction={removeTodo} />
      </TableCell>
    </TableRow>
  );
}

function TodoForm({ addTodo, step, steps, selectedStep }) {
  const [value, setValue] = useState("");
  const [fromOneDivFour, setFromOneDivFour] = useState();
  const [toOneDivFour, setToOneDivFour] = useState();
  const [fromAlias, setFromAlias] = useState();

  const [numberOfStep, setNumberOfStep] = useState();

  const [stepOrder, setStepOrder] = useState();
  const [alias, setAlias] = useState();
  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    const quranchapter = quranchapterpart.filter(x => x.key === value);
    saveRevision({
      name: quranchapter[0].label,
      step_id: selectedStep.id,
      step: quranchapter[0].key,
      origin_step_id: step.id,
      alias_step_id: alias
    }).then(res => {
      addTodo(res);
      setValue("");
    });
  };
  const handleMultipleSubmit = e => {
    e.preventDefault();
    
    let fromAliasCounter = parseInt(fromAlias)
    let aliasCounter = 0;
    const listOfRevisions = [];
   for(let i=fromOneDivFour; i<=toOneDivFour;i++){
    const quranchapter = quranchapterpart.filter(x => x.key === i);
   
    saveRevision({
      name: quranchapter[0].label,
      step_id: selectedStep.id,
      step: i,
      origin_step_id: step.id,
      alias_step_id: fromAliasCounter+""
    }).then(res => {
      addTodo(res);
      setValue("");
    }); 
    if(aliasCounter === numberOfStep-1){
      aliasCounter=0;
      fromAliasCounter=fromAliasCounter+1
    }else{
    aliasCounter=aliasCounter+1;
  }
   }
  }
  const buildMenu = () => {
    const result = [];

    const chapters = JSON.parse(step.chapters);
    chapters.forEach(item => {
      const quranchapter = quranchapterpart.filter(x => x.chapter === item);

      if (quranchapter !== undefined) {
        quranchapter.forEach(part => {
          const menu = <MenuItem value={part.key}>{part.label}</MenuItem>;
          result.push(menu);
        });
      }
    });
    return result;
  };
  return (<div style={{width:'100%'}}>
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <TextField
            id={`filled-basic0${selectedStep?selectedStep.id:0}`}
            value={alias}
            onChange={e => {
              setAlias(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <Select
            style={{ width: "100%" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={value}
            onChange={e => {
              console.log(e);
              setValue(e.target.value);
            }}
          >
            {step ? buildMenu() : ""}
          </Select>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" type="submit">
            حفظ
          </Button>
        </Grid>
      </Grid>
    </form>
  {/* <form onSubmit={handleMultipleSubmit} style={{ width: "100%" }}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <TextField
            value={fromAlias}
            onChange={e => {
              setFromAlias(e.target.value);
            }}
          />
        </Grid>
        
        <Grid item xs={4}>
          <Select
            style={{ width: "100%" }}
            labelId="demo-simple-select-label"
            value={fromOneDivFour}
            onChange={e => {
              console.log(e);
              setFromOneDivFour(e.target.value);
            }}
          >
            {step ? buildMenu() : ""}
          </Select>
        </Grid>
        <Grid item xs={4}>
          <Select
            style={{ width: "100%" }}
            labelId="demo-simple-select-label"
            value={toOneDivFour}
            onChange={e => {
              console.log(e);
              setToOneDivFour(e.target.value);
            }}
          >
            {step ? buildMenu() : ""}
          </Select>
        </Grid>
        <Grid item xs={4}>
          <TextField
            value={numberOfStep}
            onChange={e => {
              setNumberOfStep(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" type="submit">
            حفظ
          </Button>
        </Grid>
      </Grid>
          </form>*/}
    </div>
  );
}

function RevisionHook({ steps, relatedStep }) {
  const dispatch = useDispatch();
  const step = useSelector(state => state.stepReducer.data);
  const revisions = useSelector(state => state.stepReducer.revisions);
  const classes = useStyles();

  const [recitations, setRecitations] = useState([]);
  const [selectedRevision, setSelectedRevision] = useState();
  const addTodo = text => {
    const newTodos = [...revisions, text];
    dispatch(setRevisions(newTodos));
  };

  const completeTodo = (id, index) => {
    getRecitationsByRevId(id).then(res => {
      setRecitations(res);

      setSelectedRevision(id);
    });
  };

  const removeTodo = (id, index) => {
    let newTodos = [...revisions];
    deleteRevision(id).then(res => {
      newTodos = newTodos.filter(x => x.id !== id);
      dispatch(setRevisions(newTodos));

      Alert.success("تم الحفظ", { position: "top-left" });
    });
  };

  return (
    <div className="app">
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={5}>
            {relatedStep &&
              relatedStep.map(st => (
                <ExpansionPanel defaultExpanded>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1c-content"
                    id="panel1c-header"
                  >
                    <div className={classes.column}>
                      <Typography className={classes.heading}>
                        جدول المراجعة
                      </Typography>
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <div style={{ width: "100%" }}>
                      <Typography variant="caption">
                        <Table
                          className={classes.table}
                          aria-label="simple table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <b>رمز ربع الحزب في المرحلة الحالية</b>
                              </TableCell>
                              <TableCell>
                                <b>الرقم المتسلسل</b>
                              </TableCell>
                              <TableCell>
                                <b>الحزب</b>
                              </TableCell>
                              <TableCell>
                                <b></b>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {revisions
                              .filter(x => x.origin_step_id === st.id)
                              .map(rev => (
                                <Todo
                                  rev={rev}
                                  completeTodo={completeTodo}
                                  removeTodo={removeTodo}
                                  revisions={revisions}
                                  step={st}
                                />
                              ))}
                          </TableBody>
                        </Table>
                      </Typography>
                    </div>
                  </ExpansionPanelDetails>
                  <Divider />
                  <ExpansionPanelActions>
                    <TodoForm
                      addTodo={addTodo}
                      step={st}
                      steps={steps}
                      selectedStep={step}
                    />
                  </ExpansionPanelActions>
                </ExpansionPanel>
              ))}
          </Grid>
          <Grid item xs={7} style={{ height: "100vh", overflowY: "scroll" }}>
            <RecitationHook revisions={revisions} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default connect(null, { setRevisions })(RevisionHook);
