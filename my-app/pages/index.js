import React from "react";
import SimpleMap from "../components/GoogleMap";
const locations = require("../locations.json");

function Home () {
    //locations gönderirsek addresleri listeliyor göndermezsek harita üzerinden işaretleyip lat ve lng değerleri alınıyor.
    //arama için search=true parametresini gönder. Arama yoksa false gönder
    //            <SimpleMap search={false} />
    return (
        <div className="App">
            <SimpleMap search={false} locations={locations} />
        </div>
    );
}

export default Home;
