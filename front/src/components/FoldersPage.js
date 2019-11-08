import React from "react";
import Grid from "@material-ui/core/Grid";
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
  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
var foldersArray = [];
class FoldersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { image: "", name: "", open: false, folders: [] };
    this.publishToFirestore = this.publishToFirestore.bind(this);
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
    const db = firebase.firestore();
    const folderRef = db
      .collection("folders")
      .add({
        name: this.state.name,
        image: this.state.image
      })
      .then(function() {
        console.log("Folders Successfully added");
        this.handleClose();
        this.fetchFolders();
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
  }

  fetchFolders() {
    const db = firebase.firestore();
    db.collection("folders")
      .get()
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
          return { id: doc.id, data: doc.data() };
        });
        console.log(data);
        this.setState({ folders: data });
      });
  }

  componentDidMount() {
    this.fetchFolders();
  }

  onClickCard(id) {
    console.log("you clicked on card: " + id);
  }

  goIntoFolder(id) {
    let path = `/folders/` + id;
    this.props.history.push(path);
  }

  render() {
    const { classes } = this.props;
    var { folders } = this.state;
    var renderFolders = folders.map(folder => (
      <Grid key={folder.id} xs={3} item>
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
              <CircularProgress color="secondary" />
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
          <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                {renderFolders}
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
              <TextField
                id="folder-image"
                className={classes.textField}
                label="Image du dossier"
                onChange={this.changeImage}
              />
            </form>
          </DialogContent>
          <Container>
            <Card className={classes.card}>
              <CardActionArea>
                {this.state.image ? (
                  <CardMedia
                    src=""
                    children=""
                    className={classes.media}
                    image={this.state.image}
                    title={this.state.name + " image."}
                  />
                ) : (
                  <CardMedia
                    sr
                    c=""
                    children=""
                    className={classes.media}
                    image="https://image.shutterstock.com/image-vector/picture-vector-icon-no-image-260nw-1350441335.jpg"
                    title={this.state.name + " image."}
                  />
                )}
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    className={classes.cardTitle}
                  >
                    {this.state.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Container>

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

FoldersPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(FoldersPage));
