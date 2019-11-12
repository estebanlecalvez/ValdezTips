import React from "react";
import { withStyles } from "@material-ui/styles";
import firebase from "firebase";
import { Typography, Container, CircularProgress } from "@material-ui/core";

const styles = theme => ({
  pageContent: {
    margin: 100
  },
});

class Tip extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tip: {}, charging: true };
    this.fetchTip = this.fetchTip.bind(this);
  }


  fetchTip() {
    const db = firebase.firestore();
    var currentTip = {}
    var docRef = db.collection("tips").doc(this.props.match.params.id);
    docRef.get().then(doc => {
      if (doc.exists) {
        currentTip = doc.data();
        console.log("Document data:", doc.data());
        this.setState({
          tip: currentTip,
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
    console.log("state after fetchTip in cdm", this.state);
  }

  render() {
    const { classes } = this.props;

    const { tip, charging } = this.state;
    console.log("state in render", this.state);
    return (
      <React.Fragment>
        <div className={classes.pageContent}>
          {charging ? <CircularProgress /> : (
            <React.Fragment>
              <h1>
                {tip.name}
              </h1>
              <div dangerouslySetInnerHTML={{ __html: "<Typography>" + tip.text + "</Typography>" }}></div>
            </React.Fragment>
          )
          }

        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Tip);
