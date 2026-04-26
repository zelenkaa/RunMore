import React from "react";
import { useState } from 'react';
import "../index.css";

function QuickStat({ label, stat }) {

    return (
        <div className="quickstat">
            <h3>{label}</h3>
            <h1>{stat}</h1>
        </div>
    );
}

export default QuickStat;
