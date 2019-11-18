import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import FoldersPage from "./components/FoldersPage";
import { Button, Avatar, CircularProgress } from "@material-ui/core";
import Tips from "./components/Tips";
import Tip from "./components/Tip";
import { withStyles } from "@material-ui/core/styles";
import NotLoggedIn from "./components/NotLoggedIn";
import DeleteIcon from '@material-ui/icons/Delete';
import firebase from 'firebase';
import Login from "./components/Login";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appbar: {
    backgroundColor: "green"
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    display: "none",
    color: "white",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  user: {
    position: "fixed",
    left: 0,
    top: 0
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    marginRight: 50,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200
      }
    }
  },
  appbar: {
    height: 60
  }
});

class SearchAppBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isAUserConnected: false, searchTerms: null, charging: false }
  }

  componentDidMount() {
    // Les valeurs dans le localStorage sont toujours des strings, pour ça qu'on vérifie "null" et non pas null
    if (localStorage["currentUserId"] != "null") {
      this.setState({
        isAUserConnected: true
      });
      this.getUser();
    } else {
      this.setState({
        isAUserConnected: false
      });
    }
  }

  getCurrentUserId() {
    return localStorage["currentUserId"];
  }

  getUser() {
    const db = firebase.firestore();
    var currentUser = {}
    this.setState({ charging: true });
    var docRef = db.collection("users").doc(this.getCurrentUserId());
    docRef.get().then(doc => {
      if (doc.exists) {
        currentUser = doc.data();
        console.log(currentUser);
        this.setState({
          user: currentUser,
          charging: false
        })
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }

    }).catch(function (error) {
      console.log("Error getting document:", error);
    });

  }
  render() {
    const { classes } = this.props;
    const { isAUserConnected, user } = this.state;
    return (
      <div className={classes.root}>
        {isAUserConnected ?
          <Router>
            <AppBar position="static" className={classes.appbar}>
              <Toolbar>
                <IconButton
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="open drawer"
                >
                  <AcUnitIcon />
                </IconButton>
                <Button className={classes.title} href="/">
                  Parcourir les jeux
            </Button>

                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>

                  <InputBase
                    placeholder="Search…"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput
                    }}
                    inputProps={{ "aria-label": "search" }}
                  />
                </div>
                {user ? <Avatar src={user.image} alt="Current user."></Avatar> : <Avatar alt=""></Avatar>}
                <DeleteIcon onClick={() => {
                  localStorage["currentUserId"] = null
                  this.setState({
                    isAUserConnected: false,
                  });
                }} />

              </Toolbar>
            </AppBar>
            <Switch>
              <Route path="/tip/:id" component={Tip} />
              <Route path="/folders/:id" component={Tips} />
              <Route path="/folders">
                <FoldersPage />
              </Route>
              <Route path="/">
                <FoldersPage />
              </Route>
            </Switch>
          </Router>
          :
          <Login />}
      </div>
    );
  }
}
export default withStyles(styles)(SearchAppBar);