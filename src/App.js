// App.jsx
import React, { useEffect, useRef, useState } from 'react';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';

export default function App() {
  const [debug, setDebug] = useState(null);
  const [clientPrincipal, setClientPrincipal] = useState(null);
  const [user, setUser] = useState(null);
  const [runDate, setRunDate] = useState(null);
  const [runsToSave, setRunsToSave] = useState(null);
  const [refreshSummary, setRefreshSummary] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isMissingLaps, setIsMissingLaps] = useState(null);

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
    if (clientPrincipal === null) return;

    const fetchUserId = async () => {
      const res = await fetch(debug ? '/test_data/login.json' : '/api/login');
      const data = await res.json();
      setUser(data);
    };
    fetchUserId();
  }, [clientPrincipal]);

  useEffect(() => {
    if (user === null) return;

    const refreshActivities = async () => {
      if (debug) {
        setRunDate(new Date(new Date().getFullYear() + 1, 0, 1));
      } else {
        const res = await fetch('/api/refresh_activities', { method: 'POST' });

        setRunDate(new Date(new Date().getFullYear() + 1, 0, 1));
      }
    };
    refreshActivities();

  }, [user]);

  useEffect(() => {
    if (runDate === null) return;

    const getRuns = async () => {
      const encodedDate = encodeURIComponent(runDate.toISOString());

      const res = await fetch(debug ? '/test_data/runs.json' : `/api/runs/${encodedDate}`);
      const data = await res.json();

      setRunsToSave(data);

    };
    getRuns();
  }, [runDate]);

  useEffect(() => {
    if (runsToSave === null) return;

    const checkRunsWorker = new Worker(new URL("./scripts/workers/checkRuns.js", import.meta.url));
    const saveRunsWorker = new Worker(new URL("./scripts/workers/saveRuns.js", import.meta.url));

    let runExists = false;

    checkRunsWorker.onmessage = (e) => {
      const result = e.data;
      if (result.exists === true) {
        runExists = true;
      }
      saveRunsWorker.postMessage(runsToSave);
    };

    saveRunsWorker.onmessage = (e) => {
      const minDate = e.data;
      if (runExists === false && minDate instanceof Date && minDate < runDate) {
        setRunDate(minDate);
      } else {
        setRefreshSummary(true);
      }
    };

    checkRunsWorker.postMessage(runsToSave);

    return () => {
      checkRunsWorker.terminate();
      saveRunsWorker.terminate();
    };
  }, [runsToSave]);


  useEffect(() => {
    if (refreshSummary === null) return;

    const worker = new Worker(new URL("./scripts/workers/getRuns.js", import.meta.url));

    worker.onmessage = (e) => {
      setSummary(e.data);
      setIsMissingLaps(true);
    };

    worker.postMessage(null);

    return () => worker.terminate();
  }, [refreshSummary]);


  useEffect(() => {
    if (isMissingLaps === null) return;

    if (isMissingLaps === true) {
      const isMissingLapsFunc = async () => {
        const res = await fetch('/api/is_missing_laps');
        const data = await res.json();

        if (data.isMissingLaps) {
          console.log("Missing Laps");
        } else {
          console.log("All Laps Loaded");
          clearInterval(interval);
          setIsMissingLaps(false);
        }

        setIsMissingLaps(data.isMissingLaps);
      };

      isMissingLapsFunc();

      const interval = setInterval(() => {
        isMissingLapsFunc();
      }, 10000);
    } else {
      setRunDate(new Date(runDate));
    }
  }, [isMissingLaps]);


  const deauthorize = async () => {
    const res = await fetch('/api/deauthorize', { method: 'POST' });
    const data = await res.json();
    setUser(data);
  };

  let strava;
  if (user && !user.token) {
    const strava_athorization = "http://www.strava.com/oauth/authorize?client_id=76091&response_type=code&redirect_uri=" + window.location.origin + "/api/authorize&approval_prompt=force&scope=read,read_all,profile:read_all,activity:read_all";
    strava = <a href={strava_athorization}>Connect to Strava</a>;
  } else if (user && user.token) {
    strava = <button onClick={debug ? null : deauthorize}>Disconnect from Strava</button>;
  }


  return (
    <div>
      <p>User ID: {user ? user.userId : null}</p>

      {clientPrincipal ? <p><a href={debug ? "" : "/.auth/logout"}>Log out</a></p> : null}

      {strava}

      {clientPrincipal ? <HomePage summary={summary} /> : <LoginPage />}
    </div>
  );
}