import React, {Component, useEffect} from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
`;

export default function AutoComplete (props) {
    let searchInput;
    console.log(props);
    useEffect(() => {
        clearSearchBox = clearSearchBox.bind(this);
    }, [])

    useEffect(() => {
        const options = {
            types: ['geocode', 'address', 'establishment', '(regions)', '(cities)'],
            componentRestrictions: { country: ['gb', 'us'] },
        };
        const autoComplete = new props.mapApi.places.Autocomplete(
            searchInput,
            options,
        );
        autoComplete.addListener('place_changed', onPlaceChanged);
        autoComplete.bindTo('bounds', props.map);
    })

    useEffect(() => {
        props.mapApi.event.clearInstanceListeners(searchInput);
    })

    const onPlaceChanged = ({ map, addplace } = this.props) => {
        const place = this.autoComplete.getPlace();

        if (!place.geometry) return;
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        addplace(place);
        searchInput.blur();
    };

    function clearSearchBox() {
        searchInput.value = '';
    }

    return (
        <Wrapper>
            <input
                ref={(ref) => {
                    searchInput = ref;
                }}
                type="text"
                onFocus={clearSearchBox}
                placeholder="Enter a location"
            />
        </Wrapper>
    );
}