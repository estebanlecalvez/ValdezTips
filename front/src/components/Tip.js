import React from "react";
import { withStyles } from "@material-ui/styles";
import firebase from "firebase";
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import { Typography, Container, CircularProgress, Fab, Dialog, DialogContent, DialogTitle, Button, DialogActions, TextField, Card, CardContent } from "@material-ui/core";
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import ReactQuill from "react-quill";
import CenteredCircularProgress from "../utilsComponents/CenteredCircularProgress";
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
const styles = theme => ({
  pageContent: {
    margin: 100
  },
  floatingActionButton: {
    bottom: 20,
    right: 20,
    position: "fixed",
    color: "white",
    backgroundColor: "red",
    "&:hover": {
      backgroundColor: "darkRed",
      color: "lightGrey"
    }
  },
  backFAB: {
    top: 80,
    left: 20,
    position: "fixed",
  },
  floatingActionButtonTop: {
    top: 80,
    right: 20,
    position: "fixed",
    color: "white",
    backgroundColor: "green",
    "&:hover": {
      backgroundColor: "darkGreen",
      color: "lightGrey"
    }
  },
});

class Tip extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tip: {}, isDialogFullScreen: false, charging: true, openModification: false, openDeletion: false, newname: "", newdesc: "", newtext: "" };
    this.fetchTip = this.fetchTip.bind(this);
    this.deleteTip = this.deleteTip.bind(this);
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
    let path = `/folders/` + this.state.tip.gameId;
    this.props.history.push(path);
  }

  fetchTip() {
    const db = firebase.firestore();
    var currentTip = {}
    this.setState({ charging: true });
    var docRef = db.collection("tips").doc(this.props.match.params.id);
    docRef.get().then(doc => {
      if (doc.exists) {
        currentTip = doc.data();
        this.setState({
          tip: currentTip,
          newtext: currentTip.text,
          newdesc: currentTip.description,
          newname: currentTip.name,
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
    this.props.history.push("/folders/" + this.state.tip.gameId);
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

  render() {
    const { classes } = this.props;
    const { tip, charging, isDialogFullScreen, newname, newtext, newdesc } = this.state;
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
    return (
      <React.Fragment>

        <div className={classes.pageContent}>

          {charging ? <CenteredCircularProgress /> : (
            <React.Fragment>
              <Card elevation={10} >
                <CardContent>
                  <h1>
                    {tip.name}
                  </h1>
                  <div dangerouslySetInnerHTML={{ __html: "<Typography>" + tip.text + "</Typography>" }}></div>
                </CardContent>
              </Card>
              <Fab aria-label="delete" className={classes.floatingActionButton}>
                <DeleteIcon onClick={this.handleClickOpenDeletion} />
              </Fab>
              <Fab aria-label="modification" className={classes.floatingActionButtonTop}>
                <CreateIcon onClick={this.handleClickOpenModification} />
              </Fab>
              <Fab aria-label="back" className={classes.backFAB}>
                <KeyboardReturnIcon onClick={() => { this.back(); }} />
              </Fab>
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
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Tip);
