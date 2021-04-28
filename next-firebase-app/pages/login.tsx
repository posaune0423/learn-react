import React, { useEffect, useState, FC } from "react";
import { useRouter } from "next/router";
import firebase from "../utils/firebase";
import { Button, CircularProgress } from "@material-ui/core";

const Login: FC = () => {
  const router = useRouter();
  const [signinCheck, setSigninCheck] = useState(false);
  const [signinedIn, setSigninedIn] = useState(false);
  let _isMounted = false;

  useEffect(() => {
    _isMounted = true;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (_isMounted) {
          setSigninedIn(true);
          setSigninCheck(true);
          router.push("/");
        }
      } else {
        if (_isMounted) {
          setSigninedIn(false);
          setSigninCheck(true);
        }
      }
    });
  }, []);

  const logIn = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  };

  if (signinCheck) {
    return (
      <div className="wrapper">
        <h1>Login Page</h1>
        <Button variant="contained" color="primary" onClick={logIn}>
          Login
        </Button>
      </div>
    );
  } else {
    return <CircularProgress />;
  }
};

export default Login;
