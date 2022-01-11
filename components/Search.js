import { ChangeEvent } from "react";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption
} from "@reach/combobox";

import "@reach/combobox/styles.css";

export default function Search(props) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue
    } = usePlacesAutocomplete();

    const handleInput = (e) => {
        setValue(e.target.value);
    };

    const handleSelect = (val) => {
        setValue(val, false);
        getGeocode({ address: val })
            .then((results) => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                console.log("📍 Coordinates: ", { lat, lng });
            })
            .catch((error) => {
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

    return (
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
    );
}
