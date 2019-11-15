import React from "react";
import { Card, Button, CardHeader, CardContent, CardActions, Grid, TextField } from "@material-ui/core";
import { fade, makeStyles, withStyles } from "@material-ui/core/styles";
import firebase from "firebase";
import App from '../App';


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
            isLoginForm: true,
            error: null,
            email: { value: null, error: false, helperText: null },
            password: { value: null, error: false, helperText: null }
        };
    }


    signIn() {
        const { email, password } = this.state;
        const firebaseAuth = firebase.auth();
        const db = firebase.firestore();
        if (email && password) {
            firebaseAuth.signInWithEmailAndPassword(email.value, password.value).then((response) => {
                console.log(response);
                this.setState({ isLoggedIn: true, token: response.user.getIdToken });
            }).catch((error) => {
                this.setState({ error: error.message });
            })
        }
    }

    register() {
        const { email, password } = this.state;
        const firebaseAuth = firebase.auth();
        if (email && password) {
            firebaseAuth.createUserWithEmailAndPassword(email.value, password.value).then((response) => {
                console.log(response);
                this.setState({
                    isLoginForm: true,
                })
            }).catch((error) => {
                console.log(error);
                this.setState({ error: error.message });
            });
        }
    }

    render() {
        const { isLoginForm } = this.state;
        const { classes } = this.props;
        const loginForm =
            <React.Fragment>
                <CardHeader title="Connexion" className={classes.headerConnexionForm} />
                <CardContent>
                    <TextField
                        label="Email"
                        fullWidth
                        autoFocus
                        required
                        onChange={(event) => {
                            event.preventDefault();
                            this.setState({
                                email: { value: event.target.value, error: "", helperText: "" }
                            })
                            console.log(this.state.email);
                        }}
                        error={this.state.email.error}
                        helperText={this.state.email.helperText}
                    />
                    <TextField
                        label="Mot de passe"
                        fullWidth
                        required
                        type="password"
                        onChange={(event) => {
                            event.preventDefault();
                            this.setState({
                                password: { value: event.target.value, error: "", helperText: "" }
                            })
                            console.log(this.state.password);
                        }} />
                    <p>{this.state.error}</p>
                </CardContent>
                <CardActions style={{ justifyContent: "space-between" }}>
                    <Button onClick={() => {
                        this.setState({
                            error: "",

                            isLoginForm: false
                        })
                    }}>Vous n'avez pas de compte?</Button>
                    <Button onClick={() => {
                        this.signIn();
                    }}>
                        Se connecter
                    </Button>
                </CardActions>
            </React.Fragment>


            ;
        const inscriptionForm =
            <form onSubmit={this.register.bind(this)}>
                <CardHeader title="Inscription" className={classes.headerConnexionForm} />
                <CardContent>
                    <TextField
                        label="Email"
                        fullWidth
                        autoFocus
                        required
                        onChange={(event) => {
                            event.preventDefault();
                            this.setState({
                                email: { value: event.target.value, error: "", helperText: "" }
                            })
                            console.log(this.state.email);
                        }}
                        error={this.state.email.error}
                        helperText={this.state.email.helperText}
                    />
                    <TextField
                        label="Mot de passe"
                        fullWidth
                        required
                        type="password"
                        onChange={(event) => {
                            event.preventDefault();
                            this.setState({
                                password: { value: event.target.value, error: "", helperText: "" }
                            })
                            console.log(this.state.password);
                        }} />
                    <p>{this.state.error}</p>
                </CardContent>
                <CardActions style={{ justifyContent: "space-between" }}>
                    <Button onClick={() => {
                        this.setState({
                            error: "",
                            isLoginForm: true
                        })
                    }}>Vous avez déjà un compte?</Button>
                    <Button type="submit" color="primary" raised>
                        S'inscrire
                    </Button>
                </CardActions>
            </form>
            ;
        return (
            <React.Fragment>
                {this.state.isLoggedIn ? <App isLoggedIn={true} /> : <div style={{ background: 'linear-gradient(to right bottom, #001f80, #7597ff)' }}>
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justify="center"
                        style={{ minHeight: '100vh' }}
                    >
                        <Grid item xs={12} sm={6}>
                            <Card className={classes.card}>
                                {isLoginForm ? loginForm : inscriptionForm}
                            </Card>
                        </Grid>
                    </Grid>
                </div >}




            </React.Fragment>
        )
    }
}
export default withStyles(styles)(Login);