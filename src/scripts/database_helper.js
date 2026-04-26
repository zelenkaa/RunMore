import { openDB } from 'idb';

export const database_helper = {
    insert_activities: async function (activities) {
        if (activities == null || !Array.isArray(activities))
            return;

        const db = await get_db();
        const tx = db.transaction('activities', 'readwrite');

        const ps = [];
        for (let a = 0; a < activities.length; a++) {
            const activity = activities[a];
            //const p = tx.store.put('activities', activity);
            const p = tx.store.put(activity);
            ps.push(p);
        }
        ps.push(tx.done);
        await Promise.all(ps);
    },
    insert_activities_summary_range: async function (summary_range) {
        if (summary_range == null || !Array.isArray(summary_range))
            return;

        const db = await get_db();
        const tx = db.transaction('summary_ranges', 'readwrite');

        const ps = [];
        for (let a = 0; a < summary_range.length; a++) {
            const sr = summary_range[a];
            const p = tx.store.put(sr);
            ps.push(p);
        }
        ps.push(tx.done);
        await Promise.all(ps);
    },
    insert_range_date_stats: async function (data) {
        try {
            const db = await get_db();
            await db.put('range_date_stats', data);
        }
        catch (ex) {
            return ex;
        }
    },
    get_activities: async function (user_id) {
        try {
            const db = await get_db();
            const store = db.transaction('activities').objectStore('activities');
            const keys = await store.getAllKeys();

            console.log(keys);


        }
        catch (ex) {
            return ex;
        }
    },
    get_activities_range_summary: async function () {
        try {
            const db = await get_db();
            const store = db.transaction('summary_ranges').objectStore('summary_ranges');
            const result = await store.getAll();
            return result;
        }
        catch (ex) {
            return ex;
        }
    }
};

async function get_db() {
    const db = await openDB("RunMoreDB", 1, {
        upgrade(db, oldVersion, newVersion, transaction, event) {
            db.createObjectStore('activities', {
                keyPath: ['userId', 'activityID']
            });

            db.createObjectStore('summary_ranges', {
                keyPath: 'range'
            });

            db.createObjectStore('range_date_stats', {
                keyPath: ['user_id', 'range', 'date']
            });
        }
    });

    return db;
}