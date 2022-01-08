import React, {useEffect, useState} from "react";
import GoogleMapReact from "google-map-react";
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
        lat: 39.992059,
        lng: 32.945831
    });
    const [zoom, setZoom] = useState(14)
    const [lat, setLat] = useState(center.lat)
    const [lng, setLng] = useState(center.lng)

    function click(e) {
        setLng(e.lng);
        setLat(e.lat)
        return(
            <Marker
                key={1}
                lat={e.lat}
                lng={e.lng}
                place={""}
                show={false}
            />
        )
    }

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <GoogleMapReact
                bootstrapURLKeys={{key: ""}}
                defaultCenter={center}
                defaultZoom={zoom}
                draggable={true}
                onClick={(e) => click(e)}
                yesIWantToUseGoogleMapApiInternals
            >
                <Marker
                    key={1}
                    lat={lat}
                    lng={lng}
                    place={""}
                    show={false}
                />
            </GoogleMapReact>
        </div>
    );
}

export default SimpleMap;
