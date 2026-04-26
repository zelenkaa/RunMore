import { database_helper } from "../database_helper.js";

onmessage = async (event) => {

    try {
        const range_summaries = event.data.range_summaries;
        const rolling_ranges = event.data.rolling_ranges;
        const dates = event.data.dates;
        const first_date = event.data.first_date;
        const start = event.data.start;
        const web_workers = event.data.web_workers;

        console.log(`summary_range.js: ${start}`);
        let i = -1;
        for (let d = start; d < dates.length; d += web_workers) {
            i++;
            const now = Date.now();
            const date_and_ranges = dates[d];
            const date = date_and_ranges.date;
            for (let r = 0; r < date_and_ranges.ranges.length; r++) {
                const range_summary = range_summaries[r];
                range_summary.date_summaries[i] = [];
                const date_summary = range_summary.date_summaries[i];
                const rolling_range = rolling_ranges[r];
                const range = date_and_ranges.ranges[r];

                const diff_days = get_date_diff(first_date, date) + 1;
                const diff_days_adj = rolling_range > diff_days ? diff_days : rolling_range;

                const splits = range.splits.flat().filter(s => s.moving === true).sort((a, b) => (b.distance / b.time) - (a.distance / a.time));

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

                const km_per_day = range.distance / diff_days_adj / 1000;
                const km_per_hour = range.distance / range.time * 60 * 60 / 1000;
                const top_km_per_hour = distance_total / time_total * 60 * 60 / 1000;

                range_summary.range = rolling_range;
                date_summary.push(date);
                date_summary.push(km_per_day);
                date_summary.push(km_per_hour);
                date_summary.push(top_km_per_hour);

                const range_date_stats = {
                    user_id: 1,
                    range: rolling_range,
                    date: date,
                    km_per_day: km_per_day,
                    km_per_hour: km_per_hour,
                    top_km_per_hour, top_km_per_hour
                };
                
                database_helper.insert_range_date_stats(range_date_stats);
            }
            console.log(`TIME: ${(Date.now() - now) / 1000}\t${d}\t${start}`);
        }
        postMessage({ is_successful: 1, range_summaries: range_summaries });
    } catch (ex) {
        console.log(`ERROR: ${ex}`);
        postMessage({ is_successful: 0 });
    }
}

function get_date_diff(date1, date2) {
    const vdate1 = new Date(date1).setHours(0, 0, 0, 0);
    const vdate2 = new Date(date2).setHours(0, 0, 0, 0);
    const diffTime = Math.abs(vdate2 - vdate1);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}