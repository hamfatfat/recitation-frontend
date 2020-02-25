import React, { useState, useEffect } from "react";
import "./Form.css";
import { makeStyles } from "@material-ui/core/styles";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {
  saveSchedule,
  deleteSchedule,
  saveRecitation,
  updateRecitation,
  deleteRecitation
} from "../../util/APIUtils";
import { Button, TextField, Grid } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Chip from "@material-ui/core/Chip";
import Divider from "@material-ui/core/Divider";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { souwar } from "../../constants";
import { connect } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import { setSchedules } from "../../actions/steps";
import { cloneDeep } from "lodash";
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
  },
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));
function Todo({
  todo,
  index,
  completeTodo,
  removeTodo,
  stepValue,
  revisions,
  step,
  refresh
}) {
  const [stepVal, setStepVal] = useState(stepValue);
  const [schedule, setSchedule] = useState(todo);
  const [alias, setAlias] = useState(todo.alias_step_id);
  const [toAya, setToAya] = useState();
  const [value, setValue] = useState("");
  const classes = useStyles();

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    saveRecitation({
      soura: value,
      schedule_id: schedule.id,
      alias_step_id: alias,
      toAya
    }).then(res => {
      schedule.recitationstep.push(res);
      //addTodo(res);
      setValue("");
      setValue(value);
    });
  };
  const updateRecitationAction = id => {
    const recitationstep = schedule.recitationstep.find(x => x.id === id);
    updateRecitation(recitationstep, id).then(res => {
      console.log(res);
    });
  };
  const handleChange = e => {
    setAlias(e.target.value);
  };
  const updateRevRecitation = (alias, id) => {
    schedule.recitationstep = schedule.recitationstep.map(x => {
      if (x.id === id) {
        x.alias_step_id = alias;
      }
      return x;
    });
    setSchedule(cloneDeep(schedule));
  };
  const updateSouraRecitation = (soura, id) => {
    schedule.recitationstep = schedule.recitationstep.map(x => {
      if (x.id === id) {
        x.soura = soura;
      }
      return x;
    });
    setSchedule(cloneDeep(schedule));
  };
  const updateToAyaRecitation = (toAya, id) => {
    schedule.recitationstep = schedule.recitationstep.map(x => {
      if (x.id === id) {
        x.toAya = toAya;
      }
      return x;
    });
    setSchedule(cloneDeep(schedule));
  };
  const deleteRecitationAction = id => {
    deleteRecitation(id).then(res => {
      schedule.recitationstep = schedule.recitationstep.filter(
        x => x.id !== id
      );
      setSchedule(cloneDeep(schedule));
    });
  };
  const buildMenu = (revisions) => {
    let result = [];
    const chapters = JSON.parse(step.chapters);
    chapters.forEach(item => {
      const quranchapter = souwar.filter(x => x.key === item);

      if (quranchapter !== undefined) {
        quranchapter.forEach(part => {
          if (part.items !== undefined) {
            part.items.forEach(soura => {
              result.push(soura);
            });
          }
        });
      }
    });

    result = Array.from(new Set([...result,...revisions.filter(rev=> rev.step%4===1).map(x=>x.name)])).map(soura => {
      return <MenuItem value={soura}>{soura}</MenuItem>;
    });
    return result;
  };
  return (
    <div style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}>
   
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <b>رقم المراجعة</b>
            </TableCell>
            <TableCell>
              <b>السورة</b>
            </TableCell>
            <TableCell>
              <b>للآية</b>
            </TableCell>
            <TableCell>
              <b>حفظ</b>
            </TableCell>
            <TableCell>
              <b>حذف</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedule &&
            schedule.recitationstep.map((recitationStep, index) => (
              <TableRow key={recitationStep.id}>
                <TableCell>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    style={{ width: "100%", height: "100%" }}
                    value={recitationStep.alias_step_id}
                    onChange={e =>
                      updateRevRecitation(e.target.value, recitationStep.id)
                    }
                  >
                    {Array.from(new Set([...(revisions.map(rev =>rev.alias_step_id).sort((a,b)=> parseInt(a)-parseInt(b))),"المقرر كاملا"])).map(alias =>
                      <MenuItem value={alias}>{alias}</MenuItem>
                    )}
                  </Select>
                </TableCell>             
                <TableCell component="th" scope="row">
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    style={{ width: "100%", height: "100%" }}
                    value={recitationStep.soura}
                    onChange={e =>
                      updateSouraRecitation(e.target.value, recitationStep.id)
                    }
                  >
                    {buildMenu(revisions)}
                  </Select>
                </TableCell>
                <TableCell>
                  <TextField
                    id={`filled-basic${recitationStep.id}`}
                    className={classes.textField}
                    value={recitationStep.toAya}
                    onChange={e => {
                      updateToAyaRecitation(e.target.value, recitationStep.id);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    type="submit"
                    className={classes.button}
                    onClick={e => {
                      updateRecitationAction(recitationStep.id);
                    }}
                  >
                    حفظ
                  </Button>
                </TableCell>
                <TableCell>
                  <DeletePopup id={recitationStep.id} deleteAction={deleteRecitationAction}/>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Divider />
      <ExpansionPanelActions>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid container className={classes.root} spacing={3}>
            <Grid item xs={4}>
              <FormControl
                className={classes.formControl}
                style={{ width: "100%" }}
              >
                <InputLabel id="demo-simple-select-label">رقم المراجعة</InputLabel>

                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    style={{ width: "100%", height: "100%" }}
                    value={alias}
                    onChange={e =>
                      setAlias(e.target.value)
                    }
                  >
                    {Array.from(new Set([...(revisions.map(rev =>rev.alias_step_id).sort((a,b)=> parseInt(a)-parseInt(b))),...revisions.filter(rev=> rev.step%4===1).map(x=>x.name)  ,"المقرر كاملا"])).map(alias =>
                      <MenuItem value={alias}>{alias}</MenuItem>
                    )}
                  </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl
                className={classes.formControl}
                style={{ width: "100%" }}
              >
                <InputLabel id="demo-simple-select-label">السورة</InputLabel>

                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  style={{ width: "100%", height: "100%" }}
                  value={value}
                  onChange={e => setValue(e.target.value)}
                >
                  {buildMenu(revisions)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <TextField
                    id={`filled-basic0`}
                className={classes.textField}
                label="للأية"
                value={toAya}
                onChange={e => setToAya(e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                type="submit"
                className={classes.button}
              >
                حفظ
              </Button>
            </Grid>
          </Grid>
        </form>
      </ExpansionPanelActions>
    </div>
  );
}

function TodoForm({ addTodo, stepValue }) {
  const [value, setValue] = useState("");
  const [stepVal, setStepVal] = useState(stepValue);

  useEffect(() => {
    // Update the document title using the browser API
    setStepVal(stepValue);
    console.log(stepValue);
  });
  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    saveSchedule({ name: value, step_id: stepValue.id }).then(res => {
      res.recitationstep = [];
      addTodo(res);
      setValue("");
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id={`filled-basic${stepValue?stepValue.id:1}`}
        label="الجدول"
        margin="normal"
        value={value}
        onChange={e => setValue(e.target.value)}
        variant="filled"
      />
    </form>
  );
}

function RecitationHook() {
  const dispatch = useDispatch();

  const step = useSelector(state => state.stepReducer.data);
  const revisions = useSelector(state => state.stepReducer.revisions);
  const schedules = useSelector(state => state.stepReducer.schedules);
  const classes = useStyles();

  const addTodo = text => {
    const newTodos = [...schedules, text];
    dispatch(setSchedules(newTodos));
  };

  const completeTodo = index => {
    const newTodos = [...schedules];
    newTodos[index].isCompleted = true;
    dispatch(setSchedules(newTodos));
  };

  const removeTodo = (id, index) => {
    const newTodos = [...schedules];
    newTodos.splice(index, 1);
    deleteSchedule(id).then(res => {
      dispatch(setSchedules(newTodos));
    });
  };

  return (
    <div className="app">
      <div className="todo-list">
        {schedules.map((rev, index) => (
          <ExpansionPanel defaultExpanded>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1c-content"
              id="panel1c-header"
            >
              <div className={classes.column}>
                <Typography className={classes.heading}><b>
                  جدول المراجعة ل {rev.name}
</b>

  <button onClick={() => removeTodo(rev.id, index)}>x</button>

                </Typography>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div style={{ width: "100%" }}>
                <Typography variant="caption">
                  <Todo
                    key={`todo${index}`}
                    index={index}
                    todo={rev}
                    step={step}
                    completeTodo={completeTodo}
                    revisions={revisions}
                    removeTodo={removeTodo}
                  />
                </Typography>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
        <TodoForm addTodo={addTodo} stepValue={step} />
      </div>
    </div>
  );
}

export default connect(null, { setSchedules })(RecitationHook);
