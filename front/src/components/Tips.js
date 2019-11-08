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
  Container
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
class Tips extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { gameId, classes } = this.props;
    return (
      <React.Fragment>
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
          <DialogContent>Bonjour</DialogContent>
          <Container>
            <Card className={classes.card}>
              <CardActionArea>
                <CardMedia
                  src=""
                  children=""
                  className={classes.media}
                  image={this.state.image}
                  title={this.state.name + " image."}
                />
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

export default withStyles(styles)(Tips);
