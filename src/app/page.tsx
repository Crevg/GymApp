"use client"

import { auth, provider } from "./firebase/firebase";
import { browserPopupRedirectResolver, getAdditionalUserInfo, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import Home from "./home/page";
import { useEffect, useState } from "react";



export default function Index() {

  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (window) {
      setIsMobile(innerWidth <= 1000);
    }

  }, [window])
  console.log({ isMobile })
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  return <>
    {loggedIn ? <Home></Home> :
      <main className="centeredFlex main">
        <h1> Welcome </h1>
        <button className="googleLoginButton" onClick={() => {
          signInWithPopup(auth, provider, browserPopupRedirectResolver)
            .then(result => {
              const credential = GoogleAuthProvider.credentialFromResult(result);
              const token = credential?.accessToken;
              // The signed-in user info.
              const user = result.user;
              console.log({ credential, token, user, userDet: getAdditionalUserInfo(result) })
              setLoggedIn(true)
            })
            .catch(e => setLoggedIn(false))
        }}> Sign in with Google </button >
      </main>}

  </>


}
