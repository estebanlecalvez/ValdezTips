import React from "react";
import Grid from "@material-ui/core/Grid";
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import {
  Card,
  CardActionArea,
  Typography,
  CardContent,
  Fab,
  Button,
  TextField,
  Avatar,
  CircularProgress,
  CardActions,
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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CenteredCircularProgress from "../utilsComponents/CenteredCircularProgress";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  pageContent: {
    marginTop: 10,
    marginLeft: "5vw",
    marginRight: "5vw",
    marginBottom: 10,
    "& img": {
      maxWidth: "80vw"
    }
  },
  paper: {
    height: 140,
    width: 100
  },
  card: {
    minWidth: 50,
    maxHeight: 250,
    width: 300,
    maxWidth: "90vw"
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
  dialog: {
    minHeight: "50vh"
  },
  backFAB: {
    marginBottom: 10,
    cursor: 'pointer',
    color: "blue",
  },
  cardAvatar: {
    marginLeft: 'auto',
    marginBottom: 10
  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Tips extends React.Component {
  constructor(props) {
    super(props);

    this.state = { open: false, name: "", description: "", text: "", newTips: null, tips: null, isThereAnyData: true, isDialogFullScreen: false, gameId: this.props.match.params.id, charging: true };
    this.publishToFirestore = this.publishToFirestore.bind(this);
    this.fetchTips = this.fetchTips.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClickNotFullscreen = this.handleClickNotFullscreen.bind(this);
  }

  publishToFirestore() {
    if (this.state.name && this.state.text) {
      const db = firebase.firestore();
      db
        .collection("tips")
        .add({
          gameId: this.props.match.params.id,
          userId: localStorage["currentUserId"],
          name: this.state.name,
          description: this.state.description,
          text: this.state.text,
          createdOn: new Date(),
          lastModifiedOn: null
        })
        .then(function () {
          this.handleClose();
          this.fetchTips();
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
      this.setState({
        error: ""
      });
      this.handleClose();
      this.fetchTips();
    } else {
      this.setState({
        error: "Vous devez donner au moins un nom et une description."
      });
    }

  }

  fetchTips() {
    const db = firebase.firestore();
    this.setState({ charging: true });
    db.collection("tips")
      .where("gameId", "==", this.props.match.params.id)
      .get()
      .then(snap => {
        if (snap.docs.length === 0) {
          this.setState({ isThereAnyData: false, charging: false });
        } else {
          const data = snap.docs.map(doc => {
            return { id: doc.id, data: doc.data() };
          });

          let tipsWithUserInside = [];
          let actualNumber = 0;
          data.forEach((item, index, array) => {
            if (item.data.userId) {
              let userRef = db.collection("users").doc(item.data.userId);
              userRef.get().then((user) => {
                const updatedTipWithUser = { tip: item, userRef: user.data() };
                tipsWithUserInside.push(updatedTipWithUser);
                this.setState({ tips: tipsWithUserInside });
              });
            } else {
              tipsWithUserInside.push({ tip: item, userRef: null });
              this.setState({ tips: tipsWithUserInside });
            }
          });
          this.setState({ charging: false });

        }
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

  changeDescription = event => {
    this.setState({
      description: event.target.value
    });
  };

  changeText = event => {
    this.setState({
      text: event.target.value
    });
  };

  goIntoTip(id) {
    let path = `/tip/` + id;
    this.props.history.push(path);
  }

  back() {
    let path = `/`;
    this.props.history.push(path);
  }

  render() {
    const { classes } = this.props;
    const { tips, isDialogFullScreen } = this.state;
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
          <KeyboardReturnIcon className={classes.backFAB} onClick={() => { this.back(); }} />
          {this.state.charging ? <CenteredCircularProgress /> :
            <Grid container className={classes.root} >
              <Grid>
                <Grid container spacing={5}>

                  {this.state.isThereAnyData && this.state.tips != null ?
                    this.state.tips.map(tip => (
                      <Grid key={tip.tip.id} xs={"auto"} item>
                        <Card
                          className={classes.card}
                          onClick={() => this.goIntoTip(tip.tip.id)}
                        >
                          <CardActionArea>
                            <CardContent>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                                className={classes.cardTitle}
                              >
                                {tip.tip.data.name}
                              </Typography>
                              <Typography>
                                {tip.tip.data.description || "Pas de description"}
                              </Typography>
                            </CardContent>
                            <CardActions>
                              {tip.userRef != null ?
                                <React.Fragment>
                                  <Typography className={classes.cardAvatar}>{tip.userRef.name}</Typography>
                                  <Avatar className={classes.cardAvatar} src={tip.userRef.image} alt=""></Avatar>
                                </React.Fragment>
                                : <React.Fragment>
                                  <Typography className={classes.cardAvatar}>Utilisateur inconnu</Typography>
                                  <Avatar className={classes.cardAvatar} children='?' alt=""></Avatar>
                                </React.Fragment>
                              }
                            </CardActions>

                          </CardActionArea>
                        </Card>
                      </Grid>))
                    : this.state.tips === null && !this.state.isThereAnyData ?
                      <React.Fragment>
                        <Grid
                          container
                          direction="column"
                          alignItems="center"
                          justify="center"
                          style={{ minHeight: '60vh' }}
                        >
                          <Grid item xs={12} sm={6}>
                            <h1> Il n'y a rien ici... :'(</h1>
                            <p>N'hésite pas à ajouter des astuces</p>
                          </Grid>
                        </Grid>
                      </React.Fragment>
                      : null}
                </Grid>
              </Grid>
            </Grid>
          }
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
                  onChange={this.changeName}
                />
                <p></p>
                <TextField
                  id="tip-description"
                  className={classes.textField}
                  label="Description de l'astuce"
                  onChange={this.changeDescription}
                />
                <p></p>
                <p>Contenu de l'astuce</p>
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  onChange={(value) => {
                    this.setState({ text: value });
                  }}>
                </ReactQuill>
                <p>{this.state.error}</p>
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
