import React, {useEffect, useState} from "react";
import GoogleMapReact from "google-map-react";

import Button from '@mui/material/Button';
import {Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover} from "@reach/combobox";
import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";
import "@reach/combobox/styles.css";

// Marker component
const Marker = ({ show, place }) => {
    const [showVal, setShowVal] = useState(show)
    const markerStyle = {
        left: '-35px',
        bottom: '45px'
    };

    //markera tıklanınca  info popup ının gösterilmesi değiştirme
    const changeShow = () => {
        setShowVal(!showVal);
    }

    return (
        <>
            {
                //marker
                <Button style={markerStyle} onClick={() => changeShow(place)}>
                    <img src={'../pin.png'}/>
                </Button>
            }
            {
                //info popupı gösterme
                showVal && place !== null &&
                <InfoWindow place={place} />
            }
        </>
    );
};

// InfoWindow component. Marker üzerine tıklanınca açılan popup
const InfoWindow = (props) => {
    const { place } = props;
    const infoWindowStyle = {
        position: 'relative',
        bottom: 215,
        left: '-110px',
        width: 200,
        backgroundColor: props.place.type === "company" ? "white" : "yellow",
        boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
        padding: 10,
        fontSize: 12,
        height: 100,
        borderRadius: 15
    };

    return (
        <div style={infoWindowStyle}>
            <div style={{ fontSize: 14 }}>
                <span>{place.title}</span>
            </div>
            <div style={{ fontSize: 14 }}>
                <span>{place.addresses[0].address}</span>
            </div>
        </div>
    );
};

function SimpleMap(props) {
    const [center, setCenter] = useState({
        lat: 39.93361906501069,
        lng: 32.85925510281058
    });
    const [searchCenter, setSearchCenter] = useState({
        lat: 39.93361906501069,
        lng: 32.85925510281058
    });
    const [zoom, setZoom] = useState(16)
    const [searchZoom, setSearchZoom] = useState(16)
    const [lat, setLat] = useState(center.lat) //haritaya tıklanınca alınan lat değeri
    const [lng, setLng] = useState(center.lng) //haritaya tıklanınca alınan lng değeri
    //adres listesi
    const [addresses, setAddresses] = useState(props.locations != null && props.locations.length > 0 ? props.locations : []);
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete();
    const googleApiKey = "AIzaSyDUbXD4z3w1UoiCOxaAj0RFt3pT24k88O4";

    //arama sonucunda değer seçildiğinde değeri alan fonksiyon
    const handleInput = (e) => {
        setValue(e.target.value);
    };

    //arama sonucunda listeden bir yer seçildiğinde lat ve lng değerlerinin alınıp seçilen yere zoom yapan fonksiyon
    const handleSelect = (val) => {
        setValue(val, false);
        getGeocode({ address: val })
            .then((results) => getLatLng(results[0]))
            .then(({ lat, lng, formatted_address }) => {
                setSearchCenter({
                    lat: lat,
                    lng: lng
                });
                setSearchZoom(18);
                if (addresses !== null && addresses.length <= 0){
                    setLat(lat);
                    setLng(lng);
                }
                clearSuggestions();
            })
            .catch((error) => {
                clearSuggestions()
                console.log("😱 Error: ", error);
            });
    };

    //textbox a değer giriliyorken çıkan sonuçları render eden fonksiyon
    const renderSuggestions = () => {
        const suggestions = data.map(({ place_id, description }) => (
            <ComboboxOption key={place_id} value={description} />
        ));

        return (
            <>
                {suggestions}
                <li className="logo">
                    <img
                        src="https://developers.google.com/maps/documentation/images/powered_by_google_on_white.png"
                        alt="Powered by Google"
                    />
                </li>
            </>
        );
    };

    //haritada herhangi bir noktaya basınca lat ve lng değerleri alınıyor
    function click(e) {
        setLng(e.lng);
        setLat(e.lat)
    }

    return (
        <div>
            {
                //arama textboxı
                props.search &&
                <>
                    <script src={"https://maps.googleapis.com/maps/api/js?key=" + googleApiKey + "&libraries=places"}></script>
                    <div>
                        <Combobox onSelect={handleSelect} aria-labelledby="demo">
                            <ComboboxInput
                                style={{ width: 300, maxWidth: "90%" }}
                                value={value}
                                onChange={handleInput}
                                disabled={!ready}
                            />
                            <ComboboxPopover>
                                <ComboboxList>{status === "OK" && renderSuggestions()}</ComboboxList>
                            </ComboboxPopover>
                        </Combobox>
                    </div>
                </>
            }
            {
                <div style={{ height: "100vh", width: "100%" }}>
                    <GoogleMapReact
                        bootstrapURLKeys={{key: googleApiKey}}
                        defaultCenter={center}
                        center={searchCenter}
                        defaultZoom={zoom}
                        zoom={searchZoom}
                        draggable={true}
                        onClick={(e) => click(e)}
                    >
                        {
                            //adresler listeleniyorken çalışır. Eğer adresler listeleniyorken arama yapılırsa aranan yere zoom yapar
                            addresses && addresses.length > 0 &&
                            addresses.map((item, i) =>
                                item.addresses.length > 0 &&
                                item.addresses.map((address, z) =>
                                    <Marker
                                        key={address.id}
                                        lat={address.lat}
                                        lng={address.lng}
                                        place={item}
                                        show={false}
                                    />
                                )
                            )
                        }
                        {
                            //adresler listelenmiyorken haritadan tıklanma yapıldığında veya arama yapıldığında çalışır
                            (addresses === null || addresses.length <= 0) &&
                            <Marker
                                key={null}
                                lat={lat}
                                lng={lng}
                                place={null}
                                show={false}
                            />
                        }
                    </GoogleMapReact>
                </div>
            }
        </div>
    );
}

export default SimpleMap;
