import React from "react";
import { useState } from 'react';
import QuickStat from "./QuickStat";
import "../index.css";

function QuickStats() {
    const [stat, setStat] = useState(12.7);
    const [label, setLabel] = useState("km / day");
    return (
        <div className="quickstats">
            <QuickStat stat={stat} label={label} />
            <QuickStat stat={11.25} label={'km / h'} />
            <QuickStat stat={15.6} label={'top 10 min'} />
        </div>

    );
}

export default QuickStats;
