import React, {useEffect, useState} from "react";
import GoogleMapReact from "google-map-react";
import Axios from "axios";

import pin from "../pin.png";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Button from '@mui/material/Button';
import axios from "axios";
import {Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover} from "@reach/combobox";
import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";

import "@reach/combobox/styles.css";
// Marker component
const Marker = ({ show, place, search }) => {
    const markerStyle = {
        border: '1px solid white',
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: search ? 'red' : 'blue',
        cursor: 'pointer',
        zIndex: 10,
    };

    const changeShow = () => {
        window.alert('geldi')
    }

    return (
        <>
            {
                !show ?
                    <div style={markerStyle}/>
                    :
                    <div style={markerStyle}/>
            }
            {show && <InfoWindow place={place} />}
        </>
    );
};

// InfoWindow component
const InfoWindow = (props) => {
    const { place } = props;
    const infoWindowStyle = {
        position: 'relative',
        bottom: 150,
        left: '-45px',
        width: 220,
        backgroundColor: 'white',
        boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
        padding: 10,
        fontSize: 14,
        zIndex: 100,
    };

    return (
        <div style={infoWindowStyle}>
            <div style={{ fontSize: 16 }}>
                {place.name}
            </div>
            <div style={{ fontSize: 14 }}>
        <span style={{ color: 'grey' }}>
          {place.rating}
            {' '}
        </span>
                <span style={{ color: 'orange' }}>
          {String.fromCharCode(9733).repeat(Math.floor(place.rating))}
        </span>
                <span style={{ color: 'lightgrey' }}>
          {String.fromCharCode(9733).repeat(5 - Math.floor(place.rating))}
        </span>
            </div>
        </div>
    );
};

function SimpleMap(props) {
    const [center, setCenter] = useState({
        lat: 39.93361906501069,
        lng: 32.85925510281058
    });
    const [zoom, setZoom] = useState(16)
    const [lat, setLat] = useState(center.lat)
    const [lng, setLng] = useState(center.lng)
    const [address, setAddress] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [mapInstance, setMapInstance] = useState(null);
    const [mapApi, setMapApi] = useState(null);

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete();

    const handleInput = (e) => {
        setValue(e.target.value);
    };

    const handleSelect = (val) => {
        setValue(val, false);
        getGeocode({ address: val })
            .then((results) => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                setLat(lat);
                setLng(lng);
                setCenter({
                    lat: lat,
                    lng: lng
                });
                setZoom(7);
                console.log("📍 Coordinates: ", { lat, lng });
                clearSuggestions()
            })
            .catch((error) => {
                clearSuggestions()
                console.log("😱 Error: ", error);
            });
    };

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


    const createMapOptions = (maps) => {
        return {
            panControl: false,
            mapTypeControl: false,
            scrollwheel: true,
            styles: [{ stylers: [{ 'saturation': -100 }, { 'gamma': 0.8 }, { 'lightness': 4 }, { 'visibility': 'on' }] }]
        }
    }

    const apiHasLoaded = (map, maps) => {
        setMapApi(maps);
        setMapInstance(map);
        console.log(map);
        console.log(maps);

        //setMapApi(maps);
        //setMapApiLoaded(true);
        //setMapInstance(map)
    };

    //haritada herhangi bir noktaya basınca lat ve lng değerleri alınıyor
    function click(e) {
        setLng(e.lng);
        setLat(e.lat)
        console.log(e.lat);
        console.log(e.lng);
    }

    function clearSearchBox() {
        setAddress('');
    }

    return (
        <div>
            {
                props.search &&
                <>
                    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDUbXD4z3w1UoiCOxaAj0RFt3pT24k88O4&libraries=places"></script>
                    <div className="App">
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
            <div style={{ height: "100vh", width: "100%" }}>
                <GoogleMapReact
                    bootstrapURLKeys={{key: "AIzaSyDUbXD4z3w1UoiCOxaAj0RFt3pT24k88O4"}}
                    defaultCenter={center}
                    defaultZoom={zoom}
                    draggable={true}
                    onClick={(e) => click(e)}
                    onGoogleApiLoaded={({ map, maps }) => apiHasLoaded(map, maps)}

                >
                    {
                        searchResult.length > 0 &&
                            searchResult.map((item, i) =>
                                <Marker
                                    key={i}
                                    lat={item.lat}
                                    lng={item.lng}
                                    place={item}
                                    show={false}
                                    search={true}
                                />
                            )
                    }
                    {
                        props.locations && props.locations.length > 0 &&
                            props.locations.map((item, i) =>
                                item.address.length > 0 &&
                                item.address.map((address, z) =>
                                    <Marker
                                        key={address.id}
                                        lat={address.lat}
                                        lng={address.lng}
                                        place={item}
                                        show={false}
                                        search={false}
                                    />
                                )
                            )
                    }
                    <Marker
                        key={1}
                        lat={lat}
                        lng={lng}
                        place={""}
                        show={false}
                        search={false}
                    />
                </GoogleMapReact>
            </div>
        </div>
    );
}

export default SimpleMap;
