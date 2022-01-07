import React from "react";
import SimpleMap from "../components/GoogleMap";
const locations = require("../locations.json");

function Home () {
    return (
        <div className="App">
            <SimpleMap locations={locations} />
        </div>
    );
}

export default Home;
