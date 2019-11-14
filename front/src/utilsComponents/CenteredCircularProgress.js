import { CircularProgress, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";

const styles = theme => ({
    centeredCircularProgress: {
        color: 'darkBlue'
    }
});

class CenteredCircularProgress extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { color, size, className, classes } = this.props;

        return (
            <React.Fragment>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{ height: '60vh' }}
                >
                    <Grid item xs={3}>
                        <CircularProgress className={className || classes.centeredCircularProgress} size={size || 80} />
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }

}

export default withStyles(styles)(CenteredCircularProgress);
