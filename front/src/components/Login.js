import React from "react";
import { Card, Button, CardHeader, CardContent, CardActions, Grid, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
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
            email: null,
            password: null,
            name: null,
            lastname: null,
            pseudo: null,
            passwordValidation: null
        };
    }


    signIn() {
        const { email, password } = this.state;
        const firebaseAuth = firebase.auth();
        const db = firebase.firestore();
        if (email && password) {
            firebaseAuth.signInWithEmailAndPassword(email, password).then((response) => {
                console.log(response);
                this.setState({ isLoggedIn: true, token: response.user.getIdToken });
            }).catch((error) => {
                this.setState({ error: error.message });
            })
        }
    }

    register() {
        const { email, password, passwordValidation, lastname, name, pseudo } = this.state;
        const firebaseAuth = firebase.auth();
        const db = firebase.firestore();
        if (email && password) {
            if (password != passwordValidation) {
                this.setState({
                    error: "Les mots de passes ne correspondent pas."
                })
            } else {
                firebaseAuth.createUserWithEmailAndPassword(email, password).then((response) => {
                    console.log(response);
                    this.setState({
                        isLoginForm: true,
                        uid: response.user.uid
                    });
                    db
                        .collection("users")
                        .doc(this.state.uid)
                        .set({
                            "email": email,
                            "name": name,
                            "lastname": lastname,
                            "pseudo": pseudo,
                        });
                }).catch((error) => {
                    console.log(error);
                    this.setState({ error: error.message });
                });
            }


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
                                email: event.target.value
                            })
                            console.log(this.state.email);
                        }}
                    />
                    <TextField
                        label="Mot de passe"
                        fullWidth
                        required
                        type="password"
                        onChange={(event) => {
                            event.preventDefault();
                            this.setState({
                                password: event.target.value
                            })
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
            <React.Fragment>
                <CardHeader title="Inscription" className={classes.headerConnexionForm} />
                <CardContent>
                    <TextField
                        label="Nom"
                        autoFocus
                        fullWidth
                        required
                        type="text"
                        onChange={(event) => {
                            event.preventDefault();
                            this.setState({
                                lastname: event.target.value
                            })
                        }} />
                    <TextField
                        label="Prénom"
                        fullWidth
                        required
                        type="text"
                        onChange={(event) => {
                            event.preventDefault();
                            this.setState({
                                name: event.target.value
                            })
                        }} />
                    <TextField
                        label="Pseudonyme"
                        fullWidth
                        required
                        type="text"
                        onChange={(event) => {
                            event.preventDefault();
                            this.setState({
                                pseudo: event.target.value
                            })
                        }} />
                    <TextField
                        label="Email"
                        fullWidth
                        required
                        onChange={(event) => {
                            event.preventDefault();
                            this.setState({
                                email: event.target.value
                            })
                            console.log(this.state.email);
                        }}
                    />
                    <TextField
                        label="Mot de passe"
                        fullWidth
                        required
                        type="password"
                        onChange={(event) => {
                            event.preventDefault();
                            this.setState({
                                password: event.target.value
                            })
                        }} />
                    <TextField
                        label="Retapez le mot de passe"
                        fullWidth
                        required
                        type="password"
                        onChange={(event) => {
                            event.preventDefault();
                            this.setState({
                                passwordValidation: event.target.value
                            })
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
                    <Button onClick={() => {
                        this.register();
                    }}>
                        S'inscrire
                    </Button>
                </CardActions>
            </React.Fragment>

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