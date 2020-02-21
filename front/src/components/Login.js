import React from "react";
import { Card, Button, CardHeader, CardContent, CardActions, Grid, TextField, Avatar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import firebase from "firebase";
import App from '../App';
import ImageSelectPreview from 'react-image-select-pv';
import logo from '../assets/logo.PNG';
import angryBirds from '../assets/randomLogo/001-angry birds.svg';
import arcade from '../assets/randomLogo/002-arcade.svg';
import atari from '../assets/randomLogo/003-atari.svg';
import bomberMan from '../assets/randomLogo/004-bomberman.svg';
import arcadeDeux from '../assets/randomLogo/005-arcade.svg';
import button from '../assets/randomLogo/006-button.svg';
import computer from '../assets/randomLogo/007-computer.svg';
import gamepad from '../assets/randomLogo/008-gamepad.svg';
import gameController from '../assets/randomLogo/009-game controller.svg';
import gameConsole from '../assets/randomLogo/010-game console.svg';

const styles = theme => ({
    card: {
        margin: theme.spacing(2),
        padding: 20,
        paddingTop: 50,
        paddingBottom: 50
    },
    avatar: {
        height: "5em",
        width: "5em",
        margin: 20
    },
    splitLeft: {
        height: '100%',
        width: '50%',
        position: 'fixed',
        zIndex: '1',
        top: 0,
        overflowX: 'hidden',
        paddingTop: '20px',
        left: 0,
        backgroundColor: "#001C33",
    },
    /* Control the right side */
    splitRight: {
        height: '100%',
        width: '50%',
        position: 'fixed',
        zIndex: '1',
        top: 0,
        overflowX: 'hidden',
        paddingTop: '20px',
        right: 0,
    },

    /* If you want the content centered horizontally and vertically */
    centered: {
        textAlign: 'center',
    },
    contentForm: {
        display: 'inline-block',
    },
    logo: {
        width: 250,
        marginTop: 50,
        marginBottom: 50,
        borderRadius: '10px'
    },
    leftLogo: {
        width: 200,
        marginTop: '40%',
    }
});
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.signIn = this.signIn.bind(this);
        this.state = {
            isLoginForm: true,
            image: null,
            error: null,
            email: null,
            password: null,
            name: null,
            lastname: null,
            pseudo: null,
            passwordValidation: null,
            file: null, cropFile: false, selectImage: true,
            currentLogoNumber: Math.floor(Math.random() * Math.floor(9)),
        };
        this.googleProvider = new firebase.auth.GoogleAuthProvider;
        console.log("current logo number:", this.state.currentLogoNumber);
        switch (this.state.currentLogoNumber) {
            case 0:
                this.state.currentLeftLogo = gameConsole;
                break;
            case 1:
                this.state.currentLeftLogo = angryBirds;
                break;
            case 2:
                this.state.currentLeftLogo = arcade;
                break;
            case 3:
                this.state.currentLeftLogo = atari
                break;
            case 4:
                this.state.currentLeftLogo = bomberMan;
                break;
            case 5:
                this.state.currentLeftLogo = arcadeDeux;
                break;
            case 6:
                this.state.currentLeftLogo = button
                break;
            case 7:
                this.state.currentLeftLogo = computer;
                break;
            case 8:
                this.state.currentLeftLogo = gamepad;
                break;
            case 9:
                this.state.currentLeftLogo = gameController
                break;
        }
        console.log("currentLeftLogo:", this.state.currentLeftLogo);
    }

    signIn() {
        const { email, password } = this.state;
        const firebaseAuth = firebase.auth();
        if (email && password) {
            firebaseAuth.signInWithEmailAndPassword(email, password).then((response) => {
                localStorage["currentUserIdValdezTips"] = response.user.uid;
                this.getConnectedUser(response.user.uid);
                this.setState({ isLoggedIn: true, token: response.user.getIdToken });
            }).catch((error) => {
                this.setState({ error: error.message });
            })
        }
    }

    addToFirestore(uid, email, name, lastname, pseudo, image) {
        const db = firebase.firestore();
        db
            .collection("users")
            .doc(uid)
            .set({
                "email": email,
                "name": name,
                "lastname": lastname,
                "pseudo": pseudo,
                "image": image,
            });
    }

    register() {
        const { email, password, passwordValidation, lastname, name, pseudo, image } = this.state;
        const firebaseAuth = firebase.auth();
        if (email && password) {
            if (password !== passwordValidation) {
                this.setState({
                    error: "Les mots de passes ne correspondent pas."
                })
            } else {
                firebaseAuth.createUserWithEmailAndPassword(email, password).then((response) => {
                    this.addToFirestore(this.state.uid, email, name, lastname, pseudo, image);
                }).catch((error) => {
                    this.setState({ error: error.message });
                });
            }
        }
    }

    getConnectedUser(id) {
        const db = firebase.firestore();
        var docRef = db.collection("users").doc(id);
        docRef.get().then(doc => {
            if (doc.exists) {
                localStorage["currentUserValdezTips"] = doc.data();
            }
        });
    }

    doSignInWithGoogle() {
        firebase.auth().signInWithPopup(this.googleProvider).then((response) => {
            localStorage["currentUserIdValdezTips"] = response.user.uid;
            const data = response.user.providerData[0];
            this.addToFirestore(response.user.uid, data.email, data.displayName, data.displayName, data.displayName, data.photoURL);
            this.getConnectedUser(response.user.uid);
            this.setState({ isLoggedIn: true, token: response.user.getIdToken });
        }).catch((error) => {
            console.log("Error when sign in with google:", error);
        });
    }


    render() {
        const { isLoginForm, selectImage, image } = this.state;
        const { classes } = this.props;
        const loginForm =
            <React.Fragment>
                <h1>Connexion</h1>
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
                <Button onClick={() => {
                    this.doSignInWithGoogle();
                }} >Sign in with Google</Button>

                <p>{this.state.error}</p>
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
            </React.Fragment>


            ;
        const inscriptionForm =
            <React.Fragment>
                <h1>Inscription</h1>
                {selectImage && !image ?
                    <React.Fragment>
                        <p>Sélectionnez une image</p>
                        <ImageSelectPreview
                            onChange={data => {
                                this.setState({
                                    image: data[0].content,
                                    selectImage: false
                                });
                            }} />
                    </React.Fragment>
                    :
                    <Avatar alt="Remy Sharp" src={image} className={classes.avatar} />
                }
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
            </React.Fragment >

            ;
        return (
            <React.Fragment>
                {this.state.isLoggedIn ? <App isLoggedIn={true} /> :
                    <div style={{ background: 'linear-gradient(to right bottom, #001f80, #7597ff)' }}>

                        <div className={classes.splitLeft}>
                            <div className={classes.centered}>
                                <img className={classes.leftLogo} src={this.state.currentLeftLogo} />
                            </div>
                        </div>
                        <div className={classes.splitRight}>
                            <div className={classes.centered}>
                                <div className={classes.contentForm}>
                                    <img src={logo} className={classes.logo} />
                                    {isLoginForm ? loginForm : inscriptionForm}
                                </div>
                            </div >
                        </div>
                    </div>}
            </React.Fragment>
        )
    }
}
export default withStyles(styles)(Login);