import React from "react";
import Grid from "@material-ui/core/Grid";
import {
  Card,
  CardActionArea,
  Typography,
  CardContent,
  Fab,
  Button,
  TextField,

} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { withStyles } from "@material-ui/styles";
import firebase from "firebase";

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  pageContent: {
    margin: 100
  },
  paper: {
    height: 140,
    width: 100
  },

  card: {
    width: 300
  },
  media: {
    height: 140
  },
  cardTitle: {
    align: "center"
  },
  floatingActionButton: {
    bottom: 20,
    right: 20,
    position: "fixed",
    color: "white",
    backgroundColor: "green",
    "&:hover": {
      backgroundColor: "darkGreen",
      color: "lightGrey"
    }
  },
  textField: {
    width: "20vw"
  },
  linkCard: {
    color: "none"
  },
  tipText: {},
  dialog: {
    minWidth: "70vh",
    maxWidth: "70vh"
  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Tips extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, name: "", text: "", tips: [], isDialogFullScreen: false, gameId: this.props.match.params.id };
    console.log(this.state.gameId);
    this.publishToFirestore = this.publishToFirestore.bind(this);
    this.fetchTips = this.fetchTips.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClickNotFullscreen = this.handleClickNotFullscreen.bind(this);
  }

  publishToFirestore() {
    const db = firebase.firestore();
    db
      .collection("tips")
      .add({
        gameId: this.props.match.params.id,
        name: this.state.name,
        text: this.state.text
      })
      .then(function () {
        console.log("Tips Successfully added");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
    this.handleClose();
    this.fetchTips();
  }

  fetchTips() {
    const db = firebase.firestore();
    db.collection("tips")
      .where("gameId", "==", this.props.match.params.id)
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
          return { id: doc.id, data: doc.data() };
        });
        this.setState({ tips: data });
      });
  }

  componentDidMount() {
    this.fetchTips();
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleClickFullscreen = () => {
    this.setState({ isDialogFullScreen: true });

  };

  handleClickNotFullscreen = () => {
    this.setState({ isDialogFullScreen: false });
  };

  changeName = event => {
    this.setState({
      name: event.target.value
    });
  };

  changeText = event => {
    this.setState({
      text: event.target.value
    });
  };

  render() {
    const { classes } = this.props;
    const { tips, text, isDialogFullScreen } = this.state;
    var renderTips = tips.map(tip => (
      <Grid key={tip.id} xs={3} item>
        <Card className={classes.card}>
          <CardActionArea>
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="h2"
                className={classes.cardTitle}
              >
                {tip.data.name}
              </Typography>

              <Typography className={classes.tipsText}>
                {tip.data.text}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    ));
    return (
      <React.Fragment>
        <div className={classes.pageContent}>
          <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                {renderTips}
              </Grid>
            </Grid>
          </Grid>
        </div>
        <Fab aria-label="add" className={classes.floatingActionButton}>
          <AddIcon onClick={this.handleClickOpen} />
        </Fab>
        <div>
          <Dialog
            open={this.state.open}
            TransitionComponent={Transition}
            fullWidth
            fullScreen={isDialogFullScreen}
            onClose={this.handleClose}
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
                  onChange={this.changeName}
                />
                <p></p>
                <div>
                  <CKEditor
                    editor={ClassicEditor}
                    data="<p>Hello from CKEditor 5!</p>"
                    onInit={editor => {
                      // You can store the "editor" and use when it is needed.
                    }}
                    onChange={(event, editor) => {
                      this.setState({
                        text: editor.getData()
                      });
                      console.log(text);
                    }}
                  />
                </div>
              </form>
            </DialogContent>

            <DialogActions>
              <Button onClick={this.publishToFirestore} color="primary">
                Créer
            </Button>
              <Button onClick={this.handleClose} color="primary">
                Annuler
            </Button>
            </DialogActions>
          </Dialog>
        </div >
      </React.Fragment >
    );
  }
}

export default withStyles(styles)(Tips);
