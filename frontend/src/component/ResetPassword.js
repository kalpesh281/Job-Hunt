import React, { useState } from "react";
import axios from "axios";
import { Grid, Button, Typography, makeStyles, Paper, TextField } from "@material-ui/core";
import apiList from "../lib/apiList";
import PasswordInput from "../lib/PasswordInput";
// import EmailInput from "../lib/EmailInput";
import { useHistory } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
    body: {
        padding: "60px 60px",
    },
    inputBox: {
        width: "300px",
    },
    submitButton: {
        width: "300px",
    },
}));

const ResetPassword = () => {
    const classes = useStyles();
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleResetPassword = () => {
        if (!email || !newPassword || !confirmPassword) {
            setMessage("All fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        axios
            .post(apiList.resetPass, { email, newPassword })
            .then((response) => {
                setMessage(response.data.message);
                setTimeout(() => {
                    history.push("/login");
                }, 2000);
            })
            .catch((error) => {
                setMessage(error.response.data.message);
            });
    };

    return (
        <Grid container justify="center" className={classes.body}>
            <Grid item xs={10} sm={5} md={4}>
                <Paper elevation={3}>
                    <Grid container direction="column" spacing={4} alignItems="center" className={classes.body}>
                        <Grid item>
                            <Typography variant="h3" component="h2" style={{ color: "#3f51b5", fontWeight: "bold" }}>
                                Reset Password
                            </Typography>
                        </Grid>
                        <Grid item>
                            <TextField
                                variant="outlined"
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                className={classes.inputBox}
                            />
                        </Grid>
                        <Grid item>
                            <PasswordInput
                                variant="outlined"
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                fullWidth
                                className={classes.inputBox}
                            />
                        </Grid>
                        <Grid item>
                            <PasswordInput
                                variant="outlined"
                                label="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                fullWidth
                                className={classes.inputBox}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleResetPassword}
                                fullWidth
                                className={classes.submitButton}
                            >
                                Reset Password
                            </Button>
                        </Grid>
                        {message && (
                            <Grid item>
                                <Typography variant="body1" color="primary">
                                    {message}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default ResetPassword;
