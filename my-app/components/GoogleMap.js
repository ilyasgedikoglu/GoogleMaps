import React, {useState} from "react";
import GoogleMapReact from "google-map-react";
import pin from "../pin.png";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Marker component
const Marker = ({ show, place }) => {
    const markerStyle = {
        border: '1px solid white',
        borderRadius: '50%',
        height: 10,
        width: 10,
        backgroundColor: show ? 'red' : 'blue',
        cursor: 'pointer',
        zIndex: 10,
    };

    return (
        <>
            <div style={markerStyle} >
                <p>{place.name}</p>
            </div>
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
        lat: 60.192059,
        lng: 24.945831
    });
    const [zoom, setZoom] = useState(11)

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <GoogleMapReact
                bootstrapURLKeys={{key: ""}}
                defaultCenter={center}
                defaultZoom={zoom}
            >
                {props.locations.map(item => {
                    if (item.address.length !== 0) {
                        return item.address.map(i => {
                            return (
                                <Marker
                                    key={i.id}
                                    lat={i.lat}
                                    lng={i.lng}
                                    place={i}
                                    show={false}
                                />
                            );
                        });
                    }
                })}
            </GoogleMapReact>
        </div>
    );
}

export default SimpleMap;
