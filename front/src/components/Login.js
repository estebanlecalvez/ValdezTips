import React from "react";
import { Card, Button, CardHeader, CardContent, CardActions, Grid, TextField } from "@material-ui/core";
import { fade, makeStyles, withStyles } from "@material-ui/core/styles";

const styles = theme => ({

    card: {
        padding: 20,
        paddingTop: 50,
        paddingBottom: 50
    }
});
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.signIn = this.signIn.bind(this);
        this.state = {
            email: { value: null, error: false, helperText: null },
            password: { value: null, error: false, helperText: null }
        };
    }

    signIn(e) {
        if (this.emailInput.value === "") {
            this.setState({
                email: {
                    value: this.emailInput.value,
                    error: true,
                    helperText: "Your email must be specified."
                }
            });
            this.emailInput.focus();
        }
        e.preventDefault();
    }

    render() {
        const { classes } = this.props;
        return (
            <div style={{ background: 'linear-gradient(to right bottom, #001f80, #7597ff)' }}>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '100vh' }}
                >
                    <Grid item xs={12} sm={6}>
                        <Card className={classes.card}>
                            <form onSubmit={this.signIn.bind(this)}>
                                <CardHeader title="Connexion" className={classes.headerConnexionForm} />
                                <CardContent>
                                    <TextField
                                        label="Email"
                                        fullWidth
                                        autoFocus
                                        required
                                        inputRef={input => (this.emailInput = input)}
                                        error={this.state.email.error}
                                        helperText={this.state.email.helperText}
                                    />
                                    <TextField
                                        label="Mot de passe"
                                        fullWidth
                                        required
                                        type="password"
                                        inputRef={input => (this.passwordInput = input)}
                                    />
                                    <p></p>
                                </CardContent>
                                <CardActions style={{ justifyContent: "space-between" }}>
                                    <Button>Mot de passe oublié?</Button>
                                    <Button type="submit" color="primary" raised>
                                        Se connecter
                    </Button>
                                </CardActions>
                            </form>
                        </Card>
                    </Grid>
                </Grid>
            </div >
        );
    }
}
export default withStyles(styles)(Login);