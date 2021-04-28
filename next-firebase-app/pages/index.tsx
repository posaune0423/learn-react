import { useEffect, FC, useState } from "react";
import { Button, CircularProgress } from "@material-ui/core";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import firebase from "../utils/firebase";

const Home: FC = (props: any) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<null | object>(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      user ? setCurrentUser(user) : router.push("/login");
    });
  }, []);

  const logOut = async () => {
    try {
      await firebase.auth().signOut();
      router.push("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      {currentUser && console.log(currentUser)}
      <Head>
        <title>Test Title</title>
      </Head>
      <h1>Top Page</h1>
      <h2>
        You are successfully Loged in {currentUser && currentUser.displayName} !
      </h2>

      {currentUser && (
        <Image priority src={currentUser.photoURL} height={120} width={120} />
      )}

      <Button variant="contained" color="primary" onClick={logOut}>
        Logout
      </Button>
    </div>
  );
};

export default Home;
