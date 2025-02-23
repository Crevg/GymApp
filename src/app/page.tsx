"use client"

import { auth, provider } from "./firebase/firebase";
import { browserPopupRedirectResolver, signInWithPopup, signInWithRedirect } from "firebase/auth";
import Home from "./home/page";
import { useState } from "react";



export default function Index() {

  const [isMobile, setIsMobile] = useState<boolean>( window?.innerWidth <= 1000);
  console.log({isMobile})
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  return <>
    {loggedIn ? <Home></Home> :
      <main className="centeredFlex main"> 
      <h1> Welcome </h1>
      <button className="googleLoginButton" onClick={() => {
        signInWithPopup(auth, provider, browserPopupRedirectResolver)
        .then(r => setLoggedIn(true)).catch(e => setLoggedIn(false))
      }}> Sign in with Google </button >
      </main>}

  </>


}
