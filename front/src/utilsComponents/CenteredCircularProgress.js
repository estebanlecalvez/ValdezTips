import { CircularProgress, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";

const styles = ({
    centeredCircularProgress: {
        color: 'darkBlue'
    }
});

class CenteredCircularProgress extends React.Component {

    render() {
        const { size, className, classes } = this.props;

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
