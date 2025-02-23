"use client"

import { auth, provider } from "./firebase/firebase";
import { browserPopupRedirectResolver, getAdditionalUserInfo, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import Home from "./home/page";
import { useEffect, useState } from "react";
import { checkIfSignedIn, login } from "./actions";
import { getCurrentProfile, newProfile } from "./firebase/database";



export default function Index() {


  useEffect(() => {
    const checkForSignedIn = async () => {
      const signedIn = await checkIfSignedIn();
      if (signedIn === null) {
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
    }
    checkForSignedIn().then();
  }, []);

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (window) {
      setIsMobile(innerWidth <= 1000);
    }

  }, [window])
  const [loggedIn, setLoggedIn] = useState<boolean>(false);


  const signInSession = async (token: string, name: string, id: string) => {
    if (!token || !id) {
      console.error("COULD NOT AUTHENTICATE");
    } else {

      const currentProfile = await getCurrentProfile(id);
      if (currentProfile.id !== id) {
        await newProfile(id, name)
      }

      const success = await login(token, name !== "" ? name : "New user", id)
      if (success) {
        setLoggedIn(true);
      }
    }
  }

  return <>
    {loggedIn ? <Home></Home> :
      <main className="centeredFlex main">
        <h1> Welcome </h1>
        <button className="googleLoginButton" onClick={() => {
          signInWithPopup(auth, provider, browserPopupRedirectResolver)
            .then(result => {
              const credential = GoogleAuthProvider.credentialFromResult(result);
              const userDet = getAdditionalUserInfo(result)
              const idToken = credential?.idToken ?? "";
              const givenName = userDet?.profile?.given_name as string ?? "";
              const userId = userDet?.profile?.id as string ?? ""
              return signInSession(idToken, givenName, userId);
            })
            .catch(e => setLoggedIn(false))
        }}> Sign in with Google </button >
      </main>}

  </>


}
