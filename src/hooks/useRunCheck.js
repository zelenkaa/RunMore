import { useState, useEffect } from 'react';

export default function useRunCheck(user, debug) {
    const [fetchingRuns, setFetchingRuns] = useState(0);
    const [refreshSummary, setRefreshSummary] = useState(null);
    const [summary, setSummary] = useState(null);
    const [isMissingLaps, setIsMissingLaps] = useState(null);

    useEffect(() => {        
        if (user === null) return;

        console.log("Fetching runs...User");
        const fetchRunsWorker = new Worker(new URL("../scripts/workers/fetchRuns.js", import.meta.url));

        fetchRunsWorker.onmessage = (e) => {
            const result = e.data;
            if (result === true) {
                setRefreshSummary(true);
            }
        };

        fetchRunsWorker.postMessage({ debug });

        return () => {
            fetchRunsWorker.terminate();
        };
    }, [user]);

    useEffect(() => {        
        if (fetchingRuns === 0) return;

        console.log("Fetching runs...Fetching Runs");
        const fetchRunsWorker = new Worker(new URL("../scripts/workers/fetchRuns.js", import.meta.url));

        fetchRunsWorker.onmessage = (e) => {
            const result = e.data;
            if (result === true) {
                setRefreshSummary(true);
            }
        };

        fetchRunsWorker.postMessage({ debug });

        return () => {
            fetchRunsWorker.terminate();
        };
    }, [fetchingRuns]);

    useEffect(() => {
        if (refreshSummary === null) return;

        const worker = new Worker(new URL("../scripts/workers/getRuns.js", import.meta.url));

        worker.onmessage = (e) => {
            setSummary(e.data);
            setIsMissingLaps(true);
        };

        worker.postMessage(null);

        return () => worker.terminate();
    }, [refreshSummary]);


    useEffect(() => {
        if (debug || isMissingLaps === null) return;

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
            };

            isMissingLapsFunc();

            const interval = setInterval(() => {
                isMissingLapsFunc();
            }, 10000);
        } else {
            setFetchingRuns(fetchingRuns + 1);
        }
    }, [isMissingLaps]);

    return { summary };
}