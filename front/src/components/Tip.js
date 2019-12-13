import React from "react";
import firebase from "firebase";
import { Container, Dialog, DialogContent, DialogTitle, Button, DialogActions, TextField, Card, CardContent, IconButton, CardHeader, Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem, CardActions, Avatar, Typography, Tooltip, withStyles } from "@material-ui/core";
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import ReactQuill from "react-quill";
import CenteredCircularProgress from "../utilsComponents/CenteredCircularProgress";
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import "./Tip.css";
const styles = ({
  keyboardReturnIcon: {
    marginTop: 10,
    marginLeft: "5vw",
    marginRight: "5vw",
    marginBottom: 10,
  },
  pageContent: {
    marginTop: 50,
    marginLeft: "5vw",
    marginRight: "5vw",
    marginBottom: 10,
  },
  paper: {
    height: 140,
    width: 100
  },
  floatingActionButton: {
    cursor: 'pointer',
    color: "red",
  },
  backFAB: {
    cursor: 'pointer',
    color: "blue",
  },
  floatingActionButtonTop: {
    cursor: 'pointer',
    color: "green",
  },
  modifyBtnContainer: {
    align: "right",
    float: "right",
    width: 25,
    height: 25,
    marginTop: 10,
    marginRight: 10
  },
  deleteBtnContainer: {
    align: "right",
    float: "right",
    width: 25,
    height: 25,
    marginBottom: 10,
    marginRight: 10
  },
  cardContent: {
    "& img": {
      maxWidth: "40vw",
      maxHeight: "40vh",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      transition: "0.3s",
      "&:hover": {
        height: "auto",
        maxHeight: "95vh",
        maxWidth: "80vw",
        width: "auto"
      }
    }
  },
  tipTitle: {
    color: "#3F51B5",
    fontSize: 20,
    borderRadius: 5,
    fontFamily: "arial",
    left: 0,
    padding: 10,
    overflow: "hidden",
    textAlign: "center",
  },
  tipInfos: {
    position: "absolute",
    right: "5vw",
  },
  tipContent: {
    marginTop: 30,
  },
  commentarySection: {
    margin: "5vw",
  },
  commentaire: {
    margin: 20,
    border: "1px solid #f0f0f0",
    borderRadius: 10,
  },
  commentaireHeader: {
    margin: 20,
  },
  userAvatar: {
    float: "left",
    marginRight: 20,
  },
  commentContent: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  }

});

class Tip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tip: {},
      isDialogFullScreen: false,
      charging: true,
      openModification: false,
      isMenuOpen: false,
      openDeletion: false,
      newname: "",
      newdesc: "",
      newtext: "",
      commentText: null,
      commentError: null,
      commentaires: []
    };

    this.fetchTip = this.fetchTip.bind(this);
    this.deleteTip = this.deleteTip.bind(this);
    this.inputRef = null;
    this.modifyTip = this.modifyTip.bind(this);
    this.handleClickOpenModification = this.handleClickOpenModification.bind(this);
    this.handleClickCloseModification = this.handleClickCloseModification.bind(this);
  }
  handleClickOpenDeletion = () => {
    this.setState({ openDeletion: true });
  };

  handleClickCloseDeletion = () => {
    this.setState({ openDeletion: false });
  };

  handleClickOpenModification() {
    this.setState({ openModification: true });
  }

  handleClickCloseModification() {
    this.setState({ openModification: false });
  }

  back() {
    let path = `/folders/` + this.state.tip.tip.gameId;
    this.props.history.push(path);
  }

  sendComment() {
    const { commentText, commentaires } = this.state;
    if (commentText) {
      this.setState({
        charging: true
      });
      const db = firebase.firestore();
      var newCommentaires = commentaires;
      console.log(localStorage["currentUserId"]);
      var userRef = db.collection("users").doc(localStorage["currentUserId"]);
      userRef.get().then((doc) => {
        var user = doc.data();
        console.log("successfully get the user.");
        console.log(doc.data());
        newCommentaires.push({ "content": commentText, "usersPseudo": user.pseudo, "usersImage": user.image, "usersId": localStorage["currentUserId"] });
        this.setState({
          commentError: "",
        });
        var docToUpdate = db.collection("tips").doc(this.props.match.params.id);
        docToUpdate.update({
          commentaires: newCommentaires
        }).catch(function (error) {
          console.error("Error writing document: ", error);
        });
      });
    } else {
      this.setState({ commentError: "Vous devez entrer un commentaire pour l'envoyer!" });
    }
    this.setState({ charging: false, });
  }

  fetchTip() {
    const db = firebase.firestore();
    var currentTip = {}
    this.setState({ charging: true });
    var docRef = db.collection("tips").doc(this.props.match.params.id);
    docRef.get().then(doc => {
      if (doc.exists) {
        currentTip = doc.data();
        if (currentTip.userId) {
          console.log("this tip have a user id");
          let userRef = db.collection("users").doc(currentTip.userId);
          userRef.get().then((user) => {
            let userDoc = { id: user.id, data: user.data() };
            console.log(userDoc);
            console.log(userDoc.id);
            this.setState({
              tip: { tip: currentTip, currentUser: userDoc },
              newtext: currentTip.text,
              newdesc: currentTip.description,
              newname: currentTip.name,
              charging: false,
              commentaires: currentTip.commentaires || [],
            });
          })
        } else {
          this.setState({
            tip: { tip: currentTip, currentUser: null },
            newtext: currentTip.text,
            newdesc: currentTip.description,
            newname: currentTip.name,
            charging: false
          })
        }

      } else {
        // doc.data() will be undefined in this case
        console.error("No such document!");
      }

    }).catch(function (error) {
      console.error("Error getting document:", error);
    });

  }
  componentDidMount() {
    this.fetchTip();
  }

  deleteTip() {
    const db = firebase.firestore();
    db.collection("tips").doc(this.props.match.params.id).delete().then(function () {
      this.handleClickCloseDeletion();
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
    this.props.history.push("/folders/" + this.state.tip.tip.gameId);
  }


  handleClickFullscreen = () => {
    this.setState({ isDialogFullScreen: true });

  };

  handleClickNotFullscreen = () => {
    this.setState({ isDialogFullScreen: false });
  };


  modifyTip() {
    const db = firebase.firestore();
    db.collection("tips").doc(this.props.match.params.id).update({
      text: this.state.newtext,
      description: this.state.newdesc,
      name: this.state.newname,
      createdOn: this.state.tip.tip.createdOn,
      lastModifiedOn: new Date()
    }).then(() => {
      this.handleClickCloseModification();
      this.fetchTip();
    });
  }

  changeName = event => {
    this.setState({
      newname: event.target.value
    });
  };

  changeDescription = event => {
    this.setState({
      newdesc: event.target.value
    });
  };

  handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      this.setState({ isMenuOpen: false });
    }
  }

  formatDate(seconds) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(seconds);
    var formattedTimestamp = Intl.DateTimeFormat('fr-FR', {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
    }).format(t);
    return formattedTimestamp;
  }

  render() {
    const { classes } = this.props;
    const { tip, charging, isDialogFullScreen, newname, newtext, newdesc, isMenuOpen, commentaires } = this.state;
    const modules = {
      toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
      ],
    };

    const formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image'
    ];

    var listCommentaires =
      commentaires != undefined ?
        commentaires.map(commentaire => {
          return <div className={classes.commentaire}>
            <div className={classes.commentaireHeader}>
              <Avatar className={classes.userAvatar} src={commentaire.usersImage} alt=""></Avatar>
              {commentaire.usersPseudo}
            </div>
            <div className={classes.commentContent} dangerouslySetInnerHTML={{ __html: commentaire.content }}></div>
          </div>
        }) : null;
    return (
      <div className={classes.root}>
        <div className={classes.keyboardReturnIcon}>
          <KeyboardReturnIcon className={classes.backFAB} onClick={() => { this.back(); }} />
        </div>

        <div className={classes.pageContent}>
          {charging ? <CenteredCircularProgress /> : (
            <React.Fragment>
              <div>
                <div className={classes.tipTitle}>
                  {tip.tip.name.toUpperCase()}
                </div>

                {tip.currentUser != null ?
                  localStorage["currentUserId"] === tip.currentUser.id ?
                    <IconButton className={classes.tipInfos} aria-label="settings"
                      onClick={() => { this.setState({ isMenuOpen: !isMenuOpen }) }}>
                      <MoreVertIcon ref={inputRef => { this.inputRef = inputRef }}
                        aria-controls={isMenuOpen ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                      />
                    </IconButton>
                    :
                    null
                  : null
                }
              </div>

              Créé le: {this.formatDate(tip.tip.createdOn.seconds)}
              {tip.currentUser != null ?
                <div className={classes.tipInfosAvatar}>
                  <Tooltip title={tip.currentUser.data.name} placement="right">
                    <Avatar src={tip.currentUser.data.image} alt=""></Avatar>
                  </Tooltip>
                </div>
                : <Tooltip title="Utilisateur inconnu" placement="right">
                  <Avatar children="?" alt=""></Avatar>
                </Tooltip>
              }
              <div>
                <Popper open={isMenuOpen} anchorEl={this.inputRef} role={undefined} transition disablePortal>
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={() => {
                          this.setState({
                            isMenuOpen: false
                          });
                        }}>
                          <MenuList autoFocusItem={isMenuOpen} id="menu-list-grow" onKeyDown={(event) => { this.handleListKeyDown(event); }}>
                            <MenuItem onClick={this.handleClickOpenModification}  >
                              Modifier
                              </MenuItem>
                            <MenuItem onClick={this.handleClickOpenDeletion} >
                              Supprimer
                              </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>
              <div className={classes.tipContent} dangerouslySetInnerHTML={{ __html: tip.tip.text }}></div>


              <div className={classes.commentarySection}>
                {listCommentaires}
                <div className={classes.tipTitle}>
                  Poster un commentaire.
                </div>
                <div className={classes.reactQuill}>
                  <ReactQuill
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    onChange={(value) => {
                      this.setState({ commentText: value });
                    }}>
                  </ReactQuill>
                  {this.state.commentError}
                  <Button onClick={() => {
                    this.sendComment();
                  }} className={classes.tipInfos} style={{ marginRight: "5vw" }}>Envoyer</Button>
                </div>
              </div>
            </React.Fragment>
          )
          }

          <Dialog
            open={this.state.openDeletion}
            onClose={this.handleClickCloseDeletion}
          > <DialogTitle id="alert-dialog-slide-title">
              {"Etes vous sûr?"}
            </DialogTitle>
            <DialogContent>
              Cette action est irréversible
              </DialogContent>
            <DialogActions>
              <Button onClick={this.deleteTip} color="primary">
                Supprimer
            </Button>
              <Button onClick={this.handleClickCloseDeletion} color="primary">
                Annuler
            </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={this.state.openModification}
            fullWidth
            fullScreen={isDialogFullScreen}
            onClose={this.handleClickCloseModification}
            className={classes.dialog}
          >
            <DialogTitle id="alert-dialog-slide-title">
              {"Créer une astuce"}
              {isDialogFullScreen ?
                <Button onClick={this.handleClickNotFullscreen}><FullscreenExitIcon /></Button> :
                <Button onClick={this.handleClickFullscreen}><FullscreenIcon /></Button>
              }
            </DialogTitle>

            <DialogContent>
              <form noValidate autoComplete="off">
                <TextField
                  id="tip-name"
                  className={classes.textField}
                  label="Nom de l'astuce"
                  value={newname}
                  onChange={this.changeName}
                />
                <p></p>
                <TextField
                  id="tip-description"
                  className={classes.textField}
                  label="Description de l'astuce"
                  value={newdesc}
                  onChange={this.changeDescription}
                />
                <p></p>
                <p>Contenu de l'astuce</p>
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  value={newtext}
                  onChange={(value) => {
                    this.setState({ newtext: value });
                  }}>
                </ReactQuill>
                <p></p>
              </form>
            </DialogContent>

            {charging ? null :
              <DialogActions>
                <Button onClick={this.modifyTip} color="primary">
                  Modifier
            </Button>
                <Button onClick={this.handleClickCloseModification} color="primary">
                  Annuler
            </Button>
              </DialogActions>
            }
          </Dialog>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Tip);
