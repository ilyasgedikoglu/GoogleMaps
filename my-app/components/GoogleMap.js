import React, {useEffect, useState} from "react";
import GoogleMapReact from "google-map-react";
import Axios from "axios";

import pin from "../pin.png";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Button from '@mui/material/Button';

// Marker component
const Marker = ({ show, place }) => {
    const markerStyle = {
        border: '1px solid white',
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: show ? 'red' : 'blue',
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
    const [mapInstance, setMapInstance] = useState(null);
    const [mapApi, setMapApi] = useState(null);

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
    }

    function clearSearchBox() {
        setAddress('');
    }

    function searchAddress() {
        const config = {
            method: 'get',
            url: "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + address +"&key=AIzaSyDUbXD4z3w1UoiCOxaAj0RFt3pT24k88O4",
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        };

        Axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div>
            {
                props.search &&
                    <>
                        <input
                            type="text"
                            onFocus={() => clearSearchBox}
                            onChange={e => setAddress(e.target.value.trim())}
                            placeholder="Enter a address"
                        />
                        <button onClick={() => searchAddress()}>Ara</button>
                    </>
            }
            <div style={{ height: "100vh", width: "100%" }}>
                <GoogleMapReact
                    bootstrapURLKeys={{key: ""}}
                    defaultCenter={center}
                    defaultZoom={zoom}
                    draggable={true}
                    onClick={(e) => click(e)}
                    yesIWantToUseGoogleMapApiInternals
                    options={createMapOptions}
                    onGoogleApiLoaded={({ map, maps }) => apiHasLoaded(map, maps)}
                >
                    {
                        props.locations && props.locations.length > 0 ?
                            props.locations.map((item, i) =>
                                item.address.length > 0 &&
                                item.address.map((address, z) =>
                                    <Marker
                                        key={address.id}
                                        lat={address.lat}
                                        lng={address.lng}
                                        place={item}
                                        show={false}
                                    />
                                )
                            ) :
                            <Marker
                                key={1}
                                lat={lat}
                                lng={lng}
                                place={""}
                                show={false}
                            />
                    }
                </GoogleMapReact>
            </div>
        </div>
    );
}

export default SimpleMap;
