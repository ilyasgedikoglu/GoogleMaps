import React, {Component, useEffect, useState} from 'react';
import isEmpty from 'lodash.isempty';

// components:
import Marker from '../../components/Marker';

// examples:
import GoogleMap from '../../components/AutoCompleteGoogleMap';
import AutoComplete from '../../components/AutoCompleteMap';

// consts
const LOS_ANGELES_CENTER = [39.93361906501069, 32.85925510281058];

export default function Autocomplete (props) {
    const [mapApiLoaded, setMapApiLoaded] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);
    const [mapApi, setMapApi] = useState(null);
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        console.log('geldi');
        console.log(mapInstance);
        setPlaces(places);
        setMapApiLoaded(mapApiLoaded);
        setMapInstance(mapInstance);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          1
        setMapApi(mapApi);
    }, [mapApi, mapInstance])

    const apiHasLoaded = (map, maps) => {
        console.log(map);
        console.log(maps);
        setMapApi(maps);
        setMapApiLoaded(true);
        setMapInstance(map)
    };

    const addPlace = (place) => {
        setPlaces(place);
    };

    return (
        <>
            {mapApiLoaded && (
                <AutoComplete map={mapInstance} mapApi={mapApi} addplace={addPlace} />
            )}
            <GoogleMap
                defaultZoom={10}
                defaultCenter={LOS_ANGELES_CENTER}
                bootstrapURLKeys={{
                    key: "",
                    libraries: ['places', 'geometry'],
                }}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => apiHasLoaded(map, maps)}
            >
                {!isEmpty(places)
                && places.map((place) => (
                    <Marker
                        key={place.id}
                        text={place.name}
                        lat={place.geometry.location.lat()}
                        lng={place.geometry.location.lng()}
                    />
                ))}
            </GoogleMap>
        </>
    );
}