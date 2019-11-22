import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import { fade } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import FoldersPage from "./components/FoldersPage";
import { Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem, Avatar, Dialog, DialogTitle, DialogContent, TextField, Typography, CircularProgress, Container, Link, CardMedia, Card } from "@material-ui/core";
import Tips from "./components/Tips";
import Tip from "./components/Tip";
import { withStyles } from "@material-ui/core/styles";
import firebase from 'firebase';
import Login from "./components/Login";
import MyAccount from "./components/MyAccount";
import CreateIcon from '@material-ui/icons/Create';
import "./App.css";

const styles = theme => ({
  root: {
    flexGrow: 1
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
    width: 200,
    [theme.breakpoints.up("sm")]: {
      width: 200,
    }
  },
  appbar: {
    height: 60
  },
  account_picture: {
    height: "10vh",
    width: "10vh"
  },
  alignRight: {
    position: "absolute",
    right: 15,
    top: 15,
    align: "right",
  },
  menuItem: {
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30
  },
  menuItemFolders: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 0,
    paddingBottom: 5
  },
  menuItemFoldersName: {
    marginLeft: 10
  },
  searchResults: {
    width: "auto"
  },
  card: {
    height: 50,
    width: 80
  },
  media: {
    height: 50,
  },
  menuTitle: {
    backgroundColor: "#f5f5f5",
    padding: 5,
    paddingLeft: 15,
    fontSize: 18,
    color: "#750000"
  }
});

class SearchAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isSearchCharging: false, isAUserConnected: false, searchTerms: null, charging: false, searchResults: null, searchResultsUnfiltered: null, isMenuOpen: false, isSearchMenuOpen: false, openMyAccount: false, user: null, modifiedMyAccount: false };
    this.inputRef = null;
  }

  componentDidMount() {
    // Les valeurs dans le localStorage sont toujours des strings, pour ça qu'on vérifie "null" et non pas null
    if (localStorage["currentUserId"] !== "null") {
      this.setState({
        isAUserConnected: true
      });
      this.fetchFoldersAndTips();
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
        this.setState({
          user: currentUser,
          charging: false
        })
      } else {
      }

    }).catch(function (error) {
    });

  }

  goIntoFolder(id) {
    console.log(this.props);
    let path = `/folders/` + id;
    window.location.href = path;

  }

  goIntoTip(id) {
    console.log(this.props);
    let path = `/tip/` + id;
    window.location.href = path;
  }

  fetchFoldersAndTips() {
    const results = { tips: [], folders: [] };
    const db = firebase.firestore();
    db.collection("folders")
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
          return { id: doc.id, data: doc.data() };
        });
        results.folders.push(data);
      });
    db.collection("tips")
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
          return { id: doc.id, data: doc.data() };
        });
        results.tips.push(data);
      });
    this.setState({ searchResultsUnfiltered: results });
    console.log("See all the results : ", results);
  }


  search(value) {
    const results = { tips: [], folders: [] };
    this.setState({ isSearchCharging: true });
    if (this.state.searchResultsUnfiltered.folders[0]) {
      this.state.searchResultsUnfiltered.folders[0].forEach((result, index) => {
        if (result.data.name.toLowerCase().includes(value.toLowerCase())) {
          results.folders.push(result);
        }
        // if (index == this.state.searchResultsUnfiltered.length - 1) {
        //   this.setState({ searchResults: results, isSearchCharging: false });
        // }
      })
    }
    if (this.state.searchResultsUnfiltered.tips[0]) {
      this.state.searchResultsUnfiltered.tips[0].forEach((result, index) => {
        if (result.data.name.toLowerCase().includes(value.toLowerCase())) {
          results.tips.push(result);
        }
      })
    }
    console.log("current searchResults after foreaching each folders and tips:", this.state.searchResults);
    this.setState({ searchResults: results, isSearchCharging: false });

  }

  handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      this.setState({ isMenuOpen: false });
    }
  }


  render() {
    const { classes } = this.props;
    const { isAUserConnected, user, isMenuOpen, isSearchMenuOpen, modifiedMyAccount, isSearchCharging } = this.state;

    const myAccount = <Dialog
      open={this.state.openMyAccount}
      onClose={() => { this.setState({ openMyAccount: false }) }}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        Mon compte
        <CreateIcon className={classes.alignRight} onClick={
          () => {
            this.setState({
              modifiedMyAccount: !this.state.modifiedMyAccount
            })
          }
        } />
      </DialogTitle>
      <DialogContent>
        {user ?
          modifiedMyAccount ?
            <React.Fragment>
              <Avatar className={classes.account_picture} src={user.image} />
              <TextField className={classes.TextField} label="Nom" />
              <p></p>
              <TextField className={classes.TextField} label="Prénom" />
              <p></p>
              <TextField className={classes.TextField} label="Email" />
              <p></p>
              <TextField className={classes.TextField} label="Pseudo" />
            </React.Fragment>
            :
            <React.Fragment>
              <Avatar className={classes.account_picture} src={user.image} />
              <p>Mon nom: {user.lastname}</p>
              <p>Mon prénom: {user.name}</p>
              <p>Mon email: {user.email}</p>
              <p>Mon pseudo: {user.pseudo}</p>
            </React.Fragment>
          : null}
      </DialogContent>
    </Dialog>;

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
                  href="/"
                >
                  <AcUnitIcon />
                </IconButton>
                <Typography className={classes.title} href="/">
                  Valdez Tips
                </Typography>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>

                  <InputBase
                    placeholder="Search for game..."
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput
                    }}
                    onClick={() => {
                      if (this.state.searchResults != null) {
                        this.setState({ isSearchMenuOpen: !isSearchMenuOpen });
                      }
                    }}
                    onChange={(event) => {
                      this.setState({ isSearchMenuOpen: true });
                      this.search(event.target.value);
                    }}
                    inputProps={{ "aria-label": "search" }}
                    aria-controls={isSearchMenuOpen ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    ref={searchMenuRef => { this.searchMenuRef = searchMenuRef }}
                  />
                </div>
                {user ?
                  <IconButton aria-label="settings"
                    onClick={() => { this.setState({ isMenuOpen: !isMenuOpen }) }}>
                    <Avatar
                      aria-controls={isMenuOpen ? 'menu-list-grow' : undefined}
                      aria-haspopup="true"
                      src={user.image}
                      ref={inputRef => { this.inputRef = inputRef }}
                      alt="Current user." />
                  </IconButton>
                  :
                  <Avatar alt=""></Avatar>}
                <div>
                  <Popper open={isMenuOpen} anchorEl={this.inputRef} role={undefined} transition>
                    {({ TransitionProps }) => (
                      <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: 'auto' }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={() => {
                            this.setState({
                              isMenuOpen: false
                            });
                          }}>
                            <MenuList autoFocusItem={isMenuOpen} id="menu-list-grow" onKeyDown={(event) => { this.handleListKeyDown(event); }}>
                              <MenuItem className={classes.menuItem} onClick={() => {
                                this.setState({
                                  openMyAccount: true
                                })
                              }}>
                                Mon compte
                              </MenuItem>
                              <MenuItem className={classes.menuItem} onClick={() => {
                                localStorage["currentUserId"] = null;
                                this.setState({
                                  isAUserConnected: false,
                                });
                              }} >
                                Déconnexion
                              </MenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </div>
                <div>
                  <Popper open={isSearchMenuOpen} anchorEl={this.searchMenuRef} role={undefined} transition>
                    {({ TransitionProps }) => (
                      <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: 'auto' }}
                      >
                        <Paper className={classes.searchResults}>
                          <ClickAwayListener onClickAway={() => {
                            this.setState({
                              isSearchMenuOpen: false
                            });
                          }}>
                            <MenuList id="search-menu-grow" >
                              {this.state.searchResults == null ? <Container>
                                <CircularProgress />
                              </Container> :
                                <div>
                                  <Typography className={classes.menuTitle} key="folders_title" >
                                    Jeux
                                  </Typography>
                                  {this.state.searchResults.folders != null ?
                                    this.state.searchResults.folders.map(folder => (
                                      <MenuItem className={classes.menuItemFolders} onClick={() => {
                                        this.goIntoFolder(folder.id)
                                      }}>
                                        <Card className={classes.card}>
                                          <CardMedia
                                            className={classes.media}
                                            image={folder.data.image} />

                                        </Card>
                                        <p className={classes.menuItemFoldersName}>{folder.data.name}</p>

                                      </MenuItem>
                                    ))


                                    :
                                    null
                                  }
                                  <Typography className={classes.menuTitle} key="tips_title">
                                    Tips
                                  </Typography>
                                  {this.state.searchResults.tips != null ?
                                    this.state.searchResults.tips.map(tip => (
                                      <MenuItem onClick={() => {
                                        this.goIntoTip(tip.id)
                                      }}>
                                        {tip.data.name}
                                      </MenuItem>
                                    ))
                                    :
                                    null}
                                </div>
                              }
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </div>
                {myAccount}
              </Toolbar>
            </AppBar>
            <Switch>
              <Route path="/tip/:id" component={Tip} />

              <Route path="/folders/:id" component={Tips} />
              <Route path="/folders">
                <FoldersPage />
              </Route>
              <Route path="/my_account" >
                <MyAccount />
              </Route>
              <Route path="/">
                <FoldersPage />
              </Route>
            </Switch>

          </Router>
          :
          <Login />
        }
      </div>
    );
  }
}
export default withStyles(styles)(SearchAppBar);