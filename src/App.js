// App.jsx
import React, { useEffect, useRef, useState } from 'react';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';

export default function App() {
  const [debug, setDebug] = useState(null);
  const [clientPrincipal, setClientPrincipal] = useState(null);
  const [userId, setUserId] = useState(null);
  const [latestDate, setLatestDate] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {

      const res = await fetch('/.auth/me');
      try {        
        const data = await res.json();
        setDebug(false);
        setClientPrincipal(data.clientPrincipal);
      } catch {
        setDebug(true);
        setClientPrincipal({ "userId": "add85db9ad7fa2ea87a10483759a17aa", "userRoles": ["anonymous", "authenticated"], "claims": [], "identityProvider": "aad", "userDetails": "azelenka@interiorrunningassociation.com" });
      }
    };

    checkLogin();
  }, []);

  useEffect(() => {
    if(clientPrincipal === null) return;
    
    const fetchUserId = async () => {
      const res = await fetch('/api/login');
      try {
        const data = await res.json();
        setUserId(data.userId);
        setLatestDate(data.latest);
      }
      catch {
        setUserId("debug: 1");        
        setLatestDate("debug: 1");
      }
    };
    fetchUserId();
  }, [clientPrincipal]);


  return (
    <div>
      <p>User ID: {userId}</p>
      {clientPrincipal ? <a href={debug ? "" : "/.auth/logout"}>Log out</a> : null}
      {clientPrincipal ? <HomePage /> : <LoginPage />}
    </div>
  );
}