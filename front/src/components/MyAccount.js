import React from "react";
import { Card, Button, CardHeader, CardContent, CardActions, Grid, TextField, Avatar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import firebase from "firebase";
import ImageSelectPreview from 'react-image-select-pv';

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
    }
});
class MyAccount extends React.Component {
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
            image: "",
        };
    }



    render() {
        const { selectImage, image } = this.state;
        const { classes } = this.props;
        const inscriptionForm =
            <React.Fragment>
                <CardHeader title="Inscription" className={classes.headerConnexionForm} />
                <CardContent>
                    {selectImage && !image ?
                        <React.Fragment>
                            <p>Sélectionnez une image</p>
                            <ImageSelectPreview
                                onChange={data => {
                                    console.log(data);
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
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '100vh' }}
                >
                    <Grid item xs={12} sm={6}>
                        <Card className={classes.card}>
                            {inscriptionForm}
                        </Card>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}
export default withStyles(styles)(MyAccount);