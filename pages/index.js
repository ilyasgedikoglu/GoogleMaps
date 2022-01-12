import React from "react";
import SimpleMap from "../components/GoogleMap";
const locations = require("../locations.json"); //adres listesi

function Home () {
    //locations gönderirsek adresleri listeliyor göndermezsek harita üzerinden işaretleyip lat ve lng değerleri alınıyor.
    //arama için search=true parametresini gönder. Arama yoksa false gönder
    //            <SimpleMap search={false} />
    return (
        <div className="App">
            <SimpleMap search={true} locations={locations} />
        </div>
    );
}

export default Home;
