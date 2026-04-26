const is_local = 1;

export const rm_data = {
    get_activity_summary: function (callback) {

        const worker = new Worker(new URL("./web_workers/summarize_activities.js", import.meta.url), { type: "module" });

        const start = Date.now();

        /*
        worker.onmessage = (event) => {
            const dates = event.data;
            for (let d = 0; d < dates.length; d++) {
                const date = dates[d];
                console.log("***********");
                console.log(date.date);
                for (let r = 0; r < date.ranges.length; r++) {
                    const range = date.ranges[r];
                    console.log(range.range);
                    console.log(range.distance);
                    console.log(range.time);
                }
            }
        };
        */

        worker.onmessage = (event) => {
            const range_summaries = event.data;
            for (let r = 0; r < range_summaries.length; r++) {
                const range_summary = range_summaries[r];
                console.log("***********");
                console.log(`Rolling Range: ${range_summary.range}`);

                const date_summaries = range_summary.date_summaries;
                for (let d = 0; d < date_summaries.length; d++) {
                    const date_summary = date_summaries[d];
                    const date = date_summary.date.toISOString().slice(0, 10);
                    const days_in_range = date_summary.days_in_range;
                    const distance_average = (date_summary.distance_average / 1000).toFixed(2);
                    const speed_average = (date_summary.speed_average * 60 * 60 / 1000).toFixed(2);
                    const top_speed = (date_summary.top_speed * 60 * 60 / 1000).toFixed(2);

                    console.log(`Date: ${date}\t${days_in_range}\tDistance: ${distance_average}\tSpeed: ${speed_average}\tTop: ${top_speed}`);
                }
            }
        };



        worker.postMessage({ a: 1.1, b: 2.1 });


        //const activities = is_local ? get_activities_local() : get_activities_remote();
        return {};
    }
};

function get_activities_local() {
    const activities = [
        {
            "startDateLocal": "2025-12-10T10:25:01",
            "movingTimeSeconds": 5524,
            "distance": 14532.5,
            "fastestSplits": [
                {
                    "time": 40,
                    "distance": 150.9
                },
                {
                    "time": 114,
                    "distance": 482.5
                },
                {
                    "time": 1539,
                    "distance": 2808.2
                },
                {
                    "time": 911,
                    "distance": 2313.5
                },
                {
                    "time": 699,
                    "distance": 1931.5
                },
                {
                    "time": 538,
                    "distance": 1559.5
                },
                {
                    "time": 414,
                    "distance": 1248.7
                },
                {
                    "time": 321,
                    "distance": 1001.6
                },
                {
                    "time": 246,
                    "distance": 787.6
                },
                {
                    "time": 192,
                    "distance": 626.0
                },
                {
                    "time": 145,
                    "distance": 482.9
                },
                {
                    "time": 113,
                    "distance": 386.1
                },
                {
                    "time": 86,
                    "distance": 301.7
                },
                {
                    "time": 66,
                    "distance": 237.7
                },
                {
                    "time": 52,
                    "distance": 191.4
                }
            ]
        },
        {
            "startDateLocal": "2025-12-09T10:32:49",
            "movingTimeSeconds": 4588,
            "distance": 14267.5,
            "fastestSplits": [
                {
                    "time": 66,
                    "distance": 267.5
                },
                {
                    "time": 1543,
                    "distance": 3900.9
                },
                {
                    "time": 705,
                    "distance": 2132.8
                },
                {
                    "time": 540,
                    "distance": 1722.7
                },
                {
                    "time": 415,
                    "distance": 1376.1
                },
                {
                    "time": 320,
                    "distance": 1094.8
                },
                {
                    "time": 247,
                    "distance": 869.9
                },
                {
                    "time": 189,
                    "distance": 680.0
                },
                {
                    "time": 148,
                    "distance": 545.6
                },
                {
                    "time": 112,
                    "distance": 426.1
                },
                {
                    "time": 87,
                    "distance": 340.8
                },
                {
                    "time": 53,
                    "distance": 224.2
                },
                {
                    "time": 39,
                    "distance": 171.3
                },
                {
                    "time": 93,
                    "distance": 480.6
                }
            ]
        },
        {
            "startDateLocal": "2025-12-08T12:05:56",
            "movingTimeSeconds": 5116,
            "distance": 14527.2,
            "fastestSplits": [
                {
                    "time": 102,
                    "distance": 435.7
                },
                {
                    "time": 2088,
                    "distance": 4613.0
                },
                {
                    "time": 700,
                    "distance": 2070.2
                },
                {
                    "time": 540,
                    "distance": 1672.8
                },
                {
                    "time": 415,
                    "distance": 1324.1
                },
                {
                    "time": 320,
                    "distance": 1048.6
                },
                {
                    "time": 249,
                    "distance": 835.8
                },
                {
                    "time": 147,
                    "distance": 515.7
                },
                {
                    "time": 116,
                    "distance": 415.7
                },
                {
                    "time": 87,
                    "distance": 318.7
                },
                {
                    "time": 67,
                    "distance": 250.4
                },
                {
                    "time": 54,
                    "distance": 206.2
                },
                {
                    "time": 40,
                    "distance": 157.5
                },
                {
                    "time": 191,
                    "distance": 655.2
                }
            ]
        },
        {
            "startDateLocal": "2025-12-07T12:36:38",
            "movingTimeSeconds": 5901,
            "distance": 17810.8,
            "fastestSplits": [
                {
                    "time": 1931,
                    "distance": 4910.8
                },
                {
                    "time": 910,
                    "distance": 2697.9
                },
                {
                    "time": 705,
                    "distance": 2179.7
                },
                {
                    "time": 542,
                    "distance": 1727.1
                },
                {
                    "time": 417,
                    "distance": 1362.6
                },
                {
                    "time": 319,
                    "distance": 1063.7
                },
                {
                    "time": 249,
                    "distance": 846.2
                },
                {
                    "time": 192,
                    "distance": 666.2
                },
                {
                    "time": 145,
                    "distance": 511.0
                },
                {
                    "time": 116,
                    "distance": 416.0
                },
                {
                    "time": 86,
                    "distance": 312.3
                },
                {
                    "time": 70,
                    "distance": 258.0
                },
                {
                    "time": 51,
                    "distance": 190.9
                },
                {
                    "time": 41,
                    "distance": 155.6
                },
                {
                    "time": 121,
                    "distance": 499.5
                }
            ]
        }
    ];

    return activities;
}

function get_activities_remote() {

}