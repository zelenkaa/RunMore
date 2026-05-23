onmessage = async function (e) {
    const data = e.data;
    getRuns(data);
};


function getRuns(data) {
    const request = indexedDB.open("RunMoreDB", 1);

    request.onupgradeneeded = (event) => {

        const db = event.target.result;
        if (!db.objectStoreNames.contains("runs")) {
            db.createObjectStore("runs", { keyPath: ["userId", "id"] });
        }
    };

    request.onsuccess = (event) => {
        const db = event.target.result;
        const tx = db.transaction("runs", "readwrite");
        const store = tx.objectStore("runs");

        const runsReq = store.getAll();

        tx.oncomplete = () => getSummary(runsReq.result, data);
        tx.onerror = (err) => {
            console.error("Transaction error", err);
            postMessage({ totalRuns: 0, minDate: null, maxDate: null });
        };
    };
}

function getSummary(runs, range) {

    const results = [];

    const totalRuns = runs.length;
    for (let i = 0; i < runs.length; i++) {
        const run = runs[i];
        const dateTime = getDate(run.dateTime);

        const startDateDaysDiff = substractDatesInDays(range.startDate, dateTime);
        
        if (dateTime > range.endDate || startDateDaysDiff > range.rollingDays - 1)
            continue;

        const endDateDaysDiff = substractDatesInDays(range.endDate, dateTime);

        for (let j = 0; j < range.rollingDays; j++) {
            const index = endDateDaysDiff - j;
            const date = addDays(dateTime, j);

            if (index < 0 || date < range.startDate) continue;

            if (results[index]) {
                results[index].time += run.time;
                results[index].distance += run.distance;
            }
            else
                results[index] = { dateTime: date, time: run.time, distance: run.distance };

        }
    }

    const data = [["Date", "distance", "speed"]];

    for (let i = 0; i < results.length; i++) {
        const res = results[i];
        if (res) {
            const day = [
                res.dateTime,
                res.distance / range.rollingDays / 1000,
                res.distance / res.time * 3.6
            ]
            data.push(day);
        }
    }
    postMessage(data);
}

function getDate(dateTime) {
    const d = new Date(dateTime);
    d.setHours(0, 0, 0, 0);
    return d;
}

function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function substractDatesInDays(startDate, endDate) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((startDate - endDate) / oneDay);
}