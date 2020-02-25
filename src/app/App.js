import React, { Component } from "react";
import { Route, Redirect, Switch, withRouter } from "react-router-dom";
import AppHeader from "../common/AppHeader";
import Home from "../home/Home";
import Login from "../user/login/Login";
import Signup from "../user/signup/Signup";
import Profile from "../user/profile/Profile";
import OAuth2RedirectHandler from "../user/oauth2/OAuth2RedirectHandler";
import NotFound from "../common/NotFound";
import LoadingIndicator from "../common/LoadingIndicator";
import { getCurrentUser } from "../util/APIUtils";
import { ACCESS_TOKEN } from "../constants";
import PrivateRoute from "../common/PrivateRoute";
import Alert from "react-s-alert";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";
import "./App.css";
import SketchFieldDemo from "../pages/notebook/NotebookPage";
import ClippedDrawer from "./ClippedDrawer";
import RecitationPage from "../pages/recitation/RecitationPage";
import StepPage from "../pages/steps/StepPage";
import RecitationTemplatePage from "../pages/recitationtemplate/RecitationTemplatePage";
import RecitationCenterPage from "../pages/center/RecitationCenterPage";
import TeacherPage from "../pages/center/TeacherPage";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      currentUser: null,
      loading: false
    };

    this.loadCurrentlyLoggedInUser = this.loadCurrentlyLoggedInUser.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.pathName = window.location.pathname;
  }

  loadCurrentlyLoggedInUser() {
    getCurrentUser()
      .then(response => {
        localStorage.setItem("user", JSON.stringify(response));
        this.setState(
          {
            currentUser: response,
            authenticated: true,
            loading: false
          },
          () => {
            this.props.history.push(this.pathName);
          }
        );
      })
      .catch(error => {
        this.setState(
          {
            loading: false
          },
          () => {
            this.props.history.push("/login");
          }
        );
      });
  }

  handleLogout() {
    localStorage.removeItem(ACCESS_TOKEN);
    this.setState(
      {
        authenticated: false,
        currentUser: null
      },
      () => {
        this.props.history.push("/login");
      }
    );
    Alert.success("تم تسجيل الخروج بنجاح!",{position:'top-left'});
  }
  componentWillMount() {}
  componentDidMount() {
    this.setState(
      {
        loading: true
      },
      () => {
        this.loadCurrentlyLoggedInUser();
      }
    );
  }
  rerenderApp=()=>{
    this.setState(
      {
        loading: true
      },
      () => {
        this.loadCurrentlyLoggedInUser();
      }
    );
  }
  render() {
    if (this.state.loading) {
      return <LoadingIndicator />;
    }

    return (
      <div className="app">
        <div className="app-top-box">
          <AppHeader
            authenticated={this.state.authenticated}
            onLogout={this.handleLogout}
          />
          {this.state.authenticated && (
            <ClippedDrawer
              key={this.state.currentUser ? this.state.currentUser.id : 0}
              onLogout={this.handleLogout.bind(this)}
            />
          )}
        </div>
        <div className="app-body">
          <Switch>
            <Route
              exact
              path="/"
              authenticated={this.state.authenticated}
              currentUser={this.state.currentUser}
              component={Home}
            ></Route>
            <PrivateRoute
              path="/profile"
              authenticated={this.state.authenticated}
              currentUser={this.state.currentUser}
              component={Profile}
            ></PrivateRoute>
            <PrivateRoute
              path="/notebook/:docId/:page/:addEmptyPage/:courseId"
              authenticated={this.state.authenticated}
              currentUser={this.state.currentUser}
              component={SketchFieldDemo}
            ></PrivateRoute>
            <PrivateRoute
              path="/review"
              authenticated={this.state.authenticated}
              currentUser={this.state.currentUser}
              component={RecitationPage}
            ></PrivateRoute>
            <PrivateRoute
              path="/recitationtemplate"
              authenticated={this.state.authenticated}
              currentUser={this.state.currentUser}
              component={RecitationTemplatePage}
            ></PrivateRoute>
            <PrivateRoute
              path="/steps"
              authenticated={this.state.authenticated}
              currentUser={this.state.currentUser}
              component={StepPage}
            ></PrivateRoute>
            <PrivateRoute
              path="/recitationcenter"
              authenticated={this.state.authenticated}
              currentUser={this.state.currentUser}
              component={RecitationCenterPage}
            ></PrivateRoute>
            <PrivateRoute
              path="/teachers"
              authenticated={this.state.authenticated}
              currentUser={this.state.currentUser}
              component={TeacherPage}
            ></PrivateRoute>
            <Route
              path="/login"
              render={props => (
                <Login authenticated={this.state.authenticated} rerenderApp={this.rerenderApp} {...props} />
              )}
            ></Route>
            <Route
              path="/signup"
              render={props => (
                <Signup authenticated={this.state.authenticated} {...props} />
              )}
            ></Route>
            <Route
              path="/oauth2/redirect"
              component={OAuth2RedirectHandler}
            ></Route>
            <Route component={NotFound}></Route>
          </Switch>
        </div>
        <Alert
          stack={{ limit: 3 }}
          timeout={3000}
          position="top-right"
          effect="slide"
          offset={65}
        />
      </div>
    );
  }
}

export default withRouter(App);
