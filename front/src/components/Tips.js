import React from "react";
import Grid from "@material-ui/core/Grid";
import {
  Card,
  CardActionArea,
  CardMedia,
  Typography,
  CardContent,
  Fab,
  Button,
  TextField,
  Link,
  ButtonBase,
  Container,
  CircularProgress
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import PropTypes from "prop-types";
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
  editor: {
    height: 500
  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

class Tips extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, name: "", text: "", tips: [] };
    this.publishToFirestore = this.publishToFirestore.bind(this);
    this.fetchTips = this.fetchTips.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  publishToFirestore() {
    const db = firebase.firestore();
    const tipRef = db
      .collection("tips")
      .add({
        gameId: this.props.match.params.id,
        name: this.state.name,
        text: this.state.text
      })
      .then(function() {
        console.log("Tips Successfully added");
      })
      .catch(function(error) {
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
        console.log(data);
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
    const { gameId, classes } = this.props;
    const { tips, text } = this.state;
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
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"Créer une astuce"}
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
                    editor={ ClassicEditor }
                    data="<p>Hello from CKEditor 5!</p>"
                    onInit={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        console.log( { event, editor, data } );
                    } }
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    } }
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
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Tips);
