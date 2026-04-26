// App.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function App() {
  const getRunsRef = useRef(null);
  const [result, setResult] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(async () => {
    const res = await fetch('/.auth/me');
    const data = await res.json();
  }, []);

  useEffect(() => {
    getRunsRef.current = new Worker(
      new URL('./scripts/workers/getRuns.js', import.meta.url)
    );

    getRunsRef.current.onmessage = (e) => {
      setResult(e.data);
    };

    return () => getRunsRef.current.terminate();
  }, []);

  const runHeavyTask = () => {
    getRunsRef.current.postMessage(10);
  };

  return (
    <div>
      <button onClick={runHeavyTask}>Get Runs</button>
      <p>Result: {result}</p>
    </div>
  );
}