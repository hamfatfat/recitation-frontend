import React, { useRef, useEffect, useState } from "react";
import { SketchField, Tools } from "react-sketch";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Backdrop from "@material-ui/core/Backdrop";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import FileCopyIcon from "@material-ui/icons/FileCopyOutlined";
import LineIcon from "@material-ui/icons/Remove";
import RectangleIcon from "@material-ui/icons/CropLandscape";
import CircleIcon from "@material-ui/icons/PanoramaFishEye";
import GestureIcon from "@material-ui/icons/Gesture";
import { useParams } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import RcViewer from "rc-viewer";
import { Toolbar } from "primereact/toolbar";

import { Button as PrimeButton } from "primereact/button";
import { InputText } from "primereact/inputtext";
import WhiteBoard from "./components/whiteBoard";
import { Tools as DrawingTools } from "./components/tools";
import History from "./components/history";
import "./style.css";
import {
  saveCourseWhiteboard,
  courseWhiteboardsByStudentStructure
} from "../../util/APIUtils";
import Alert from "react-s-alert";
import Store from "./store";
const useStyles = makeStyles(theme => ({
  root: {
    height: 1200,
    transform: "translateZ(0px)",
    flexGrow: 1
  },
  speedDial: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

const actions = [
  { icon: <FileCopyIcon />, name: "Copy" },
  { icon: <LineIcon />, name: "Line" },
  { icon: <RectangleIcon />, name: "Rectangle" },
  { icon: <CircleIcon />, name: "Circle" },
  { icon: <GestureIcon />, name: "Pen" },
  { icon: <GestureIcon />, name: "Pan" },
  { icon: <GestureIcon />, name: "Select" }
];
export default function SketchFieldDemo() {
  const classes = useStyles();
  const mounted = useRef();
  let { docId, page, addEmptyPage, courseId } = useParams();
  const [courseWhiteboard, setCourseWhiteboard] = useState(null);

  useEffect(() => {
    if (!mounted.current && addEmptyPage === "1") {
      var canvas = document.getElementById("whiteBoard");
      // ctx = canvas.getContext("2d");
      Store.setShapes([]);
      localStorage.removeItem("fff");
      var background = new Image();
      background.src = "http://localhost:8080/download/" + docId + "/" + page;
      if (canvas !== undefined && canvas !== null) {
        canvas.style.background = `url('${background.src}')`;
        canvas.style.backgroundSize = `800px 1200px`;

        canvas.style.backgroundPosition = `center`;
        canvas.style.backgroundRepeat = "no-repeat";
      }
    }
    courseWhiteboardsByStudentStructure(courseId, page, docId,addEmptyPage)
      .then(response => {
        if (response.length > 0) {
          setCourseWhiteboard(response[0].courseWhiteboard);
          Store.setShapes(JSON.parse(response[0].svgContent));
          localStorage.setItem(
            "fff",
            JSON.stringify(JSON.parse(response[0].svgContent))
          );
        } else {
          setCourseWhiteboard(null);
          Store.setShapes([]);
          localStorage.removeItem("fff");
        }
      })
      .catch(error => {
        Alert.error(
          (error && error.message) ||
            "Oops! Something went wrong. Please try again!"
        );
      });
    // ctx.background.url=background
    // Make sure the image is loaded first otherwise nothing will draw.
    //  background.onload = function() {
    // ctx.drawImage(background, 0, 0);
    //};
  });

  const saveSvg = () => {
    const val = localStorage.getItem("fff");
    const saveRequest = {};
    saveRequest.courseWhiteboard = null;
    saveRequest.page = page;
    saveRequest.type = addEmptyPage + "";
    saveRequest.pageIndex = 0;
    saveRequest.svgContent = val;
    saveRequest.fileId = docId;
    saveRequest.courseId = courseId;
    saveRequest.courseWhiteboard = courseWhiteboard;
    saveCourseWhiteboard(saveRequest)
      .then(response => {})
      .catch(error => {
        Alert.error(
          (error && error.message) ||
            "Oops! Something went wrong. Please try again!"
        );
      });
  };
  return (
    <div className={classes.root}>
      <Menubar>
        <PrimeButton
          onClick={saveSvg}
          label="حفظ"
          icon="pi pi-save"
          style={{ marginRight: ".25em" }}
        />
      </Menubar>
      <div id="main">
        <div id="container">
          <DrawingTools />
          <WhiteBoard />
        </div>
        <History />
      </div>
    </div>
  );
}
