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
import { Button } from "@material-ui/core";
import Tips from "./components/Tips";

const useStyles = makeStyles(theme => ({
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
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
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
  }
}));

export default function SearchAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
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
          </Toolbar>
        </AppBar>
        <Switch>
          <Route path="/folders/:id" component={Tips} />
          <Route path="/folders">
            <FoldersPage />
          </Route>
          <Route path="/">
            <FoldersPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
