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
    width: 300,
    maxHeight: 200
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
  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Tips extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, name: "", description: "", text: "", tips: [], isDialogFullScreen: false, gameId: this.props.match.params.id, charging: true };
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
        description: this.state.description,
        text: this.state.text,
        createdOn: new Date(),
        lastModifiedOn: new Date()
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
    this.setState({ charging: true });
    const db = firebase.firestore();
    db.collection("tips")
      .where("gameId", "==", this.props.match.params.id)
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
          return { id: doc.id, data: doc.data() };
        });
        this.setState({ tips: data, charging: false });
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


  render() {
    const { classes } = this.props;
    const { charging } = this.state;
    const modules = {
      toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
      ],
    };
    var date = new Date().getDay()

    const formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image'
    ];
    const { tips, text, isDialogFullScreen } = this.state;
    var renderTips = tips.map(tip => (
      <Grid key={tip.id} xs={3} item>
        <Card
          className={classes.card}
          onClick={() => this.goIntoTip(tip.id)}
        >
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
              <Typography>
                {tip.data.description || "Pas de description"}
              </Typography>
            </CardContent>
          </CardActionArea>
          {/* TODO: Handle la date */}
          {/* <Typography>Créée le: {
              tip.data.createdOn}</Typography> */}
        </Card>
      </Grid>
    ));
    return (
      <React.Fragment>
        <div className={classes.pageContent}>
          {charging ? <CircularProgress /> :

            <Grid container className={classes.root} spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  {renderTips}
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
                    console.log(value);
                  }}>
                </ReactQuill>
                <p></p>
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
