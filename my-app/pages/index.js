import React, {Component, useEffect, useState} from 'react';
import PropTypes, {func} from 'prop-types';
import isEmpty from 'lodash.isempty';

// examples:
import GoogleMap from '../components/GoogleMap';

// consts: [34.0522, -118.2437]
const LOS_ANGELES_CENTER = [34.0522, -118.2437];

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
            <div style={{ fontSize: 14, color: 'grey' }}>
                {place.types[0]}
            </div>
            <div style={{ fontSize: 14, color: 'grey' }}>
                {'$'.repeat(place.price_level)}
            </div>
            <div style={{ fontSize: 14, color: 'green' }}>
                {place.opening_hours.open_now ? 'Open' : 'Closed'}
            </div>
        </div>
    );
};

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
            <div style={markerStyle} />
            {show && <InfoWindow place={place} />}
        </>
    );
};

function MarkerInfoWindow() {
    const [places, setPlaces ] = useState([]);

    useEffect(() => {
        fetch('places.json')
            .then((response) => response.json())
            .then((data) => {
                window.alert('geldi');
                data.results.forEach((result) => {
                    result.show = false; // eslint-disable-line no-param-reassign
                });
                setPlaces(data.results);
            });
    }, [])
    /*constructor(props) {
        super(props);

        this.state = {
            places: [],
        };
    }*/

    // onChildClick callback can take two arguments: key and childProps
    /*onChildClickCallback = (key) => {
        this.setState((state) => {
            const index = state.places.findIndex((e) => e.id === key);
            state.places[index].show = !state.places[index].show; // eslint-disable-line no-param-reassign
            return { places: state.places };
        });
    };*/


    return (
        <>
            {!isEmpty(places) && (
                <GoogleMap
                    defaultZoom={10}
                    defaultCenter={LOS_ANGELES_CENTER}
                    bootstrapURLKeys={{ key: "" }}
                    /*onChildClick={this.onChildClickCallback}*/
                >
                    {places.map((place) => (
                        <Marker
                            key={place.id}
                            lat={place.geometry.location.lat}
                            lng={place.geometry.location.lng}
                            show={place.show}
                            place={place}
                        />
                    ))}
                </GoogleMap>
            )}
        </>
    );
}

InfoWindow.propTypes = {
    place: PropTypes.shape({
        name: PropTypes.string,
        formatted_address: PropTypes.string,
        rating: PropTypes.number,
        types: PropTypes.arrayOf(PropTypes.string),
        price_level: PropTypes.number,
        opening_hours: PropTypes.shape({
            open_now: PropTypes.bool,
        }),
    }).isRequired,
};

Marker.propTypes = {
    show: PropTypes.bool.isRequired,
    place: PropTypes.shape({
        name: PropTypes.string,
        formatted_address: PropTypes.string,
        rating: PropTypes.number,
        types: PropTypes.arrayOf(PropTypes.string),
        price_level: PropTypes.number,
        opening_hours: PropTypes.shape({
            open_now: PropTypes.bool,
        }),
    }).isRequired,
};

export default MarkerInfoWindow;