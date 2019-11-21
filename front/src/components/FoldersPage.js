import React from "react";
import Grid from "@material-ui/core/Grid";
import CreateIcon from '@material-ui/icons/Create';

import { withRouter } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardMedia,
  Typography,
  CardContent,
  Fab,
  Button,
  TextField,
  Container,
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
import CenteredCircularProgress from "../utilsComponents/CenteredCircularProgress";

import ImageSelectPreview from 'react-image-select-pv';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  pageContent: {
    margin: "5vh"
  },
  paper: {
    height: 140,
    width: 100
  },

  card: {
    minWidth: 50,
    maxHeight: 210,
    width: 300,
    maxWidth: "90vw"
  },
  media: {
    height: 150
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
  fabOnImage: {
    top: 10,
    left: 250,
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
});
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
class FoldersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { image: "", name: "", open: false, folders: [], charging: true, selectImage: true, error: "" };
    this.publishToFirestore = this.publishToFirestore.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.fetchFolders = this.fetchFolders.bind(this);
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

  changeImage = event => {
    this.setState({
      image: event.target.value
    });
  };

  publishToFirestore() {
    if (this.state.image && this.state.name) {
      const db = firebase.firestore();
      db
        .collection("folders")
        .add({
          name: this.state.name,
          image: this.state.image
        })
        .then(function () {
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
      this.setState({ error: "" });
      this.handleClose();
      this.fetchFolders();
    } else {
      this.setState({ error: "Vous devez entrer un nom et une image." });
    }

  }

  fetchFolders() {
    const db = firebase.firestore();

    db.collection("folders")
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
          return { id: doc.id, data: doc.data() };
        });
        this.setState({ folders: data, charging: false });
      });


  }

  componentDidMount() {
    this.fetchFolders();
  }

  goIntoFolder(id) {
    let path = `/folders/` + id;
    this.props.history.push(path);
  }



  render() {
    const { classes } = this.props;
    var { folders, charging, image, name, selectImage, error } = this.state;
    var renderFolders = folders.map(folder => (
      <Grid key={folder.id} xs={"auto"} item>
        <Card
          className={classes.card}
          onClick={() => this.goIntoFolder(folder.id)}
        >
          <CardActionArea>
            {folder.data.image ? (
              <CardMedia
                src=""
                children=""
                className={classes.media}
                image={folder.data.image}
                title={folder.data.name + " image."}
              />
            ) : (
                <CenteredCircularProgress />
              )}
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="h2"
                className={classes.cardTitle}
              >
                {folder.data.name}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    ));
    return (
      <React.Fragment>
        <div className={classes.pageContent}>
          {charging ? <CenteredCircularProgress /> :
            <Grid container className={classes.root} >
              <Grid>
                <Grid container spacing={5}>
                  {renderFolders}
                </Grid>
              </Grid>
            </Grid>
          }
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
            {"Créer un dossier"}
          </DialogTitle>
          <DialogContent>
            <form noValidate autoComplete="off">
              <TextField
                id="folder-name"
                className={classes.textField}
                label="Nom du dossier"
                onChange={this.changeName}
              />
              <p></p>
              {/* <TextField
                id="folder-image"
                className={classes.textField}
                label="Image du dossier"
                onChange={this.changeImage}
              /> */}
              {selectImage ? <ImageSelectPreview
                onChange={data => {
                  this.setState({
                    image: data[0].content,
                    selectImage: false
                  });
                }} /> :
                null
              }
            </form>
          </DialogContent>
          {image || name ? (
            <Container>
              <Card className={classes.card}>
                <CardMedia
                  src=""
                  className={classes.media}
                  title={name + " image."}
                  children={image ? <Fab aria-label="modify_picture" className={classes.fabOnImage} size="small">
                    <CreateIcon onClick={() => {
                      this.setState({
                        selectImage: true,
                      });
                    }} />
                  </Fab> : null}
                />

                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    className={classes.cardTitle}
                  >
                    {name}
                  </Typography>
                </CardContent>
              </Card>
            </Container>
          ) : null}
          <DialogActions>
            <p>{error}</p>

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

FoldersPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(FoldersPage));
