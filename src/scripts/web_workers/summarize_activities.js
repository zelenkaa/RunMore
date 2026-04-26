


onmessage = async (event) => {

    const rolling_ranges = [7, 30, 100, 365];
    const activities = get_activities_local();
    //const activities = await (await fetch(`/api/get_activities`)).json();
    

    let first_date = null;
    let last_date = null;
    for (let i = 0; i < activities.length; i++) {
        const activity = activities[i];

        const activity_date = get_date(activity);
        if (first_date === null || first_date > activity_date)
            first_date = activity_date;
        if (last_date === null || last_date < activity_date)
            last_date = activity_date;
    }

    const days = get_date_diff(first_date, last_date);
    const dates = [];
    for (let d = 0; d <= days; d++) {
        const date = new Date(last_date);
        date.setDate(date.getDate() - d);
        const date_and_ranges = { date: date, ranges: [] };
        dates[d] = date_and_ranges;


        for (let i = 0; i < rolling_ranges.length; i++) {
            const range = rolling_ranges[i];
            date_and_ranges.ranges[i] = { range: range, distance: 0, time: 0, splits: [] };
        }
    }


    for (let i = 0; i < activities.length; i++) {
        const activity = activities[i];
        const activity_date = new Date(Date.parse(activity.startDateLocal));

        const diff_days = get_date_diff(last_date, activity_date);

        let out_of_ranges = false;
        for (let d = diff_days; d >= 0 && out_of_ranges === false; d--) {
            const date_and_ranges = dates[d];
            out_of_ranges = true;
            for (let r = 0; r < date_and_ranges.ranges.length; r++) {
                const range = date_and_ranges.ranges[r];
                if (range.range > (diff_days - d)) {
                    out_of_ranges = false;
                    range.distance += activity.distance;
                    range.time += activity.movingTimeSeconds;
                    range.splits = range.splits.concat(activity.fastestSplits);
                }
            }
        }
    }

    const range_summaries = [];
    for (let r = 0; r < rolling_ranges.length; r++) {
        range_summaries[r] = { range: r, date_summaries: [] };
    }

    for (let d = 0; d < dates.length; d++) {
        const date_and_ranges = dates[d];
        const date = date_and_ranges.date;
        for (let r = 0; r < date_and_ranges.ranges.length; r++) {
            const range_summary = range_summaries[r];
            range_summary.date_summaries[d] = {};
            const date_summary = range_summary.date_summaries[d];
            const rolling_range = rolling_ranges[r];


            const range = date_and_ranges.ranges[r];

            const diff_days = get_date_diff(first_date, date) + 1;
            const diff_days_adj = rolling_range > diff_days ? diff_days : rolling_range;

            const splits = range.splits.sort((a, b) => (b.distance / b.time) - (a.distance / a.time));
            const secs_per_day = 10 * 60;
            const secs_cap = secs_per_day * diff_days_adj;
            let distance_total = 0;
            let time_total = 0;
            for (let s = 0; s < splits.length; s++) {
                const split = splits[s];
                const time = split.time;
                const distance = split.distance;
                if (time_total + time < secs_cap) {
                    time_total += time;
                    distance_total += distance;
                } else {
                    const cap_room = secs_cap - time_total;
                    const time_per = cap_room / time;
                    const distance_per = distance * time_per;
                    time_total += cap_room;
                    distance_total += distance_per;
                    break;
                }
            }

            range_summary.range = rolling_range;


            date_summary.date = date;
            date_summary.days_in_range = diff_days_adj;
            date_summary.distance_average = range.distance / diff_days_adj;
            date_summary.speed_average = range.distance / range.time;
            date_summary.top_speed = distance_total / time_total;
        }
    }


    //const today = new Date((new Date()).setHours(0, 0, 0, 0));



    postMessage(range_summaries);
};

function get_date(activity) {
    const date = new Date(Date.parse(activity.startDateLocal));

    return date;
}


function get_date_diff(date1, date2) {
    const vdate1 = new Date(date1).setHours(0, 0, 0, 0);
    const vdate2 = new Date(date2).setHours(0, 0, 0, 0);
    const diffTime = Math.abs(vdate2 - vdate1);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

const database_name = "ActivitiesDatabase";

function get_activities_local() {
    // Open (or create) the database
    const request = indexedDB.open(database_name, 1);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;

        // Create an object store (table) with auto-incrementing keys
        if (!db.objectStoreNames.contains("activities")) {
            db.createObjectStore("activities", { keyPath: "id", autoIncrement: true });
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;

        // Example JSON to store
        const data = {
            name: "Adam",
            skills: ["Node.js", "JavaScript", ".NET"],
            timestamp: Date.now()
        };

        // Start a readwrite transaction
        const tx = db.transaction("activities", "readwrite");
        const store = tx.objectStore("activities");

        // Add the JSON object
        const addRequest = store.add(data);

        addRequest.onsuccess = function () {
            console.log("Data written successfully");
        };

        addRequest.onerror = function (err) {
            console.error("Error writing data", err);
        };
    };

    request.onerror = function (err) {
        console.error("Error opening database", err);
    };
}








