import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app/App";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import "./w3.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "antd/dist/antd.css";
import 'semantic-ui-css/semantic.min.css'
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import teal from "@material-ui/core/colors/teal";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider
} from "@material-ui/core/styles";
import { ConfigProvider } from "antd";
import arEG from "antd/es/locale/ar_EG";
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import rtl from 'jss-rtl';
import { create } from 'jss';
import { createStore, combineReducers,applyMiddleware } from 'redux'

import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux'

import thunk from 'redux-thunk';
import logger from 'redux-logger';
import reducers from './reducers'
const middleWares = [thunk, logger]; // Put the list of third part plugins in an array 

const rootReducer = combineReducers(reducers);
const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(...middleWares),
  // other store enhancers if any
))
// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const theme = createMuiTheme({
  direction: "rtl",
  palette: {
    primary: teal
  }
});

ReactDOM.render(
  <Router>
    <ConfigProvider locale={arEG}>
      <ThemeProvider theme={theme}>
        <div dir="rtl">
          <StylesProvider jss={jss}>
            <Provider store={store}>
              <App />
            </Provider>
          </StylesProvider>
        </div>
      </ThemeProvider>
    </ConfigProvider>
  </Router>,
  document.getElementById("root")
);

registerServiceWorker();
