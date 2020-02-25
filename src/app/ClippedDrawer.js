import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { NavLink } from "react-router-dom";
import { Button } from "@material-ui/core";

import Grid from "@material-ui/core/Grid";
const LinkRef = React.forwardRef((props, ref) => (
  <div ref={ref}>
    <NavLink {...props} />
  </div>
));

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar
}));

export default function ClippedDrawer({onLogout, key}) {
  const classes = useStyles();

  return (
    <Drawer
      anchor="left"
      key={key}
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.toolbar} />
      <List>
        <ListItem component={LinkRef} to="/profile" key={`Profile`}>
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary={`الملف الشخصي`} />
        </ListItem>
        <ListItem component={LinkRef} to="/recitationtemplate" key={`recitationtemplate`}>
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary={`المناهج`} />
        </ListItem> 
        <ListItem component={LinkRef} to="/steps" key={`steps`}>
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary={`المراحل`} />
        </ListItem> 
         <ListItem component={LinkRef} to="/review" key={`review`}>
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary={`جداول المراجعة`} />
        </ListItem>
        <ListItem component={LinkRef} to="/recitationcenter" key={`recitationcenter`}>
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary={`الحلقات`} />
        </ListItem>
        <ListItem component={LinkRef} to="/teachers" key={`teachers`}>
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary={`المشايخ`} />
        </ListItem>
        <ListItem button onClick={onLogout} key={`Logout`}>
          <ListItemIcon>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary={`تسجيل الخروج`}  />
        </ListItem>
      </List>
      
    </Drawer>
  );
}
