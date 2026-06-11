// App.jsx
import React, { useEffect, useRef, useState } from 'react';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import useAuth from './hooks/useAuth';
import useRunCheck from './hooks/useRunCheck';

export default function App() {

  const { debug, clientPrincipal, user, deauthorize } = useAuth();
  const { summary } = useRunCheck(user, debug);

  let strava;
  if (user && !user.token) {
    const strava_athorization = "http://www.strava.com/oauth/authorize?client_id=257154&response_type=code&redirect_uri=" + window.location.origin + "/api/authorize&approval_prompt=force&scope=read,read_all,profile:read_all,activity:read_all";
    strava = <a href={strava_athorization}>Connect to Strava</a>;
  } else if (user && user.token) {
    strava = <button onClick={debug ? null : deauthorize}>Disconnect from Strava</button>;
  }


  return (
    <div>
      <p>User ID: {user ? user.userId : null}</p>

      {clientPrincipal ? <p><a href={debug ? "" : "/.auth/logout"}>Log out</a></p> : <LoginPage />}

      {strava}

      {clientPrincipal && <HomePage summary={summary} />}
    </div>
  );
}