import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Grid, makeStyles } from "@material-ui/core";

import Welcome, { ErrorPage } from "./component/Welcome";
import Navbar from "./component/Navbar";
import Login from "./component/Login";
import Logout from "./component/Logout";
import Signup from "./component/Signup";
import Home from "./component/Home";
import Applications from "./component/Applications";
import Profile from "./component/Profile";
import CreateJobs from "./component/recruiter/CreateJobs";
import MyJobs from "./component/recruiter/MyJobs";
import JobApplications from "./component/recruiter/JobApplications";
import AcceptedApplicants from "./component/recruiter/AcceptedApplicants";
import RecruiterProfile from "./component/recruiter/Profile";
import MessagePopup from "./lib/MessagePopup";
import { userType } from "./lib/isAuth";
import Recruiters from "./Permission/Recruiter";
import apiList from "./lib/apiList";
import ResetPassword from "./component/ResetPassword";

const useStyles = makeStyles((theme) => ({
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "98vh",
    paddingTop: "64px",
    boxSizing: "border-box",
    width: "100%",
  },
}));

export const SetPopupContext = createContext();

function App() {
  const classes = useStyles();
  const [status, setstatus] = useState(
    localStorage.getItem("status") || "unverified"
  );
  const [popup, setPopup] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const type = localStorage.getItem("type");

  useEffect(() => {
    if (type === "recruiter") {
      fetch(apiList.status, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("status", data.status);
          setstatus(data.status);
        });
    }
  }, []);

  return (
    <BrowserRouter>
      <SetPopupContext.Provider value={setPopup}>
        {type === "recruiter" ? (
          <>
            {status === "unverified" ? (
              <h1
                style={{
                  position: "fixed",
                  top: "0px",
                  left: "0px",
                  background: "#3f51b5",
                  zIndex: "9999",
                }}
              >
                Please wait for Admin's Approval{" "}
              </h1>
            ) : null}
            {status === "rejected" ? (
              <h1
                style={{
                  position: "fixed",
                  top: "0px",
                  left: "0px",
                  background: "#3f51b5",
                  zIndex: "9999",
                }}
              >
                You  Have Been Rejected From Admin
              </h1>
            ) : null}
          </>
        ) : null}

        <Grid container direction="column">
          <Grid item xs>
            <Navbar />
          </Grid>
          <Grid item className={classes.body}>
            <Switch>
              <Route exact path="/">
                <Welcome />
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/signup">
                <Signup />
              </Route>
              <Route exact path="/logout">
                <Logout />
              </Route>
              <Route exact path="/reset-password">
                <ResetPassword />
              </Route>
              <Route exact path="/home">
                <Home />
              </Route>
              <Route exact path="/applications">
                <Applications />
              </Route>

              <Route exact path="/profile">
                {userType() === "recruiter" ? (
                  <RecruiterProfile />
                ) : (
                  <Profile />
                )}
              </Route>
              <Route exact path="/addjob">
                <CreateJobs />
              </Route>
              <Route exact path="/myjobs">
                <MyJobs />
              </Route>
              <Route exact path="/job/applications/:jobId">
                <JobApplications />
              </Route>
              <Route exact path="/employees">
                <AcceptedApplicants />
              </Route>
              <Route exact path="/recruiters">
                <Recruiters />
              </Route>
              <Route>
                <ErrorPage />
              </Route>
            </Switch>
          </Grid>
        </Grid>
        <MessagePopup
          open={popup.open}
          setOpen={(status) =>
            setPopup({
              ...popup,
              open: status,
            })
          }
          severity={popup.severity}
          message={popup.message}
        />
      </SetPopupContext.Provider>
    </BrowserRouter>
  );
}

export default App;
